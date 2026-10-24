import React from 'react';

interface HeroThriftShowcaseProps {
  className?: string;
}

export const HeroThriftShowcase: React.FC<HeroThriftShowcaseProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full bg-[#2E1F16] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Visual illustration of curated thrift rack */}
      <svg
        viewBox="0 0 800 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <rect width="800" height="550" fill="#2E1F16" />
        
        {/* Soft background light circles */}
        <circle cx="200" cy="180" r="240" fill="#C1D7C2" fillOpacity="0.12" />
        <circle cx="620" cy="340" r="280" fill="#EFAE6E" fillOpacity="0.15" />
        <circle cx="400" cy="480" r="200" fill="#F7E09A" fillOpacity="0.1" />

        {/* Clothing Rack Bar */}
        <path d="M100 140 H700" stroke="#FBEFD9" strokeWidth="8" strokeLinecap="round" />
        <path d="M120 140 V500" stroke="#FBEFD9" strokeWidth="8" strokeLinecap="round" />
        <path d="M680 140 V500" stroke="#FBEFD9" strokeWidth="8" strokeLinecap="round" />
        <path d="M80 500 H160" stroke="#FBEFD9" strokeWidth="8" strokeLinecap="round" />
        <path d="M640 500 H720" stroke="#FBEFD9" strokeWidth="8" strokeLinecap="round" />

        {/* Garment 1: Vintage 90s Denim Jacket */}
        <g transform="translate(160, 145)">
          {/* Hanger */}
          <path d="M60 -5 A12 12 0 0 0 48 -17 A12 12 0 0 0 60 -29" stroke="#EFAE6E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 -5 L10 25 H110 Z" stroke="#EFAE6E" strokeWidth="4" fill="none" />
          {/* Jacket Body */}
          <path d="M15 25 L5 120 L28 125 L35 70 L35 260 H85 L85 70 L92 125 L115 120 L105 25 Z" fill="#3D5A80" />
          {/* Collar & Buttons */}
          <path d="M35 25 L60 55 L85 25" stroke="#EFAE6E" strokeWidth="3" fill="none" />
          <circle cx="60" cy="90" r="3" fill="#EFAE6E" />
          <circle cx="60" cy="140" r="3" fill="#EFAE6E" />
          <circle cx="60" cy="190" r="3" fill="#EFAE6E" />
          {/* Tag */}
          <rect x="90" y="80" width="18" height="26" rx="3" fill="#F7E09A" />
          <text x="94" y="98" fill="#2E1F16" fontSize="12" fontWeight="bold">$8</text>
        </g>

        {/* Garment 2: Warm Knit Tangerine Sweater */}
        <g transform="translate(290, 145)">
          <path d="M60 -5 A12 12 0 0 0 48 -17 A12 12 0 0 0 60 -29" stroke="#EFAE6E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 -5 L12 25 H108 Z" stroke="#EFAE6E" strokeWidth="4" fill="none" />
          <path d="M18 25 L0 140 L26 146 L38 80 L38 280 H82 L82 80 L94 146 L120 140 L102 25 Z" fill="#EFAE6E" />
          {/* Ribbed detail */}
          <line x1="38" y1="270" x2="82" y2="270" stroke="#2E1F16" strokeWidth="2" strokeOpacity="0.3" />
          <rect x="85" y="90" width="18" height="26" rx="3" fill="#C1D7C2" />
          <text x="89" y="108" fill="#2E1F16" fontSize="12" fontWeight="bold">$5</text>
        </g>

        {/* Garment 3: Mint Sustainable Chore Coat */}
        <g transform="translate(420, 145)">
          <path d="M60 -5 A12 12 0 0 0 48 -17 A12 12 0 0 0 60 -29" stroke="#EFAE6E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 -5 L12 25 H108 Z" stroke="#EFAE6E" strokeWidth="4" fill="none" />
          <path d="M15 25 L2 135 L26 140 L36 75 L36 290 H84 L84 75 L94 140 L118 135 L105 25 Z" fill="#C1D7C2" />
          <rect x="42" y="150" width="16" height="20" rx="2" fill="#2E1F16" fillOpacity="0.15" />
          <rect x="62" y="150" width="16" height="20" rx="2" fill="#2E1F16" fillOpacity="0.15" />
          <rect x="88" y="70" width="18" height="26" rx="3" fill="#FBEFD9" />
          <text x="92" y="88" fill="#2E1F16" fontSize="12" fontWeight="bold">$6</text>
        </g>

        {/* Garment 4: Homecoming Formal Blazer */}
        <g transform="translate(550, 145)">
          <path d="M60 -5 A12 12 0 0 0 48 -17 A12 12 0 0 0 60 -29" stroke="#EFAE6E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 -5 L10 25 H110 Z" stroke="#EFAE6E" strokeWidth="4" fill="none" />
          <path d="M15 25 L4 135 L28 140 L36 70 L36 300 H84 L84 70 L92 140 L116 135 L105 25 Z" fill="#2A3439" />
          {/* Lapels */}
          <path d="M36 25 L60 110 L44 140 L36 70" fill="#1C2427" />
          <path d="M84 25 L60 110 L76 140 L84 70" fill="#1C2427" />
          <rect x="88" y="85" width="22" height="26" rx="3" fill="#EFAE6E" />
          <text x="91" y="103" fill="#2E1F16" fontSize="11" fontWeight="bold">$15</text>
        </g>

        {/* Floating Sparks */}
        <circle cx="280" cy="80" r="4" fill="#F7E09A" />
        <circle cx="530" cy="90" r="3" fill="#EFAE6E" />
        <circle cx="680" cy="180" r="5" fill="#C1D7C2" />
      </svg>
    </div>
  );
};
