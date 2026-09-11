import React from 'react';
import { motion } from 'motion/react';

/**
 * Modern Educational Mobile App Illustrations & Background Decorations
 * Harmonized strictly in Primary Red (#D62828 / #EF5350) & Primary Green (#168A5B / #36A269)
 * With Soft Red (#FDECEC) and Soft Green (#E8F5EE).
 */

// Soft Abstract Background Shapes (Floating waves, subtle rounded blobs)
export const AbstractBackgroundDecor: React.FC<{ variant?: 'welcome' | 'light' | 'student' }> = ({
  variant = 'light',
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Top Right Subtle Green Glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          x: [0, 6, 0],
          y: [0, -4, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-[#E8F5EE] blur-3xl opacity-80"
      />
      {/* Top Left Soft Red Tint */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          x: [0, -6, 0],
          y: [0, 6, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#FDECEC] blur-3xl opacity-75"
      />
      {/* Bottom Center Subtle Green Glow */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-36 rounded-full bg-[#E8F5EE]/60 blur-3xl" />

      {/* Decorative Organic Vector Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        viewBox="0 0 360 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-40 120 C 60 80, 140 160, 240 110 C 310 70, 370 120, 420 100"
          stroke="#168A5B"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.3"
        />
        <path
          d="M-20 480 C 80 440, 160 520, 260 470 C 330 430, 390 480, 440 450"
          stroke="#D62828"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          strokeOpacity="0.25"
        />
        {/* Subtle geometric particles */}
        <circle cx="45" cy="180" r="3" fill="#168A5B" fillOpacity="0.25" />
        <circle cx="310" cy="220" r="2.5" fill="#D62828" fillOpacity="0.25" />
        <circle cx="60" cy="420" r="2" fill="#D62828" fillOpacity="0.25" />
        <circle cx="290" cy="510" r="3.5" fill="#168A5B" fillOpacity="0.2" />
      </svg>
    </div>
  );
};

// Halaman 2: Welcome Screen Hero Illustration (Large, Central Visual, Education, Student, Tablet, Books, School)
export const WelcomeHeroIllustration: React.FC = () => {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className="relative w-full max-w-[310px] h-[220px] mx-auto flex items-center justify-center select-none"
    >
      {/* Layered Backdrop Glow */}
      <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-white to-[#FDECEC] shadow-inner opacity-90" />

      <svg
        viewBox="0 0 340 240"
        className="w-full h-full relative z-10 drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="welGreenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#168A5B" />
            <stop offset="100%" stopColor="#0F5C40" />
          </linearGradient>
          <linearGradient id="welRedGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D62828" />
            <stop offset="100%" stopColor="#EF5350" />
          </linearGradient>
          <linearGradient id="tabletScreenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7F9F8" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* 1. School Building Background Silhouette (Subtle & Elegant) */}
        <g opacity="0.45">
          <path d="M70 140 L70 105 L95 90 L120 105 L120 140 Z" fill="#E8F5EE" stroke="#168A5B" strokeWidth="1" />
          {/* Bell tower / small dome */}
          <rect x="91" y="78" width="8" height="12" fill="#168A5B" opacity="0.6" rx="2" />
          <path d="M89 78 L95 70 L101 78 Z" fill="#D62828" />
          {/* School windows */}
          <rect x="78" y="112" width="6" height="8" rx="1" fill="#168A5B" opacity="0.5" />
          <rect x="88" y="112" width="6" height="8" rx="1" fill="#168A5B" opacity="0.5" />
          <rect x="105" y="112" width="6" height="8" rx="1" fill="#168A5B" opacity="0.5" />
        </g>

        {/* 2. Central Large Education Tablet / Smart Screen */}
        <rect x="105" y="32" width="130" height="170" rx="20" fill="#1F2937" />
        <rect x="110" y="37" width="120" height="160" rx="16" fill="url(#tabletScreenGrad)" />

        {/* Tablet Camera */}
        <circle cx="170" cy="44" r="2.5" fill="#9CA3AF" />

        {/* Tablet App Header with BISA Brand */}
        <rect x="118" y="52" width="104" height="28" rx="8" fill="#E8F5EE" />
        <circle cx="132" cy="66" r="6" fill="#168A5B" />
        <rect x="144" y="61" width="46" height="4.5" rx="2.2" fill="#168A5B" />
        <rect x="144" y="69" width="30" height="3.5" rx="1.7" fill="#64748B" />

        {/* Learning Video / Module Card on Tablet */}
        <rect x="118" y="86" width="104" height="48" rx="9" fill="#FDECEC" stroke="#FECDD3" strokeWidth="0.8" />
        {/* Play button circle */}
        <circle cx="170" cy="110" r="12" fill="#D62828" />
        <polygon points="167,104 176,110 167,116" fill="#FFFFFF" />

        {/* Live Learning Wave Lines */}
        <path d="M126 122 Q 134 116, 142 122 T 158 122" stroke="#D62828" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* Student Progress Bar on Tablet */}
        <rect x="118" y="142" width="104" height="6" rx="3" fill="#E5E7EB" />
        <rect x="118" y="142" width="70" height="6" rx="3" fill="#168A5B" />
        <rect x="118" y="154" width="55" height="4" rx="2" fill="#64748B" opacity="0.7" />

        {/* Tablet Home Bar */}
        <rect x="150" y="190" width="40" height="3" rx="1.5" fill="#9CA3AF" />

        {/* 3. Flying Graduation Mortarboard / Toga Cap (Top-Right) */}
        <g>
          {/* Diamond top */}
          <polygon points="255,42 278,51 255,60 232,51" fill="#1F2937" />
          {/* Cap skull base */}
          <path d="M242 55 L242 66 C242 72, 268 72, 268 66 L268 55 Z" fill="#111827" />
          {/* Red Tassel */}
          <path d="M255 51 C264 54, 274 58, 274 72" stroke="#D62828" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="274" cy="74" r="2.5" fill="#D62828" />
        </g>

        {/* 4. Left Side: Stack of Educational Books with Red Ribbon */}
        <g>
          {/* Bottom Green Book */}
          <rect x="42" y="152" width="65" height="15" rx="3" fill="url(#welGreenGrad)" />
          <path d="M46 154 L103 154 L103 165 L46 165 Z" fill="#FFFFFF" />
          {/* Middle Light Green Book */}
          <rect x="46" y="137" width="58" height="15" rx="3" fill="#36A269" />
          <path d="M50 139 L100 139 L100 150 L50 150 Z" fill="#FFFFFF" />
          {/* Top Red Book with Bookmark */}
          <rect x="52" y="122" width="50" height="15" rx="3" fill="url(#welRedGrad)" />
          <path d="M55 124 L98 124 L98 135 L55 135 Z" fill="#FFFFFF" />
          {/* Red Ribbon Bookmark Hanging */}
          <path d="M72 122 L72 142 L76 138 L80 142 L80 122 Z" fill="#D62828" />
        </g>

        {/* 5. Right Side: Diligent Student Character Illustration */}
        <g>
          {/* Student Body (Green Campus Hoodie) */}
          <path d="M228 178 C228 162, 240 152, 256 152 C272 152, 284 162, 284 178 Z" fill="#168A5B" />
          <path d="M250 152 L256 166 L262 152 Z" fill="#FFFFFF" />
          {/* Student Head / Face */}
          <circle cx="256" cy="136" r="14" fill="#FBBF24" opacity="0.3" />
          <circle cx="256" cy="136" r="12" fill="#FDE047" opacity="0.6" />
          <circle cx="256" cy="135" r="11" fill="#FED7AA" />
          {/* Student Hair (Dark, tidy) */}
          <path d="M245 132 C245 124, 267 122, 267 132 C267 127, 263 123, 256 123 C249 123, 245 127, 245 132 Z" fill="#1F2937" />
          {/* Eyeglasses */}
          <circle cx="252" cy="134" r="3.2" stroke="#1F2937" strokeWidth="1" fill="none" />
          <circle cx="260" cy="134" r="3.2" stroke="#1F2937" strokeWidth="1" fill="none" />
          <line x1="255.2" y1="134" x2="256.8" y2="134" stroke="#1F2937" strokeWidth="1" />
          {/* Friendly Smile */}
          <path d="M253 140 Q 256 143, 259 140" stroke="#D62828" strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Raised Thumb / Hand waving */}
          <circle cx="282" cy="162" r="4.5" fill="#FED7AA" />
        </g>

        {/* 6. Floating Sparkles and Achievement Badges */}
        <g>
          {/* Gold / Red Star */}
          <path d="M68 66 L70 71 L75 72 L71 75 L72 80 L68 77 L64 80 L65 75 L61 72 L66 71 Z" fill="#D62828" opacity="0.9" />
          {/* Green Sparkle */}
          <circle cx="288" cy="100" r="3" fill="#168A5B" opacity="0.7" />
          <circle cx="48" cy="106" r="2.5" fill="#36A269" opacity="0.6" />
        </g>
      </svg>
    </motion.div>
  );
};

// Halaman 4: Digital Learning Student Login Illustration
export const StudentLoginIllustration: React.FC = () => {
  return (
    <motion.div
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className="relative w-full max-w-[240px] h-[160px] mx-auto flex items-center justify-center select-none"
    >
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-white to-[#FDECEC] shadow-inner opacity-80" />

      <svg
        viewBox="0 0 240 160"
        className="w-full h-full relative z-10 drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="loginGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#168A5B" />
            <stop offset="100%" stopColor="#0F5C40" />
          </linearGradient>
          <linearGradient id="loginRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D62828" />
            <stop offset="100%" stopColor="#EF5350" />
          </linearGradient>
        </defs>

        {/* Central Shield / Key Card */}
        <rect x="75" y="24" width="90" height="112" rx="18" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
        {/* Card Header */}
        <rect x="83" y="32" width="74" height="22" rx="6" fill="#E8F5EE" />
        <circle cx="94" cy="43" r="4.5" fill="#168A5B" />
        <rect x="104" y="41" width="34" height="4" rx="2" fill="#168A5B" />

        {/* Google Authentication Circle inside Card */}
        <circle cx="120" cy="78" r="18" fill="#FDECEC" stroke="#FECDD3" strokeWidth="1" />
        {/* Google 'G' Styled Graphic */}
        <path
          d="M126 78 C126 82.5 122.5 86 118 86 C113.5 86 110 82.5 110 78 C110 73.5 113.5 70 118 70 C120.2 70 122.2 70.8 123.6 72.2 L121.2 74.4 C120.4 73.6 119.3 73.2 118 73.2 C115.4 73.2 113.2 75.3 113.2 78 C113.2 80.7 115.4 82.8 118 82.8 C120.6 82.8 122.2 81.2 122.5 79.4 L118 79.4 L118 76.6 L125.8 76.6 C125.9 77.1 126 77.5 126 78 Z"
          fill="#D62828"
        />

        {/* Secure Student Badge at bottom of Card */}
        <rect x="88" y="106" width="64" height="18" rx="9" fill="#168A5B" />
        <circle cx="98" cy="115" r="3.5" fill="#FFFFFF" />
        <rect x="106" y="113" width="36" height="4" rx="2" fill="#FFFFFF" />

        {/* Floating Book on Left */}
        <rect x="30" y="80" width="36" height="28" rx="4" fill="url(#loginGreen)" />
        <path d="M33 83 L63 83 L63 105 L33 105 Z" fill="#FFFFFF" />
        <line x1="36" y1="88" x2="58" y2="88" stroke="#168A5B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="36" y1="94" x2="52" y2="94" stroke="#168A5B" strokeWidth="1.2" strokeLinecap="round" />

        {/* Floating Mortarboard on Right */}
        <polygon points="195,46 212,53 195,60 178,53" fill="#1F2937" />
        <path d="M185 57 L185 66 C185 71, 205 71, 205 66 L205 57 Z" fill="#111827" />
        <path d="M195 53 C202 55, 208 58, 208 68" stroke="#D62828" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  );
};

// Halaman 7: Animated Checkmark Hijau with Confetti Particles
export const AnimatedCheckmarkGreen: React.FC = () => {
  // Confetti particles configuration (Primary Red, Primary Green, Soft Gold)
  const confettiPieces = [
    { x: -52, y: -45, color: '#168A5B', size: 8, delay: 0.1, rotate: 25 },
    { x: 48, y: -48, color: '#D62828', size: 9, delay: 0.15, rotate: -30 },
    { x: -62, y: 15, color: '#D62828', size: 7, delay: 0.2, rotate: 45 },
    { x: 58, y: 12, color: '#36A269', size: 8, delay: 0.25, rotate: -15 },
    { x: -38, y: -65, color: '#F59E0B', size: 6, delay: 0.18, rotate: 60 },
    { x: 34, y: -60, color: '#168A5B', size: 7, delay: 0.22, rotate: -40 },
    { x: -25, y: 55, color: '#EF5350', size: 6, delay: 0.28, rotate: 10 },
    { x: 28, y: 52, color: '#168A5B', size: 7, delay: 0.3, rotate: -20 },
  ];

  return (
    <div className="relative flex items-center justify-center select-none py-2">
      {/* Confetti Particles with brief burst animation */}
      {confettiPieces.map((piece, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0.9, 0],
            scale: [0, 1.2, 1, 0.6],
            x: piece.x,
            y: piece.y,
            rotate: piece.rotate + 180,
          }}
          transition={{
            duration: 1.2,
            delay: piece.delay,
            ease: 'easeOut',
          }}
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size * 0.75,
            borderRadius: piece.size > 7 ? '2px' : '999px',
          }}
          className="absolute z-0 pointer-events-none"
        />
      ))}

      {/* Outer Soft Green Glow Ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.7] }}
        transition={{
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.5 },
        }}
        className="absolute w-28 h-28 rounded-full bg-[#E8F5EE] blur-md z-0"
      />

      {/* Main Circle with Spring Scale (Circle Scale 0 -> 1) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 18,
          delay: 0.05,
        }}
        className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#168A5B] to-[#36A269] flex items-center justify-center shadow-lg shadow-[#168A5B]/30 border-4 border-white"
      >
        {/* Animated Checkmark SVG with path drawing & scale */}
        <svg
          viewBox="0 0 48 48"
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M14 24 L22 32 L34 16"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.25,
              ease: 'easeOut',
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

