import React from 'react';

/**
 * Official PKBM BINA INSANI Logo
 * Recreated accurately from the institution's official emblem:
 * - Emerald Green open book with fanning page layers and sweeping dynamic swooshes (#006837, #007A3D)
 * - Vibrant Ruby Red crescent arch swooping into a triumphant graduate in toga mortarboard cap (#DC2626, #E11D48)
 * - 5-pointed red star at top-right
 * - Distinctive "PKBM BINA INSANI" typography
 */
export const PkbmOfficialLogo: React.FC<{
  size?: number;
  showText?: boolean;
  className?: string;
  variant?: 'color' | 'white';
}> = ({ size = 48, showText = false, className = '', variant = 'color' }) => {
  const isWhite = variant === 'white';
  const greenPrimary = isWhite ? '#FFFFFF' : '#006837';
  const greenSecondary = isWhite ? '#F0FDF4' : '#047857';
  const redPrimary = isWhite ? '#FFFFFF' : '#DC2626';
  const redSecondary = isWhite ? '#FFFFFF' : '#E11D48';
  const textColor = isWhite ? '#FFFFFF' : '#0F172A';

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={showText ? size * 1.15 : size}
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="pkbmGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={greenPrimary} />
            <stop offset="100%" stopColor={greenSecondary} />
          </linearGradient>
          <linearGradient id="pkbmRedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={redSecondary} />
            <stop offset="100%" stopColor={redPrimary} />
          </linearGradient>
          <filter id="pkbmGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. GREEN OPEN BOOK (BOTTOM-LEFT) */}
        <g id="pkbmBook">
          {/* Main Solid Book Base - Left Wing */}
          <path
            d="M8 82 L78 98 L78 152 L26 142 L8 82 Z"
            fill="url(#pkbmGreenGrad)"
          />
          {/* Main Solid Book Base - Right Wing */}
          <path
            d="M78 98 L122 88 L122 144 L78 152 Z"
            fill={greenSecondary}
          />
          {/* Central Spine Fold Highlight */}
          <line x1="78" y1="98" x2="78" y2="152" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.4" />

          {/* Fanning Page Layers fluttering upwards on the left */}
          {/* Top Page Layer */}
          <path
            d="M32 54 C48 50 68 70 78 96 C64 88 44 76 32 54 Z"
            fill="url(#pkbmGreenGrad)"
          />
          {/* Middle Page Layer */}
          <path
            d="M20 68 C38 68 62 82 77 97 C60 90 40 82 20 68 Z"
            fill="url(#pkbmGreenGrad)"
            opacity="0.9"
          />
          {/* Inner Spreading Page Sheets (White/Cream) */}
          <path
            d="M26 84 C45 84 66 94 77 98 C62 94 42 90 26 84 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />
          <path
            d="M79 98 C92 94 110 88 120 86 C110 92 94 96 79 98 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />
          {/* Right fluttering page */}
          <path
            d="M78 97 C96 82 118 72 136 68 C122 80 102 90 78 97 Z"
            fill="url(#pkbmGreenGrad)"
            opacity="0.85"
          />
        </g>

        {/* 2. DYNAMIC GREEN SWOOSHES (TOP-LEFT & MID ARC) */}
        <g id="pkbmGreenSwooshes">
          {/* Outer sweeping arch swirling upwards and over the graduate */}
          <path
            d="M60 4 C110 2 168 18 178 22 C138 20 90 14 56 24 C40 28 32 38 42 56 C50 72 68 84 84 88 C70 82 52 68 46 54 C42 44 48 34 60 28 C74 20 102 12 140 16 C98 8 50 14 36 28 C26 38 28 54 36 68 C24 52 26 34 38 20 C46 10 56 6 60 4 Z"
            fill="url(#pkbmGreenGrad)"
          />
          {/* Inner swirling curve connecting towards the book */}
          <path
            d="M68 28 C92 34 110 56 102 82 C98 90 92 96 84 96 C92 92 98 84 98 74 C98 56 82 40 64 36 C54 34 46 38 42 46 C38 40 44 32 54 28 C58 26 64 27 68 28 Z"
            fill="url(#pkbmGreenGrad)"
          />
        </g>

        {/* 3. DYNAMIC RED GRADUATE & STAR (#DC2626) */}
        <g id="pkbmGraduate" filter="url(#pkbmGlow)">
          {/* Sweeping Red Crescent Ribbon from under the book up to graduate's arm */}
          <path
            d="M44 148 C68 160 94 162 116 156 C144 146 158 122 158 92 C158 64 144 46 122 34 C110 28 92 24 88 24 C104 26 126 32 140 44 C154 58 162 78 160 102 C156 128 138 152 108 162 C84 168 58 164 44 148 Z"
            fill="url(#pkbmRedGrad)"
          />
          {/* Main graduate body & outstretched reaching arm */}
          <path
            d="M138 44 C150 48 166 60 174 74 C184 92 192 118 198 130 C194 112 186 92 176 74 C168 58 154 44 138 36 L138 44 Z"
            fill="url(#pkbmRedGrad)"
          />
          <path
            d="M142 40 C156 46 172 62 180 84 C186 102 188 122 194 140 C188 120 182 98 174 80 C166 62 152 48 140 38 Z"
            fill="url(#pkbmRedGrad)"
          />
          {/* Left reaching torso fold */}
          <path
            d="M118 52 C134 52 148 64 154 78 C158 88 160 98 162 112 C158 98 154 84 146 72 C138 60 126 54 118 52 Z"
            fill="url(#pkbmRedGrad)"
          />

          {/* Graduate Head (Solid Circle) */}
          <circle cx="152" cy="46" r="16" fill="url(#pkbmRedGrad)" />

          {/* Graduation Toga Mortarboard (Top Diamond & Skullcap) */}
          {/* Mortarboard Diamond */}
          <polygon points="152,14 176,28 152,40 128,28" fill="url(#pkbmRedGrad)" />
          {/* Skullcap underneath */}
          <path d="M136 29 C136 38 168 38 168 29 Z" fill="url(#pkbmRedGrad)" />
          {/* Hanging Tassel on the left */}
          <path d="M136 29 L132 44 L134 46 L138 31 Z" fill="url(#pkbmRedGrad)" />
          <circle cx="133" cy="46" r="2.5" fill="url(#pkbmRedGrad)" />

          {/* 5-POINTED RED STAR AT TOP-RIGHT */}
          <g className="animate-star-twinkle" style={{ transformOrigin: '184px 22px' }}>
            <polygon
              points="184,10 188,20 198,20 190,26 193,36 184,30 175,36 178,26 170,20 180,20"
              fill="url(#pkbmRedGrad)"
            />
          </g>
        </g>

        {/* 4. OFFICIAL TYPOGRAPHY: "PKBM BINA INSANI" */}
        {showText && (
          <g id="pkbmText" transform="translate(0, 185)">
            <text
              x="100"
              y="28"
              textAnchor="middle"
              fill={textColor}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="21"
              letterSpacing="2.5"
            >
              PKBM BINA INSANI
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * 3D Administrator Avatar with Ruby-Red and Emerald Theme
 */
export const AdminAvatar3D: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="adminBgGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEE2E2" />
          <stop offset="100%" stopColor="#FECDD3" />
        </linearGradient>
        <linearGradient id="adminSuitGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="adminSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#adminBgGradRed)" />
      
      {/* Body / Suit */}
      <path
        d="M20 92C20 74 34 68 50 68C66 68 80 74 80 92C80 96 76 98 70 98H30C24 98 20 96 20 92Z"
        fill="url(#adminSuitGradRed)"
      />
      {/* White Shirt Collar */}
      <polygon points="50,69 40,78 60,78" fill="#FFFFFF" />
      {/* Emerald Green Tie */}
      <polygon points="50,73 47,88 50,96 53,88" fill="#047857" />
      
      {/* Neck */}
      <rect x="44" y="54" width="12" height="15" rx="3" fill="url(#adminSkinGrad)" />
      
      {/* Head */}
      <ellipse cx="50" cy="42" rx="19" ry="21" fill="url(#adminSkinGrad)" />
      
      {/* Hair */}
      <path
        d="M31 38C31 24 40 18 52 18C64 18 69 25 69 36C69 38 67 36 65 33C60 27 48 24 37 32C33 35 31 38 31 38Z"
        fill="#1E293B"
      />
      
      {/* Ears */}
      <circle cx="31" cy="42" r="4.5" fill="#FDBA74" />
      <circle cx="69" cy="42" r="4.5" fill="#FDBA74" />
      
      {/* Eyes & Eyebrows */}
      <ellipse cx="43" cy="39" rx="2" ry="2.5" fill="#0F172A" />
      <ellipse cx="57" cy="39" rx="2" ry="2.5" fill="#0F172A" />
      <path d="M40 34C42 33 45 33 46 34" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M54 34C55 33 58 33 60 34" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Smile */}
      <path d="M45 47C47 50 53 50 55 47" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
    </svg>

    {/* Ruby Red Cog / Gear Badge at bottom right */}
    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DC2626] border border-white flex items-center justify-center text-white shadow-sm">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
  </div>
);

/**
 * 3D Guru Avatar (Female Teacher with glasses, Emerald Blazer, holding pen & notebook)
 */
export const TeacherAvatar3D: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="teacherBgGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="100%" stopColor="#FFE4E6" />
        </linearGradient>
        <linearGradient id="teacherBlazerGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id="teacherSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#teacherBgGradGreen)" />
      
      {/* Body / Blazer */}
      <path
        d="M20 92C20 74 34 68 50 68C66 68 80 74 80 92C80 96 76 98 70 98H30C24 98 20 96 20 92Z"
        fill="url(#teacherBlazerGradRed)"
      />
      {/* Inner top / blouse */}
      <polygon points="50,68 44,79 56,79" fill="#FFFFFF" />

      {/* Book & Pen in hands */}
      <rect x="42" y="78" width="22" height="16" rx="2" fill="#F0FDF4" stroke="#047857" strokeWidth="1.5" />
      <line x1="53" y1="78" x2="53" y2="94" stroke="#86EFAC" strokeWidth="1" />
      {/* Pen */}
      <line x1="62" y1="75" x2="70" y2="85" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Neck */}
      <rect x="45" y="55" width="10" height="15" rx="3" fill="url(#teacherSkinGrad)" />
      
      {/* Hair back */}
      <path d="M28 40C28 22 72 22 72 40C74 54 72 65 68 70H32C28 65 26 54 28 40Z" fill="#78350F" />
      
      {/* Head */}
      <ellipse cx="50" cy="42" rx="17" ry="19" fill="url(#teacherSkinGrad)" />
      
      {/* Hair Bangs / Front */}
      <path d="M33 34C35 24 45 22 50 22C60 22 67 27 67 34C64 30 57 28 50 28C43 28 36 30 33 34Z" fill="#92400E" />
      
      {/* Eyeglasses */}
      <rect x="37" y="36" width="11" height="8" rx="2" fill="none" stroke="#7C2D12" strokeWidth="1.8" />
      <rect x="52" y="36" width="11" height="8" rx="2" fill="none" stroke="#7C2D12" strokeWidth="1.8" />
      <line x1="48" y1="40" x2="52" y2="40" stroke="#7C2D12" strokeWidth="1.8" />
      
      {/* Eyes */}
      <circle cx="42.5" cy="40" r="1.5" fill="#1E293B" />
      <circle cx="57.5" cy="40" r="1.5" fill="#1E293B" />
      
      {/* Smile */}
      <path d="M46 48C48 51 52 51 54 48" stroke="#B45309" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * 3D Siswa Avatar (Student with Emerald Green Shirt and Red Backpack Straps)
 */
