import { useState, useEffect } from 'react';
import { supabase, Market } from '../lib/supabase';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';

export default function Markets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<'all' | 'polymarket' | 'kalshi'>('all');
  const [category, setCategory] = useState<'all' | 'crypto' | 'politics'>('all');

  useEffect(() => {
    fetchMarkets();
  }, [platform, category]);

  const fetchMarkets = async () => {
    try {
      let query = supabase
        .from('markets')
        .select('*')
        .eq('status', 'active')
        .order('last_updated', { ascending: false })
        .limit(100);

      if (platform !== 'all') {
        query = query.eq('platform', platform);
      }

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading markets...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Markets</h1>
        <p className="text-gray-400">Browse active prediction markets from Polymarket and Kalshi</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as any)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="polymarket">Polymarket</option>
            <option value="kalshi">Kalshi</option>
          </select>
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-2 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="crypto">Crypto</option>
            <option value="politics">Politics</option>
          </select>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((market) => (
          <div
            key={market.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded border ${
                market.platform === 'polymarket'
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
              }`}>
                {market.platform.toUpperCase()}
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded border border-green-500/50 uppercase">
                {market.category}
              </span>
            </div>

            <h3 className="text-white font-semibold mb-4 line-clamp-2 min-h-[3rem]">
              {market.event_name}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Current Price</span>
                <span className="text-white font-semibold">${market.current_price.toFixed(4)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  24h Volume
                </span>
                <span className="text-white font-semibold">${market.volume_24h.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Open Interest
                </span>
                <span className="text-white font-semibold">${market.open_interest.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <span className="text-gray-500 text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Updated
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(market.last_updated).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {markets.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No markets found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
