import React from 'react';

// Official BISA Logo SVG
export const BisaLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="bisaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="bisaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
    {/* Head / Center figure */}
    <circle cx="50" cy="24" r="9" fill="#1E3A8A" />
    {/* Left Blue Wing / Book Page */}
    <path
      d="M45 42C32 40 18 46 12 56C10 60 12 65 16 66C26 68 38 64 45 52V82C45 84 43 86 40 86C32 86 22 84 14 80C11 78.5 7 81 7 84.5C7 87.5 10 89.5 14 91C24 95 36 96 46 92C48 91 49 89.5 49 87V42H45Z"
      fill="url(#bisaBlueGrad)"
    />
    {/* Right Golden Amber Wing / Book Page */}
    <path
      d="M55 42C68 40 82 46 88 56C90 60 88 65 84 66C74 68 62 64 55 52V82C55 84 57 86 60 86C68 86 78 84 86 80C89 78.5 93 81 93 84.5C93 87.5 90 89.5 86 91C76 95 64 96 54 92C52 91 51 89.5 51 87V42H55Z"
      fill="url(#bisaGoldGrad)"
    />
  </svg>
);

// Administrator 3D Avatar (Male with suit, tie, and blue gear cog badge)
export const AdminAvatar3D: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="adminBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="adminSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="adminSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#adminBgGrad)" />
      
      {/* Body / Suit */}
      <path
        d="M20 92C20 74 34 68 50 68C66 68 80 74 80 92C80 96 76 98 70 98H30C24 98 20 96 20 92Z"
        fill="url(#adminSuitGrad)"
      />
      {/* White Shirt Collar */}
      <polygon points="50,69 40,78 60,78" fill="#FFFFFF" />
      {/* Blue Tie */}
      <polygon points="50,73 47,88 50,96 53,88" fill="#0284C7" />
      
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

    {/* Blue Cog / Gear Badge at bottom right */}
    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center text-white shadow-sm">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
  </div>
);

// Guru 3D Avatar (Female teacher with glasses, blue blazer holding book & pen)
export const TeacherAvatar3D: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="teacherBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
        <linearGradient id="teacherBlazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="teacherSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FED7AA" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#teacherBgGrad)" />
      
      {/* Body / Blazer */}
      <path
        d="M20 92C20 74 34 68 50 68C66 68 80 74 80 92C80 96 76 98 70 98H30C24 98 20 96 20 92Z"
        fill="url(#teacherBlazerGrad)"
      />
      {/* Inner top / blouse */}
      <polygon points="50,68 44,79 56,79" fill="#FFFFFF" />

      {/* Book & Pen in hands */}
      <rect x="42" y="78" width="22" height="16" rx="2" fill="#F8FAFC" stroke="#9333EA" strokeWidth="1.5" />
      <line x1="53" y1="78" x2="53" y2="94" stroke="#CBD5E1" strokeWidth="1" />
      {/* Pen */}
      <line x1="62" y1="75" x2="70" y2="85" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      
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

// Siswa 3D Avatar (Male student with yellow/teal shirt and blue backpack)
export const StudentAvatar3D: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="studentBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DCFCE7" />
          <stop offset="100%" stopColor="#BBF7D0" />
        </linearGradient>
        <linearGradient id="studentShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="studentSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#studentBgGrad)" />
      
      {/* Backpack straps */}
      <path d="M30 76C30 70 34 68 37 68" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
      <path d="M70 76C70 70 66 68 63 68" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />

      {/* Body / Shirt */}
      <path
        d="M23 92C23 76 34 70 50 70C66 70 77 76 77 92C77 96 74 98 68 98H32C26 98 23 96 23 92Z"
        fill="url(#studentShirtGrad)"
      />

      {/* Yellow Book in hand */}
      <rect x="36" y="80" width="28" height="16" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      
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

