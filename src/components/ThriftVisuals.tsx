import React from 'react';

// 1. HERO THRIFT SHOWCASE (4:3 / 16:11 Aspect Ratio)
export const HeroThriftShowcase: React.FC<{ className?: string }> = ({ className = 'w-full h-full object-cover' }) => (
  <svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBEFD9" />
        <stop offset="60%" stopColor="#F7E09A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FBEFD9" />
      </linearGradient>
      <linearGradient id="woodFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EFAE6E" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#2E1F16" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="denimGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B5A70" />
        <stop offset="50%" stopColor="#2E4354" />
        <stop offset="100%" stopColor="#1E2E3A" />
      </linearGradient>
      <linearGradient id="sweaterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F7E09A" />
        <stop offset="100%" stopColor="#EFAE6E" />
      </linearGradient>
      <linearGradient id="blazerGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C1D7C2" />
        <stop offset="100%" stopColor="#8BAF8C" />
      </linearGradient>
      <linearGradient id="tangerineGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EFAE6E" />
        <stop offset="100%" stopColor="#D98A44" />
      </linearGradient>
    </defs>

    {/* Warm boutique wall background */}
    <rect width="600" height="450" fill="url(#heroBg)" />

    {/* Sunlit arch window on left */}
    <path d="M40 70 A 50 50 0 0 1 140 70 L 140 280 L 40 280 Z" fill="#FFFFFF" opacity="0.6" />
    <line x1="90" y1="20" x2="90" y2="280" stroke="#F7E09A" strokeWidth="3" />
    <line x1="40" y1="120" x2="140" y2="120" stroke="#F7E09A" strokeWidth="2.5" />
    <line x1="40" y1="190" x2="140" y2="190" stroke="#F7E09A" strokeWidth="2.5" />

    {/* Warm sunlight ray */}
    <polygon points="90,20 280,360 160,360 40,120" fill="#F7E09A" opacity="0.3" />

    {/* Hardwood flooring */}
    <rect x="0" y="340" width="600" height="110" fill="url(#woodFloor)" />
    {[40, 100, 160, 220, 280, 340, 400, 460, 520, 580].map((x) => (
      <line key={x} x1={x} y1="340" x2={x - 20} y2="450" stroke="#2E1F16" strokeWidth="1.5" opacity="0.4" />
    ))}
    <line x1="0" y1="340" x2="600" y2="340" stroke="#2E1F16" strokeWidth="3" />

    {/* Potted plant on left */}
    <ellipse cx="70" cy="360" rx="28" ry="12" fill="#2E1F16" opacity="0.4" />
    <path d="M52 320 L58 360 L82 360 L88 320 Z" fill="url(#tangerineGrad)" stroke="#2E1F16" strokeWidth="2" />
    <path d="M70 320 Q 50 260 20 250 Q 50 270 70 320" fill="#C1D7C2" />
    <path d="M70 320 Q 80 240 100 220 Q 85 260 70 320" fill="#A8C8A9" />
    <path d="M70 320 Q 95 280 120 290 Q 90 300 70 320" fill="#C1D7C2" />

    {/* Main Wooden Clothing Rack */}
    <line x1="160" y1="90" x2="520" y2="90" stroke="#2E1F16" strokeWidth="8" strokeLinecap="round" />
    <line x1="180" y1="90" x2="160" y2="360" stroke="#2E1F16" strokeWidth="6" strokeLinecap="round" />
    <line x1="500" y1="90" x2="520" y2="360" stroke="#2E1F16" strokeWidth="6" strokeLinecap="round" />
    <line x1="145" y1="360" x2="185" y2="360" stroke="#2E1F16" strokeWidth="6" strokeLinecap="round" />
    <line x1="495" y1="360" x2="535" y2="360" stroke="#2E1F16" strokeWidth="6" strokeLinecap="round" />

    {/* Garment 1: Mint Eco Wool Blazer */}
    <g transform="translate(190, 88)">
      {/* Wooden Hanger */}
      <path d="M30 4 L10 18 L50 18 Z" fill="none" stroke="#EFAE6E" strokeWidth="2.5" />
      <circle cx="30" cy="2" r="3" fill="none" stroke="#EFAE6E" strokeWidth="2" />
      {/* Jacket body */}
      <path d="M10 18 C2 40 0 160 2 200 L58 200 C60 160 58 40 50 18 Z" fill="url(#blazerGrad)" />
      {/* Lapels & Collar */}
      <path d="M22 18 L30 75 L38 18" stroke="#FBEFD9" strokeWidth="2" fill="none" />
      <polygon points="12,24 28,68 18,72" fill="#8BAF8C" />
      <polygon points="48,24 32,68 42,72" fill="#8BAF8C" />
      {/* Brass buttons */}
      <circle cx="30" cy="90" r="2.5" fill="#F7E09A" />
      <circle cx="30" cy="115" r="2.5" fill="#F7E09A" />
      <circle cx="30" cy="140" r="2.5" fill="#F7E09A" />
      {/* Thrift Tag */}
      <g transform="translate(48, 110)">
        <polygon points="0,0 16,-4 26,6 10,10" fill="#FBEFD9" stroke="#2E1F16" strokeWidth="1" />
        <text x="5" y="6" fontSize="6" fontWeight="bold" fill="#2E1F16">$25</text>
      </g>
    </g>

    {/* Garment 2: Buttercup Cable-Knit Sweater */}
    <g transform="translate(255, 88)">
      <path d="M30 4 L8 18 L52 18 Z" fill="none" stroke="#EFAE6E" strokeWidth="2.5" />
      <path d="M8 18 C0 35 2 150 4 185 L56 185 C58 150 60 35 52 18 Z" fill="url(#sweaterGrad)" />
      {/* Knit ribbing */}
      <path d="M20 22 Q 22 100 20 180" stroke="#EFAE6E" strokeWidth="2" fill="none" />
      <path d="M30 22 Q 30 100 30 180" stroke="#EFAE6E" strokeWidth="2.5" fill="none" />
      <path d="M40 22 Q 38 100 40 180" stroke="#EFAE6E" strokeWidth="2" fill="none" />
    </g>

    {/* Garment 3: Vintage 90s Stonewashed Denim Jacket */}
    <g transform="translate(325, 88)">
      <path d="M35 4 L10 18 L60 18 Z" fill="none" stroke="#EFAE6E" strokeWidth="2.5" />
      <path d="M10 18 C0 35 0 160 5 195 L65 195 C70 160 70 35 60 18 Z" fill="url(#denimGrad)" />
      {/* Front flap pockets & stitching */}
      <rect x="18" y="55" width="14" height="15" rx="2" fill="#2E4354" stroke="#F7E09A" strokeWidth="1" />
      <rect x="38" y="55" width="14" height="15" rx="2" fill="#2E4354" stroke="#F7E09A" strokeWidth="1" />
      <circle cx="25" cy="62" r="1.5" fill="#F7E09A" />
      <circle cx="45" cy="62" r="1.5" fill="#F7E09A" />
      <line x1="35" y1="20" x2="35" y2="195" stroke="#F7E09A" strokeWidth="1.5" />
      {/* Gold stitching accents */}
      <circle cx="35" cy="85" r="2" fill="#F7E09A" />
      <circle cx="35" cy="115" r="2" fill="#F7E09A" />
      <circle cx="35" cy="145" r="2" fill="#F7E09A" />
      {/* 50% Off Tag */}
      <g transform="translate(58, 90)">
        <polygon points="0,0 20,-2 28,12 8,14" fill="#EFAE6E" />
        <text x="3" y="9" fontSize="6" fontWeight="bold" fill="#2E1F16">50%</text>
      </g>
    </g>

    {/* Garment 4: Retro Tangerine Utility Overcoat */}
    <g transform="translate(405, 88)">
      <path d="M30 4 L8 18 L52 18 Z" fill="none" stroke="#EFAE6E" strokeWidth="2.5" />
      <path d="M8 18 C-2 40 -2 180 2 220 L58 220 C62 180 62 40 52 18 Z" fill="url(#tangerineGrad)" />
      <path d="M22 18 L30 90 L38 18" stroke="#FBEFD9" strokeWidth="1.8" fill="none" />
      <circle cx="30" cy="110" r="3" fill="#2E1F16" />
      <circle cx="30" cy="145" r="3" fill="#2E1F16" />
    </g>

    {/* Garment 5: Cream Vintage Slip / Dress */}
    <g transform="translate(470, 88)">
      <path d="M25 4 L6 18 L44 18 Z" fill="none" stroke="#EFAE6E" strokeWidth="2" />
      <path d="M6 18 C0 40 2 170 6 210 L44 210 C48 170 50 40 44 18 Z" fill="#FBEFD9" stroke="#EFAE6E" strokeWidth="1" />
      <circle cx="25" cy="60" r="1.5" fill="#EFAE6E" />
    </g>

    {/* Vintage Wicker Storage Basket with Rolled Scarves on right floor */}
    <g transform="translate(460, 335)">
      <ellipse cx="50" cy="50" rx="45" ry="24" fill="#2E1F16" opacity="0.3" />
      <path d="M12 25 L20 65 L80 65 L88 25 Z" fill="#EFAE6E" stroke="#2E1F16" strokeWidth="2" />
      {/* Woven pattern */}
      <line x1="28" y1="25" x2="34" y2="65" stroke="#2E1F16" strokeWidth="1.5" opacity="0.6" />
      <line x1="50" y1="25" x2="50" y2="65" stroke="#2E1F16" strokeWidth="1.5" opacity="0.6" />
      <line x1="72" y1="25" x2="66" y2="65" stroke="#2E1F16" strokeWidth="1.5" opacity="0.6" />
      {/* Rolled garments */}
      <ellipse cx="35" cy="24" rx="14" ry="8" fill="#C1D7C2" />
      <ellipse cx="65" cy="22" rx="16" ry="9" fill="#F7E09A" />
      <ellipse cx="50" cy="28" rx="15" ry="8" fill="#EFAE6E" />
    </g>

    {/* Canvas Shopper Tote Bag leaning on floor */}
    <g transform="translate(230, 335)">
      <ellipse cx="40" cy="45" rx="35" ry="12" fill="#2E1F16" opacity="0.3" />
      <rect x="15" y="10" width="50" height="42" rx="4" fill="#FBEFD9" stroke="#2E1F16" strokeWidth="2" />
      {/* Handles */}
      <path d="M28 10 C28 -8 52 -8 52 10" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
      {/* Graphic on tote */}
      <path d="M40 22 L45 32 L35 32 Z" fill="#C1D7C2" />
      <text x="23" y="42" fontSize="6" fontWeight="bold" fill="#2E1F16" letterSpacing="0.5">THRIFTIT</text>
    </g>

    {/* Floating badges & sparkles */}
    <g transform="translate(180, 45)">
      <rect x="0" y="0" width="130" height="24" rx="12" fill="#EFAE6E" />
      <text x="12" y="16" fontSize="10" fontWeight="bold" fill="#2E1F16">✨ CURATED DUVAL RACKS</text>
    </g>
  </svg>
);

