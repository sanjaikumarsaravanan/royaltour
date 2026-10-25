import React from 'react';

interface RoyalToursLogoProps {
  variant?: 'badge' | 'compact' | 'light' | 'pdf';
  className?: string;
}

export const RoyalToursLogo: React.FC<RoyalToursLogoProps> = ({
  variant = 'badge',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Compact black emblem with gold yellow typography */}
        <div className="relative bg-black text-[#FACC15] px-3 py-1.5 rounded-lg border border-yellow-500/30 shadow-xs flex items-center gap-2">
          <svg className="w-5 h-5 text-[#FACC15]" viewBox="0 0 24 24" fill="currentColor">
            {/* Luggage with handle */}
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1v1a1 1 0 0 1-2 0v-1H9v1a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2-2v2h4V4h-4z" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wider leading-none text-[#FACC15] font-sans">
              ROYAL TOURS
            </span>
            <span className="text-[7.5px] uppercase tracking-widest text-slate-300 font-semibold font-mono mt-0.5">
              TRAVEL IN LUXURY
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full official logo matching WhatsApp Image 2026-10-14 at 6.25.41 PM.jpeg
  return (
    <div
      className={`relative bg-black rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg border border-yellow-500/20 select-none ${className}`}
    >
      {/* SVG rendering of the exact uploaded logo */}
      <svg
        viewBox="0 0 600 210"
        className="w-full max-w-[420px] h-auto drop-shadow-[0_2px_12px_rgba(250,204,21,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle architectural silhouette pattern overlay in yellow */}
          <linearGradient id="yellowGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* Pattern of architectural city lines & silhouettes */}
          <pattern id="silhouettes" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M5 40V20L10 15L15 20V40M20 40V10L25 5L30 10V40" stroke="#CA8A04" strokeWidth="1" opacity="0.4" />
            <circle cx="20" cy="25" r="4" stroke="#CA8A04" strokeWidth="0.8" opacity="0.3" fill="none" />
          </pattern>
        </defs>

        {/* Luggage handle on the letter 'O' in TOURS */}
        <g stroke="#FACC15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M394 62 V38 Q394 32 400 32 H414 Q420 32 420 38 V62" />
        </g>

        {/* Main "ROYAL TOURS" text block */}
        <text
          x="300"
          y="118"
          textAnchor="middle"
          fill="#FACC15"
          fontSize="72"
          fontWeight="900"
          letterSpacing="4"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ROYAL TOURS
        </text>

        {/* Secondary silhouette texture layer */}
        <text
          x="300"
          y="118"
          textAnchor="middle"
          fill="url(#silhouettes)"
          fontSize="72"
          fontWeight="900"
          letterSpacing="4"
          fontFamily="system-ui, -apple-system, sans-serif"
          opacity="0.75"
        >
          ROYAL TOURS
        </text>

        {/* Tagline: "TRAVEL IN LUXURY, EXPLORE IN STYLE" matching uploaded font aesthetic */}
        <text
          x="300"
          y="166"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="17.5"
          fontWeight="700"
          letterSpacing="5"
          fontFamily="'Cinzel', 'Cormorant Garamond', Georgia, serif"
        >
          TRAVEL IN LUXURY, EXPLORE IN STYLE
        </text>
      </svg>
    </div>
  );
};

export const RoyalToursEmailCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-3.5 ${className}`}
    >
      {/* Green circular avatar with capital white 'R' matching 2nd photo */}
      <div className="w-12 h-12 rounded-full bg-[#00796B] flex items-center justify-center text-white font-sans font-medium text-2xl shadow-xs shrink-0 select-none">
        R
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div className="text-base font-bold text-slate-900 leading-tight">
          Royal Tours
        </div>
        <a
          href="mailto:royaltoursofficial@gmail.com"
          className="text-xs sm:text-sm text-slate-600 hover:text-slate-950 font-normal truncate mt-0.5"
        >
          royaltoursofficial@gmail.com
        </a>
      </div>
    </div>
  );
};
