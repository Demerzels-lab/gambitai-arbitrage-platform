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

    console.log('Fetching Kalshi data...');

    // Fetch markets from Kalshi API (public endpoint)
    // Focus on crypto and politics markets
    const marketsResponse = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets?limit=100&status=open', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!marketsResponse.ok) {
      throw new Error(`Kalshi API error: ${marketsResponse.statusText}`);
    }

    const marketsResult = await marketsResponse.json();
    const marketsData = marketsResult.markets || [];
    console.log(`Fetched ${marketsData.length} markets from Kalshi`);

    // Filter for crypto and politics categories
    const relevantMarkets = marketsData.filter((market: any) => {
      const title = (market.title || '').toLowerCase();
      const subtitle = (market.subtitle || '').toLowerCase();
      const eventTicker = (market.event_ticker || '').toLowerCase();
      
      return title.includes('crypto') || 
             title.includes('bitcoin') || 
             title.includes('ethereum') ||
             title.includes('election') ||
             title.includes('president') ||
             title.includes('congress') ||
             subtitle.includes('crypto') ||
             subtitle.includes('bitcoin') ||
             eventTicker.includes('crypto') ||
             eventTicker.includes('btc');
    });

    console.log(`Found ${relevantMarkets.length} relevant markets`);

    // Upsert markets to database
    let upsertedCount = 0;
    for (const market of relevantMarkets) {
      try {
        // Determine category
        const title = (market.title || '').toLowerCase();
        let category = 'politics';
        if (title.includes('crypto') || title.includes('bitcoin') || title.includes('ethereum')) {
          category = 'crypto';
        }

        // Calculate current price from cents to decimal (0-1 range)
        const currentPrice = (market.last_price || 50) / 100;

        const marketData = {
          platform: 'kalshi',
          market_id: market.ticker,
          event_name: market.title || market.subtitle,
          category: category,
          current_price: currentPrice,
          volume_24h: market.volume_24h || 0,
          open_interest: market.open_interest || 0,
          status: market.status === 'open' ? 'active' : market.status,
          metadata: {
            ticker: market.ticker,
            event_ticker: market.event_ticker,
            yes_bid: market.yes_bid,
            yes_ask: market.yes_ask,
            no_bid: market.no_bid,
            no_ask: market.no_ask,
            close_time: market.close_time,
          },
          last_updated: new Date().toISOString(),
        };

        // Upsert to database
        const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/markets`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify(marketData),
        });

        if (upsertResponse.ok) {
          upsertedCount++;
        }
      } catch (error) {
        console.error(`Error upserting market ${market.ticker}:`, error);
      }
    }

    console.log(`Successfully upserted ${upsertedCount} markets`);

    return new Response(
      JSON.stringify({
        data: {
          success: true,
          fetched: marketsData.length,
          relevant: relevantMarkets.length,
          upserted: upsertedCount,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Kalshi fetch error:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'KALSHI_FETCH_ERROR',
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