// 2. STORE CARD VISUALS (5 Category Variants)
export const StoreCardVisual: React.FC<{ variant?: number; name?: string; className?: string }> = ({
  variant = 0,
  name = 'Thrift Store',
  className = 'w-full h-full object-cover',
}) => {
  const v = variant % 5;

  if (v === 0) {
    // Vintage Denim & Streetwear
    return (
      <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#FBEFD9" />
        <circle cx="150" cy="150" r="110" fill="#F7E09A" opacity="0.5" />
        {/* Denim Jacket Illustration */}
        <g transform="translate(60, 45)">
          {/* Hanger */}
          <path d="M90 10 L40 35 L140 35 Z" fill="none" stroke="#2E1F16" strokeWidth="3" />
          <circle cx="90" cy="6" r="4" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
          {/* Jacket */}
          <path d="M35 35 C15 60 10 180 20 200 L160 200 C170 180 165 60 145 35 Z" fill="#3B5A70" />
          {/* Collar */}
          <polygon points="50,35 90,75 70,80" fill="#2A4254" />
          <polygon points="130,35 90,75 110,80" fill="#2A4254" />
          {/* Flap Pockets */}
          <rect x="45" y="75" width="30" height="30" rx="3" fill="#324D60" stroke="#F7E09A" strokeWidth="1.5" />
          <rect x="105" y="75" width="30" height="30" rx="3" fill="#324D60" stroke="#F7E09A" strokeWidth="1.5" />
          <circle cx="60" cy="88" r="3" fill="#F7E09A" />
          <circle cx="120" cy="88" r="3" fill="#F7E09A" />
          <line x1="90" y1="35" x2="90" y2="200" stroke="#F7E09A" strokeWidth="2" strokeDasharray="4,2" />
          <circle cx="90" cy="120" r="3.5" fill="#F7E09A" />
          <circle cx="90" cy="155" r="3.5" fill="#F7E09A" />
        </g>
        <rect x="20" y="240" width="105" height="24" rx="12" fill="#C1D7C2" />
        <text x="30" y="256" fontSize="10" fontWeight="bold" fill="#2E1F16">90s Denim $12</text>
      </svg>
    );
  }

  if (v === 1) {
    // Homecoming & Prom Suits / Blazers
    return (
      <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#FBEFD9" />
        <circle cx="150" cy="150" r="110" fill="#C1D7C2" opacity="0.6" />
        {/* Navy Wool Suit Jacket */}
        <g transform="translate(60, 40)">
          <path d="M90 10 L35 35 L145 35 Z" fill="none" stroke="#2E1F16" strokeWidth="3" />
          <circle cx="90" cy="6" r="4" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
          {/* Blazer */}
          <path d="M35 35 C20 60 15 190 25 210 L155 210 C165 190 160 60 145 35 Z" fill="#1E2E3D" />
          {/* White shirt inner */}
          <polygon points="75,35 90,110 105,35" fill="#FBEFD9" />
          {/* Bowtie / Tie */}
          <polygon points="85,50 95,50 92,95 88,95" fill="#EFAE6E" />
          {/* Lapels */}
          <polygon points="45,35 90,120 70,125" fill="#141E28" />
          <polygon points="135,35 90,120 110,125" fill="#141E28" />
          {/* Pocket square */}
          <polygon points="50,90 65,85 62,95" fill="#F7E09A" />
        </g>
        <rect x="20" y="240" width="125" height="24" rx="12" fill="#EFAE6E" />
        <text x="30" y="256" fontSize="10" fontWeight="bold" fill="#2E1F16">Event Suits $25</text>
      </svg>
    );
  }

  if (v === 2) {
    // Cozy Retro Knitwear & Cardigans
    return (
      <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#FBEFD9" />
        <circle cx="150" cy="150" r="110" fill="#F7E09A" opacity="0.6" />
        {/* Cable-knit sweater */}
        <g transform="translate(60, 45)">
          <path d="M90 10 L40 32 L140 32 Z" fill="none" stroke="#2E1F16" strokeWidth="3" />
          <circle cx="90" cy="6" r="4" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
          <path d="M40 32 C15 55 18 175 25 200 L155 200 C162 175 165 55 140 32 Z" fill="#F7E09A" />
          {/* Cable patterns */}
          <path d="M60 40 Q 65 120 60 195" stroke="#EFAE6E" strokeWidth="3" fill="none" />
          <path d="M90 40 Q 90 120 90 195" stroke="#EFAE6E" strokeWidth="3.5" fill="none" />
          <path d="M120 40 Q 115 120 120 195" stroke="#EFAE6E" strokeWidth="3" fill="none" />
          {/* Buttons */}
          <circle cx="90" cy="70" r="4" fill="#2E1F16" />
          <circle cx="90" cy="105" r="4" fill="#2E1F16" />
          <circle cx="90" cy="140" r="4" fill="#2E1F16" />
        </g>
        <rect x="20" y="240" width="115" height="24" rx="12" fill="#C1D7C2" />
        <text x="30" y="256" fontSize="10" fontWeight="bold" fill="#2E1F16">Wool Knits $8</text>
      </svg>
    );
  }

  if (v === 3) {
    // Utility Jackets & Trench Coats
    return (
      <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#FBEFD9" />
        <circle cx="150" cy="150" r="110" fill="#EFAE6E" opacity="0.4" />
        {/* Tan Cargo / Utility Jacket */}
        <g transform="translate(60, 40)">
          <path d="M90 10 L35 32 L145 32 Z" fill="none" stroke="#2E1F16" strokeWidth="3" />
          <circle cx="90" cy="6" r="4" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
          <path d="M35 32 C15 55 12 185 20 215 L160 215 C168 185 165 55 145 32 Z" fill="#EFAE6E" />
          <polygon points="50,32 90,80 70,85" fill="#D98A44" />
          <polygon points="130,32 90,80 110,85" fill="#D98A44" />
          {/* 4 Utility cargo pockets */}
          <rect x="42" y="85" width="28" height="28" rx="2" fill="#D98A44" stroke="#2E1F16" strokeWidth="1.5" />
          <rect x="110" y="85" width="28" height="28" rx="2" fill="#D98A44" stroke="#2E1F16" strokeWidth="1.5" />
          <rect x="42" y="145" width="30" height="32" rx="2" fill="#D98A44" stroke="#2E1F16" strokeWidth="1.5" />
          <rect x="108" y="145" width="30" height="32" rx="2" fill="#D98A44" stroke="#2E1F16" strokeWidth="1.5" />
        </g>
        <rect x="20" y="240" width="120" height="24" rx="12" fill="#F7E09A" />
        <text x="30" y="256" fontSize="10" fontWeight="bold" fill="#2E1F16">Utility Coats $15</text>
      </svg>
    );
  }

  // Variant 4: Vintage Floral Dress / Eveningwear
  return (
    <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#FBEFD9" />
      <circle cx="150" cy="150" r="110" fill="#F7E09A" opacity="0.5" />
      {/* Floral Slip Dress */}
      <g transform="translate(75, 40)">
        <path d="M75 10 L45 35 L105 35 Z" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
        <circle cx="75" cy="6" r="3.5" fill="none" stroke="#2E1F16" strokeWidth="2" />
        <path d="M45 35 C40 60 25 180 20 220 L130 220 C125 180 110 60 105 35 Z" fill="#EFAE6E" />
        {/* Flower motifs */}
        <circle cx="65" cy="90" r="6" fill="#FBEFD9" />
        <circle cx="65" cy="90" r="2.5" fill="#C1D7C2" />
        <circle cx="95" cy="120" r="7" fill="#FBEFD9" />
        <circle cx="95" cy="120" r="3" fill="#C1D7C2" />
        <circle cx="55" cy="155" r="7" fill="#FBEFD9" />
        <circle cx="55" cy="155" r="3" fill="#C1D7C2" />
        <circle cx="85" cy="180" r="8" fill="#FBEFD9" />
        <circle cx="85" cy="180" r="3.5" fill="#C1D7C2" />
      </g>
      <rect x="20" y="240" width="125" height="24" rx="12" fill="#C1D7C2" />
      <text x="30" y="256" fontSize="10" fontWeight="bold" fill="#2E1F16">Vintage Dress $14</text>
    </svg>
  );
};

