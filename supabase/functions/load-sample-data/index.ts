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

    console.log('Loading 2025/2026 sample arbitrage data...');

    // Comprehensive sample data for 2025/2026 timeline
    const cryptoEvents = [
      // Bitcoin Events 2025
      { name: "Will Bitcoin reach $150,000 by end of 2025?", category: "crypto", poly: 0.45, kalshi: 0.58, bet: 3500, conf: "high", risk: "medium" },
      { name: "Will Bitcoin surpass $200,000 in 2025?", category: "crypto", poly: 0.28, kalshi: 0.38, bet: 2800, conf: "medium", risk: "high" },
      { name: "Will Bitcoin ETF total AUM exceed $100B by Q3 2025?", category: "crypto", poly: 0.62, kalshi: 0.75, bet: 4200, conf: "high", risk: "low" },
      { name: "Will BlackRock Bitcoin ETF reach $50B AUM in 2025?", category: "crypto", poly: 0.58, kalshi: 0.69, bet: 3900, conf: "high", risk: "medium" },
      { name: "Will Bitcoin dominance exceed 60% in 2025?", category: "crypto", poly: 0.51, kalshi: 0.64, bet: 3300, conf: "medium", risk: "medium" },
      { name: "Will Bitcoin halving impact price positively by Q2 2025?", category: "crypto", poly: 0.72, kalshi: 0.83, bet: 4500, conf: "high", risk: "low" },
      { name: "Will Bitcoin Lightning Network users exceed 10M in 2025?", category: "crypto", poly: 0.44, kalshi: 0.56, bet: 2900, conf: "medium", risk: "high" },
      { name: "Will Bitcoin mining difficulty increase 25% in 2025?", category: "crypto", poly: 0.66, kalshi: 0.78, bet: 3800, conf: "high", risk: "medium" },
      { name: "Will institutional Bitcoin holdings double in 2025?", category: "crypto", poly: 0.53, kalshi: 0.67, bet: 3600, conf: "medium", risk: "medium" },
      { name: "Will Bitcoin correlation with gold strengthen in 2025?", category: "crypto", poly: 0.48, kalshi: 0.61, bet: 3100, conf: "medium", risk: "medium" },
      
      // Ethereum Events 2025
      { name: "Will Ethereum hit $8,000 in 2025?", category: "crypto", poly: 0.38, kalshi: 0.52, bet: 3200, conf: "high", risk: "medium" },
      { name: "Will Ethereum surpass $10,000 by end of 2025?", category: "crypto", poly: 0.25, kalshi: 0.36, bet: 2500, conf: "medium", risk: "high" },
      { name: "Will Ethereum 2.0 staking exceed 40M ETH in 2025?", category: "crypto", poly: 0.68, kalshi: 0.79, bet: 4100, conf: "high", risk: "low" },
      { name: "Will Ethereum gas fees average below $2 in 2025?", category: "crypto", poly: 0.56, kalshi: 0.69, bet: 3700, conf: "high", risk: "medium" },
      { name: "Will Ethereum Layer 2 TVL exceed $50B in 2025?", category: "crypto", poly: 0.61, kalshi: 0.74, bet: 3900, conf: "high", risk: "low" },
      { name: "Will Ethereum spot ETF launch in 2025?", category: "crypto", poly: 0.73, kalshi: 0.85, bet: 4600, conf: "high", risk: "low" },
      { name: "Will Ethereum Dencun upgrade succeed in Q1 2025?", category: "crypto", poly: 0.82, kalshi: 0.91, bet: 5200, conf: "high", risk: "low" },
      { name: "Will Ethereum NFT volume recover to $2B monthly in 2025?", category: "crypto", poly: 0.42, kalshi: 0.55, bet: 3000, conf: "medium", risk: "high" },
      { name: "Will Ethereum merge anniversary boost price in Q3 2025?", category: "crypto", poly: 0.49, kalshi: 0.62, bet: 3400, conf: "medium", risk: "medium" },
      { name: "Will Ethereum developer activity increase 30% in 2025?", category: "crypto", poly: 0.64, kalshi: 0.76, bet: 4000, conf: "high", risk: "medium" },
      
      // Solana Events 2025/2026
      { name: "Will Solana surpass $500 by Q2 2026?", category: "crypto", poly: 0.35, kalshi: 0.48, bet: 2900, conf: "medium", risk: "high" },
      { name: "Will Solana exceed $300 in 2025?", category: "crypto", poly: 0.52, kalshi: 0.65, bet: 3500, conf: "high", risk: "medium" },
      { name: "Will Solana network outages decrease 80% in 2025?", category: "crypto", poly: 0.58, kalshi: 0.70, bet: 3800, conf: "medium", risk: "medium" },
      { name: "Will Solana DeFi TVL reach $10B in 2025?", category: "crypto", poly: 0.46, kalshi: 0.59, bet: 3200, conf: "medium", risk: "high" },
      { name: "Will Solana NFT marketplace volume exceed Ethereum in 2025?", category: "crypto", poly: 0.31, kalshi: 0.44, bet: 2600, conf: "low", risk: "high" },
      { name: "Will Solana Mobile Saga phone sell 100k units in 2025?", category: "crypto", poly: 0.54, kalshi: 0.67, bet: 3600, conf: "medium", risk: "medium" },
      { name: "Will Solana validator count exceed 5,000 in 2025?", category: "crypto", poly: 0.67, kalshi: 0.78, bet: 4100, conf: "high", risk: "low" },
      { name: "Will Solana transaction speed improve to 100k TPS in 2025?", category: "crypto", poly: 0.41, kalshi: 0.54, bet: 3100, conf: "medium", risk: "high" },
      
      // DeFi Events 2025
      { name: "Will DeFi total value exceed $500B in 2025?", category: "crypto", poly: 0.47, kalshi: 0.61, bet: 3400, conf: "high", risk: "medium" },
      { name: "Will DeFi TVL surpass $300B by Q3 2025?", category: "crypto", poly: 0.63, kalshi: 0.75, bet: 4000, conf: "high", risk: "low" },
      { name: "Will Uniswap v4 launch successfully in Q1 2025?", category: "crypto", poly: 0.76, kalshi: 0.86, bet: 4800, conf: "high", risk: "low" },
      { name: "Will Aave total lending exceed $25B in 2025?", category: "crypto", poly: 0.59, kalshi: 0.71, bet: 3700, conf: "high", risk: "medium" },
      { name: "Will MakerDAO rebrand to Sky complete in 2025?", category: "crypto", poly: 0.81, kalshi: 0.89, bet: 5000, conf: "high", risk: "low" },
      { name: "Will DeFi hacks decrease 50% compared to 2024?", category: "crypto", poly: 0.44, kalshi: 0.57, bet: 3200, conf: "medium", risk: "high" },
      { name: "Will real-world assets in DeFi exceed $20B in 2025?", category: "crypto", poly: 0.68, kalshi: 0.79, bet: 4200, conf: "high", risk: "low" },
      { name: "Will Curve Finance recover to $5B TVL in 2025?", category: "crypto", poly: 0.52, kalshi: 0.65, bet: 3500, conf: "medium", risk: "medium" },
      
      // Altcoin Events 2025
      { name: "Will Cardano implement full smart contract capability in 2025?", category: "crypto", poly: 0.71, kalshi: 0.82, bet: 4400, conf: "high", risk: "low" },
      { name: "Will Polkadot parachains exceed 100 in 2025?", category: "crypto", poly: 0.55, kalshi: 0.68, bet: 3700, conf: "medium", risk: "medium" },
      { name: "Will Chainlink node operators exceed 10,000 in 2025?", category: "crypto", poly: 0.48, kalshi: 0.61, bet: 3300, conf: "medium", risk: "medium" },
      { name: "Will Avalanche subnets grow by 200% in 2025?", category: "crypto", poly: 0.43, kalshi: 0.56, bet: 3100, conf: "medium", risk: "high" },
      { name: "Will Polygon PoS migrate to zkEVM in 2025?", category: "crypto", poly: 0.62, kalshi: 0.74, bet: 3900, conf: "high", risk: "medium" },
      { name: "Will Cosmos IBC volume exceed $100B in 2025?", category: "crypto", poly: 0.37, kalshi: 0.50, bet: 2800, conf: "low", risk: "high" },
      { name: "Will Arbitrum become top L2 by TVL in 2025?", category: "crypto", poly: 0.69, kalshi: 0.80, bet: 4300, conf: "high", risk: "low" },
      { name: "Will Optimism Superchain reach 50 chains in 2025?", category: "crypto", poly: 0.51, kalshi: 0.64, bet: 3500, conf: "medium", risk: "medium" },
      
      // Stablecoin & CBDC Events 2025
      { name: "Will USDC market cap exceed USDT in 2025?", category: "crypto", poly: 0.33, kalshi: 0.46, bet: 2700, conf: "low", risk: "high" },
      { name: "Will PayPal USD stablecoin reach $10B supply in 2025?", category: "crypto", poly: 0.56, kalshi: 0.68, bet: 3700, conf: "medium", risk: "medium" },
      { name: "Will Tether face regulatory issues in 2025?", category: "crypto", poly: 0.47, kalshi: 0.60, bet: 3300, conf: "medium", risk: "high" },
      { name: "Will US launch digital dollar pilot in 2025?", category: "crypto", poly: 0.41, kalshi: 0.54, bet: 3000, conf: "medium", risk: "high" },
      { name: "Will China CBDC expand internationally in 2025?", category: "crypto", poly: 0.64, kalshi: 0.76, bet: 4000, conf: "high", risk: "medium" },
      { name: "Will EU digital euro launch in 2025?", category: "crypto", poly: 0.38, kalshi: 0.51, bet: 2900, conf: "medium", risk: "high" },
    ];

    const politicsEvents = [
      // 2026 Midterm Elections
      { name: "Will Democrats maintain House majority in 2026 midterms?", category: "politics", poly: 0.42, kalshi: 0.56, bet: 3200, conf: "medium", risk: "high" },
      { name: "Will Republicans gain Senate seats in 2026 midterms?", category: "politics", poly: 0.61, kalshi: 0.73, bet: 3900, conf: "high", risk: "medium" },
      { name: "Will voter turnout exceed 50% in 2026 midterms?", category: "politics", poly: 0.48, kalshi: 0.61, bet: 3400, conf: "medium", risk: "medium" },
      { name: "Will Democrats flip any red Senate seats in 2026?", category: "politics", poly: 0.54, kalshi: 0.67, bet: 3600, conf: "medium", risk: "medium" },
      { name: "Will GOP maintain control of 30+ state legislatures in 2026?", category: "politics", poly: 0.68, kalshi: 0.79, bet: 4200, conf: "high", risk: "low" },
      
      // Presidential Politics 2025/2028
      { name: "Will Joe Biden seek re-election in 2028?", category: "politics", poly: 0.31, kalshi: 0.44, bet: 2700, conf: "low", risk: "high" },
      { name: "Will Donald Trump be GOP nominee in 2028?", category: "politics", poly: 0.58, kalshi: 0.70, bet: 3800, conf: "high", risk: "medium" },
      { name: "Will Kamala Harris run for president in 2028?", category: "politics", poly: 0.66, kalshi: 0.77, bet: 4100, conf: "high", risk: "medium" },
      { name: "Will Ron DeSantis announce 2028 presidential bid in 2025?", category: "politics", poly: 0.72, kalshi: 0.83, bet: 4500, conf: "high", risk: "low" },
      { name: "Will Nikki Haley run for president in 2028?", category: "politics", poly: 0.55, kalshi: 0.68, bet: 3700, conf: "medium", risk: "medium" },
      { name: "Will primary debates begin before Q4 2027?", category: "politics", poly: 0.78, kalshi: 0.87, bet: 4900, conf: "high", risk: "low" },
      
      // Crypto Regulation 2025
      { name: "Will crypto regulation pass Congress in 2025?", category: "politics", poly: 0.64, kalshi: 0.76, bet: 4000, conf: "high", risk: "medium" },
      { name: "Will Bitcoin ETF approval expand by Q2 2025?", category: "politics", poly: 0.73, kalshi: 0.84, bet: 4600, conf: "high", risk: "low" },
      { name: "Will SEC approve spot Ethereum ETF in 2025?", category: "politics", poly: 0.69, kalshi: 0.80, bet: 4300, conf: "high", risk: "low" },
      { name: "Will US establish comprehensive crypto framework in 2025?", category: "politics", poly: 0.57, kalshi: 0.70, bet: 3800, conf: "high", risk: "medium" },
      { name: "Will stablecoin regulation bill pass in 2025?", category: "politics", poly: 0.62, kalshi: 0.74, bet: 3900, conf: "high", risk: "medium" },
      { name: "Will SEC change leadership in 2025?", category: "politics", poly: 0.45, kalshi: 0.58, bet: 3200, conf: "medium", risk: "high" },
      { name: "Will Congress create new crypto regulatory body in 2025?", category: "politics", poly: 0.38, kalshi: 0.51, bet: 2900, conf: "medium", risk: "high" },
      { name: "Will DeFi face increased regulation in 2025?", category: "politics", poly: 0.71, kalshi: 0.82, bet: 4400, conf: "high", risk: "low" },
      { name: "Will crypto exchanges require federal license in 2025?", category: "politics", poly: 0.52, kalshi: 0.65, bet: 3500, conf: "medium", risk: "medium" },
      { name: "Will IRS implement new crypto tax rules in 2025?", category: "politics", poly: 0.67, kalshi: 0.78, bet: 4100, conf: "high", risk: "medium" },
      
      // Economic Policy 2025
      { name: "Will Federal Reserve cut rates in Q1 2025?", category: "politics", poly: 0.58, kalshi: 0.71, bet: 3800, conf: "high", risk: "medium" },
      { name: "Will inflation fall below 2% by end of 2025?", category: "politics", poly: 0.44, kalshi: 0.57, bet: 3200, conf: "medium", risk: "high" },
      { name: "Will Fed maintain rates above 4% throughout 2025?", category: "politics", poly: 0.51, kalshi: 0.64, bet: 3500, conf: "medium", risk: "medium" },
      { name: "Will unemployment rate stay below 4.5% in 2025?", category: "politics", poly: 0.69, kalshi: 0.80, bet: 4300, conf: "high", risk: "low" },
      { name: "Will US GDP growth exceed 2.5% in 2025?", category: "politics", poly: 0.55, kalshi: 0.68, bet: 3700, conf: "high", risk: "medium" },
      { name: "Will US avoid recession in 2025?", category: "politics", poly: 0.73, kalshi: 0.84, bet: 4600, conf: "high", risk: "low" },
      { name: "Will stock market reach new highs in 2025?", category: "politics", poly: 0.66, kalshi: 0.77, bet: 4100, conf: "high", risk: "medium" },
      { name: "Will housing prices stabilize in 2025?", category: "politics", poly: 0.48, kalshi: 0.61, bet: 3400, conf: "medium", risk: "medium" },
      
      // International Politics 2025
      { name: "Will UK hold general election in 2025?", category: "politics", poly: 0.62, kalshi: 0.74, bet: 3900, conf: "high", risk: "medium" },
      { name: "Will France face political crisis in 2025?", category: "politics", poly: 0.47, kalshi: 0.60, bet: 3300, conf: "medium", risk: "high" },
      { name: "Will Germany elect new chancellor in 2025?", category: "politics", poly: 0.71, kalshi: 0.82, bet: 4400, conf: "high", risk: "low" },
      { name: "Will EU expand membership in 2025?", category: "politics", poly: 0.35, kalshi: 0.48, bet: 2800, conf: "low", risk: "high" },
      { name: "Will NATO add new members in 2025?", category: "politics", poly: 0.58, kalshi: 0.70, bet: 3800, conf: "medium", risk: "medium" },
      { name: "Will Ukraine peace negotiations conclude in 2025?", category: "politics", poly: 0.42, kalshi: 0.55, bet: 3100, conf: "medium", risk: "high" },
      { name: "Will China-Taiwan tensions escalate in 2025?", category: "politics", poly: 0.53, kalshi: 0.66, bet: 3600, conf: "medium", risk: "high" },
      { name: "Will Israel-Palestine conflict de-escalate in 2025?", category: "politics", poly: 0.38, kalshi: 0.51, bet: 2900, conf: "low", risk: "high" },
      
      // Supreme Court & Legislation 2025
      { name: "Will Supreme Court rule on major crypto case in 2025?", category: "politics", poly: 0.56, kalshi: 0.69, bet: 3700, conf: "medium", risk: "medium" },
      { name: "Will Congress pass AI regulation bill in 2025?", category: "politics", poly: 0.49, kalshi: 0.62, bet: 3400, conf: "medium", risk: "medium" },
      { name: "Will infrastructure bill phase 2 pass in 2025?", category: "politics", poly: 0.64, kalshi: 0.76, bet: 4000, conf: "high", risk: "medium" },
      { name: "Will federal minimum wage increase in 2025?", category: "politics", poly: 0.33, kalshi: 0.46, bet: 2700, conf: "low", risk: "high" },
      { name: "Will student loan forgiveness expand in 2025?", category: "politics", poly: 0.41, kalshi: 0.54, bet: 3000, conf: "medium", risk: "high" },
      { name: "Will healthcare reform legislation pass in 2025?", category: "politics", poly: 0.37, kalshi: 0.50, bet: 2800, conf: "low", risk: "high" },
      { name: "Will climate bill receive bipartisan support in 2025?", category: "politics", poly: 0.44, kalshi: 0.57, bet: 3200, conf: "medium", risk: "high" },
      { name: "Will immigration reform bill pass in 2025?", category: "politics", poly: 0.39, kalshi: 0.52, bet: 2900, conf: "medium", risk: "high" },
    ];

    const allEvents = [...cryptoEvents, ...politicsEvents];
    const opportunities = [];

    // Generate 2025/2026 opportunities with realistic dates
    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i];
      const spread = event.kalshi - event.poly;
      const arbitragePercentage = (spread / event.poly) * 100;
      const profitPercentage = spread * 100;
      const expectedProfit = event.bet * spread;
      
      // Generate realistic dates for 2025-2026
      const baseDate = new Date('2025-01-01');
      const daysOffset = Math.floor(Math.random() * 548); // ~18 months
      const detectedDate = new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
      const expiresDate = new Date(detectedDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days validity

      opportunities.push({
        event_name: event.name,
        category: event.category,
        polymarket_price: event.poly,
        kalshi_price: event.kalshi,
        spread: spread,
        arbitrage_percentage: parseFloat(arbitragePercentage.toFixed(2)),
        profit_percentage: parseFloat(profitPercentage.toFixed(2)),
        optimal_bet_amount: event.bet,
        expected_profit: parseFloat(expectedProfit.toFixed(2)),
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

    // Clear existing data first
    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/arbitrage_opportunities?status=eq.active`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
    });

    if (!deleteResponse.ok) {
      console.warn('Delete old data warning:', await deleteResponse.text());
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
      throw new Error(`Failed to insert data: ${error}`);
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
