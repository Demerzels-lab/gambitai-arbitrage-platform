import { Link } from 'react-router-dom';
import { TrendingUp, Target, Zap, Users } from 'lucide-react';

export default function About() {
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
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
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
            About GambitAI
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered arbitrage detection platform that helps traders find risk-free profit opportunities in prediction markets
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg mb-4">
                GambitAI was founded with a mission to democratize access to arbitrage trading strategies previously available only to institutions and professional traders.
              </p>
              <p className="text-gray-300 text-lg mb-4">
                We believe that every trader, regardless of their experience level, deserves access to high-quality tools and data to make better trading decisions.
              </p>
              <p className="text-gray-300 text-lg">
                By leveraging AI technology and real-time monitoring, we help traders identify and execute arbitrage opportunities quickly and efficiently.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-500/20 to-teal-400/20 p-12 rounded-2xl border border-teal-500/30">
              <div className="text-center">
                <div className="text-6xl font-bold text-teal-500 mb-2">1,000+</div>
                <div className="text-gray-300 text-lg mb-8">Arbitrage Opportunities Detected</div>
                <div className="text-6xl font-bold text-teal-400 mb-2">24/7</div>
                <div className="text-gray-300 text-lg mb-8">Non-Stop Monitoring</div>
                <div className="text-6xl font-bold text-teal-600 mb-2">95%</div>
                <div className="text-gray-300 text-lg">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-400">Principles that guide every decision we make</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <div className="h-12 w-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Accuracy</h3>
              <p className="text-gray-400">
                We are committed to providing accurate and reliable data and analysis for every trading decision you make.
              </p>
            </div>
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <div className="h-12 w-12 bg-teal-400/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Speed</h3>
              <p className="text-gray-400">
                Arbitrage opportunities appear and disappear in seconds. Our system ensures you're always one step ahead.
              </p>
            </div>
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <div className="h-12 w-12 bg-teal-600/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Transparency</h3>
              <p className="text-gray-400">
                We believe in complete transparency in our detection methodology and profit calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Technology</h2>
            <p className="text-xl text-gray-400">Advanced infrastructure for real-time arbitrage detection</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Data Processing</h3>
              <p className="text-gray-400 mb-4">
                Our system processes data from multiple sources simultaneously using WebSocket connections to ensure no opportunity is missed.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  Polymarket WebSocket API
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  Kalshi REST API Integration
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  Sub-second latency monitoring
                </li>
              </ul>
            </div>
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Detection</h3>
              <p className="text-gray-400 mb-4">
                Our machine learning algorithms analyze market patterns and identify arbitrage opportunities with high accuracy.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  Pattern recognition algorithms
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  Risk assessment models
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  Profit optimization calculations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Us
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start your arbitrage trading journey today
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg"
          >
            Get Started Free
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