// 3. SUSTAINABILITY SHOWCASE VISUAL
export const SustainabilityShowcaseVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-full object-cover' }) => (
  <svg viewBox="0 0 500 375" preserveAspectRatio="xMidYMid slice" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ecoBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C1D7C2" />
        <stop offset="100%" stopColor="#8BAF8C" />
      </linearGradient>
      <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#F7E09A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#EFAE6E" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <rect width="500" height="375" fill="url(#ecoBg)" />

    {/* St. Johns River ripples */}
    <path d="M0 240 Q 120 200 250 250 T 500 230 L 500 375 L 0 375 Z" fill="url(#riverGrad)" opacity="0.6" />
    <path d="M0 280 Q 140 250 280 290 T 500 270 L 500 375 L 0 375 Z" fill="url(#riverGrad)" opacity="0.8" />

    {/* Florida Palm / Sabal silhouettes */}
    <path d="M420 375 Q 430 200 450 120" stroke="#2E1F16" strokeWidth="8" fill="none" />
    <path d="M450 120 Q 380 90 340 110" stroke="#2E1F16" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M450 120 Q 480 70 510 80" stroke="#2E1F16" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M450 120 Q 430 60 410 40" stroke="#2E1F16" strokeWidth="5" fill="none" strokeLinecap="round" />

    {/* Centerpiece: Upcycled Denim & Cotton Shirt with Leaf Halo */}
    <circle cx="230" cy="150" r="100" fill="#F7E09A" opacity="0.6" />
    <g transform="translate(150, 60)">
      <path d="M80 15 L30 40 L130 40 Z" fill="none" stroke="#2E1F16" strokeWidth="3" />
      <circle cx="80" cy="10" r="4" fill="none" stroke="#2E1F16" strokeWidth="2.5" />
      <path d="M30 40 C15 65 15 155 25 175 L135 175 C145 155 145 65 130 40 Z" fill="#3B5A70" stroke="#F7E09A" strokeWidth="2" />
      {/* Mended sashiko stitching in gold */}
      <line x1="60" y1="70" x2="100" y2="70" stroke="#F7E09A" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="60" y1="80" x2="100" y2="80" stroke="#F7E09A" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="60" y1="90" x2="100" y2="90" stroke="#F7E09A" strokeWidth="2" strokeDasharray="3,3" />
      {/* Heart / Leaf on chest */}
      <circle cx="80" cy="125" r="14" fill="#EFAE6E" />
      <path d="M80 118 Q 86 124 80 132 Q 74 124 80 118" fill="#FBEFD9" />
    </g>

    {/* Water drop savings badge */}
    <g transform="translate(40, 60)">
      <rect x="0" y="0" width="120" height="32" rx="16" fill="#FBEFD9" />
      <circle cx="16" cy="16" r="9" fill="#EFAE6E" />
      <path d="M16 11 Q 20 16 16 21 Q 12 16 16 11" fill="#FBEFD9" />
      <text x="32" y="20" fontSize="10" fontWeight="bold" fill="#2E1F16">700 Gal Saved</text>
    </g>
  </svg>
);

