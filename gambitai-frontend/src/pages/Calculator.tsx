import { useState } from 'react';
import { Calculator as CalcIcon, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function Calculator() {
  const [polymarketPrice, setPolymarketPrice] = useState('');
  const [kalshiPrice, setKalshiPrice] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateArbitrage = () => {
    const poly = parseFloat(polymarketPrice);
    const kalshi = parseFloat(kalshiPrice);
    const amount = parseFloat(betAmount);

    if (!poly || !kalshi || !amount) {
      alert('Please fill in all fields');
      return;
    }

    const spread = Math.abs(poly - kalshi);
    const arbitragePercentage = (spread / Math.min(poly, kalshi)) * 100;
    const profitPercentage = (spread / (poly + kalshi)) * 100;
    const expectedProfit = amount * (spread / (1 - Math.min(poly, kalshi)));

    const buyPlatform = poly < kalshi ? 'Polymarket' : 'Kalshi';
    const sellPlatform = poly < kalshi ? 'Kalshi' : 'Polymarket';
    const buyPrice = Math.min(poly, kalshi);
    const sellPrice = Math.max(poly, kalshi);

    setResult({
      spread,
      arbitragePercentage,
      profitPercentage,
      expectedProfit,
      buyPlatform,
      sellPlatform,
      buyPrice,
      sellPrice,
      hasOpportunity: spread > 0.05, // 5% minimum spread
    });
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
                  <div className="text-gray-400 text-sm mb-1">Spread</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {(result.spread * 100).toFixed(2)}%
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
                      <span className="text-white font-semibold">${result.buyPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded">
                      <span className="text-gray-300">Sell on</span>
                      <span className="text-white font-semibold">{result.sellPlatform}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded">
                      <span className="text-gray-300">Sell Price</span>
                      <span className="text-white font-semibold">${result.sellPrice.toFixed(4)}</span>
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
