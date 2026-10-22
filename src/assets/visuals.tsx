/**
 * Color-compliant visual assets strictly following the required palette:
 * - Page background: ivory #FBEFD9
 * - Top nav & footer: mint #C1D7C2
 * - Cards & panels: white #FFFFFF with 1px mint #C1D7C2 border & rounded corners
 * - Primary buttons: tangerine #EFAE6E with dark text #3B2F2A
 * - Highlights/tags/active: buttercup #F7E09A
 * - Secondary tags: mint #C1D7C2
 * - All text: dark brown #3B2F2A (NEVER white text)
 * - Zero teal, zero gold, zero black anywhere
 */
import React from 'react';

// ThredUp hanger glyph in dark brown #3B2F2A
export const ThredupHangerGlyph: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-[#3B2F2A]" }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 7C17.8 7 16 8.8 16 11C16 12.8 17.2 14.3 18.9 14.8L11.5 22.2C10.5 23.2 11.2 25 12.6 25H27.4C28.8 25 29.5 23.2 28.5 22.2L21.1 14.8C22.8 14.3 24 12.8 24 11C24 8.8 22.2 7 20 7Z"
      stroke="#3B2F2A"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 25C15 28 17 32 20 32C23 32 25 28 23 25"
      stroke="#3B2F2A"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <circle cx="20" cy="11" r="1.5" fill="#3B2F2A" />
  </svg>
);

// Map Pin icons (tangerine for thrift stores, buttercup with dark outline for selected school)
export const ThriftStoreMapPin: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      fill="#EFAE6E"
      stroke="#3B2F2A"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="9" r="3" fill="#FFFFFF" stroke="#3B2F2A" strokeWidth="1" />
  </svg>
);

export const SchoolMapPin: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      fill="#F7E09A"
      stroke="#3B2F2A"
      strokeWidth="2"
    />
    <circle cx="12" cy="9" r="3" fill="#3B2F2A" />
  </svg>
);

// Hero Panel 1: Woman in dark brown tailored outfit against warm ivory-parchment wall with tangerine clutch
export const HeroVelvetWoman: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 480 640" preserveAspectRatio="xMidYMid slice" className={className}>
    <defs>
      <linearGradient id="warmWallGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5E8D3" />
        <stop offset="50%" stopColor="#EAD8BE" />
        <stop offset="100%" stopColor="#DEC7A7" />
      </linearGradient>
      <linearGradient id="darkBrownVelvet" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#4A3B34" />
        <stop offset="40%" stopColor="#3B2F2A" />
        <stop offset="100%" stopColor="#2E231E" />
      </linearGradient>
      <linearGradient id="skinTone" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#eed2c2" />
        <stop offset="50%" stopColor="#e2beaa" />
        <stop offset="100%" stopColor="#cca28f" />
      </linearGradient>
      <linearGradient id="tangerineClutch" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5BE83" />
        <stop offset="60%" stopColor="#EFAE6E" />
        <stop offset="100%" stopColor="#D99752" />
      </linearGradient>
    </defs>
    <rect width="480" height="640" fill="url(#warmWallGrad)" />
    <path d="M40 0 L90 280 L70 640" stroke="#C1D7C2" strokeWidth="2" opacity="0.4" fill="none" />
    <path d="M420 100 L380 400" stroke="#F7E09A" strokeWidth="2" opacity="0.5" fill="none" />

    {/* Hair pulled back */}
    <path d="M190 140 C175 160 160 210 165 260 C170 300 185 330 195 340 L285 330 C295 300 300 240 295 190 C290 145 265 130 220 130 Z" fill="#3B2F2A" />
    {/* Neck & Face */}
    <path d="M210 240 L210 320 L260 320 L255 240 Z" fill="url(#skinTone)" />
    <path d="M195 180 C190 215 200 260 230 270 C260 260 270 215 265 180 C260 145 235 145 205 160 Z" fill="url(#skinTone)" />
    {/* Facial features in dark brown */}
    <path d="M208 178 Q218 174 225 178" stroke="#3B2F2A" strokeWidth="2" fill="none" />
    <path d="M245 176 Q254 174 260 178" stroke="#3B2F2A" strokeWidth="2" fill="none" />
    <path d="M212 188 Q220 192 226 189" stroke="#3B2F2A" strokeWidth="2.5" fill="none" />
    <path d="M246 187 Q252 191 258 188" stroke="#3B2F2A" strokeWidth="2.5" fill="none" />
    <path d="M233 194 L231 216 L237 216" stroke="#b88c78" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M225 232 Q234 238 244 232 Q234 240 225 232" fill="#aa5c55" />

    {/* Dark brown tailored blazer */}
    <path d="M140 310 C160 295 210 320 220 330 C230 320 280 295 315 315 C340 370 350 490 355 640 L110 640 C115 510 125 380 140 310 Z" fill="url(#darkBrownVelvet)" />
    <path d="M170 315 L225 440 L280 320" stroke="#5E4C44" strokeWidth="3" fill="none" />
    <path d="M205 350 L220 490 L240 360" stroke="#2B201C" strokeWidth="3" fill="none" />

    {/* Tangerine clutch under arm (replacing teal) */}
    <path d="M100 480 C100 460 135 440 145 440 L165 520 C150 560 120 570 105 550 Z" fill="url(#tangerineClutch)" />
    <path d="M110 460 L145 445" stroke="#F7E09A" strokeWidth="3" />
  </svg>
);

