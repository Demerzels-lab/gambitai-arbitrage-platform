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

    console.log('Updating to 2025/2026 data...');

    const cryptoEvents = [
      {name: "Will Bitcoin reach $150,000 by end of 2025?", poly: 0.45, kalshi: 0.58, bet: 3500, conf: "high", risk: "medium", date: "2025-03-15"},
      {name: "Will Bitcoin surpass $200,000 in 2025?", poly: 0.28, kalshi: 0.38, bet: 2800, conf: "medium", risk: "high", date: "2025-04-20"},
      {name: "Will Bitcoin ETF total AUM exceed $100B by Q3 2025?", poly: 0.62, kalshi: 0.75, bet: 4200, conf: "high", risk: "low", date: "2025-02-10"},
      {name: "Will Ethereum hit $8,000 in 2025?", poly: 0.38, kalshi: 0.52, bet: 3200, conf: "high", risk: "medium", date: "2025-07-12"},
      {name: "Will Ethereum surpass $10,000 by end of 2025?", poly: 0.25, kalshi: 0.36, bet: 2500, conf: "medium", risk: "high", date: "2025-08-25"},
      {name: "Will Ethereum spot ETF launch in 2025?", poly: 0.73, kalshi: 0.85, bet: 4600, conf: "high", risk: "low", date: "2025-01-28"},
      {name: "Will Solana surpass $500 by Q2 2026?", poly: 0.35, kalshi: 0.48, bet: 2900, conf: "medium", risk: "high", date: "2025-11-22"},
      {name: "Will Solana exceed $300 in 2025?", poly: 0.52, kalshi: 0.65, bet: 3500, conf: "high", risk: "medium", date: "2025-12-05"},
      {name: "Will DeFi total value exceed $500B in 2025?", poly: 0.47, kalshi: 0.61, bet: 3400, conf: "high", risk: "medium", date: "2025-02-28"},
      {name: "Will DeFi TVL surpass $300B by Q3 2025?", poly: 0.63, kalshi: 0.75, bet: 4000, conf: "high", risk: "low", date: "2025-04-10"},
      {name: "Will Uniswap v4 launch successfully in Q1 2025?", poly: 0.76, kalshi: 0.86, bet: 4800, conf: "high", risk: "low", date: "2025-01-05"},
      {name: "Will Ethereum Layer 2 TVL exceed $50B in 2025?", poly: 0.61, kalshi: 0.74, bet: 3900, conf: "high", risk: "low", date: "2025-10-08"},
      {name: "Will Ethereum gas fees average below $2 in 2025?", poly: 0.56, kalshi: 0.69, bet: 3700, conf: "high", risk: "medium", date: "2025-09-14"},
      {name: "Will BlackRock Bitcoin ETF reach $50B AUM in 2025?", poly: 0.58, kalshi: 0.69, bet: 3900, conf: "high", risk: "medium", date: "2025-05-05"},
      {name: "Will Bitcoin dominance exceed 60% in 2025?", poly: 0.51, kalshi: 0.64, bet: 3300, conf: "medium", risk: "medium", date: "2025-06-18"},
      {name: "Will Solana DeFi TVL reach $10B in 2025?", poly: 0.46, kalshi: 0.59, bet: 3200, conf: "medium", risk: "high", date: "2026-01-18"},
      {name: "Will real-world assets in DeFi exceed $20B in 2025?", poly: 0.68, kalshi: 0.79, bet: 4200, conf: "high", risk: "low", date: "2025-05-23"},
      {name: "Will Cardano implement full smart contract capability in 2025?", poly: 0.71, kalshi: 0.82, bet: 4400, conf: "high", risk: "low", date: "2025-03-28"},
      {name: "Will Polygon PoS migrate to zkEVM in 2025?", poly: 0.62, kalshi: 0.74, bet: 3900, conf: "high", risk: "medium", date: "2025-07-07"},
      {name: "Will Arbitrum become top L2 by TVL in 2025?", poly: 0.69, kalshi: 0.80, bet: 4300, conf: "high", risk: "low", date: "2025-08-12"},
      {name: "Will Bitcoin halving impact price positively by Q2 2025?", poly: 0.72, kalshi: 0.83, bet: 4500, conf: "high", risk: "low", date: "2025-04-15"},
      {name: "Will Ethereum Dencun upgrade succeed in Q1 2025?", poly: 0.82, kalshi: 0.91, bet: 5200, conf: "high", risk: "low", date: "2025-03-03"},
      {name: "Will Aave total lending exceed $25B in 2025?", poly: 0.59, kalshi: 0.71, bet: 3700, conf: "high", risk: "medium", date: "2025-06-25"},
      {name: "Will USDC market cap exceed USDT in 2025?", poly: 0.33, kalshi: 0.46, bet: 2700, conf: "low", risk: "high", date: "2025-09-19"},
      {name: "Will PayPal USD stablecoin reach $10B supply in 2025?", poly: 0.56, kalshi: 0.68, bet: 3700, conf: "medium", risk: "medium", date: "2025-11-03"},
      {name: "Will Tether face regulatory issues in 2025?", poly: 0.47, kalshi: 0.60, bet: 3300, conf: "medium", risk: "high", date: "2025-05-29"},
      {name: "Will US launch digital dollar pilot in 2025?", poly: 0.41, kalshi: 0.54, bet: 3000, conf: "medium", risk: "high", date: "2025-12-18"},
      {name: "Will Bitcoin Lightning Network users exceed 10M in 2025?", poly: 0.44, kalshi: 0.56, bet: 2900, conf: "medium", risk: "high", date: "2025-10-22"},
      {name: "Will institutional Bitcoin holdings double in 2025?", poly: 0.53, kalshi: 0.67, bet: 3600, conf: "medium", risk: "medium", date: "2025-11-28"},
      {name: "Will Ethereum NFT volume recover to $2B monthly in 2025?", poly: 0.42, kalshi: 0.55, bet: 3000, conf: "medium", risk: "high", date: "2025-07-17"},
      {name: "Will Solana network outages decrease 80% in 2025?", poly: 0.58, kalshi: 0.70, bet: 3800, conf: "medium", risk: "medium", date: "2026-02-12"},
      {name: "Will Solana Mobile Saga phone sell 100k units in 2025?", poly: 0.54, kalshi: 0.67, bet: 3600, conf: "medium", risk: "medium", date: "2025-08-08"},
      {name: "Will DeFi hacks decrease 50% compared to 2024?", poly: 0.44, kalshi: 0.57, bet: 3200, conf: "medium", risk: "high", date: "2025-10-14"},
      {name: "Will Polkadot parachains exceed 100 in 2025?", poly: 0.55, kalshi: 0.68, bet: 3700, conf: "medium", risk: "medium", date: "2025-04-04"},
      {name: "Will Chainlink node operators exceed 10,000 in 2025?", poly: 0.48, kalshi: 0.61, bet: 3300, conf: "medium", risk: "medium", date: "2025-06-30"},
    ];

    const politicsEvents = [
      {name: "Will Democrats maintain House majority in 2026 midterms?", poly: 0.42, kalshi: 0.56, bet: 3200, conf: "medium", risk: "high", date: "2025-08-15"},
      {name: "Will Republicans gain Senate seats in 2026 midterms?", poly: 0.61, kalshi: 0.73, bet: 3900, conf: "high", risk: "medium", date: "2025-09-20"},
      {name: "Will voter turnout exceed 50% in 2026 midterms?", poly: 0.48, kalshi: 0.61, bet: 3400, conf: "medium", risk: "medium", date: "2026-03-10"},
      {name: "Will Democrats flip any red Senate seats in 2026?", poly: 0.54, kalshi: 0.67, bet: 3600, conf: "medium", risk: "medium", date: "2026-04-22"},
      {name: "Will Joe Biden seek re-election in 2028?", poly: 0.31, kalshi: 0.44, bet: 2700, conf: "low", risk: "high", date: "2025-07-30"},
      {name: "Will Donald Trump be GOP nominee in 2028?", poly: 0.58, kalshi: 0.70, bet: 3800, conf: "high", risk: "medium", date: "2025-10-18"},
      {name: "Will Kamala Harris run for president in 2028?", poly: 0.66, kalshi: 0.77, bet: 4100, conf: "high", risk: "medium", date: "2025-11-05"},
      {name: "Will Ron DeSantis announce 2028 presidential bid in 2025?", poly: 0.72, kalshi: 0.83, bet: 4500, conf: "high", risk: "low", date: "2025-12-11"},
      {name: "Will Nikki Haley run for president in 2028?", poly: 0.55, kalshi: 0.68, bet: 3700, conf: "medium", risk: "medium", date: "2026-01-07"},
      {name: "Will crypto regulation pass Congress in 2025?", poly: 0.64, kalshi: 0.76, bet: 4000, conf: "high", risk: "medium", date: "2025-03-08"},
      {name: "Will Bitcoin ETF approval expand by Q2 2025?", poly: 0.73, kalshi: 0.84, bet: 4600, conf: "high", risk: "low", date: "2025-02-14"},
      {name: "Will SEC approve spot Ethereum ETF in 2025?", poly: 0.69, kalshi: 0.80, bet: 4300, conf: "high", risk: "low", date: "2025-04-22"},
      {name: "Will US establish comprehensive crypto framework in 2025?", poly: 0.57, kalshi: 0.70, bet: 3800, conf: "high", risk: "medium", date: "2025-05-17"},
      {name: "Will stablecoin regulation bill pass in 2025?", poly: 0.62, kalshi: 0.74, bet: 3900, conf: "high", risk: "medium", date: "2025-06-09"},
      {name: "Will SEC change leadership in 2025?", poly: 0.45, kalshi: 0.58, bet: 3200, conf: "medium", risk: "high", date: "2025-08-27"},
      {name: "Will DeFi face increased regulation in 2025?", poly: 0.71, kalshi: 0.82, bet: 4400, conf: "high", risk: "low", date: "2025-07-03"},
      {name: "Will Federal Reserve cut rates in Q1 2025?", poly: 0.58, kalshi: 0.71, bet: 3800, conf: "high", risk: "medium", date: "2025-01-20"},
      {name: "Will inflation fall below 2% by end of 2025?", poly: 0.44, kalshi: 0.57, bet: 3200, conf: "medium", risk: "high", date: "2025-07-28"},
      {name: "Will Fed maintain rates above 4% throughout 2025?", poly: 0.51, kalshi: 0.64, bet: 3500, conf: "medium", risk: "medium", date: "2025-09-16"},
      {name: "Will unemployment rate stay below 4.5% in 2025?", poly: 0.69, kalshi: 0.80, bet: 4300, conf: "high", risk: "low", date: "2025-05-13"},
      {name: "Will US avoid recession in 2025?", poly: 0.73, kalshi: 0.84, bet: 4600, conf: "high", risk: "low", date: "2025-09-03"},
      {name: "Will stock market reach new highs in 2025?", poly: 0.66, kalshi: 0.77, bet: 4100, conf: "high", risk: "medium", date: "2025-11-19"},
      {name: "Will UK hold general election in 2025?", poly: 0.62, kalshi: 0.74, bet: 3900, conf: "high", risk: "medium", date: "2025-06-14"},
      {name: "Will Germany elect new chancellor in 2025?", poly: 0.71, kalshi: 0.82, bet: 4400, conf: "high", risk: "low", date: "2025-02-23"},
      {name: "Will NATO add new members in 2025?", poly: 0.58, kalshi: 0.70, bet: 3800, conf: "medium", risk: "medium", date: "2025-10-06"},
      {name: "Will Ukraine peace negotiations conclude in 2025?", poly: 0.42, kalshi: 0.55, bet: 3100, conf: "medium", risk: "high", date: "2025-12-29"},
      {name: "Will Congress pass AI regulation bill in 2025?", poly: 0.49, kalshi: 0.62, bet: 3400, conf: "medium", risk: "medium", date: "2025-08-19"},
      {name: "Will infrastructure bill phase 2 pass in 2025?", poly: 0.64, kalshi: 0.76, bet: 4000, conf: "high", risk: "medium", date: "2025-04-28"},
      {name: "Will student loan forgiveness expand in 2025?", poly: 0.41, kalshi: 0.54, bet: 3000, conf: "medium", risk: "high", date: "2025-03-21"},
      {name: "Will climate bill receive bipartisan support in 2025?", poly: 0.44, kalshi: 0.57, bet: 3200, conf: "medium", risk: "high", date: "2025-07-24"},
    ];

    const allEvents = [...cryptoEvents.map(e => ({...e, category: "crypto"})), ...politicsEvents.map(e => ({...e, category: "politics"}))];
    const opportunities = [];

    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const spread = event.kalshi - event.poly;
      const arbitragePercentage = parseFloat(((spread / event.poly) * 100).toFixed(2));
      const profitPercentage = parseFloat((spread * 100).toFixed(2));
      const expectedProfit = parseFloat((event.bet * spread).toFixed(2));
      
      const detectedDate = new Date(event.date + "T10:00:00Z");
      const expiresDate = new Date(detectedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      opportunities.push({
        event_name: event.name,
        category: event.category,
        polymarket_price: event.poly,
        kalshi_price: event.kalshi,
        spread: parseFloat(spread.toFixed(2)),
        arbitrage_percentage: arbitragePercentage,
        profit_percentage: profitPercentage,
        optimal_bet_amount: event.bet,
        expected_profit: expectedProfit,
        confidence_level: event.conf,
        risk_assessment: event.risk,
        polymarket_market_id: `poly_2025_${i + 1}`,
        kalshi_market_id: `kalshi_2025_${i + 1}`,
        detected_at: detectedDate.toISOString(),
        expires_at: expiresDate.toISOString(),
        status: 'active',
      });
    }

    console.log(`Generated ${opportunities.length} opportunities for 2025/2026`);

    // Delete old data
    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/arbitrage_opportunities?status=eq.active`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
    });

    if (!deleteResponse.ok) {
      console.warn('Delete warning:', await deleteResponse.text());
    }

    // Insert new opportunities
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
      throw new Error(`Failed to insert: ${error}`);
    }

    const insertedData = await insertResponse.json();

    return new Response(
      JSON.stringify({
        data: {
          success: true,
          inserted: insertedData.length,
          message: `Successfully loaded ${insertedData.length} opportunities for 2025/2026`,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Update error:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'UPDATE_ERROR',
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