// 4. IMPACT CARD VISUALS
// Card 1: Student Budget Savings
export const BudgetSavingsVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 130" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="130" fill="#C1D7C2" />
    {/* Floating thrift tags */}
    <g transform="translate(50, 25)">
      <polygon points="0,20 20,0 70,0 70,50 20,50" fill="#FBEFD9" stroke="#2E1F16" strokeWidth="2" />
      <circle cx="20" cy="25" r="4" fill="#2E1F16" />
      <text x="30" y="32" fontSize="16" fontWeight="bold" fill="#2E1F16">$5</text>
    </g>
    <g transform="translate(140, 15) rotate(10)">
      <polygon points="0,22 22,0 80,0 80,55 22,55" fill="#F7E09A" stroke="#2E1F16" strokeWidth="2" />
      <circle cx="22" cy="27" r="4" fill="#2E1F16" />
      <text x="32" y="35" fontSize="18" fontWeight="bold" fill="#2E1F16">70% OFF</text>
    </g>
    <g transform="translate(235, 30) rotate(-8)">
      <polygon points="0,18 18,0 65,0 65,45 18,45" fill="#EFAE6E" stroke="#2E1F16" strokeWidth="2" />
      <circle cx="18" cy="22" r="4" fill="#2E1F16" />
      <text x="26" y="28" fontSize="14" fontWeight="bold" fill="#2E1F16">$15</text>
    </g>
  </svg>
);

