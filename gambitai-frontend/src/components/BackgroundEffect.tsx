import React from 'react';

const BackgroundEffect = () => {
  return (
    // 1. Base Background: Darker than teal-950 (#000D1D) -> Almost Pure Black (#000205)
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#000205]">
      
      {/* 2. Technical Grid: Sharper, more "Fintech" feel */}
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15] bg-center"
        style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 90%)' }} 
      />

      {/* 3. The "Liquidity Nebula" - Using Color Dodge for "Electric" Overlaps */}
      <div className="absolute inset-0 opacity-60">
        
        {/* Primary Trend: Diagonal Flow from Top-Left to Bottom-Right */}
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-teal-900/40 rounded-full mix-blend-color-dodge blur-[120px] animate-blob" />
        
        <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-teal-600/30 rounded-full mix-blend-color-dodge blur-[100px] animate-blob animation-delay-2000" />
        
        {/* intense Core: The "Hot" zone */}
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-cyan-500/20 rounded-full mix-blend-color-dodge blur-[80px] animate-blob animation-delay-4000" />

        {/* Deep Contrast: Indigo/Blue shadows to create depth against the Teal */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-indigo-900/40 rounded-full mix-blend-color-dodge blur-[130px] animate-blob animation-delay-2000" />
        
        <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-blue-800/30 rounded-full mix-blend-color-dodge blur-[90px] animate-blob" />
      </div>

      {/* 4. Aesthetic "Stardust" / Data Points */}
      {/* These small glows add the "Crowded" texture without overwhelming the eye */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-700" />

      {/* 5. Film Grain / Noise - Essential for the "Aesthetic" look */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
      
      {/* 6. Vignette - Focuses attention to the center */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000205] via-transparent to-[#000205]/50" />
    </div>
  );
};

export default BackgroundEffect;