// Hero Panel 2: Person holding wicker basket with fresh flowers, wearing tan jacket & mint gingham pants
export const HeroGinghamBasket: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 540 640" preserveAspectRatio="xMidYMid slice" className={className}>
    <defs>
      <linearGradient id="mintMeadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C1D7C2" />
        <stop offset="50%" stopColor="#A8C4A9" />
        <stop offset="100%" stopColor="#8FAFA1" />
      </linearGradient>
      <linearGradient id="tanJacket" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F2BA81" />
        <stop offset="50%" stopColor="#EFAE6E" />
        <stop offset="100%" stopColor="#D59553" />
      </linearGradient>
      <pattern id="mintGingham" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="#FBEFD9" />
        <rect width="12" height="24" fill="#C1D7C2" opacity="0.75" />
        <rect width="24" height="12" fill="#C1D7C2" opacity="0.75" />
        <rect width="12" height="12" fill="#8EAFA0" opacity="0.9" />
      </pattern>
      <linearGradient id="wickerGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EED2A8" />
        <stop offset="50%" stopColor="#D5AF79" />
        <stop offset="100%" stopColor="#A8824C" />
      </linearGradient>
    </defs>
    <rect width="540" height="640" fill="url(#mintMeadow)" />
    <circle cx="80" cy="220" r="16" fill="#F7E09A" opacity="0.8" />
    <circle cx="460" cy="210" r="14" fill="#FBEFD9" opacity="0.8" />

    {/* Upper body: Tangerine-tan utility jacket */}
    <path d="M120 70 C160 50 270 40 380 50 C440 60 480 180 500 320 L70 320 C85 220 95 100 120 70 Z" fill="url(#tanJacket)" />
    <path d="M230 65 L270 140 L310 65" stroke="#3B2F2A" strokeWidth="2.5" fill="none" />
    <circle cx="270" cy="180" r="5" fill="#3B2F2A" />
    <circle cx="270" cy="230" r="5" fill="#3B2F2A" />

    {/* Mint and Ivory gingham skirt / trousers */}
    <rect x="140" y="320" width="280" height="320" fill="url(#mintGingham)" />
    <path d="M140 320 C140 320 200 480 180 640 L380 640 C360 480 420 320 420 320 Z" fill="url(#mintGingham)" />

    {/* Hands */}
    <circle cx="200" cy="310" r="16" fill="#e0b89f" />
    <circle cx="340" cy="305" r="16" fill="#e0b89f" />

    {/* Wicker basket */}
    <ellipse cx="270" cy="400" rx="140" ry="80" fill="none" stroke="url(#wickerGrad)" strokeWidth="12" />
    <ellipse cx="270" cy="480" rx="170" ry="110" fill="url(#wickerGrad)" />

    {/* Flowers in buttercup, ivory & peach */}
    <circle cx="230" cy="450" r="45" fill="#FBEFD9" />
    <circle cx="230" cy="450" r="28" fill="#F7E09A" />
    <circle cx="300" cy="440" r="40" fill="#FFFFFF" />
    <circle cx="300" cy="440" r="24" fill="#F7E09A" />
    <circle cx="170" cy="480" r="35" fill="#EFAE6E" opacity="0.8" />
  </svg>
);

