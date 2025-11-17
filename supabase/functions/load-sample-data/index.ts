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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    console.log('Loading sample arbitrage data...');

    // Sample data based on the JSON file structure
    const sampleData = [
      {
        event_id: "btc_2024_q3_regulation",
        event_name: "Will Bitcoin rise above $70,000 in Q3 2024?",
        category: "crypto",
        polymarket: { price: 0.68 },
        kalshi: { price: 0.82 },
        arbitrage_analysis: {
          spread: 0.14,
          arbitrage_percentage: 14.0,
          profit_percentage: 19.6,
          optimal_bet_amount: 2500,
          expected_profit: 490,
          confidence_level: "high",
          risk_assessment: "medium"
        }
      },
      {
        event_id: "trump_reelection_2024",
        event_name: "Will Donald Trump win the 2024 presidential election?",
        category: "politics",
        polymarket: { price: 0.55 },
        kalshi: { price: 0.72 },
        arbitrage_analysis: {
          spread: 0.17,
          arbitrage_percentage: 17.0,
          profit_percentage: 23.9,
          optimal_bet_amount: 3200,
          expected_profit: 764,
          confidence_level: "high",
          risk_assessment: "medium"
        }
      },
      {
        event_id: "eth_upgrade_2024",
        event_name: "Will Ethereum complete a major upgrade in 2024?",
        category: "crypto",
        polymarket: { price: 0.42 },
        kalshi: { price: 0.56 },
        arbitrage_analysis: {
          spread: 0.14,
          arbitrage_percentage: 14.0,
          profit_percentage: 20.0,
          optimal_bet_amount: 1800,
          expected_profit: 360,
          confidence_level: "medium",
          risk_assessment: "high"
        }
      }
    ];

    const opportunities = [];

    for (const item of sampleData) {
      opportunities.push({
        event_name: item.event_name,
        category: item.category,
        polymarket_price: item.polymarket.price,
        kalshi_price: item.kalshi.price,
        spread: item.arbitrage_analysis.spread,
        arbitrage_percentage: item.arbitrage_analysis.arbitrage_percentage,
        profit_percentage: item.arbitrage_analysis.profit_percentage,
        optimal_bet_amount: item.arbitrage_analysis.optimal_bet_amount,
        expected_profit: item.arbitrage_analysis.expected_profit,
        confidence_level: item.arbitrage_analysis.confidence_level,
        risk_assessment: item.arbitrage_analysis.risk_assessment,
        polymarket_market_id: item.event_id + '_poly',
        kalshi_market_id: item.event_id + '_kalshi',
        detected_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      });
    }

    // Insert opportunities
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/arbitrage_opportunities`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(opportunities),
    });

    if (!insertResponse.ok) {
      const error = await insertResponse.text();
      throw new Error(`Failed to insert data: ${error}`);
    }

    const insertedData = await insertResponse.json();

    return new Response(
      JSON.stringify({
        data: {
          success: true,
          inserted: insertedData.length,
          opportunities: insertedData,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Load sample data error:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'LOAD_SAMPLE_DATA_ERROR',
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
