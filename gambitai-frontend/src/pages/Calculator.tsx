import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator as CalcIcon, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function Calculator() {
  const location = useLocation();
  const state = location.state as { polymarketPrice?: number; kalshiPrice?: number; betAmount?: number } || {};
  
  const [polymarketPrice, setPolymarketPrice] = useState(state.polymarketPrice?.toString() || '');
  const [kalshiPrice, setKalshiPrice] = useState(state.kalshiPrice?.toString() || '');
  const [betAmount, setBetAmount] = useState(state.betAmount?.toString() || '');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Auto-calculate if all fields are pre-filled from navigation state
    if (state.polymarketPrice && state.kalshiPrice && state.betAmount) {
      console.log('Auto-calculating with pre-filled values:', state);
      // Use timeout to ensure state is updated
      setTimeout(() => {
        const poly = state.polymarketPrice || 0;
        const kalshi = state.kalshiPrice || 0;
        const amount = state.betAmount || 0;
        
        if (poly > 0 && kalshi > 0 && amount > 0) {
          performCalculation(poly, kalshi, amount);
        }
      }, 100);
    }
  }, []);

  const performCalculation = (poly: number, kalshi: number, amount: number) => {
    console.log('Performing calculation with:', { poly, kalshi, amount });
    
    // Basic validation
    if (poly <= 0 || kalshi <= 0 || amount <= 0) {
      console.error('Invalid input values');
      return;
    }

    // Calculate spread and arbitrage metrics
    const spread = Math.abs(poly - kalshi);
    const spreadPercentage = (spread / Math.min(poly, kalshi)) * 100;
    
    // Improved profit calculation
    // If we buy at lower price and sell at higher price
    const buyPrice = Math.min(poly, kalshi);
    const sellPrice = Math.max(poly, kalshi);
    
    // Expected profit based on the spread and bet amount
    // Profit = (Sell Price - Buy Price) * Number of contracts
    // Number of contracts = Bet Amount / Buy Price
    const numContracts = amount / buyPrice;
    const grossProfit = numContracts * (sellPrice - buyPrice);
    const profitPercentage = (grossProfit / amount) * 100;

    const buyPlatform = poly < kalshi ? 'Polymarket' : 'Kalshi';
    const sellPlatform = poly < kalshi ? 'Kalshi' : 'Polymarket';

    const calculatedResult = {
      spread: spreadPercentage,
      arbitragePercentage: spreadPercentage,
      profitPercentage,
      expectedProfit: grossProfit,
      buyPlatform,
      sellPlatform,
      buyPrice,
      sellPrice,
      hasOpportunity: spreadPercentage > 5, // 5% minimum spread
    };

    console.log('Calculation result:', calculatedResult);
    setResult(calculatedResult);
  };

  const calculateArbitrage = () => {
    const poly = parseFloat(polymarketPrice);
    const kalshi = parseFloat(kalshiPrice);
    const amount = parseFloat(betAmount);

    console.log('Calculate button clicked with:', { poly, kalshi, amount });

    if (!poly || !kalshi || !amount || isNaN(poly) || isNaN(kalshi) || isNaN(amount)) {
      alert('Please fill in all fields with valid numbers');
      return;
    }

    if (poly <= 0 || poly > 1 || kalshi <= 0 || kalshi > 1) {
      alert('Prices must be between 0 and 1');
      return;
    }

    if (amount <= 0) {
      alert('Bet amount must be greater than 0');
      return;
    }

    performCalculation(poly, kalshi, amount);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Arbitrage Calculator</h1>
        <p className="text-gray-400">Calculate potential profits from price differences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <CalcIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Input Values</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Polymarket Price (0-1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={polymarketPrice}
                onChange={(e) => setPolymarketPrice(e.target.value)}
                placeholder="0.65"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kalshi Price (0-1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={kalshiPrice}
                onChange={(e) => setKalshiPrice(e.target.value)}
                placeholder="0.82"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bet Amount ($)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={calculateArbitrage}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all shadow-lg"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Results</h2>
          </div>

          {!result ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Enter values and click Calculate
            </div>
          ) : (
            <div className="space-y-6">
              {result.hasOpportunity ? (
                <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-400">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">Arbitrage Opportunity Detected!</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Spread too small - may not be profitable</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Spread Percentage</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {result.spread.toFixed(2)}%
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Profit Percentage</div>
                  <div className="text-2xl font-bold text-green-400">
                    {result.profitPercentage.toFixed(2)}%
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Expected Profit</div>
                  <div className="text-2xl font-bold text-white flex items-center">
                    <DollarSign className="w-6 h-6" />
                    {result.expectedProfit.toFixed(2)}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-white font-semibold mb-3">Strategy</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded">
                      <span className="text-gray-300">Buy on</span>
                      <span className="text-white font-semibold">{result.buyPlatform}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded">
                      <span className="text-gray-300">Buy Price</span>
                      <span className="text-white font-semibold">{result.buyPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded">
                      <span className="text-gray-300">Sell on</span>
                      <span className="text-white font-semibold">{result.sellPlatform}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded">
                      <span className="text-gray-300">Sell Price</span>
                      <span className="text-white font-semibold">{result.sellPrice.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