// Hero Panel 3: Woman with sunglasses, white denim jacket against warm siding wall
export const HeroPinkWallWoman: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 480 640" preserveAspectRatio="xMidYMid slice" className={className}>
    <defs>
      <linearGradient id="warmWallSlat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5D8C3" />
        <stop offset="50%" stopColor="#E8C3AC" />
        <stop offset="100%" stopColor="#D9AF96" />
      </linearGradient>
      <linearGradient id="whiteDenim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FBEFD9" />
        <stop offset="100%" stopColor="#EFE3CC" />
      </linearGradient>
    </defs>
    <rect width="480" height="640" fill="url(#warmWallSlat)" />
    {[40, 85, 130, 175, 220, 265, 310, 355, 400, 445, 490, 535, 580, 625].map((y) => (
      <g key={y}>
        <line x1="0" y1={y} x2="480" y2={y} stroke="#3B2F2A" strokeWidth="1.5" opacity="0.3" />
        <line x1="0" y1={y + 1} x2="480" y2={y + 1} stroke="#C1D7C2" strokeWidth="1.2" opacity="0.6" />
      </g>
    ))}

    {/* Blonde hair */}
    <path d="M380 120 C350 140 330 200 330 260 C330 320 340 360 350 380 C380 340 430 300 440 220 C445 160 415 110 380 120 Z" fill="#D2A36B" />
    <path d="M360 180 C365 220 375 250 395 260 C405 240 410 200 405 170 Z" fill="#e9beaa" />
    {/* Dark brown sunglasses (NO black) */}
    <path d="M365 175 C360 185 375 198 392 195 C398 185 390 172 375 172 Z" fill="#3B2F2A" />

    {/* Denim Jacket */}
    <path d="M250 310 C270 270 340 250 390 265 C440 280 470 350 480 640 L210 640 C215 540 230 400 250 310 Z" fill="url(#whiteDenim)" />
    <path d="M330 260 L350 320 L400 280" stroke="#C1D7C2" strokeWidth="2" fill="none" />
    <line x1="350" y1="320" x2="350" y2="640" stroke="#C1D7C2" strokeWidth="2" />
  </svg>
);

// Promo Banner: Person in cozy sweater holding dark brown heels with buttercup buckle & mint/tangerine plaid scarf
export const PromoPinkSweaterHeels: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 520 340" preserveAspectRatio="xMidYMid slice" className={className}>
    <defs>
      <linearGradient id="warmStudio" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBEFD9" />
        <stop offset="100%" stopColor="#EADBBE" />
      </linearGradient>
      <linearGradient id="softSweater" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#F5E5D5" />
        <stop offset="100%" stopColor="#E7CEBC" />
      </linearGradient>
      <pattern id="mintPlaid" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="#C1D7C2" />
        <rect width="8" height="28" fill="#EFAE6E" opacity="0.7" />
        <rect width="28" height="8" fill="#EFAE6E" opacity="0.7" />
        <line x1="0" y1="14" x2="28" y2="14" stroke="#F7E09A" strokeWidth="2" />
        <line x1="14" y1="0" x2="14" y2="28" stroke="#F7E09A" strokeWidth="2" />
      </pattern>
    </defs>
    <rect width="520" height="340" fill="url(#warmStudio)" />
    {/* Plaid blanket in mint, tangerine, buttercup */}
    <rect x="360" y="0" width="160" height="340" fill="url(#mintPlaid)" />

    {/* Cozy sweater */}
    <path d="M20 0 C70 40 180 30 260 0 C300 80 320 200 320 340 L0 340 L0 80 Z" fill="url(#softSweater)" />
    {/* Ribbed lines in mint */}
    {[40, 70, 100, 130, 160, 190, 220, 250, 280, 310].map(y => (
      <path key={y} d={`M${10 + y * 0.2} ${y} Q${120} ${y + 8} ${280} ${y - 4}`} stroke="#C1D7C2" strokeWidth="2" opacity="0.5" fill="none" />
    ))}

    {/* Hand */}
    <path d="M220 180 C240 160 270 170 280 200 L260 250 Z" fill="#e8c2b0" />

    {/* Pointed Slingback Pump in dark brown #3B2F2A (NO black) */}
    <path d="M260 80 C280 60 350 90 380 180 C360 210 300 240 250 200 C230 180 240 110 260 80 Z" fill="#3B2F2A" />
    <path d="M370 160 L410 195 L370 215 Z" fill="#2E231E" />
    {/* Buttercup Buckle #F7E09A (NO gold) */}
    <rect x="295" y="115" width="28" height="24" rx="3" fill="none" stroke="#F7E09A" strokeWidth="4" />
    <line x1="295" y1="127" x2="323" y2="127" stroke="#F7E09A" strokeWidth="4" />
  </svg>
);

