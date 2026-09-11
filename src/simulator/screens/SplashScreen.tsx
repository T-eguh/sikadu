import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { SplashEducationHero, BottomCornerWaveDecor } from '../components/EducationHeroVisuals';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Memuat BISA...');
  const [isExiting, setIsExiting] = useState(false);

  // Smooth real-time progress bar running from 0 to 100 over ~2.4 seconds
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds for responsive feel

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setLoadingStage('Memuat modul pembelajaran...');
      } else if (pct < 75) {
        setLoadingStage('Menyiapkan pengalaman belajarmu...');
      } else if (pct < 100) {
        setLoadingStage('Sinkronisasi data PKBM...');
      } else {
        setLoadingStage('Selamat datang di BISA!');
      }

      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 40);

    // Auto finish after 2.8 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onFinish();
      }, 300);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 150);
  };

  return (
    <motion.div
      id="bisa-active-splash-screen"
      onClick={() => {
        setIsExiting(true);
        setTimeout(() => onFinish(), 150);
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.35 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col items-center justify-between py-6 px-5 select-none relative overflow-hidden font-sans cursor-pointer"
    >
      {/* Top Skip Button */}
      <div className="w-full flex justify-end z-20">
        <button
          type="button"
          onClick={handleSkip}
          className="px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 text-[11px] font-semibold border border-slate-200/80 shadow-2xs transition flex items-center gap-1"
        >
          <span>Lewati</span>
          <span>→</span>
        </button>
      </div>
      {/* =========================================================================
          LAYER 1: BACKGROUND MODERN & GRADIENT
          ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFBFB] via-[#F7F9F8] to-[#F0F5F2] pointer-events-none" />

      {/* =========================================================================
          LAYER 2: DECORATIVE SHAPES LAYER (CLEAR VISIBLE REAL-TIME MOVEMENT)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-Left Organic Soft Red Blob: Real movement 25px - 30px loop */}
        <motion.div
          animate={{
            x: [0, 28, -12, 0],
            y: [0, 30, 8, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-br from-[#FDECEC] via-[#FCDCDC] to-[#FDECEC]/40 blur-xl opacity-90"
        />

        {/* Top-Right Organic Soft Green Blob: Real movement 25px - 30px loop */}
        <motion.div
          animate={{
            x: [0, -26, 15, 0],
            y: [0, 28, -10, 0],
            scale: [1, 1.18, 0.94, 1],
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-bl from-[#E8F5EE] via-[#D3EDE0] to-[#E8F5EE]/40 blur-xl opacity-90"
        />

        {/* Bottom-Left Organic Blob: Moving & Breathing */}
        <motion.div
          animate={{
            x: [0, 20, -8, 0],
            y: [0, -22, 10, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -bottom-14 -left-14 w-56 h-56 rounded-full bg-[#FDECEC]/85 blur-2xl"
        />

        {/* Bottom-Right Organic Green Blob */}
        <motion.div
          animate={{
            x: [0, -20, 10, 0],
            y: [0, -24, 8, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 5.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -bottom-14 -right-12 w-60 h-60 rounded-full bg-[#E8F5EE]/90 blur-2xl"
        />

        {/* Central Halo Glow directly behind Logo */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-[#E8F5EE]/80 via-white to-[#FDECEC]/80 blur-3xl opacity-80" />

        {/* SVG Decorative Outlines & Waves with visible animations */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 360 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Right Outline Circles */}
          <circle
            cx="320"
            cy="110"
            r="44"
            stroke="#168A5B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.35"
          />
          <circle
            cx="320"
            cy="110"
            r="26"
            stroke="#168A5B"
            strokeWidth="1.2"
            strokeOpacity="0.25"
          />

          {/* Top-Left Outline Circles */}
          <circle
            cx="44"
            cy="90"
            r="38"
            stroke="#D62828"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            strokeOpacity="0.3"
          />

          {/* Bottom-Left Outline Circles */}
          <circle
            cx="65"
            cy="530"
            r="52"
            stroke="#D62828"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.28"
          />
          <circle
            cx="65"
            cy="530"
            r="28"
            stroke="#168A5B"
            strokeWidth="1.2"
            strokeOpacity="0.22"
          />

          {/* Bottom-Right Concentric Ring */}
          <circle
            cx="295"
            cy="550"
            r="46"
            stroke="#168A5B"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* Soft Wave Connecting Lines */}
          <path
            d="M-20 180 C 80 140, 150 220, 250 170 C 310 140, 360 190, 400 160"
            stroke="#168A5B"
            strokeWidth="1.5"
            strokeDasharray="5 6"
            strokeOpacity="0.35"
          />
          <path
            d="M-30 450 C 70 410, 160 480, 260 430 C 320 400, 370 450, 410 420"
            stroke="#D62828"
            strokeWidth="1.5"
            strokeDasharray="5 7"
            strokeOpacity="0.3"
          />

          {/* Abstract Education Geometry: Subtle Open Book Shapes */}
          <g opacity="0.32">
            <path
              d="M36 215 C44 212, 52 212, 56 215 C60 212, 68 212, 76 215 L76 230 C68 227, 60 227, 56 230 C52 227, 44 227, 36 230 Z"
              fill="#E8F5EE"
              stroke="#168A5B"
              strokeWidth="1"
            />
            <line x1="56" y1="215" x2="56" y2="230" stroke="#168A5B" strokeWidth="1" />
          </g>

          <g opacity="0.28">
            <path
              d="M280 395 C288 392, 296 392, 300 395 C304 392, 312 392, 320 395 L320 410 C312 407, 304 407, 300 410 C296 407, 288 407, 280 410 Z"
              fill="#FDECEC"
              stroke="#D62828"
              strokeWidth="1"
            />
            <line x1="300" y1="395" x2="300" y2="410" stroke="#D62828" strokeWidth="1" />
          </g>

          {/* Abstract Graduation Cap Diamond & Tassel Geometry */}
          <g opacity="0.25">
            <polygon points="305,82 320,89 305,96 290,89" stroke="#168A5B" strokeWidth="1.2" fill="#E8F5EE" />
            <path d="M296 92 L296 98 C296 102, 314 102, 314 98 L314 92" stroke="#168A5B" strokeWidth="1" fill="none" />
          </g>

          {/* Small Decorative Floating Learning Dots */}
          <circle cx="50" cy="190" r="3.5" fill="#168A5B" fillOpacity="0.5" />
          <circle cx="95" cy="140" r="2.5" fill="#D62828" fillOpacity="0.45" />
          <circle cx="310" cy="220" r="4" fill="#D62828" fillOpacity="0.4" />
          <circle cx="270" cy="160" r="3" fill="#168A5B" fillOpacity="0.45" />
          <circle cx="70" cy="460" r="3" fill="#D62828" fillOpacity="0.4" />
          <circle cx="110" cy="510" r="4" fill="#168A5B" fillOpacity="0.4" />
          <circle cx="290" cy="480" r="3.5" fill="#168A5B" fillOpacity="0.4" />
          <circle cx="250" cy="530" r="2.5" fill="#D62828" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Top Bar Spacer */}
      <div className="h-2 w-full" />

      {/* Embedded CSS Animations for Book & Cap Floating Shapes */}
      <style>{`
        @keyframes floatBookShape {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-1.2deg);
          }
        }
        @keyframes floatCapShape {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(3deg);
          }
        }
        @keyframes floatPencilShape {
          0%, 100% {
            transform: translateY(0px) rotate(-22deg);
          }
          50% {
            transform: translateY(-5px) rotate(-15deg);
          }
        }
        @keyframes pulseGlowAura {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.06);
          }
        }
        .animate-css-book {
          animation: floatBookShape 3.4s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-css-cap {
          animation: floatCapShape 4s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-css-pencil {
          animation: floatPencilShape 2.8s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-css-glow {
          animation: pulseGlowAura 3s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* =========================================================================
          LAYER 3 & 4: HIGH-QUALITY VECTOR EDUCATIONAL ILLUSTRATION COMPOSITION IN CENTER
          Includes open book pedestal, laurel branches, graduation cap, star sparkles,
          and preserved official BISA logo with CSS floating animations.
          ========================================================================= */}
      <div className="flex flex-col items-center text-center z-10 w-full max-w-[340px] my-auto">
        <div className="relative w-full max-w-[320px] h-[175px] flex items-center justify-center mx-auto select-none">
          {/* Radial Glow Aura with CSS Pulse */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-white to-[#FDECEC] blur-xl opacity-80 pointer-events-none animate-css-glow" />

          {/* Educational Vector Graphic Layer */}
          <svg
            viewBox="0 0 320 175"
            className="w-full h-full absolute inset-0 overflow-visible pointer-events-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="splashBookPedestal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#168A5B" />
                <stop offset="100%" stopColor="#0F5C40" />
              </linearGradient>
              <linearGradient id="splashStarGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* 1. LAUREL WREATH OF EXCELLENCE */}
            <g id="laurel-wreath-vector" opacity="0.85">
              {/* Left Laurel Branch */}
              <path
                d="M92 108 C75 92, 72 65, 84 42"
                stroke="#168A5B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="80" cy="50" rx="6" ry="3.5" transform="rotate(-30 80 50)" fill="#168A5B" />
              <ellipse cx="74" cy="68" rx="6.5" ry="3.5" transform="rotate(-15 74 68)" fill="#10B981" />
              <ellipse cx="76" cy="88" rx="6.5" ry="3.5" transform="rotate(10 76 88)" fill="#168A5B" />
              <ellipse cx="85" cy="104" rx="6" ry="3.5" transform="rotate(35 85 104)" fill="#0F5C40" />

              {/* Right Laurel Branch */}
              <path
                d="M228 108 C245 92, 248 65, 236 42"
                stroke="#168A5B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="240" cy="50" rx="6" ry="3.5" transform="rotate(30 240 50)" fill="#168A5B" />
              <ellipse cx="246" cy="68" rx="6.5" ry="3.5" transform="rotate(15 246 68)" fill="#10B981" />
              <ellipse cx="244" cy="88" rx="6.5" ry="3.5" transform="rotate(-10 244 88)" fill="#168A5B" />
              <ellipse cx="235" cy="104" rx="6" ry="3.5" transform="rotate(-35 235 104)" fill="#0F5C40" />
            </g>

            {/* 2. OPEN HARDCOVER BOOK PEDESTAL (With CSS Floating Animation) */}
            <g id="pedestal-open-book-css" className="animate-css-book" transform="translate(85, 118)">
              {/* Hardcover Binding Left & Right */}
              <path d="M5 28 C 35 22, 65 22, 75 29 L 75 8 C 65 3, 35 3, 5 8 Z" fill="#0F5C40" />
              <path d="M145 28 C 115 22, 85 22, 75 29 L 75 8 C 85 3, 115 3, 145 8 Z" fill="#168A5B" />

              {/* White Open Pages Left & Right */}
              <path d="M9 25 C 36 19, 66 19, 74 26 L 74 6 C 66 1, 36 1, 9 6 Z" fill="#F8FAFC" />
              <path d="M141 25 C 114 19, 84 19, 76 26 L 76 6 C 84 1, 114 1, 141 6 Z" fill="#FFFFFF" />

              {/* Lesson Text Lines */}
              <line x1="18" y1="11" x2="60" y2="9" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="18" y1="16" x2="52" y2="14" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="90" y1="9" x2="132" y2="11" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="98" y1="14" x2="132" y2="16" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />

              {/* Red Silk Bookmark Ribbon */}
              <path d="M72 4 L72 32 L75 28 L78 32 L78 4 Z" fill="#D62828" />
            </g>

            {/* 3. GRADUATION CAP SHAPE (With CSS Floating Animation) */}
            <g id="splash-grad-cap-css" className="animate-css-cap" transform="translate(198, 18)">
              {/* Cap Diamond */}
              <polygon points="24,6 46,15 24,24 2,15" fill="#1E293B" />
              <path d="M10,18 L10,25 C10,30 38,30 38,25 L38,18" fill="#0F172A" />
              {/* Red Silk Tassel */}
              <path d="M24,16 C32,18 36,22 36,32" stroke="#D62828" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="36" cy="33" r="2.5" fill="#D62828" />
            </g>

            {/* 4. WRITING PENCIL (With CSS Floating Animation) */}
            <g id="splash-pencil-css" className="animate-css-pencil" transform="translate(74, 22)">
              <rect x="0" y="5" width="7" height="26" rx="1.5" fill="#FBBF24" />
              <rect x="0" y="0" width="7" height="5" rx="1.5" fill="#F87171" />
              <polygon points="0,31 3.5,40 7,31" fill="#FED7AA" />
              <polygon points="2,36 3.5,40 5,36" fill="#1E293B" />
            </g>

            {/* 5. GOLDEN ACADEMIC STARS */}
            <g transform="translate(56, 75)">
              <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill="url(#splashStarGold)" />
            </g>
            <g transform="translate(254, 70)">
              <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill="url(#splashStarGold)" />
            </g>

            {/* Educational Spark Dots */}
            <circle cx="95" cy="35" r="3" fill="#168A5B" opacity="0.5" />
            <circle cx="225" cy="35" r="3" fill="#D62828" opacity="0.5" />
          </svg>

          {/* Preserved Official BISA Logo Container (Subtle Staggered Reveal) */}
          <div className="relative z-10 -mt-3 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                duration: 0.7,
                delay: 0.15,
              }}
              className="relative"
            >
              {/* Elevated Card Container for Existing Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-emerald-950/15 border-2 border-[#E8F5EE] flex items-center justify-center p-2.5 relative">
                {/* Existing BISA Logo Asset Preserved Strictly */}
                <PkbmOfficialLogo size={62} showText={false} variant="color" />
              </div>

              {/* Accent Star Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 14 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D62828] text-white flex items-center justify-center shadow-md border-2 border-white"
              >
                <span className="text-[9px] font-black leading-none">★</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* SUBTLE STAGGERED REVEAL: TEXT 1 (BISA) */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.45,
            ease: 'easeOut',
          }}
          className="text-3xl font-black tracking-widest text-[#1F2937] mt-1"
        >
          BISA
        </motion.h1>

        {/* SUBTLE STAGGERED REVEAL: TEXT 2 (Bisa Insani Smart Academy) */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.75,
            ease: 'easeOut',
          }}
          className="text-xs sm:text-sm font-bold text-[#168A5B] tracking-wide mt-0.5"
        >
          Bisa Insani Smart Academy
        </motion.p>

        {/* SUBTLE STAGGERED REVEAL: TEXT 3 (PKBM Bina Insani) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 1.05,
            ease: 'easeOut',
          }}
          className="mt-0.5"
        >
          <span className="text-[11px] text-slate-500 font-semibold tracking-normal">
            PKBM Bina Insani
          </span>
        </motion.div>

        {/* SUBTLE STAGGERED REVEAL: MOTTO BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.55,
            delay: 1.35,
            type: 'spring',
            stiffness: 240,
            damping: 14,
          }}
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5EE] border border-[#168A5B]/30 text-[10px] font-black tracking-wider shadow-2xs"
        >
          <span className="text-[#D62828]">HEBAT</span>
          <span className="text-[#168A5B]/40">•</span>
          <span className="text-[#168A5B]">MANDIRI</span>
          <span className="text-[#168A5B]/40">•</span>
          <span className="text-[#D62828]">KREATIF</span>
        </motion.div>
      </div>

      {/* =========================================================================
          LAYER 5: LOADING LAYER (Progress Bar & Temporary SPLASH DEBUG ACTIVE Label)
          ========================================================================= */}
      <div className="w-full max-w-[260px] flex flex-col items-center z-10 pb-4">
        {/* Loading Stage Status Text */}
        <motion.p
          key={loadingStage}
          initial={{ opacity: 0.4, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-[11.5px] text-slate-600 font-medium mb-2 text-center tracking-tight"
        >
          {loadingStage}
        </motion.p>

        {/* Real Dynamic Progress Bar */}
        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden relative shadow-inner p-[1px] border border-slate-300/60">
          <div
            className="h-full bg-gradient-to-r from-[#168A5B] via-[#2BA468] to-[#D62828] rounded-full transition-all duration-75 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex items-center justify-between w-full mt-1.5 px-0.5">
          <span className="text-[9.5px] text-slate-400 font-medium">Digital School Ecosystem</span>
          <span className="text-[10.5px] text-slate-700 font-mono font-bold tracking-tight">
            {progress}%
          </span>
        </div>
      </div>

      {/* Signature Bottom Corner Curves (Left Soft Red, Right Soft Green) */}
      <BottomCornerWaveDecor />
    </motion.div>
  );
};