// Card 2: Water Conservation
export const WaterConservationVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 130" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="130" fill="#F7E09A" />
    {/* Water ripples and cotton bloom */}
    <circle cx="160" cy="65" r="50" fill="none" stroke="#2E1F16" strokeWidth="1.5" opacity="0.3" />
    <circle cx="160" cy="65" r="35" fill="none" stroke="#2E1F16" strokeWidth="2" opacity="0.5" />
    <circle cx="160" cy="65" r="20" fill="#C1D7C2" />
    {/* Clean water drop */}
    <path d="M160 48 C168 58 174 66 174 72 C174 80 168 86 160 86 C152 86 146 80 146 72 C146 66 152 58 160 48 Z" fill="#2E1F16" />
    {/* Fresh green leaves */}
    <path d="M100 75 Q 80 60 70 70 Q 85 85 100 75" fill="#C1D7C2" />
    <path d="M220 75 Q 240 60 250 70 Q 235 85 220 75" fill="#C1D7C2" />
  </svg>
);

// Card 3: Verified Fitting Rooms
export const FittingRoomVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 130" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="130" fill="#EFAE6E" />
    {/* Fitting Room Door with OPEN sign */}
    <g transform="translate(110, 10)">
      <rect x="0" y="0" width="100" height="110" rx="4" fill="#FBEFD9" stroke="#2E1F16" strokeWidth="2.5" />
      {/* Inner panel */}
      <rect x="15" y="15" width="70" height="80" rx="3" fill="#F7E09A" stroke="#2E1F16" strokeWidth="1.5" />
      {/* Door Handle */}
      <circle cx="26" cy="60" r="4.5" fill="#2E1F16" />
      {/* "OPEN" Badge */}
      <rect x="25" y="30" width="50" height="22" rx="4" fill="#C1D7C2" />
      <text x="34" y="45" fontSize="11" fontWeight="bold" fill="#2E1F16">OPEN</text>
    </g>
    {/* Dressing mirror frame on left */}
    <rect x="40" y="20" width="45" height="90" rx="20" fill="#FBEFD9" stroke="#2E1F16" strokeWidth="2" />
    {/* Reflection lines */}
    <line x1="55" y1="35" x2="68" y2="95" stroke="#FFF" strokeWidth="2" opacity="0.6" />
  </svg>
);