// Curators Avatars with mint border and dark brown text
export const CuratorAvatar: React.FC<{ name: string; id: string }> = ({ name, id }) => {
  const getColors = () => {
    switch (id) {
      case 'aleksandra':
        return { bg: '#F7E09A', clothes: '#C1D7C2', hair: '#3B2F2A' };
      case 'emory':
        return { bg: '#C1D7C2', clothes: '#EFAE6E', hair: '#4E3A33' };
      case 'sofia':
        return { bg: '#EFAE6E', clothes: '#3B2F2A', hair: '#5C443A' };
      case 'allegra':
        return { bg: '#FBEFD9', clothes: '#C1D7C2', hair: '#3B2F2A' };
      case 'robin':
        return { bg: '#C1D7C2', clothes: '#3B2F2A', hair: '#6E4E3F' };
      case 'maddy':
        return { bg: '#F7E09A', clothes: '#EFAE6E', hair: '#B88B57' };
      case 'ceci':
      default:
        return { bg: '#EFAE6E', clothes: '#C1D7C2', hair: '#3B2F2A' };
    }
  };

  const c = getColors();

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full object-cover">
      <circle cx="80" cy="80" r="78" fill={c.bg} stroke="#C1D7C2" strokeWidth="2" />
      <path d="M15 160 C25 110 60 100 80 100 C100 100 135 110 145 160 Z" fill={c.clothes} />
      <path d="M70 75 L70 105 L90 105 L90 75 Z" fill="#EECDBE" />
      <path d="M62 45 C60 68 66 90 80 92 C94 90 100 68 98 45 C96 28 84 25 70 30 Z" fill="#EECDBE" />
      <path d="M56 40 C52 65 54 95 62 110 C50 95 50 60 58 35 C65 20 95 18 104 35 C110 50 108 95 98 110 C106 95 108 65 104 40 Z" fill={c.hair} />
    </svg>
  );
};

// Wear 1: Tan suede fringe jacket & layered necklaces
export const WearFringeJacket: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 460 380" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="460" height="380" fill="#C1D7C2" />
    <circle cx="120" cy="110" r="70" fill="#3B2F2A" />
    <circle cx="150" cy="140" r="80" fill="#3B2F2A" />
    <path d="M190 80 C210 110 215 150 205 170 C190 190 170 195 150 190 Z" fill="#c9957a" />
    {/* Tangerine suede fringe jacket */}
    <path d="M80 180 C110 170 240 180 300 240 L310 380 L30 380 Z" fill="#EFAE6E" />
    {[110, 130, 150, 170, 190, 210, 230, 250, 270, 290].map(x => (
      <path key={x} d={`M${x} 230 L${x - 15} 360`} stroke="#3B2F2A" strokeWidth="3" strokeLinecap="round" />
    ))}
    {/* Buttercup beads */}
    <path d="M175 185 Q195 240 220 220" stroke="#F7E09A" strokeWidth="4.5" fill="none" strokeDasharray="3 3" />
    <path d="M170 195 Q200 270 235 240" stroke="#3B2F2A" strokeWidth="3.5" fill="none" strokeDasharray="3 3" />
  </svg>
);