// Top Hero Illustration Header (Students, School, Indonesian Flag, Slogan)
export const BisaTopHeroBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#DCEEFF] via-[#EDF6FF] to-white pt-2 pb-5 px-4 select-none">
      {/* Subtle cloud backgrounds */}
      <div className="absolute top-2 right-12 w-24 h-12 bg-white/60 rounded-full blur-sm pointer-events-none" />
      <div className="absolute top-8 left-4 w-28 h-10 bg-white/50 rounded-full blur-sm pointer-events-none" />

      {/* Grid container with Left Brand Info & Right 3D Illustration */}
      <div className="relative z-10 flex items-start justify-between gap-1">
        {/* Left: Official BISA Identity */}
        <div className="flex-1 max-w-[195px] pt-1">
          {/* Logo row */}
          <div className="flex items-center gap-1.5">
            <BisaLogoIcon size={34} />
            <span className="text-3xl font-black tracking-tight text-[#1E3A8A]">
              BISA
            </span>
          </div>

          <h1 className="text-xs font-bold text-slate-900 tracking-tight mt-1 leading-snug">
            Bisa Insani Smart Academy
          </h1>
          <p className="text-[10.5px] font-medium text-slate-500 leading-tight">
            PKBM Bina Insani
          </p>

          {/* Golden Pill Motto Chip */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] font-bold text-[9.5px] tracking-wide shadow-sm">
            <span>Hebat</span>
            <span className="text-amber-500">•</span>
            <span>Mandiri</span>
            <span className="text-amber-500">•</span>
            <span>Kreatif</span>
          </div>
        </div>

        {/* Right: Slogan & Indonesian Student Characters */}
        <div className="relative w-[160px] h-[135px] shrink-0">
          {/* Handwritten Slogan */}
          <div className="absolute -top-1 right-2 text-right leading-none z-20">
            <div className="font-extrabold text-[10.5px] text-[#0284C7] transform -rotate-3 leading-tight tracking-tight drop-shadow-sm font-sans">
              <div>Belajar</div>
              <div className="ml-1">Berkembang</div>
              <div className="ml-2">Berkarya</div>
              <div className="ml-3 font-black text-[#0369A1]">Bersama</div>
            </div>
          </div>

          {/* 3D Student Characters SVG Illustration */}
          <svg className="w-full h-full" viewBox="0 0 160 135" fill="none">
            <defs>
              <linearGradient id="schoolRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id="flagPoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="boyJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="girlHijabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>

            {/* School Building & Flag in the Background */}
            <g opacity="0.85">
              {/* Roof */}
              <polygon points="110,48 148,48 129,38" fill="url(#schoolRoofGrad)" />
              {/* Wall */}
              <rect x="114" y="48" width="30" height="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
              {/* Small windows */}
              <rect x="118" y="52" width="6" height="6" rx="1" fill="#38BDF8" />
              <rect x="134" y="52" width="6" height="6" rx="1" fill="#38BDF8" />
              {/* Green tree bush */}
              <circle cx="108" cy="64" r="10" fill="#22C55E" />
              <circle cx="148" cy="62" r="8" fill="#16A34A" />

              {/* Flagpole */}
              <line x1="152" y1="28" x2="152" y2="58" stroke="url(#flagPoleGrad)" strokeWidth="1.5" />
              <circle cx="152" cy="28" r="1.5" fill="#FBBF24" />
              {/* Indonesian Flag: Merah Putih waving */}
              <path d="M152 29 Q157 27 162 29 L162 34 Q157 32 152 34 Z" fill="#EF4444" />
              <path d="M152 34 Q157 32 162 34 L162 39 Q157 37 152 39 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.3" />
            </g>

            {/* Boy Student (Left) */}
            <g id="boyStudent">
              {/* Body / Royal Blue School Jacket */}
              <path
                d="M48 94 C48 76 60 72 74 72 C88 72 100 76 100 94 L100 135 L48 135 Z"
                fill="url(#boyJacketGrad)"
              />
              {/* White collar */}
              <polygon points="74,74 68,84 80,84" fill="#FFFFFF" />
              <polygon points="74,80 71,94 77,94" fill="#1E40AF" />
              {/* Black tablet in hands */}
              <rect x="58" y="88" width="22" height="28" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" transform="rotate(-6 58 88)" />
              <circle cx="68" cy="112" r="1.5" fill="#64748B" />

              {/* Head & Face */}
              <rect x="69" y="58" width="10" height="15" rx="3" fill="#FED7AA" />
              <ellipse cx="74" cy="46" rx="15" ry="17" fill="#FED7AA" />
              {/* Ears */}
              <circle cx="59" cy="46" r="3.5" fill="#FDBA74" />
              <circle cx="89" cy="46" r="3.5" fill="#FDBA74" />
              {/* Short Black Spiky/Neat Hair */}
              <path
                d="M59 42 C59 27 68 22 76 22 C87 22 90 28 90 40 C88 36 82 32 74 32 C66 32 62 36 59 42 Z"
                fill="#0F172A"
              />
              {/* Eyes */}
              <ellipse cx="69" cy="44" rx="1.8" ry="2.2" fill="#0F172A" />
              <ellipse cx="80" cy="44" rx="1.8" ry="2.2" fill="#0F172A" />
              <path d="M67 39 C68 38 70 38 71 39" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M78 39 C79 38 81 38 82 39" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
              {/* Smile */}
              <path d="M70 51 C72 54 78 54 80 51" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Girl Student in White Hijab (Right) */}
            <g id="girlStudent">
              {/* Blue Uniform lower */}
              <path
                d="M92 98 C92 84 102 80 118 80 C134 80 144 84 144 98 L144 135 L92 135 Z"
                fill="#1D4ED8"
              />
              
              {/* Books in Hands (Cyan and Golden Yellow) */}
              <rect x="100" y="88" width="24" height="18" rx="2" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" transform="rotate(-3 100 88)" />
              <rect x="103" y="93" width="23" height="17" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" transform="rotate(2 103 93)" />
              <line x1="114" y1="94" x2="114" y2="109" stroke="#FFFFFF" strokeWidth="1" />

              {/* White Hijab (jilbab) Cape */}
              <path
                d="M96 74 C96 66 104 60 118 60 C132 60 140 66 140 74 C140 88 134 98 118 98 C102 98 96 88 96 74 Z"
                fill="url(#girlHijabGrad)"
                stroke="#E2E8F0"
                strokeWidth="0.8"
              />

              {/* Face Area cutout */}
              <ellipse cx="118" cy="54" rx="11" ry="13" fill="#FED7AA" />
              {/* Hijab Inner framing */}
              <path
                d="M107 50 C107 40 112 36 118 36 C124 36 129 40 129 50 C129 58 124 64 118 64 C112 64 107 58 107 50 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
              />

              {/* Eyes & Eyebrows */}
              <ellipse cx="114" cy="53" rx="1.6" ry="2" fill="#0F172A" />
              <ellipse cx="123" cy="53" rx="1.6" ry="2" fill="#0F172A" />
              <path d="M112 49 C113 48 115 48 116 49" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
              <path d="M121 49 C122 48 124 48 125 49" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
              
              {/* Soft Cheeks */}
              <circle cx="112" cy="56" r="1.8" fill="#FCA5A5" opacity="0.7" />
              <circle cx="124" cy="56" r="1.8" fill="#FCA5A5" opacity="0.7" />

              {/* Warm Gentle Smile */}
              <path d="M115 58 C116 60 120 60 121 58" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
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

