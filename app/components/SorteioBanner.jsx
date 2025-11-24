import React from "react";

export default function SorteioBanner() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center mb-8" style={{ marginTop: '64px' }}>
      {/* Banner background com gradiente verde/amarelo */}
      <div className="w-full h-28 md:h-36 bg-transparent relative flex items-end select-none">
        <svg viewBox="0 0 1920 120" width="100%" height="100%" preserveAspectRatio="none" className="absolute left-0 top-0 w-full h-full">
          <defs>
            <linearGradient id="bannerGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6a0dad" />
              <stop offset="60%" stopColor="#5865F2" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <polygon points="0,60 1920,0 1920,120 0,120" fill="url(#bannerGradient)" />
        </svg>
        {/* Title and breadcrumb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex flex-col items-center mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg flex items-center gap-3 neon-text">
            SORTEIOS
          </h1>
          <div className="flex items-center gap-2 mt-2 font-bold text-sm uppercase tracking-wider text-discord-neon">
            <span className="text-discord-neon">LAR</span>
            <span className="text-discord-neon">●</span>
            <span className="text-white">SORTEIOS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