// Wear 2: Faux-fur coat collar with rich brown suede leather gloves over ivory knit turtleneck
export const WearFauxFurGloves: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 460 380" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="460" height="380" fill="#FBEFD9" />
    {[40, 70, 100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 400, 430].map(x => (
      <line key={x} x1={x} y1="0" x2={x} y2="380" stroke="#C1D7C2" strokeWidth="3" opacity="0.6" />
    ))}
    {/* Mocha faux fur collar */}
    <path d="M0 0 C60 50 140 120 150 380 L0 380 Z" fill="#6B5347" />
    <path d="M460 0 C400 50 320 120 310 380 L460 380 Z" fill="#6B5347" />
    {/* Dark brown glove */}
    <path d="M200 240 C190 200 200 160 215 150 C225 140 240 180 245 200 L255 170 C265 170 270 200 270 220 L285 200 C295 205 295 235 290 255 L320 380 L180 380 Z" fill="#3B2F2A" />
  </svg>
);

// Wear 3: 70s autumnal rust paisley bell-sleeve blouse
export const WearPaisleyBellSleeve: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 460 380" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="460" height="380" fill="#FBEFD9" />
    <path d="M330 60 C320 120 310 180 310 260 C350 240 370 180 370 100 Z" fill="#3B2F2A" />
    <path d="M360 80 C340 100 320 140 330 180 L360 170 Z" fill="#e8c2ab" />
    <path d="M120 190 C180 150 300 150 380 180 L460 380 L60 380 Z" fill="#EFAE6E" />
    <circle cx="200" cy="260" r="15" fill="#F7E09A" />
    <circle cx="280" cy="270" r="18" fill="#C1D7C2" />
    <path d="M300 170 C280 190 270 230 290 250 C310 230 310 190 300 170 Z" fill="#3B2F2A" />
  </svg>
);

// Trend 1: Fall Uniform
export const TrendFallUniform: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="280" height="400" fill="#FBEFD9" />
    <circle cx="125" cy="95" r="28" fill="#ebd2c0" />
    <path d="M120 70 C105 100 95 180 120 240 C135 180 135 100 120 70 Z" fill="#C69865" />
    <path d="M50 170 C70 140 160 140 190 170 C205 230 210 320 215 400 L25 400 Z" fill="#EADBC6" />
    <rect x="25" y="270" width="60" height="90" fill="#3B2F2A" rx="4" />
    <path d="M60 210 L78 280" stroke="#EFAE6E" strokeWidth="12" strokeLinecap="round" />
    <circle cx="45" cy="250" r="14" fill="#F7E09A" />
  </svg>
);

// Trend 2: Y2K Remix
export const TrendY2KRemix: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="280" height="400" fill="#FBEFD9" />
    <path d="M30 60 C50 40 230 40 250 60 L240 210 C210 215 70 215 40 210 Z" fill="#EFAE6E" />
    <path d="M70 50 C90 90 190 90 210 50 C230 90 210 140 140 140 C70 140 50 90 70 50 Z" fill="#FFFFFF" />
    <path d="M90 150 C90 130 190 130 190 150 L190 190 C190 205 90 205 90 190 Z" fill="#F7E09A" rx="10" stroke="#3B2F2A" strokeWidth="1.5" />
    <path d="M50 220 L230 220 L245 400 L35 400 Z" fill="#C1D7C2" />
  </svg>
);

// Trend 3: Animal Print
export const TrendAnimalPrint: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="280" height="400" fill="#FBEFD9" />
    {/* Beret with buttercup and dark brown spots (NO gold, NO black) */}
    <path d="M80 80 C80 40 200 40 200 80 C210 95 180 105 140 105 C100 105 70 95 80 80 Z" fill="#F7E09A" stroke="#3B2F2A" strokeWidth="1.5" />
    <circle cx="110" cy="70" r="4" fill="#3B2F2A" />
    <circle cx="140" cy="65" r="5" fill="#3B2F2A" />
    <circle cx="170" cy="75" r="4" fill="#3B2F2A" />
    <circle cx="125" cy="88" r="4" fill="#3B2F2A" />

    <path d="M95 90 C95 140 105 170 140 175 C175 170 185 140 185 90 Z" fill="#ebcfc0" />
    <path d="M20 200 C50 170 230 170 260 200 L270 400 L10 400 Z" fill="#755038" />
  </svg>
);

