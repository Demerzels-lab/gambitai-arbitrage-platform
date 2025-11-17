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

    console.log('Detecting arbitrage opportunities...');

    // Fetch active markets from both platforms
    const polymarketResponse = await fetch(
      `${supabaseUrl}/rest/v1/markets?platform=eq.polymarket&status=eq.active&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
        },
      }
    );

    const kalshiResponse = await fetch(
      `${supabaseUrl}/rest/v1/markets?platform=eq.kalshi&status=eq.active&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
        },
      }
    );

    const polymarketMarkets = await polymarketResponse.json();
    const kalshiMarkets = await kalshiResponse.json();

    console.log(`Polymarket markets: ${polymarketMarkets.length}`);
    console.log(`Kalshi markets: ${kalshiMarkets.length}`);

    // Function to calculate similarity between two strings
    function calculateSimilarity(str1: string, str2: string): number {
      const s1 = str1.toLowerCase();
      const s2 = str2.toLowerCase();
      
      // Simple word matching similarity
      const words1 = s1.split(/\s+/);
      const words2 = s2.split(/\s+/);
      
      let matches = 0;
      for (const word1 of words1) {
        if (word1.length > 3 && words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
          matches++;
        }
      }
      
      return matches / Math.max(words1.length, words2.length);
    }

    const opportunities = [];
    const MIN_SIMILARITY = 0.3;
    const MIN_SPREAD = 0.05; // 5% minimum spread

    // Match markets between platforms
    for (const polyMarket of polymarketMarkets) {
      for (const kalshiMarket of kalshiMarkets) {
        // Only compare same category
        if (polyMarket.category !== kalshiMarket.category) continue;

        const similarity = calculateSimilarity(polyMarket.event_name, kalshiMarket.event_name);
        
        if (similarity >= MIN_SIMILARITY) {
          const polyPrice = parseFloat(polyMarket.current_price);
          const kalshiPrice = parseFloat(kalshiMarket.current_price);
          const spread = Math.abs(polyPrice - kalshiPrice);

          // Check if there's an arbitrage opportunity
          if (spread >= MIN_SPREAD) {
            const arbitragePercentage = (spread / Math.min(polyPrice, kalshiPrice)) * 100;
            const profitPercentage = (spread / (polyPrice + kalshiPrice)) * 100;

            // Determine confidence level based on similarity and volume
            let confidenceLevel = 'low';
            if (similarity > 0.7 && (polyMarket.volume_24h > 1000 || kalshiMarket.volume_24h > 1000)) {
              confidenceLevel = 'high';
            } else if (similarity > 0.5) {
              confidenceLevel = 'medium';
            }

            // Determine risk assessment based on spread and volatility
            let riskAssessment = 'medium';
            if (spread > 0.15) {
              riskAssessment = 'high';
            } else if (spread < 0.08) {
              riskAssessment = 'low';
            }

            // Calculate optimal bet amount (simple heuristic)
            const minLiquidity = Math.min(
              parseFloat(polyMarket.open_interest || 0),
              parseFloat(kalshiMarket.open_interest || 0)
            );
            const optimalBetAmount = Math.min(5000, Math.max(1000, minLiquidity * 0.1));
            const expectedProfit = optimalBetAmount * (spread / (1 - Math.min(polyPrice, kalshiPrice)));

            opportunities.push({
              event_name: polyMarket.event_name,
              category: polyMarket.category,
              polymarket_price: polyPrice,
              kalshi_price: kalshiPrice,
              spread: spread,
              arbitrage_percentage: arbitragePercentage,
              profit_percentage: profitPercentage,
              optimal_bet_amount: Math.round(optimalBetAmount),
              expected_profit: Math.round(expectedProfit),
              confidence_level: confidenceLevel,
              risk_assessment: riskAssessment,
              polymarket_market_id: polyMarket.market_id,
              kalshi_market_id: kalshiMarket.market_id,
              detected_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
              status: 'active',
            });
          }
        }
      }
    }

    console.log(`Found ${opportunities.length} arbitrage opportunities`);

    // Save opportunities to database
    let savedCount = 0;
    if (opportunities.length > 0) {
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/arbitrage_opportunities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(opportunities),
      });

      if (insertResponse.ok) {
        savedCount = opportunities.length;
      }
    }

    return new Response(
      JSON.stringify({
        data: {
          success: true,
          opportunities_found: opportunities.length,
          opportunities_saved: savedCount,
          polymarket_markets: polymarketMarkets.length,
          kalshi_markets: kalshiMarkets.length,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Arbitrage detection error:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'ARBITRAGE_DETECTION_ERROR',
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
