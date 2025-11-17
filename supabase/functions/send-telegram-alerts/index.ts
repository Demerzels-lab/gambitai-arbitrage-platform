Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { opportunity_id } = await req.json();

    if (!opportunity_id) {
      throw new Error('opportunity_id is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    if (!telegramBotToken) {
      console.log('Warning: TELEGRAM_BOT_TOKEN not configured, skipping alerts');
      return new Response(
        JSON.stringify({
          data: {
            success: false,
            message: 'Telegram bot not configured',
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Sending alerts for opportunity: ${opportunity_id}`);

    // Fetch opportunity details
    const opportunityResponse = await fetch(
      `${supabaseUrl}/rest/v1/arbitrage_opportunities?id=eq.${opportunity_id}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
        },
      }
    );

    const opportunities = await opportunityResponse.json();
    if (!opportunities || opportunities.length === 0) {
      throw new Error('Opportunity not found');
    }

    const opportunity = opportunities[0];

    // Fetch users with alert preferences
    const usersResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_alert_preferences?enabled=eq.true&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
        },
      }
    );

    const users = await usersResponse.json();
    console.log(`Found ${users.length} users with alerts enabled`);

    // Filter users based on preferences
    const eligibleUsers = users.filter((user: any) => {
      // Check minimum profit percentage
      if (opportunity.profit_percentage < (user.min_profit_percentage || 10)) {
        return false;
      }

      // Check category preference
      if (user.categories && !user.categories.includes(opportunity.category)) {
        return false;
      }

      // Check confidence level
      const confidenceLevels = ['low', 'medium', 'high'];
      const userMinConfidence = confidenceLevels.indexOf(user.min_confidence || 'medium');
      const opportunityConfidence = confidenceLevels.indexOf(opportunity.confidence_level);
      if (opportunityConfidence < userMinConfidence) {
        return false;
      }

      return true;
    });

    console.log(`${eligibleUsers.length} eligible users for this opportunity`);

    // Send Telegram alerts
    let sentCount = 0;
    let failedCount = 0;

    for (const user of eligibleUsers) {
      if (!user.telegram_chat_id) {
        continue;
      }

      try {
        // Format alert message
        const message = `
🚨 NEW ARBITRAGE OPPORTUNITY

Event: ${opportunity.event_name}
Category: ${opportunity.category.toUpperCase()}

Polymarket: $${opportunity.polymarket_price.toFixed(4)}
Kalshi: $${opportunity.kalshi_price.toFixed(4)}

Spread: ${(opportunity.spread * 100).toFixed(2)}%
Profit Potential: ${opportunity.profit_percentage.toFixed(2)}%

Optimal Bet: $${opportunity.optimal_bet_amount}
Expected Profit: $${opportunity.expected_profit}

Confidence: ${opportunity.confidence_level.toUpperCase()}
Risk: ${opportunity.risk_assessment.toUpperCase()}

Act fast - this opportunity expires in 1 hour!
        `.trim();

        // Send to Telegram
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: user.telegram_chat_id,
              text: message,
              parse_mode: 'HTML',
            }),
          }
        );

        const telegramResult = await telegramResponse.json();

        // Log alert history
        const alertHistoryData = {
          user_id: user.user_id,
          arbitrage_opportunity_id: opportunity_id,
          sent_at: new Date().toISOString(),
          delivery_status: telegramResult.ok ? 'success' : 'failed',
          error_message: telegramResult.ok ? null : telegramResult.description,
        };

        await fetch(`${supabaseUrl}/rest/v1/alert_history`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(alertHistoryData),
        });

        if (telegramResult.ok) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.error(`Error sending alert to user ${user.user_id}:`, error);
        failedCount++;
      }
    }

    console.log(`Alerts sent: ${sentCount}, failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        data: {
          success: true,
          eligible_users: eligibleUsers.length,
          sent: sentCount,
          failed: failedCount,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Telegram alert error:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'TELEGRAM_ALERT_ERROR',
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
