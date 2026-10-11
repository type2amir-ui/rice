import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'image' | 'icon' | 'badge';
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} shrink-0 transition-transform duration-200 hover:scale-105 drop-shadow-sm`}
        role="img"
        aria-label="Hashir Rice Supplier International Brand Mark"
      >
        <defs>
          {/* Deep corporate emerald tech gradient */}
          <linearGradient id="intlBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="45%" stopColor="#04392B" />
            <stop offset="100%" stopColor="#022119" />
          </linearGradient>

          {/* Precision inner glass border */}
          <linearGradient id="intlBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
          </linearGradient>

          {/* Dynamic Golden Harvest Rice Gradient */}
          <linearGradient id="intlGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FFFBEB" />
          </linearGradient>

          {/* Subtle drop shadow for depth */}
          <filter id="intlShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Squircle App-Icon Container */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill="url(#intlBgGrad)"
          stroke="url(#intlBorderGrad)"
          strokeWidth="1.5"
        />

        {/* Subtle geometric grid backdrop accent */}
        <path
          d="M20 20 L80 80 M80 20 L20 80"
          stroke="#10B981"
          strokeWidth="0.5"
          strokeOpacity="0.06"
        />

        {/* The International 'H' Mark */}
        {/* Left Column (Solid architectural white pillar) */}
        <rect
          x="27"
          y="25"
          width="11"
          height="50"
          rx="5.5"
          fill="#FFFFFF"
          filter="url(#intlShadow)"
        />

        {/* Right Column (Solid architectural white pillar) */}
        <rect
          x="62"
          y="25"
          width="11"
          height="50"
          rx="5.5"
          fill="#FFFFFF"
          filter="url(#intlShadow)"
        />

        {/* The Iconic Dynamic Golden Basmati Rice Grain Arc (Global Trade Smile / Bridge) */}
        {/* Sweeps across the H pillars with confident upward momentum */}
        <path
          d="M23 55 C29 60 41 62 52 58 C63 54 73 45 81 37 C77 48 64 61 50 63 C39 64 29 61 23 55 Z"
          fill="url(#intlGoldGrad)"
          filter="url(#intlShadow)"
        />

        {/* Inner Grain Highlight Spine */}
        <path
          d="M28 56 C38 60 55 58 76 40"
          stroke="#FFFBEB"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* International Grade-A Quality Spark (Upper-Right Accent) */}
        <path
          d="M81 29 L82.5 32.5 L86 34 L82.5 35.5 L81 39 L79.5 35.5 L76 34 L79.5 32.5 Z"
          fill="#FDE68A"
          opacity="0.95"
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="font-sans font-black text-base sm:text-lg tracking-tight text-neutral-900 leading-none">
              HASHIR
            </span>
            <span className="font-sans font-black text-base sm:text-lg tracking-tight text-amber-600 leading-none">
              RICE
            </span>
          </div>
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-emerald-800 mt-1">
            Wholesale Supplier
          </span>
        </div>
      )}
    </div>
  );
};