export const StudentAvatar3D: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="studentBgGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DCFCE7" />
          <stop offset="100%" stopColor="#BBF7D0" />
        </linearGradient>
        <linearGradient id="studentShirtGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="studentSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#studentBgGradEmerald)" />
      
      {/* Red Backpack straps */}
      <path d="M30 76C30 70 34 68 37 68" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
      <path d="M70 76C70 70 66 68 63 68" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />

      {/* Body / Shirt */}
      <path
        d="M23 92C23 76 34 70 50 70C66 70 77 76 77 92C77 96 74 98 68 98H32C26 98 23 96 23 92Z"
        fill="url(#studentShirtGradGreen)"
      />

      {/* Red Book in hand */}
      <rect x="36" y="80" width="28" height="16" rx="2" fill="#F87171" stroke="#DC2626" strokeWidth="1.5" />
      
      {/* Neck */}
      <rect x="44" y="55" width="12" height="15" rx="3" fill="url(#studentSkinGrad)" />
      
      {/* Head */}
      <ellipse cx="50" cy="43" rx="18" ry="20" fill="url(#studentSkinGrad)" />
      
      {/* Short Neat Hair */}
      <path
        d="M32 39C32 23 42 17 52 17C64 17 68 24 68 37C66 33 60 28 50 28C40 28 35 33 32 39Z"
        fill="#0F172A"
      />
      
      {/* Ears */}
      <circle cx="32" cy="43" r="4" fill="#FDBA74" />
      <circle cx="68" cy="43" r="4" fill="#FDBA74" />
      
      {/* Eyes */}
      <ellipse cx="43" cy="40" rx="2" ry="2.5" fill="#0F172A" />
      <ellipse cx="57" cy="40" rx="2" ry="2.5" fill="#0F172A" />
      
      {/* Big Cheerful Smile */}
      <path d="M44 48C46 52 54 52 56 48" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Top Hero Illustration Header:
 * - Official PKBM Bina Insani Logo with green and red branding
 * - 3D Animated Indonesian Students (Boy with tablet, Girl with white hijab & books)
 * - School rooftop with waving Merah Putih flag
 * - Dynamic Slogan: "Belajar, Berkembang, Berkarya, Bersama"
 * - Living float and drift animations
 */