// Trend 4: Dark Florals
export const TrendDarkFlorals: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="280" height="400" fill="#C1D7C2" />
    <circle cx="140" cy="85" r="22" fill="#e9c8b7" />
    {/* Dark brown shawl */}
    <path d="M70 120 C100 100 180 100 210 120 L230 260 L50 260 Z" fill="#3B2F2A" />
    {/* Floral skirt */}
    <path d="M85 240 L195 240 L210 370 L70 370 Z" fill="#4A3B34" />
    <circle cx="120" cy="300" r="10" fill="#F7E09A" />
    <circle cx="170" cy="320" r="12" fill="#EFAE6E" />
    <rect x="100" y="340" width="30" height="60" fill="#3B2F2A" rx="4" />
    <rect x="150" y="340" width="30" height="60" fill="#3B2F2A" rx="4" />
  </svg>
);

// Trend 5: Romantic Lace
export const TrendRomanticLace: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="280" height="400" fill="#FBEFD9" />
    <rect x="0" y="0" width="280" height="150" fill="#C1D7C2" />
    {/* Lace pattern in dark brown */}
    <path d="M60 130 C80 200 80 260 70 340 L130 340 C140 260 140 200 120 130 Z" fill="#d9baa8" />
    <path d="M60 130 C80 200 80 260 70 340 L130 340 C140 260 140 200 120 130 Z" fill="none" stroke="#3B2F2A" strokeWidth="2" strokeDasharray="4 3" />
    {/* Dark brown boot */}
    <path d="M180 180 L230 200 L250 340 L170 340 Z" fill="#3B2F2A" />
    <path d="M230 200 L270 230 L250 250 Z" fill="#3B2F2A" />
    {/* Tangerine bag */}
    <path d="M190 270 C190 240 240 230 250 260 L240 330 C220 340 190 320 190 270 Z" fill="#EFAE6E" />
    {/* Mint camera */}
    <rect x="100" y="270" width="45" height="30" rx="3" fill="#C1D7C2" stroke="#3B2F2A" strokeWidth="1.5" />
    <circle cx="122" cy="285" r="8" fill="#F7E09A" stroke="#3B2F2A" strokeWidth="1.5" />
  </svg>
);

// Trend 6: Bold Stripes
export const TrendBoldStripes: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 280 400" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="280" height="400" fill="#FBEFD9" />
    <circle cx="150" cy="95" r="45" fill="#3B2F2A" />
    <path d="M120 80 C130 110 160 140 190 125 C205 105 190 70 170 65 Z" fill="#e8c2ab" />
    {/* Mint and Tangerine/Brown striped sweater */}
    <path d="M40 160 C90 130 200 130 250 160 L270 400 L20 400 Z" fill="#C1D7C2" />
    {[180, 240, 300, 360].map(y => (
      <rect key={y} x="20" y={y} width="250" height="25" fill="#EFAE6E" opacity="0.9" />
    ))}
  </svg>
);

// Catalog Product 1: Lace Wrap in dark brown
export const CatalogLaceWrap: React.FC<{ className?: string }> = ({ className = "w-full h-full object-contain" }) => (
  <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid meet" className={className}>
    <rect width="320" height="400" fill="#FFFFFF" />
    <rect x="148" y="40" width="24" height="45" fill="#FBEFD9" rx="4" stroke="#C1D7C2" strokeWidth="1" />
    <path d="M125 75 C135 60 185 60 195 75 L215 160 C215 220 105 220 105 160 Z" fill="#FBEFD9" />
    <line x1="160" y1="210" x2="160" y2="400" stroke="#3B2F2A" strokeWidth="4" />

    {/* Dark brown wrap */}
    <path d="M100 85 C120 75 200 75 220 85 L245 280 C235 340 180 370 160 370 C140 370 85 340 75 280 Z" fill="#3B2F2A" opacity="0.9" />
    {[90, 105, 120, 135, 150, 160, 170, 185, 200, 215, 230].map(x => (
      <line key={x} x1={x} y1="260" x2={x + (x > 160 ? 5 : -5)} y2="385" stroke="#3B2F2A" strokeWidth="2.5" />
    ))}
  </svg>
);

