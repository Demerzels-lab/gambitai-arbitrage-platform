import { useState, useEffect } from 'react';
import { supabase, ArbitrageOpportunity } from '../lib/supabase';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'crypto' | 'politics'>('all');

  useEffect(() => {
    fetchOpportunities();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('arbitrage_opportunities_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'arbitrage_opportunities',
        },
        () => {
          fetchOpportunities();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filter]);

  const fetchOpportunities = async () => {
    try {
      let query = supabase
        .from('arbitrage_opportunities')
        .select('*')
        .eq('status', 'active')
        .order('detected_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const stats = {
    total: opportunities.length,
    avgProfit: opportunities.length > 0
      ? (opportunities.reduce((sum, opp) => sum + opp.profit_percentage, 0) / opportunities.length).toFixed(2)
      : '0',
    highConfidence: opportunities.filter((opp) => opp.confidence_level === 'high').length,
    totalExpectedProfit: opportunities.reduce((sum, opp) => sum + opp.expected_profit, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Arbitrage Dashboard</h1>
        <p className="text-gray-400">Real-time arbitrage opportunities between Polymarket and Kalshi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Opportunities</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg. Profit</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.avgProfit}%</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">High Confidence</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.highConfidence}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Expected Profit</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">${stats.totalExpectedProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-gray-300 font-medium">Filter:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('crypto')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'crypto'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Crypto
        </button>
        <button
          onClick={() => setFilter('politics')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'politics'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Politics
        </button>
      </div>

      {/* Opportunities List */}
      {opportunities.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No opportunities found</h3>
          <p className="text-gray-500">Check back soon for new arbitrage opportunities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{opportunity.event_name}</h3>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded border border-blue-500/50 uppercase">
                      {opportunity.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded border ${getConfidenceBadgeColor(opportunity.confidence_level)}`}>
                    {opportunity.confidence_level.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded border ${getRiskBadgeColor(opportunity.risk_assessment)}`}>
                    Risk: {opportunity.risk_assessment.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Polymarket</div>
                  <div className="text-white font-semibold">${opportunity.polymarket_price.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Kalshi</div>
                  <div className="text-white font-semibold">${opportunity.kalshi_price.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Spread</div>
                  <div className="text-yellow-400 font-semibold">{(opportunity.spread * 100).toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Profit Potential</div>
                  <div className="text-green-400 font-semibold">{opportunity.profit_percentage.toFixed(2)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Optimal Bet: ${opportunity.optimal_bet_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Expected Profit: ${opportunity.expected_profit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      Detected: {new Date(opportunity.detected_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