export const BisaTopHeroBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#E8F5E9] via-[#F0FDF4] to-white pt-2.5 pb-5 px-4 select-none">
      {/* Animated drifting clouds in sky */}
      <div className="absolute top-2 right-8 w-24 h-10 bg-white/70 rounded-full blur-sm pointer-events-none animate-cloud-drift" />
      <div className="absolute top-7 left-3 w-28 h-9 bg-white/60 rounded-full blur-sm pointer-events-none animate-cloud-drift" style={{ animationDelay: '-7s' }} />

      {/* Grid container with Left Brand Info & Right 3D Animated Illustration */}
      <div className="relative z-10 flex items-start justify-between gap-1">
        {/* Left: Official PKBM Bina Insani Identity */}
        <div className="flex-1 max-w-[195px] pt-0.5">
          {/* Official Logo & BISA Text */}
          <div className="flex items-center gap-2">
            <PkbmOfficialLogo size={42} showText={false} />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#006837] leading-none">
                BISA
              </span>
              <span className="text-[10px] font-extrabold tracking-wider text-[#DC2626] uppercase mt-0.5">
                SMART ACADEMY
              </span>
            </div>
          </div>

          <h1 className="text-[11.5px] font-bold text-slate-900 tracking-tight mt-1.5 leading-snug">
            Bisa Insani Smart Academy
          </h1>
          <p className="text-[10px] font-semibold text-[#006837] leading-tight">
            PKBM Bina Insani
          </p>

          {/* Golden/Emerald Pill Motto Chip */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[9px] tracking-wide shadow-sm">
            <span>Hebat</span>
            <span className="text-[#DC2626] font-black">•</span>
            <span>Mandiri</span>
            <span className="text-[#DC2626] font-black">•</span>
            <span>Kreatif</span>
          </div>
        </div>

        {/* Right: Slogan & 3D Animated Indonesian Characters */}
        <div className="relative w-[165px] h-[140px] shrink-0">
          {/* Handwritten Dynamic Slogan (Green & Red) */}
          <div className="absolute -top-1 right-1 text-right leading-none z-20 pointer-events-none">
            <div className="font-black text-[10px] transform -rotate-3 leading-tight tracking-tight drop-shadow-sm font-sans">
              <div className="text-[#047857]">Belajar</div>
              <div className="ml-1 text-[#059669]">Berkembang</div>
              <div className="ml-2 text-[#DC2626]">Berkarya</div>
              <div className="ml-3 font-black text-[#B91C1C]">Bersama</div>
            </div>
          </div>

          {/* 3D Student Characters SVG Illustration with Keyframe Animation */}
          <svg className="w-full h-full" viewBox="0 0 165 140" fill="none">
            <defs>
              <linearGradient id="schoolRoofGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
              <linearGradient id="flagPoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
              <linearGradient id="boyJacketGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
              <linearGradient id="girlHijabGradClean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>
            </defs>

            {/* School Building & Indonesian Flag in Background */}
            <g opacity="0.9">
              {/* Roof Terracotta Red */}
              <polygon points="112,48 154,48 133,36" fill="url(#schoolRoofGradRed)" />
              {/* Wall */}
              <rect x="116" y="48" width="34" height="26" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              {/* Small windows */}
              <rect x="121" y="52" width="7" height="7" rx="1.5" fill="#34D399" />
              <rect x="138" y="52" width="7" height="7" rx="1.5" fill="#34D399" />
              {/* Lush green school garden bush */}
              <circle cx="110" cy="65" r="10" fill="#059669" />
              <circle cx="152" cy="63" r="8" fill="#047857" />

              {/* Flagpole */}
              <line x1="156" y1="26" x2="156" y2="58" stroke="url(#flagPoleGrad)" strokeWidth="1.5" />
              <circle cx="156" cy="26" r="1.5" fill="#FBBF24" />
              {/* Indonesian Flag: Sang Saka Merah Putih waving with animation */}
              <g className="animate-pulse-glow" style={{ transformOrigin: '156px 27px' }}>
                <path d="M156 27 Q161 25 166 27 L166 32 Q161 30 156 32 Z" fill="#DC2626" />
                <path d="M156 32 Q161 30 166 32 L166 37 Q161 35 156 37 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.3" />
              </g>
            </g>

            {/* Boy Student with Tablet (Left) - Gentle Float Animation */}
            <g id="boyStudent3D" className="animate-float-gentle">
              {/* Body / Emerald Green School Jacket */}
              <path
                d="M48 94 C48 76 60 72 74 72 C88 72 100 76 100 94 L100 140 L48 140 Z"
                fill="url(#boyJacketGradGreen)"
              />
              {/* White collar */}
              <polygon points="74,74 68,84 80,84" fill="#FFFFFF" />
              {/* Red tie accent */}
              <polygon points="74,80 71,94 77,94" fill="#DC2626" />
              
              {/* Black tablet with glowing green screen */}
              <rect x="58" y="88" width="23" height="30" rx="3.5" fill="#0F172A" stroke="#334155" strokeWidth="1" transform="rotate(-6 58 88)" />
              <rect x="61" y="91" width="17" height="22" rx="2" fill="#10B981" opacity="0.85" transform="rotate(-6 58 88)" />
              <circle cx="68" cy="115" r="1.5" fill="#FFFFFF" />

              {/* Head & Face */}
              <rect x="69" y="58" width="10" height="15" rx="3" fill="#FED7AA" />
              <ellipse cx="74" cy="46" rx="15" ry="17" fill="#FED7AA" />
              {/* Ears */}
              <circle cx="59" cy="46" r="3.5" fill="#FDBA74" />
              <circle cx="89" cy="46" r="3.5" fill="#FDBA74" />
              {/* Neat 3D Hair */}
              <path
                d="M59 42 C59 27 68 22 76 22 C87 22 90 28 90 40 C88 36 82 32 74 32 C66 32 62 36 59 42 Z"
                fill="#0F172A"
              />
              {/* Expressive animated eyes */}
              <ellipse cx="69" cy="44" rx="2" ry="2.4" fill="#0F172A" />
              <ellipse cx="80" cy="44" rx="2" ry="2.4" fill="#0F172A" />
              <circle cx="70" cy="43" r="0.7" fill="#FFFFFF" />
              <circle cx="81" cy="43" r="0.7" fill="#FFFFFF" />
              <path d="M67 39 C68 38 70 38 71 39" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M78 39 C79 38 81 38 82 39" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
              {/* Big friendly smile */}
              <path d="M70 51 C72 55 78 55 80 51" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Girl Student in White Hijab (Right) - Subtle Float Animation */}
            <g id="girlStudent3D" className="animate-float-subtle">
              {/* Red uniform bottom */}
              <path
                d="M92 98 C92 84 102 80 118 80 C134 80 144 84 144 98 L144 140 L92 140 Z"
                fill="#DC2626"
              />
              
              {/* Stacked Hardcover Textbooks in Hands (Emerald Green and Ruby Red) */}
              <rect x="99" y="88" width="25" height="18" rx="2.5" fill="#059669" stroke="#047857" strokeWidth="1" transform="rotate(-3 99 88)" />
              <rect x="102" y="93" width="24" height="17" rx="2.5" fill="#DC2626" stroke="#B91C1C" strokeWidth="1" transform="rotate(2 102 93)" />
              <line x1="113" y1="94" x2="113" y2="110" stroke="#FFFFFF" strokeWidth="1.2" />

              {/* White Hijab (Jilbab) Cape with soft 3D shading */}
              <path
                d="M96 74 C96 66 104 60 118 60 C132 60 140 66 140 74 C140 88 134 98 118 98 C102 98 96 88 96 74 Z"
                fill="url(#girlHijabGradClean)"
                stroke="#E2E8F0"
                strokeWidth="0.8"
              />

              {/* Face Cutout */}
              <ellipse cx="118" cy="54" rx="11" ry="13" fill="#FED7AA" />
              {/* Hijab Inner framing */}
              <path
                d="M107 50 C107 40 112 36 118 36 C124 36 129 40 129 50 C129 58 124 64 118 64 C112 64 107 58 107 50 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
              />

              {/* Expressive warm eyes & eyelashes */}
              <ellipse cx="114" cy="53" rx="1.8" ry="2.2" fill="#0F172A" />
              <ellipse cx="123" cy="53" rx="1.8" ry="2.2" fill="#0F172A" />
              <circle cx="115" cy="52" r="0.6" fill="#FFFFFF" />
              <circle cx="124" cy="52" r="0.6" fill="#FFFFFF" />
              <path d="M112 49 C113 48 115 48 116 49" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
              <path d="M121 49 C122 48 124 48 125 49" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
              
              {/* Rosy Cheeks */}
              <circle cx="112" cy="56" r="2" fill="#FCA5A5" opacity="0.8" />
              <circle cx="124" cy="56" r="2" fill="#FCA5A5" opacity="0.8" />

              {/* Warm Gentle Smile */}
              <path d="M115 58 C116 61 120 61 121 58" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>

      {/* Curved wave transition into white container */}
      <div className="absolute -bottom-0.5 left-0 right-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="w-full h-5 text-white fill-current"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C120,24 280,24 400,0 L400,24 L0,24 Z" />
        </svg>
      </div>
    </div>
  );
};

