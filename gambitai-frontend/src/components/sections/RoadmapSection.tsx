import { CheckCircle, Circle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Milestone {
  version: string;
  status: 'completed' | 'in-progress' | 'planned';
  title: string;
  date: string;
  features: string[];
}

interface RoadmapSectionProps {
  showFeedback?: boolean;
  className?: string;
}

export default function RoadmapSection({ showFeedback = true, className = '' }: RoadmapSectionProps) {
  const milestones: Milestone[] = [
    {
      version: 'v1.0',
      status: 'completed',
      title: 'Core Platform Launch',
      date: 'Q4 2024',
      features: [
        'Real-time arbitrage detection for Polymarket and Kalshi',
        'Multi-user authentication system',
        'Dashboard with live opportunities',
        'Markets browser',
        'Telegram alert integration',
        'Arbitrage calculator',
        'Historical analytics',
      ],
    },
    {
      version: 'v1.1',
      status: 'in-progress',
      title: 'Enhanced Analytics & Automation',
      date: 'Q1 2025',
      features: [
        'Advanced filtering and search',
        'Custom alert rules and thresholds',
        'Portfolio tracking and performance metrics',
        'Price charts and market trends',
        'Mobile responsive improvements',
        'API access for developers',
      ],
    },
    {
      version: 'v2.0',
      status: 'planned',
      title: 'Trading Automation',
      date: 'Q2 2025',
      features: [
        'Automated trade execution',
        'Strategy backtesting',
        'Risk management tools',
        'Multi-platform account linking',
        'Machine learning opportunity scoring',
        'Discord and Slack integrations',
      ],
    },
    {
      version: 'v2.1',
      status: 'planned',
      title: 'Ecosystem Expansion',
      date: 'Q3 2025',
      features: [
        'Additional prediction market platforms',
        'Social features and community insights',
        'Educational resources and tutorials',
        'Premium subscription tiers',
        'White-label solutions for institutions',
        'Mobile native apps (iOS & Android)',
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'planned':
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'planned':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-teal-900/50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Product Roadmap</h2>
          <p className="text-xl text-gray-400">Our vision for the future of GambitAI</p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.version}
              className="bg-teal-950/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Connecting line */}
              {index < milestones.length - 1 && (
                <div className="absolute left-9 top-16 w-0.5 h-full bg-gray-700" />
              )}

              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className="flex-shrink-0 z-10 bg-gray-900 p-1">
                  {getStatusIcon(milestone.status)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <div className="flex items-center space-x-3 mb-2 flex-wrap">
                        <h3 className="text-2xl font-bold text-white">{milestone.version}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded border ${getStatusBadge(
                            milestone.status
                          )}`}
                        >
                          {milestone.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-lg text-gray-300 font-semibold">{milestone.title}</h4>
                    </div>
                    <div className="text-gray-400 text-sm">{milestone.date}</div>
                  </div>

                  <div className="space-y-2">
                    {milestone.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            milestone.status === 'completed' ? 'text-green-400' : 'text-gray-600'
                          }`}
                        />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Feedback */}
        {showFeedback && (
          <motion.div
            className="mt-8 max-w-5xl mx-auto bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-xl p-6 border border-teal-400/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: milestones.length * 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-2">Have a Feature Request?</h3>
            <p className="text-gray-300 mb-4">
              We value your feedback! Help us shape the future of GambitAI by sharing your ideas and suggestions.
            </p>
            <a
              href="mailto:feedback@gambitai.com"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Send Feedback
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
