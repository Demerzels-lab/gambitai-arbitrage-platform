import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Zap, Shield, Bell, BarChart3, Calculator, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import RoadmapSection from '../components/sections/RoadmapSection';

export default function Landing() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);
  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-teal-950/95 backdrop-blur-sm border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpeg" alt="GambitAI Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-white">GambitAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              <a href="https://x.com/GambittAI" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              {user ? (
                <span className="text-gray-300 text-sm">{user.email}</span>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
                  <Link 
                    to="/signup" 
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              {user ? (
                <span className="text-gray-300 text-sm px-4 py-2">{user.email}</span>
              ) : (
                <Link to="/signup" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold">
                  Start
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Detect Arbitrage Opportunities
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300 drop-shadow-lg">
                In Real-Time
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered platform that detects arbitrage opportunities between Polymarket and Kalshi. 
              Get risk-free profits with instant notifications and real-time data analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-teal-500/50"
                >
                  Back to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/signup"
                    className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-teal-500/50 hover:shadow-2xl"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link 
                    to="/login"
                    className="px-8 py-4 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors font-semibold text-lg border border-teal-700"
                  >
                    View Demo
                  </Link>
                </>
              )}
            </div>
            <p className="mt-6 text-gray-400 text-sm">
              No credit card required. Get started in 30 seconds.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-500 mb-2 drop-shadow-lg">1,000+</div>
              <div className="text-gray-400">Opportunities Detected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400 mb-2 drop-shadow-lg">24/7</div>
              <div className="text-gray-400">Real-Time Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2 drop-shadow-lg">95%</div>
              <div className="text-gray-400">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2 drop-shadow-lg">&lt;1s</div>
              <div className="text-gray-400">Instant Notifications</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-teal-900/50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to identify and capitalize on arbitrage opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 hover:border-teal-500 transition-all hover:shadow-lg hover:shadow-teal-500/20">
              <div className="h-12 w-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Detection</h3>
              <p className="text-gray-400">
                24/7 monitoring system that detects arbitrage opportunities in seconds
              </p>
            </div>

            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 hover:border-teal-400 transition-all hover:shadow-lg hover:shadow-teal-400/20">
              <div className="h-12 w-12 bg-teal-400/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Telegram Notifications</h3>
              <p className="text-gray-400">
                Get instant alerts via Telegram for every new arbitrage opportunity
              </p>
            </div>

            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 hover:border-teal-600 transition-all hover:shadow-lg hover:shadow-teal-600/20">
              <div className="h-12 w-12 bg-teal-600/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deep Analytics</h3>
              <p className="text-gray-400">
                Complete analytics dashboard with historical data and market trends
              </p>
            </div>

            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Profit Calculator</h3>
              <p className="text-gray-400">
                Calculate your potential profits with our accurate arbitrage calculator
              </p>
            </div>

            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 hover:border-teal-500 transition-all hover:shadow-lg hover:shadow-teal-500/20">
              <div className="h-12 w-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Risk-Free Trading</h3>
              <p className="text-gray-400">
                Arbitrage is a risk-free trading strategy with guaranteed profits
              </p>
            </div>

            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="h-12 w-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Market</h3>
              <p className="text-gray-400">
                Simultaneous monitoring across Polymarket and Kalshi for maximum opportunities
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works - Detailed */}
      <HowItWorksSection showCTA={false} />

      {/* Roadmap */}
      <RoadmapSection showFeedback={true} />

      {/* Pricing Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-teal-900/50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your trading needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  10 alerts per day
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Basic dashboard access
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  7-day historical data
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors text-center font-semibold border border-teal-700"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-teal-900/50 to-gray-900 p-8 rounded-xl border-2 border-teal-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Unlimited alerts
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Full dashboard + analytics
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  90-day historical data
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Premium Telegram bot
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-center font-semibold"
              >
                Start Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  All Pro features
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  API access
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Unlimited historical data
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  Custom integration
                </li>
                <li className="text-gray-300 flex items-start">
                  <span className="text-teal-500 mr-2">✓</span>
                  24/7 dedicated support
                </li>
              </ul>
              <Link
                to="/contact"
                className="block w-full px-6 py-3 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors text-center font-semibold border border-teal-700"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Arbitrage Trading?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join smart traders using GambitAI for consistent profits
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-semibold text-lg shadow-lg hover:shadow-teal-500/50 hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-teal-950 border-t border-teal-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.jpeg" alt="GambitAI Logo" className="h-6 w-6" />
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