/**
 * Bottom Wave & Educational Illustration Footer:
 * - Oceanic flowing waves in Emerald Green and Ruby Red
 * - Calligraphy: "Menuju Masa Depan yang Lebih Baik"
 * - 3D Books & Pencil Holder with green sprout
 */
export const BisaBottomFooterWave: React.FC = () => {
  return (
    <div className="relative w-full h-[98px] overflow-hidden select-none mt-auto">
      {/* Background SVG wave with Green & Red gradient */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 98"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="waveGradGreenDeep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006837" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>
          <linearGradient id="waveGradRedAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Top subtle ruby red wave layer */}
        <path
          d="M0,26 C90,6 210,42 400,14 L400,98 L0,98 Z"
          fill="url(#waveGradRedAccent)"
        />

        {/* Main deep emerald green wave */}
        <path
          d="M0,35 C100,16 220,50 400,22 L400,98 L0,98 Z"
          fill="url(#waveGradGreenDeep)"
        />

        {/* Dot pattern accent on the left */}
        <g opacity="0.35" fill="#FFFFFF">
          <circle cx="18" cy="52" r="1.5" />
          <circle cx="28" cy="52" r="1.5" />
          <circle cx="38" cy="52" r="1.5" />
          <circle cx="48" cy="52" r="1.5" />

          <circle cx="18" cy="62" r="1.5" />
          <circle cx="28" cy="62" r="1.5" />
          <circle cx="38" cy="62" r="1.5" />
          <circle cx="48" cy="62" r="1.5" />

          <circle cx="18" cy="72" r="1.5" />
          <circle cx="28" cy="72" r="1.5" />
          <circle cx="38" cy="72" r="1.5" />
          <circle cx="48" cy="72" r="1.5" />

          <circle cx="18" cy="82" r="1.5" />
          <circle cx="28" cy="82" r="1.5" />
          <circle cx="38" cy="82" r="1.5" />
        </g>
      </svg>

      {/* Foreground Content: Text on Left + 3D Stacked Books & Pencil Holder on Right */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 pt-4">
        {/* Left Cursive Script */}
        <div className="max-w-[190px] text-white">
          <p className="font-serif italic text-xs text-white/95 tracking-wide leading-tight drop-shadow">
            Menuju Masa Depan
          </p>
          <div className="relative inline-block mt-0.5">
            <span className="font-serif italic text-xs font-bold text-white tracking-wide drop-shadow">
              yang Lebih Baik
            </span>
            {/* Golden yellow brush underline */}
            <svg
              className="absolute -bottom-1 left-0 w-full h-2 text-amber-400"
              viewBox="0 0 100 8"
              fill="none"
            >
              <path
                d="M2 5 C30 2 70 7 98 3"
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right 3D Books & Pencil Cup */}
        <div className="relative w-[110px] h-[75px] shrink-0">
          <svg className="w-full h-full" viewBox="0 0 110 75" fill="none">
            <defs>
              <linearGradient id="bookRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="bookGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="cupGradClean" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>

            {/* Sprouting Green Leaves behind cup */}
            <path d="M78 28 C74 18 80 12 88 16 C88 24 82 28 78 28 Z" fill="#22C55E" />
            <path d="M86 30 C94 22 102 24 100 32 C94 34 88 32 86 30 Z" fill="#16A34A" />

            {/* Stack of Books (Green & Red) */}
            {/* Bottom Red Book */}
            <g transform="translate(14, 44)">
              {/* Pages edge */}
              <polygon points="5,14 48,14 53,7 10,7" fill="#FEF2F2" />
              {/* Cover spine */}
              <polygon points="0,17 5,14 10,7 5,10" fill="#991B1B" />
              {/* Front cover */}
              <polygon points="5,10 48,10 53,7 10,7" fill="url(#bookRed)" stroke="#991B1B" strokeWidth="0.5" />
              {/* Cover thickness */}
              <rect x="0" y="14" width="48" height="3" rx="1" fill="#DC2626" />
            </g>

            {/* Top Emerald Green Book */}
            <g transform="translate(18, 33)">
              {/* Pages edge */}
              <polygon points="5,13 46,13 50,6 9,6" fill="#F0FDF4" />
              {/* Cover spine */}
              <polygon points="0,15 5,13 9,6 4,8" fill="#065F46" />
              {/* Front cover */}
              <polygon points="4,8 45,8 50,6 9,6" fill="url(#bookGreen)" stroke="#047857" strokeWidth="0.5" />
              {/* Cover thickness */}
              <rect x="0" y="12" width="46" height="3" rx="1" fill="#059669" />
            </g>

            {/* Pencil Cup */}
            <g transform="translate(68, 26)">
              {/* Pencils & Pens sticking out */}
              <rect x="6" y="-6" width="3" height="18" rx="1" fill="#DC2626" transform="rotate(-15 6 -6)" />
              <rect x="12" y="-10" width="3" height="22" rx="1" fill="#F59E0B" />
              <rect x="12" y="-10" width="3" height="4" fill="#10B981" />
              <rect x="18" y="-7" width="3" height="19" rx="1" fill="#047857" transform="rotate(12 18 -7)" />
              <rect x="22" y="-12" width="5" height="24" rx="1" fill="#D97706" transform="rotate(20 22 -12)" />

              {/* White Ceramic Cup */}
              <ellipse cx="16" cy="12" rx="12" ry="4" fill="#E2E8F0" />
              <path d="M4 12 L7 32 Q16 35 25 32 L28 12 Z" fill="url(#cupGradClean)" stroke="#CBD5E1" strokeWidth="0.5" />
              <ellipse cx="16" cy="32" rx="9" ry="2.5" fill="#94A3B8" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
