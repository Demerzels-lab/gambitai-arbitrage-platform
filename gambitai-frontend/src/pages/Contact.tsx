import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TrendingUp, Mail, MessageSquare, MapPin, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted successfully!');
    // In production, this would send to backend
    setSubmitted(true);
    console.log('Submitted state set to true');
    // Clear form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Hide success message after 8 seconds for better visibility
    setTimeout(() => {
      setSubmitted(false);
      console.log('Submitted state set to false');
    }, 8000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-teal-950">
      {/* Success Toast Notification - Fixed Position */}
      {submitted && (
        <div className="fixed top-24 right-8 z-50 max-w-md animate-fade-in">
          <div className="p-6 bg-teal-600 border-2 border-teal-400 rounded-xl shadow-2xl shadow-teal-500/50">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-xl mb-1">Success!</p>
                <p className="text-teal-50 text-base">Your message has been sent successfully. We'll respond within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
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
            Contact Us
          </h1>
          <p className="text-xl text-gray-300">
            Have questions? Our team is ready to help you. Contact us through the form below or reach out directly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-teal-950 p-8 rounded-xl border border-teal-700 relative">
              <h2 className="text-3xl font-bold text-white mb-6">Send Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-teal-900 border border-teal-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-teal-900 border border-teal-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-teal-900 border border-teal-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Question about..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-teal-900 border border-teal-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                <p className="text-gray-400 mb-8">
                  We are available to answer your questions and help you get started with GambitAI.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-teal-950 p-6 rounded-xl border border-teal-700 flex items-start">
                  <div className="h-12 w-12 bg-teal-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">support@gambitai.com</p>
                    <p className="text-gray-500 text-sm mt-1">Response within 24 hours</p>
                  </div>
                </div>

                <div className="bg-teal-950 p-6 rounded-xl border border-teal-700 flex items-start">
                  <div className="h-12 w-12 bg-teal-400/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-400">Available on dashboard</p>
                    <p className="text-gray-500 text-sm mt-1">Monday - Friday, 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="bg-teal-950 p-6 rounded-xl border border-teal-700 flex items-start">
                  <div className="h-12 w-12 bg-teal-600/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Office</h3>
                    <p className="text-gray-400">Jakarta, Indonesia</p>
                    <p className="text-gray-500 text-sm mt-1">By appointment only</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
                <h3 className="text-white font-semibold mb-4">Operating Hours</h3>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-white">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-white">10:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Enterprise */}
              <div className="bg-gradient-to-br from-teal-500/10 to-teal-400/10 p-6 rounded-xl border border-teal-500/30">
                <h3 className="text-white font-semibold mb-2">Enterprise Solutions</h3>
                <p className="text-gray-400 mb-4">
                  Need custom solutions or special integrations? Our sales team is ready to help.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm"
                >
                  View Enterprise Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              General Question
            </h2>
            <p className="text-gray-400">
              Maybe your answer is already here
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-white font-semibold mb-2">How do I get started?</h3>
              <p className="text-gray-400 text-sm">
                Sign up for free, set your alert preferences, and start receiving arbitrage opportunity notifications.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-white font-semibold mb-2">Is there a trial period?</h3>
              <p className="text-gray-400 text-sm">
                The Free plan is available forever. No credit card required to get started.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-white font-semibold mb-2">Which platforms are supported?</h3>
              <p className="text-gray-400 text-sm">
                We currently support Polymarket and Kalshi with plans to expand to other platforms.
              </p>
            </div>
            <div className="bg-teal-950 p-6 rounded-xl border border-teal-700">
              <h3 className="text-white font-semibold mb-2">What about data security?</h3>
              <p className="text-gray-400 text-sm">
                All data is encrypted end-to-end and stored on secure servers with routine backups.
              </p>
            </div>
          </div>
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
