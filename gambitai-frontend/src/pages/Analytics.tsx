import { useState, useEffect } from 'react';
import { supabase, ArbitrageOpportunity } from '../lib/supabase';
import { TrendingUp, PieChart, DollarSign, Target } from 'lucide-react';

export default function Analytics() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      const { data, error } = await supabase
        .from('arbitrage_opportunities')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalOpportunities: opportunities.length,
    avgProfit: opportunities.length > 0
      ? (opportunities.reduce((sum, opp) => sum + opp.profit_percentage, 0) / opportunities.length).toFixed(2)
      : '0',
    totalExpectedProfit: opportunities.reduce((sum, opp) => sum + opp.expected_profit, 0),
    highConfidence: opportunities.filter((opp) => opp.confidence_level === 'high').length,
    cryptoCount: opportunities.filter((opp) => opp.category === 'crypto').length,
    politicsCount: opportunities.filter((opp) => opp.category === 'politics').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Historical performance and insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Opportunities</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalOpportunities}</div>
        </div>

        <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg. Profit Potential</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.avgProfit}%</div>
        </div>

        <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Expected Profit</span>
            <DollarSign className="w-5 h-5 text-teal-500" />
          </div>
          <div className="text-3xl font-bold text-white">${stats.totalExpectedProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-semibold text-white">Category Distribution</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Crypto</span>
                <span className="text-white font-semibold">{stats.cryptoCount}</span>
              </div>
              <div className="w-full bg-teal-800 rounded-full h-2">
                <div
                  className="bg-teal-400 h-2 rounded-full"
                  style={{
                    width: `${(stats.cryptoCount / stats.totalOpportunities) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Politics</span>
                <span className="text-white font-semibold">{stats.politicsCount}</span>
              </div>
              <div className="w-full bg-teal-800 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{
                    width: `${(stats.politicsCount / stats.totalOpportunities) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Confidence Levels</h2>
          </div>
          <div className="space-y-4">
            {['high', 'medium', 'low'].map((level) => {
              const count = opportunities.filter((opp) => opp.confidence_level === level).length;
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 capitalize">{level}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-teal-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        level === 'high' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(count / stats.totalOpportunities) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Opportunities</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-teal-700">
                <th className="text-left text-gray-400 text-sm font-medium py-3">Event</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Category</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Spread</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Profit %</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Confidence</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.slice(0, 10).map((opp) => (
                <tr key={opp.id} className="border-b border-gray-800">
                  <td className="py-4 text-white">{opp.event_name.substring(0, 50)}...</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded">
                      {opp.category}
                    </span>
                  </td>
                  <td className="py-4 text-yellow-400">{(opp.spread * 100).toFixed(2)}%</td>
                  <td className="py-4 text-green-400">{opp.profit_percentage.toFixed(2)}%</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        opp.confidence_level === 'high'
                          ? 'bg-green-500/20 text-green-400'
                          : opp.confidence_level === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {opp.confidence_level}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        opp.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {opp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