// 5. STUDENT TESTIMONIAL AVATARS
// Marcus T. (Fletcher High)
export const MarcusAvatar: React.FC<{ className?: string }> = ({ className = 'w-full h-full object-cover' }) => (
  <svg viewBox="0 0 300 225" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="225" fill="#FBEFD9" />
    <circle cx="150" cy="100" r="65" fill="#F7E09A" opacity="0.6" />
    {/* Marcus portrait in navy suit */}
    <g transform="translate(80, 20)">
      {/* Head & Neck */}
      <rect x="62" y="90" width="16" height="25" fill="#8C5835" />
      <ellipse cx="70" cy="65" rx="26" ry="32" fill="#9E6842" />
      {/* Haircut */}
      <path d="M44 60 C44 35 60 30 70 30 C80 30 96 35 96 60 Z" fill="#2E1F16" />
      {/* Eyes & Smile */}
      <circle cx="60" cy="62" r="3" fill="#2E1F16" />
      <circle cx="80" cy="62" r="3" fill="#2E1F16" />
      <path d="M60 76 Q 70 85 80 76" stroke="#2E1F16" strokeWidth="2.5" fill="#FFF" />
      {/* Navy Suit Jacket */}
      <path d="M25 115 C10 135 5 185 5 200 L135 200 C135 185 130 135 115 115 Z" fill="#1E2E3D" />
      <polygon points="60,115 70,165 80,115" fill="#FBEFD9" />
      <polygon points="67,125 73,125 71,155 69,155" fill="#EFAE6E" />
    </g>
    {/* Fletcher Senators Purple/White Badge */}
    <rect x="20" y="180" width="125" height="24" rx="12" fill="#EFAE6E" />
    <text x="32" y="196" fontSize="10" fontWeight="bold" fill="#2E1F16">Fletcher High · $25 Suit</text>
  </svg>
);

