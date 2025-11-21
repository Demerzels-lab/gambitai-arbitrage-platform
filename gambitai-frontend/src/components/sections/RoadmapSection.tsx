import React from 'react';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';

const roadmapData = [
  {
    phase: "Phase 1",
    title: "Foundation & Data Streams",
    date: "Q4 2024",
    status: "completed",
    description: "Establishment of real-time websocket connections with major exchanges (Kalshi, Polymarket) and initial arbitrage engine architecture.",
    items: [
      "Multi-source Data Aggregation",
      "Latency Optimization (<50ms)",
      "Historical Data Backtesting Environment"
    ]
  },
  {
    phase: "Phase 2",
    title: "Alpha Detection Engine",
    date: "Q1 2025",
    status: "active",
    description: "Deployment of the core arbitrage detection logic. Focusing on discrepancies between sports betting odds and prediction market spreads.",
    items: [
      "Cross-Market Spread Analysis",
      "Automated Opportunity Alerting",
      "User Dashboard Beta Release"
    ]
  },
  {
    phase: "Phase 3",
    title: "Execution & Integration",
    date: "Q2 2025",
    status: "upcoming",
    description: "Integration of direct execution capabilities, allowing one-click arbitrage trades via API keys on supported platforms.",
    items: [
      "Direct Trade Execution via API",
      "Risk Management Protocols",
      "Mobile App Beta Launch"
    ]
  },
  {
    phase: "Phase 4",
    title: "Decentralized Liquidity",
    date: "Q3 2025",
    status: "upcoming",
    description: "Expansion into decentralized prediction markets and implementation of smart contract-based atomic settlement layers.",
    items: [
      "On-chain Settlement Layer",
      "DAO Governance Token Launch",
      "Institutional API Access"
    ]
  }
];

const RoadmapSection = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="roadmap">
      {/* Ambient Glow behind the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 mb-4 tracking-tight">
            Execution Roadmap
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our strategic timeline for deploying the world's most advanced arbitrage infrastructure.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* The Glowing Vertical Line */}
          {/* Hidden on mobile, visible on md+ */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px md:w-1 h-full">
            <div className="w-full h-full bg-gradient-to-b from-teal-500/0 via-teal-500 to-teal-500/0 opacity-50 md:opacity-100 shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
          </div>

          {/* Roadmap Items */}
          <div className="space-y-12 md:space-y-0">
            {roadmapData.map((item, index) => {
              const isEven = index % 2 === 0;
              const isCompleted = item.status === 'completed';
              const isActive = item.status === 'active';

              return (
                <div key={index} className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center justify-between group`}>
                  
                  {/* Center Node (The "Dot") */}
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500
                      ${isActive 
                        ? 'bg-teal-950 border-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.8)] scale-110' 
                        : isCompleted
                          ? 'bg-teal-900 border-teal-600'
                          : 'bg-[#000205] border-gray-800'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-teal-400" />
                      ) : isActive ? (
                        <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-teal-200 animate-pulse" />
                      ) : (
                        <Circle className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Content Spacer for Desktop Layout */}
                  <div className="hidden md:block w-5/12" />

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                    <div className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1
                      ${isActive 
                        ? 'bg-teal-950/30 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.15)]' 
                        : 'bg-white/5 border-white/10 hover:border-teal-500/30 hover:bg-white/10'
                      }`}
                    >
                      {/* Decorative Glow inside active card */}
                      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent rounded-2xl" />}

                      <div className="relative z-10">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4
                          ${isActive 
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}
                        >
                          {item.date} • {item.status.toUpperCase()}
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                          <span className="text-teal-500 text-lg block mb-1">{item.phase}</span>
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        <ul className={`space-y-2 ${isEven ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                          {item.items.map((subItem, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-400' : 'bg-gray-600'}`} />
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;