import { Link } from 'react-router-dom';
import { TrendingUp, Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-teal-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-teal-950/95 backdrop-blur-sm border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-teal-500" />
              <span className="text-2xl font-bold text-white">GambitAI</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Pricing That Fits Everyone
          </h1>
          <p className="text-xl text-gray-300">
            Choose the right plan for your trading needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-teal-950 p-8 rounded-2xl border border-teal-700 hover:border-teal-600 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <p className="text-gray-400 mb-6">To get started and try the platform</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                </div>
                <p className="text-gray-400">Forever free</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>10 alert notifications per day</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Basic dashboard access</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>7-day historical data</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Arbitrage calculator</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Email support (48 hours)</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-3">✗</span>
                  <span>Telegram bot premium</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-3">✗</span>
                  <span>Advanced analytics</span>
                </li>
              </ul>

              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors text-center font-semibold border border-teal-700"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-teal-900/50 to-gray-900 p-8 rounded-2xl border-2 border-teal-500 relative transform md:scale-105 shadow-2xl shadow-teal-500/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">For serious traders who want full features</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">$49</span>
                  <span className="text-gray-400 text-lg">/month</span>
                </div>
                <p className="text-gray-400">or $499/year (save 17%)</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Unlimited alert notifications</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Full dashboard with analytics</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>90-day historical data</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Advanced arbitrage calculator</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Premium Telegram bot with instant alerts</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Custom alert threshold</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Priority support (24 hours)</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-3">✗</span>
                  <span>API access</span>
                </li>
              </ul>

              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-center font-semibold shadow-lg"
              >
                Start Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-teal-950 p-8 rounded-2xl border border-teal-700 hover:border-teal-600 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-6">For organizations and institutional traders</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">Custom</span>
                </div>
                <p className="text-gray-400">Contact for pricing</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>API access with high rate limits</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Data historis unlimited</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Custom integration & webhooks</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>SLA guarantee</span>
                </li>
              </ul>

              <Link
                to="/contact"
                className="block w-full px-6 py-3 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors text-center font-semibold border border-teal-700"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Can I upgrade or downgrade my plan anytime?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect in the next billing period.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Are there any hidden fees?
              </h3>
              <p className="text-gray-400">
                No hidden fees. The pricing displayed is final with no additional charges.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-xl font-bold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept payments via credit card, bank transfer, and e-wallets. For Enterprise plans, we also accept invoice payments.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-400">
                Yes, we offer a 14-day money-back guarantee for paid plans if you're not satisfied with our service.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-xl font-bold text-white mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-400">
                Data security is our priority. All data is encrypted and stored on secure servers with routine backups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start with the Free plan and upgrade anytime as needed
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-950 border-t border-teal-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-teal-500" />
                <span className="text-xl font-bold text-white">GambitAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered arbitrage detection platform for prediction market traders.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white text-sm">Dashboard</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white text-sm">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-800 pt-8 text-center text-gray-400 text-sm">
            © 2025 GambitAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