// Maya Lin (Riverside High)
export const MayaAvatar: React.FC<{ className?: string }> = ({ className = 'w-full h-full object-cover' }) => (
  <svg viewBox="0 0 300 225" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="225" fill="#FBEFD9" />
    <circle cx="150" cy="100" r="65" fill="#C1D7C2" opacity="0.6" />
    {/* Maya portrait with curly hair and denim jacket */}
    <g transform="translate(80, 20)">
      {/* Curly hair outline */}
      <circle cx="45" cy="55" r="18" fill="#3B2618" />
      <circle cx="95" cy="55" r="18" fill="#3B2618" />
      <circle cx="55" cy="35" r="18" fill="#3B2618" />
      <circle cx="85" cy="35" r="18" fill="#3B2618" />
      <circle cx="70" cy="30" r="18" fill="#3B2618" />
      {/* Face & Neck */}
      <rect x="62" y="90" width="16" height="25" fill="#D4A373" />
      <ellipse cx="70" cy="65" rx="25" ry="30" fill="#E6B88A" />
      {/* Eyes & Smile */}
      <circle cx="60" cy="64" r="3" fill="#2E1F16" />
      <circle cx="80" cy="64" r="3" fill="#2E1F16" />
      <path d="M60 76 Q 70 85 80 76" stroke="#2E1F16" strokeWidth="2.5" fill="#FFF" />
      {/* Denim Jacket */}
      <path d="M25 115 C10 135 5 185 5 200 L135 200 C135 185 130 135 115 115 Z" fill="#3B5A70" />
      {/* Eco club green enamel pin */}
      <circle cx="45" cy="135" r="6" fill="#C1D7C2" />
      <path d="M45 131 Q 48 135 45 139 Q 42 135 45 131" fill="#2E1F16" />
    </g>
    {/* Riverside Generals Badge */}
    <rect x="20" y="180" width="135" height="24" rx="12" fill="#C1D7C2" />
    <text x="28" y="196" fontSize="10" fontWeight="bold" fill="#2E1F16">Riverside High · Green Club</text>
  </svg>
);