// Catalog Product 2: Patagonia Puffer in terracotta / brick
export const CatalogPatagoniaJacket: React.FC<{ className?: string }> = ({ className = "w-full h-full object-contain" }) => (
  <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid meet" className={className}>
    <rect width="320" height="400" fill="#FFFFFF" />
    <rect x="150" y="30" width="20" height="35" fill="#FBEFD9" rx="3" stroke="#C1D7C2" strokeWidth="1" />
    <path d="M120 220 L200 220 L190 280 L130 280 Z" fill="#FBEFD9" />
    <line x1="160" y1="280" x2="160" y2="390" stroke="#3B2F2A" strokeWidth="4" />

    {/* Tangerine/brick jacket */}
    <path d="M85 95 C110 75 210 75 235 95 L260 210 C250 230 225 240 160 240 C95 240 70 230 60 210 Z" fill="#EFAE6E" stroke="#3B2F2A" strokeWidth="1.5" />
    <path d="M85 95 L55 210 L85 220 L105 130 Z" fill="#D99752" />
    <path d="M235 95 L265 210 L235 220 L215 130 Z" fill="#D99752" />
    <path d="M130 65 C140 60 180 60 190 65 L190 95 L130 95 Z" fill="#D99752" />

    {[105, 125, 145, 165, 185, 205, 225].map(y => (
      <path key={y} d={`M${95} ${y} Q${160} ${y + 5} ${225} ${y}`} stroke="#3B2F2A" strokeWidth="1.8" fill="none" />
    ))}
    <line x1="160" y1="65" x2="160" y2="240" stroke="#3B2F2A" strokeWidth="2" />
    <rect x="185" y="115" width="14" height="6" fill="#3B2F2A" rx="1" />
  </svg>
);

// Catalog Product 3: Original by Sharif satchel
export const CatalogSharifSatchel: React.FC<{ className?: string }> = ({ className = "w-full h-full object-contain" }) => (
  <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid meet" className={className}>
    <rect width="320" height="400" fill="#FFFFFF" />
    {/* Handle in dark brown */}
    <path d="M110 200 C110 80 210 80 210 200" stroke="#3B2F2A" strokeWidth="12" fill="none" strokeLinecap="round" />
    {/* Satchel Body */}
    <rect x="70" y="180" width="180" height="150" rx="8" fill="#FBEFD9" stroke="#C1D7C2" strokeWidth="3" />
    <circle cx="160" cy="255" r="30" fill="#C1D7C2" opacity="0.6" />
    <circle cx="160" cy="255" r="18" fill="#EFAE6E" />
    <circle cx="160" cy="255" r="8" fill="#F7E09A" />

    <path d="M70 180 L110 180 L110 330 L70 330 Z" fill="#EFAE6E" opacity="0.85" />
    <path d="M210 180 L250 180 L250 330 L210 330 Z" fill="#EFAE6E" opacity="0.85" />

    {/* Buttercup Buckles (NO gold) */}
    <rect x="80" y="240" width="20" height="16" fill="none" stroke="#F7E09A" strokeWidth="3" rx="2" />
    <rect x="220" y="240" width="20" height="16" fill="none" stroke="#F7E09A" strokeWidth="3" rx="2" />
    <rect x="66" y="174" width="188" height="24" rx="4" fill="#3B2F2A" />
  </svg>
);

// Catalog Promo Card: Woman holding mint Clean Out bag with buttercup dots
export const CatalogCleanOutPromo: React.FC<{ className?: string }> = ({ className = "w-full h-full object-cover" }) => (
  <svg viewBox="0 0 320 440" preserveAspectRatio="xMidYMid slice" className={className}>
    <rect width="320" height="440" fill="#FBEFD9" />
    <circle cx="160" cy="120" r="48" fill="#3B2F2A" />
    <path d="M130 95 C140 145 180 145 190 95 Z" fill="#ebcfc0" />

    {/* Mint bag with buttercup polka dots */}
    <path d="M110 200 C150 180 280 190 320 220 L320 440 L100 440 Z" fill="#C1D7C2" />
    {[220, 260, 300, 340, 380, 420].map(y => (
      <g key={y}>
        <circle cx="140" cy={y} r="8" fill="#F7E09A" />
        <circle cx="180" cy={y + 15} r="8" fill="#F7E09A" />
        <circle cx="220" cy={y} r="8" fill="#F7E09A" />
        <circle cx="260" cy={y + 15} r="8" fill="#F7E09A" />
      </g>
    ))}
    <text x="180" y="320" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#3B2F2A">
      THREDUP
    </text>
  </svg>
);
