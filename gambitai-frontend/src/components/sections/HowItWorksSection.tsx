import { Link } from 'react-router-dom';
import { TrendingUp, Search, Calculator, Bell, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  showCTA?: boolean;
  className?: string;
}

export default function HowItWorksSection({ showCTA = true, className = '' }: HowItWorksSectionProps) {
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">How GambitAI Works</h2>
          </div>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
            Discover arbitrage opportunities between Polymarket and Kalshi prediction markets automatically
          </p>
        </div>

        {/* What is Arbitrage */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">What is Arbitrage?</h3>
          <p className="text-gray-300 mb-4">
            Arbitrage is the practice of taking advantage of price differences for the same asset across different markets. 
            In prediction markets, this means buying a contract at a lower price on one platform and selling it at a higher 
            price on another platform, profiting from the spread.
          </p>
          <p className="text-gray-300">
            GambitAI automatically monitors both Polymarket and Kalshi to find these opportunities in real-time, 
            focusing on crypto and political events where price discrepancies are most common.
          </p>
        </div>

        {/* How it Works Steps */}
        <div className="space-y-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-2">1. Market Monitoring</h4>
              <p className="text-gray-300">
                Our system continuously monitors active prediction markets on both Polymarket and Kalshi, 
                fetching real-time price data every minute for crypto and political events.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-2">2. Arbitrage Detection</h4>
              <p className="text-gray-300">
                Advanced algorithms analyze price spreads between platforms, calculating potential profit margins, 
                optimal bet amounts, and risk assessments for each opportunity detected.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-2">3. Instant Alerts</h4>
              <p className="text-gray-300">
                Receive instant Telegram notifications when high-confidence arbitrage opportunities are detected 
                that match your preferences for minimum profit, categories, and confidence levels.
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 flex items-start space-x-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-2">4. Take Action</h4>
              <p className="text-gray-300">
                Use our calculator to verify the opportunity and execute trades on both platforms. 
                Track your performance with detailed analytics and historical data.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-500/30 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Real-Time Monitoring</h4>
              <p className="text-gray-300">Updates every minute to catch opportunities as they emerge</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Multi-Category Coverage</h4>
              <p className="text-gray-300">Focus on crypto and political events with highest activity</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Risk Assessment</h4>
              <p className="text-gray-300">Confidence levels and risk ratings for each opportunity</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Smart Calculations</h4>
              <p className="text-gray-300">Optimal bet amounts and expected profit calculations</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {showCTA && (
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-4 rounded-lg transition-all shadow-lg"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