// Elena R. (Stanton College Prep)
export const ElenaAvatar: React.FC<{ className?: string }> = ({ className = 'w-full h-full object-cover' }) => (
  <svg viewBox="0 0 300 225" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="225" fill="#FBEFD9" />
    <circle cx="150" cy="100" r="65" fill="#F7E09A" opacity="0.6" />
    {/* Elena portrait with glasses and mustard knit sweater */}
    <g transform="translate(80, 20)">
      {/* Long dark hair */}
      <path d="M40 50 C40 25 100 25 100 50 L105 130 L35 130 Z" fill="#2A1B12" />
      {/* Face & Neck */}
      <rect x="62" y="90" width="16" height="25" fill="#E8C39E" />
      <ellipse cx="70" cy="65" rx="24" ry="30" fill="#F3D1AE" />
      {/* Wireframe round glasses */}
      <circle cx="58" cy="62" r="9" fill="none" stroke="#2E1F16" strokeWidth="2" />
      <circle cx="82" cy="62" r="9" fill="none" stroke="#2E1F16" strokeWidth="2" />
      <line x1="67" y1="62" x2="73" y2="62" stroke="#2E1F16" strokeWidth="2" />
      <circle cx="58" cy="62" r="2.5" fill="#2E1F16" />
      <circle cx="82" cy="62" r="2.5" fill="#2E1F16" />
      <path d="M62 78 Q 70 84 78 78" stroke="#2E1F16" strokeWidth="2" fill="none" />
      {/* Cozy Knit Sweater */}
      <path d="M25 115 C10 135 5 185 5 200 L135 200 C135 185 130 135 115 115 Z" fill="#F7E09A" />
      <line x1="70" y1="115" x2="70" y2="200" stroke="#EFAE6E" strokeWidth="2" />
    </g>
    {/* Stanton Prep Badge */}
    <rect x="20" y="180" width="130" height="24" rx="12" fill="#EFAE6E" />
    <text x="30" y="196" fontSize="10" fontWeight="bold" fill="#2E1F16">Stanton Prep · Junior</text>
  </svg>
);

// 6. THRIFTER'S FIELD GUIDE VISUAL (Centerpiece in Section 10)
export const FieldGuideVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-full object-cover' }) => (
  <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="300" fill="#FBEFD9" />
    <circle cx="150" cy="150" r="110" fill="#F7E09A" opacity="0.5" />
    {/* Canvas Tote Bag with magnifying glass & measuring tape */}
    <g transform="translate(60, 45)">
      {/* Tote Body */}
      <rect x="30" y="60" width="120" height="110" rx="8" fill="#FFFFFF" stroke="#2E1F16" strokeWidth="3" />
      {/* Handles */}
      <path d="M60 60 C60 15 120 15 120 60" fill="none" stroke="#2E1F16" strokeWidth="4" />
      {/* ThriftFit Logo on Tote */}
      <path d="M90 90 L102 110 L78 110 Z" fill="#C1D7C2" />
      <circle cx="90" cy="100" r="3" fill="#2E1F16" />
      <text x="63" y="125" fontSize="9.5" fontWeight="bold" fill="#2E1F16" letterSpacing="0.8">THRIFTFIT</text>
      {/* Yellow Cloth Measuring Tape draped out of bag */}
      <path d="M40 70 Q 20 110 30 150 Q 40 180 20 200" fill="none" stroke="#F7E09A" strokeWidth="10" strokeLinecap="round" />
      <path d="M40 70 Q 20 110 30 150 Q 40 180 20 200" fill="none" stroke="#2E1F16" strokeWidth="1" strokeDasharray="2,3" />
      {/* Magnifying Glass checking tag */}
      <g transform="translate(95, 110) rotate(-25)">
        <circle cx="30" cy="30" r="24" fill="#C1D7C2" stroke="#2E1F16" strokeWidth="3" opacity="0.9" />
        <line x1="47" y1="47" x2="70" y2="70" stroke="#2E1F16" strokeWidth="5" strokeLinecap="round" />
        {/* "100% COTTON" tag seen in lens */}
        <text x="14" y="28" fontSize="6" fontWeight="bold" fill="#2E1F16">100%</text>
        <text x="12" y="36" fontSize="5" fontWeight="bold" fill="#2E1F16">COTTON</text>
      </g>
    </g>
    <rect x="25" y="245" width="130" height="24" rx="12" fill="#EFAE6E" />
    <text x="35" y="261" fontSize="10" fontWeight="bold" fill="#2E1F16">Pro Thrifter Kit</text>
  </svg>
);
