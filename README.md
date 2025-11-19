# GambitAI - Arbitrage Detection Platform

🎯 **Real-time arbitrage opportunity detection for prediction markets**

GambitAI is a sophisticated arbitrage detection platform that monitors prediction markets across Polymarket and Kalshi to identify profitable arbitrage opportunities in real-time.

## 🌟 Features

- **Real-time Monitoring**: Continuous surveillance of prediction markets every minute
- **Arbitrage Detection**: Advanced algorithms to identify price discrepancies between platforms
- **Multi-Platform Support**: Integrated with both Polymarket and Kalshi APIs
- **Profit Calculations**: Auto-calculate optimal bet amounts and expected returns
- **Telegram Alerts**: Instant notifications for high-confidence opportunities
- **Historical Analytics**: Track performance and analyze past opportunities
- **User Authentication**: Secure multi-user platform with Supabase Auth
- **Responsive Design**: Optimized for desktop and mobile devices

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Supabase** for authentication and real-time data

### Backend
- **Supabase** (PostgreSQL database)
- **Edge Functions** for API integrations and arbitrage detection
- **Real-time subscriptions** for live updates
- **CRON jobs** for automated monitoring

### APIs Integrated
- **Polymarket Gamma API** (Data API + CLOB)
- **Kalshi Public API**
- **Telegram Bot API** for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- API keys for Polymarket and Kalshi (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gambitai.git
   cd gambitai
   ```

2. **Install frontend dependencies**
   ```bash
   cd gambitai-frontend
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Dashboard: http://localhost:5173/dashboard

### Database Setup

1. **Run Supabase migrations**
   ```bash
   # Navigate to supabase directory
   cd ../supabase
   
   # Apply database schema
   # (Your migration commands here)
   ```

2. **Seed sample data**
   ```bash
   # Load sample arbitrage opportunities
   # (Your seed commands here)
   ```

## 📊 Sample Data

The platform includes comprehensive sample data for 2025/2026:

### Politics Events
- 2026 Midterm Elections
- 2028 Presidential Candidates
- Crypto Regulation Outcomes
- International Relations

### Crypto Events
- Bitcoin price predictions ($150,000 by 2025)
- Ethereum developments ($8,000 target)
- DeFi growth projections ($500B TVL)
- Layer 2 adoption metrics

## 🎮 Demo

**Live Demo**: https://5kzrrwm0sj8a.space.minimax.io

**Test Account**:
- Email: alzqylsq@minimax.com
- Password: gRTBe4ip1f

### Key Sections
- **Dashboard**: Overview of opportunities and performance metrics
- **Markets**: Real-time prediction market data
- **Analytics**: Historical data and profit analysis
- **Calculator**: Arbitrage profit calculator
- **Settings**: User preferences and alert configuration

## 🛠️ Development

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: MiniMax Space hosting

### Project Structure
```
gambitai/
├── gambitai-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── lib/               # Utilities and configurations
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   └── package.json           # Dependencies and scripts
├── supabase/                   # Backend configuration
│   ├── functions/             # Edge functions
│   ├── migrations/            # Database migrations
│   └── config/               # Supabase configuration
├── docs/                      # Project documentation
└── README.md                 # This file
```

### Code Principles
- **SOLID Principles**: Clean, maintainable architecture
- **Single Responsibility**: Each component has one clear purpose
- **Reusable Components**: Modular design for scalability
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach

## 📈 Key Features Implementation

### 1. Real-time Data Monitoring
- Edge functions fetch market data every minute
- Real-time price discrepancy detection
- Automated arbitrage opportunity identification

### 2. Profit Calculation Engine
- Optimal bet amount calculations
- Risk-adjusted profit projections
- Platform-specific fee considerations

### 3. Alert System
- Telegram bot integration
- Customizable alert preferences
- Confidence-level based notifications

### 4. Analytics Dashboard
- Historical performance tracking
- Category-based opportunity analysis
- Confidence level distribution

## 🎯 Target Users

- **Sports Bettors**: Finding arbitrage opportunities in sports betting
- **Crypto Traders**: Exploring DeFi and cryptocurrency markets
- **Political Analysts**: Political prediction market opportunities
- **Quantitative Analysts**: Data-driven arbitrage strategies

## 🔮 Roadmap

### v1.1 (Q1 2025)
- [ ] Mobile app development
- [ ] Advanced charting tools
- [ ] Portfolio tracking features

### v1.2 (Q2 2025)
- [ ] Additional prediction markets integration
- [ ] Machine learning arbitrage predictions
- [ ] Social trading features

### v2.0 (Q3 2025)
- [ ] API for third-party integrations
- [ ] Advanced risk management tools
- [ ] White-label solutions

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For technical support or business inquiries, please contact the development team.

---

**Built with ❤️ by MiniMax Agent**

*Last updated: November 2025*