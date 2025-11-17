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

    console.log('Fetching Polymarket data...');

    // Fetch markets from Polymarket Gamma API (public, no auth needed)
    // Focus on crypto and politics categories
    const marketsResponse = await fetch('https://gamma-api.polymarket.com/markets?limit=50&closed=false', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!marketsResponse.ok) {
      throw new Error(`Polymarket API error: ${marketsResponse.statusText}`);
    }

    const marketsData = await marketsResponse.json();
    console.log(`Fetched ${marketsData.length} markets from Polymarket`);

    // Filter for crypto and politics categories
    const relevantMarkets = marketsData.filter((market: any) => {
      const tags = market.tags || [];
      return tags.some((tag: string) => 
        tag.toLowerCase().includes('crypto') || 
        tag.toLowerCase().includes('bitcoin') ||
        tag.toLowerCase().includes('ethereum') ||
        tag.toLowerCase().includes('politics') ||
        tag.toLowerCase().includes('election')
      );
    });

    console.log(`Found ${relevantMarkets.length} relevant markets`);

    // Upsert markets to database
    let upsertedCount = 0;
    for (const market of relevantMarkets) {
      try {
        // Determine category based on tags
        const tags = market.tags || [];
        let category = 'politics';
        if (tags.some((tag: string) => 
          tag.toLowerCase().includes('crypto') || 
          tag.toLowerCase().includes('bitcoin') ||
          tag.toLowerCase().includes('ethereum')
        )) {
          category = 'crypto';
        }

        // Get current price (use outcomePrices if available)
        const currentPrice = market.outcomePrices?.[0] || 0.5;

        const marketData = {
          platform: 'polymarket',
          market_id: market.id || market.conditionId,
          event_name: market.question || market.title,
          category: category,
          current_price: currentPrice,
          volume_24h: market.volume24hr || 0,
          open_interest: market.liquidity || 0,
          status: market.closed ? 'closed' : 'active',
          metadata: {
            slug: market.slug,
            tags: market.tags,
            end_date: market.endDate,
            outcomes: market.outcomes,
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
        console.error(`Error upserting market ${market.id}:`, error);
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
    console.error('Polymarket fetch error:', error);
    return new Response(
      JSON.stringify({
        error: {
          code: 'POLYMARKET_FETCH_ERROR',
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