// Bottom Wave & Educational Illustration Footer
export const BisaBottomFooterWave: React.FC = () => {
  return (
    <div className="relative w-full h-[98px] overflow-hidden select-none mt-auto">
      {/* Background SVG wave with rich navy gradient */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 98"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="waveGradDeep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="waveGradSubtle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Top subtle wave layer */}
        <path
          d="M0,28 C80,8 200,45 400,16 L400,98 L0,98 Z"
          fill="url(#waveGradSubtle)"
        />

        {/* Main deep blue ocean wave */}
        <path
          d="M0,36 C100,18 220,52 400,24 L400,98 L0,98 Z"
          fill="url(#waveGradDeep)"
        />

        {/* Dot pattern accent on the left */}
        <g opacity="0.3" fill="#FFFFFF">
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
              <linearGradient id="bookYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
              <linearGradient id="bookBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>

            {/* Sprouting Green Leaves behind cup */}
            <path d="M78 28 C74 18 80 12 88 16 C88 24 82 28 78 28 Z" fill="#22C55E" />
            <path d="M86 30 C94 22 102 24 100 32 C94 34 88 32 86 30 Z" fill="#16A34A" />

            {/* Stack of Books */}
            {/* Bottom Yellow Book */}
            <g transform="translate(14, 44)">
              {/* Pages edge */}
              <polygon points="5,14 48,14 53,7 10,7" fill="#FEF08A" />
              {/* Cover spine */}
              <polygon points="0,17 5,14 10,7 5,10" fill="#CA8A04" />
              {/* Front cover */}
              <polygon points="5,10 48,10 53,7 10,7" fill="url(#bookYellow)" stroke="#CA8A04" strokeWidth="0.5" />
              {/* Cover thickness */}
              <rect x="0" y="14" width="48" height="3" rx="1" fill="#EAB308" />
            </g>

            {/* Top Blue Book */}
            <g transform="translate(18, 33)">
              {/* Pages edge */}
              <polygon points="5,13 46,13 50,6 9,6" fill="#F0F9FF" />
              {/* Cover spine */}
              <polygon points="0,15 5,13 9,6 4,8" fill="#0369A1" />
              {/* Front cover */}
              <polygon points="4,8 45,8 50,6 9,6" fill="url(#bookBlue)" stroke="#0284C7" strokeWidth="0.5" />
              {/* Cover thickness */}
              <rect x="0" y="12" width="46" height="3" rx="1" fill="#0284C7" />
            </g>

            {/* Pencil Cup */}
            <g transform="translate(68, 26)">
              {/* Pencils & Pens sticking out */}
              {/* Blue pen */}
              <rect x="6" y="-6" width="3" height="18" rx="1" fill="#2563EB" transform="rotate(-15 6 -6)" />
              {/* Yellow pencil with eraser */}
              <rect x="12" y="-10" width="3" height="22" rx="1" fill="#F59E0B" />
              <rect x="12" y="-10" width="3" height="4" fill="#F43F5E" />
              {/* Green pen */}
              <rect x="18" y="-7" width="3" height="19" rx="1" fill="#10B981" transform="rotate(12 18 -7)" />
              {/* Wooden ruler */}
              <rect x="22" y="-12" width="5" height="24" rx="1" fill="#D97706" transform="rotate(20 22 -12)" />

              {/* White Ceramic Cup */}
              <ellipse cx="16" cy="12" rx="12" ry="4" fill="#E2E8F0" />
              <path d="M4 12 L7 32 Q16 35 25 32 L28 12 Z" fill="url(#cupGrad)" stroke="#CBD5E1" strokeWidth="0.5" />
              <ellipse cx="16" cy="32" rx="9" ry="2.5" fill="#94A3B8" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
