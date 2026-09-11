import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Award,
  Laptop,
  CheckCircle2,
  School,
  Pencil,
  Star,
  Users,
  Library,
  ShieldCheck,
} from 'lucide-react';

/**
 * ============================================================================
 * BISA SMART ACADEMY - UNIFIED MODERN EDUCATION HERO VISUAL SYSTEM
 * Highly polished, professional educational visuals:
 * 1. High-definition, authentic school education photography with verified CDN.
 * 2. Elegant, smooth Framer Motion floating physics for academic badges.
 * 3. Prestigious school emblems and interactive scene switcher.
 * 4. Zero messy overlapping or crude stick figures.
 * ============================================================================
 */

// ============================================================================
// 1. SPLASH SCREEN EDUCATION HERO (HARMONIOUS ACADEMIC CREST)
// ============================================================================
export const SplashEducationHero: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full max-w-[320px] flex flex-col items-center justify-center mx-auto select-none">
      {/* Soft Multi-layered Radial Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-white to-[#FDECEC] blur-2xl opacity-90 pointer-events-none" />

      {/* Floating Academic Badges around the Emblem */}
      <div className="relative w-full h-[180px] flex items-center justify-center">
        {/* Floating Top-Right: Graduation Cap */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 4, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#168A5B]/30 shadow-md text-[10px] font-bold text-[#168A5B]"
        >
          <div className="w-5 h-5 rounded-full bg-[#168A5B] flex items-center justify-center text-white shadow-2xs">
            <GraduationCap size={12} />
          </div>
          <span>Wisuda & Prestasi</span>
        </motion.div>

        {/* Floating Top-Left: Writing & Smart Study */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, -3, 0],
          }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="absolute top-3 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#D62828]/25 shadow-md text-[10px] font-bold text-[#D62828]"
        >
          <div className="w-5 h-5 rounded-full bg-[#D62828] flex items-center justify-center text-white shadow-2xs">
            <Pencil size={11} />
          </div>
          <span>Belajar Mandiri</span>
        </motion.div>

        {/* Floating Bottom-Left: Open Knowledge Book */}
        <motion.div
          animate={{
            y: [0, 5, 0],
            rotate: [0, 2, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="absolute bottom-1 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#168A5B]/30 shadow-md text-[10px] font-bold text-[#168A5B]"
        >
          <div className="w-5 h-5 rounded-full bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center border border-[#168A5B]/20">
            <BookOpen size={11} />
          </div>
          <span>Modul Resmi</span>
        </motion.div>

        {/* Floating Bottom-Right: Accreditation Star */}
        <motion.div
          animate={{
            y: [0, 5, 0],
            rotate: [0, -2, 0],
          }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute bottom-1 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-300/60 shadow-md text-[10px] font-bold text-amber-700"
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-2xs">
            <Star size={11} className="fill-white" />
          </div>
          <span>Akreditasi A</span>
        </motion.div>

        {/* Center Official Logo Card with Breathing Animation */}
        <motion.div
          animate={{
            scale: [1, 1.025, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 p-2 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-emerald-950/10"
        >
          {children}
        </motion.div>
      </div>

      {/* Institution Banner Below Logo */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-2 text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5EE] text-[#168A5B] text-[10px] font-black tracking-wider uppercase border border-[#168A5B]/20 shadow-2xs">
          <School size={11} />
          <span>PKBM BINA INSANI • SMART ACADEMY</span>
        </div>
      </motion.div>
    </div>
  );
};


// ============================================================================
// 2. WELCOME SCREEN - HERO EDUCATION COMPOSITION (V3 - GORGEOUS VECTOR ANIMATION)
// Scene: A delightful, modern, lively educational study scene.
// - Background: Soft ambient pastel aura with subtle academic formulas & sparkles.
// - Characters: Two cheerful Indonesian students (Siswa & Siswi) in crisp uniforms:
//     * Siswi (Left): Sweet friendly smile, neat hair with red ribbon, emerald cardigan,
//       holding a glowing digital tablet with live learning graph.
//     * Siswa (Right): Confident cheerful smile, emerald school tie, sling backpack,
//       waving hand and holding a hardcover textbook.
// - Centerpiece: Modern study desk, stack of colorful books (Kurikulum Merdeka), pencil.
// - Floating Props: Floating graduation toga cap with swaying golden tassel,
//   floating "A+" achievement star badge, floating inspiration lightbulb, golden sparkles.
// ============================================================================
export const WelcomeEducationBigHero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id="welcome-education-big-hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[340px] h-[225px] sm:h-[235px] mx-auto select-none my-0.5 flex flex-col items-center justify-center overflow-visible"
    >
      {/* 1. Ambient Background Pastel Aura */}
      <div className="absolute inset-x-2 inset-y-1 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-white to-[#FDECEC] blur-xl opacity-90 pointer-events-none" />

      {/* 2. Main Animated Vector Educational Stage */}
      <svg
        viewBox="0 0 360 220"
        className="w-full h-full relative z-10 drop-shadow-xs overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="welEmeraldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#168A5B" />
            <stop offset="100%" stopColor="#0F5C40" />
          </linearGradient>
          <linearGradient id="welRubyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EF5350" />
            <stop offset="100%" stopColor="#D62828" />
          </linearGradient>
          <linearGradient id="welGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="welDeskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="welTabletScreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>
        </defs>

        {/* -----------------------------------------------------------------
            A. BACKGROUND: MINIMALIST ACADEMIC SMARTBOARD & ARCH
            ----------------------------------------------------------------- */}
        <g id="classroom-decor" opacity="0.6">
          {/* Subtle curved chalk arch */}
          <path
            d="M50 170 C50 60, 310 60, 310 170"
            stroke="#168A5B"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            strokeOpacity="0.25"
            fill="none"
          />
          {/* Floating subtle formula hints */}
          <text x="68" y="76" fill="#168A5B" fontSize="9" fontWeight="bold" opacity="0.4" fontFamily="sans-serif">
            E=mc²
          </text>
          <text x="270" y="80" fill="#D62828" fontSize="9" fontWeight="bold" opacity="0.4" fontFamily="sans-serif">
            100%
          </text>
        </g>

        {/* -----------------------------------------------------------------
            B. GROUND: MODERN CLEAN STUDY PEDESTAL
            ----------------------------------------------------------------- */}
        <g id="study-pedestal">
          {/* Soft Ground Shadow */}
          <ellipse cx="180" cy="192" rx="142" ry="13" fill="#CBD5E1" opacity="0.35" />
          {/* Smooth Tabletop Base */}
          <ellipse cx="180" cy="186" rx="132" ry="9.5" fill="url(#welDeskGrad)" stroke="#CBD5E1" strokeWidth="1" />
        </g>

        {/* -----------------------------------------------------------------
            C. LEFT CHARACTER: STUDENT GIRL (SISWI CERDAS)
            ----------------------------------------------------------------- */}
        <motion.g
          id="student-girl"
          animate={{
            y: isHovered ? [0, -8, 0] : [0, -5, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Backpack straps behind shoulders */}
          <path d="M88 128 C84 140, 86 156, 92 166" stroke="#D62828" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />

          {/* Torso: BISA Emerald Cardigan Sweater over White Shirt */}
          <path
            d="M93 140 C91 116, 102 110, 118 110 C134 110, 145 116, 143 140 L139 170 L97 170 Z"
            fill="url(#welEmeraldGrad)"
          />
          {/* White Cardigan Trim & Collar */}
          <polygon points="114,110 118,124 122,110" fill="#FFFFFF" />
          {/* Cute Red Ribbon Bowtie */}
          <polygon points="113,122 118,125 113,128" fill="#D62828" />
          <polygon points="123,122 118,125 123,128" fill="#D62828" />
          <circle cx="118" cy="125" r="2" fill="#991B1B" />

          {/* Pleated Navy Skirt */}
          <path d="M97 169 L93 184 L143 184 L139 169 Z" fill="#1E293B" />
          <line x1="109" y1="169" x2="107" y2="184" stroke="#334155" strokeWidth="1" />
          <line x1="121" y1="169" x2="121" y2="184" stroke="#334155" strokeWidth="1" />
          <line x1="131" y1="169" x2="133" y2="184" stroke="#334155" strokeWidth="1" />

          {/* Clean White Sneakers with Red Sole Accent */}
          <rect x="98" y="183" width="14" height="6" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <line x1="99" y1="188" x2="111" y2="188" stroke="#D62828" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="122" y="183" width="14" height="6" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <line x1="123" y1="188" x2="135" y2="188" stroke="#D62828" strokeWidth="1.2" strokeLinecap="round" />

          {/* Head & Neck */}
          <rect x="115" y="104" width="6" height="8" rx="2" fill="#FDBA74" />
          <circle cx="118" cy="94" r="14.5" fill="#FED7AA" />

          {/* Neat Dark Bob Hair with Soft Bangs */}
          <path
            d="M103 94 C103 77, 133 77, 133 94 C133 106, 130 114, 127 116 C127 103, 125 93, 118 93 C111 93, 109 103, 109 116 C106 114, 103 106, 103 94 Z"
            fill="#1E293B"
          />
          {/* Cute Signature Red Ribbon Clip */}
          <circle cx="130" cy="86" r="3.2" fill="#D62828" />
          <circle cx="130" cy="86" r="1" fill="#FFFFFF" />

          {/* Big Sparkly Eyes */}
          <circle cx="113" cy="93.5" r="2.2" fill="#0F172A" />
          <circle cx="123" cy="93.5" r="2.2" fill="#0F172A" />
          <circle cx="113.8" cy="92.6" r="0.8" fill="#FFFFFF" />
          <circle cx="123.8" cy="92.6" r="0.8" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="108" cy="98" rx="2.8" ry="1.6" fill="#FDA4AF" opacity="0.65" />
          <ellipse cx="128" cy="98" rx="2.8" ry="1.6" fill="#FDA4AF" opacity="0.65" />

          {/* Sweet Cheerful Smile */}
          <path d="M114 100 Q 118 103.5, 122 100" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Arms: Holding Smart Tablet with Both Hands */}
          <path d="M99 126 L108 142 L116 142" stroke="url(#welEmeraldGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="116" cy="142" r="3.5" fill="#FED7AA" />
          <path d="M137 126 L128 142 L120 142" stroke="url(#welEmeraldGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="120" cy="142" r="3.5" fill="#FED7AA" />

          {/* Mini Glowing Educational Tablet in Girl's Hands */}
          <rect x="105" y="132" width="26" height="20" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
          <rect x="107" y="134" width="22" height="16" rx="2" fill="url(#welTabletScreen)" />
          {/* Animated chart line on tablet */}
          <line x1="110" y1="144" x2="114" y2="140" stroke="#168A5B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="114" y1="140" x2="118" y2="142" stroke="#168A5B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="118" y1="142" x2="124" y2="137" stroke="#168A5B" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="124" cy="137" r="1.5" fill="#D62828" />
        </motion.g>

        {/* -----------------------------------------------------------------
            D. RIGHT CHARACTER: STUDENT BOY (SISWA AKTIF)
            ----------------------------------------------------------------- */}
        <motion.g
          id="student-boy"
          animate={{
            y: isHovered ? [0, -9, 0] : [0, -6, 0],
          }}
          transition={{
            duration: 3.9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.25,
          }}
        >
          {/* Navy Sling Backpack Straps */}
          <path d="M224 126 C220 138, 222 154, 226 164" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M256 126 C260 138, 258 154, 254 164" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />

          {/* Torso: Crisp White Uniform Shirt */}
          <path
            d="M224 140 C222 116, 230 110, 246 110 C262 110, 270 116, 268 140 L264 170 L228 170 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          {/* Emerald Green School Necktie */}
          <polygon points="244,110 248,110 247,136 246,140 245,136" fill="url(#welEmeraldGrad)" />
          {/* White Shirt Collar */}
          <polygon points="241,110 246,118 243,110" fill="#F1F5F9" />
          <polygon points="251,110 246,118 249,110" fill="#F1F5F9" />

          {/* Smart Slate Trousers */}
          <path d="M228 169 L225 184 L265 184 L262 169 Z" fill="#334155" />
          <line x1="245" y1="172" x2="245" y2="184" stroke="#1E293B" strokeWidth="1.2" />

          {/* Modern Navy Sneakers with Green Accent */}
          <rect x="225" y="183" width="15" height="6" rx="3" fill="#1E293B" />
          <line x1="226" y1="188" x2="238" y2="188" stroke="#168A5B" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="249" y="183" width="15" height="6" rx="3" fill="#1E293B" />
          <line x1="250" y1="188" x2="262" y2="188" stroke="#168A5B" strokeWidth="1.2" strokeLinecap="round" />

          {/* Head & Neck */}
          <rect x="243" y="104" width="6" height="8" rx="2" fill="#FDBA74" />
          <circle cx="246" cy="94" r="14.5" fill="#FED7AA" />

          {/* Neat Modern Dark Crop Haircut */}
          <path
            d="M232 93 C230 76, 258 74, 263 86 C265 91, 263 96, 259 96 C259 87, 253 83, 246 83 C238 83, 235 87, 233 93 Z"
            fill="#0F172A"
          />

          {/* Friendly Sparkly Eyes */}
          <circle cx="241" cy="93.5" r="2.2" fill="#0F172A" />
          <circle cx="251" cy="93.5" r="2.2" fill="#0F172A" />
          <circle cx="241.8" cy="92.6" r="0.8" fill="#FFFFFF" />
          <circle cx="251.8" cy="92.6" r="0.8" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="236" cy="98" rx="2.8" ry="1.6" fill="#FDA4AF" opacity="0.6" />
          <ellipse cx="256" cy="98" rx="2.8" ry="1.6" fill="#FDA4AF" opacity="0.6" />

          {/* Broad Cheerful Smile */}
          <path d="M241 100 Q 246 104, 251 100" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Right Arm: Enthusiastic Wave / Thumbs-up */}
          <path d="M266 122 L278 114 L282 103" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="282" cy="102" r="4" fill="#FED7AA" />
          {/* Thumbs-up bump */}
          <line x1="282" y1="102" x2="284" y2="98" stroke="#FED7AA" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Arm: Holding Textbook against chest */}
          <path d="M228 122 L216 136 L210 144" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="210" cy="144" r="4" fill="#FED7AA" />

          {/* Crimson Hardcover School Textbook */}
          <g transform="translate(196, 130) rotate(-10)">
            <rect x="0" y="0" width="18" height="26" rx="3" fill="url(#welRubyGrad)" stroke="#B91C1C" strokeWidth="0.8" />
            <rect x="2" y="2" width="14" height="22" rx="1.5" fill="#FFFFFF" opacity="0.2" />
            <line x1="4" y1="6" x2="14" y2="6" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="4" y1="10" x2="12" y2="10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
            {/* Hanging ribbon bookmark */}
            <path d="M8 26 L8 31 L10 29 L12 31 L12 26 Z" fill="#FBBF24" />
          </g>
        </motion.g>

        {/* -----------------------------------------------------------------
            E. CENTER STUDY ACCESSORIES: STACK OF BOOKS & SMART SCREEN
            ----------------------------------------------------------------- */}
        <g id="center-study-props">
          {/* Stack of 3 Curriculum Books on Desk */}
          <g transform="translate(148, 154)">
            {/* Bottom Book: Emerald Green (Kurikulum Merdeka) */}
            <rect x="0" y="16" width="34" height="8" rx="2" fill="url(#welEmeraldGrad)" />
            <rect x="2" y="18" width="30" height="4" rx="1" fill="#FFFFFF" opacity="0.9" />

            {/* Middle Book: Ruby Red (Modul Interaktif) */}
            <rect x="3" y="9" width="30" height="7.5" rx="2" fill="url(#welRubyGrad)" />
            <rect x="5" y="11" width="26" height="3.5" rx="1" fill="#FFFFFF" opacity="0.9" />

            {/* Top Book: Golden Yellow (Sains & Vokasi) */}
            <rect x="6" y="2" width="26" height="7.5" rx="2" fill="url(#welGoldGrad)" />
            <rect x="8" y="4" width="22" height="3.5" rx="1" fill="#FFFFFF" opacity="0.9" />

            {/* Dangling Bookmark Ribbon */}
            <path d="M16 2 L16 23 L18 21 L20 23 L20 2 Z" fill="#D62828" />
          </g>

          {/* Yellow Study Pencil Leaning on Books */}
          <g transform="translate(140, 156) rotate(-28)">
            <rect x="0" y="4" width="5" height="20" rx="1" fill="#FBBF24" />
            <rect x="0" y="0" width="5" height="4" rx="1" fill="#F87171" />
            <polygon points="0,24 2.5,29 5,24" fill="#FED7AA" />
            <polygon points="1.5,27 2.5,29 3.5,27" fill="#1E293B" />
          </g>
        </g>

        {/* -----------------------------------------------------------------
            F. FLOATING MAGICAL ACADEMIC ELEMENTS
            ----------------------------------------------------------------- */}
        {/* 1. Floating Graduation Mortarboard (Top Center) */}
        <motion.g
          id="floating-toga-cap"
          transform="translate(162, 30)"
          animate={{
            y: [0, -8, 0],
            rotate: [-4, 4, -4],
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Shadow */}
          <ellipse cx="18" cy="28" rx="16" ry="3" fill="#CBD5E1" opacity="0.3" />
          {/* Cap Diamond Top */}
          <polygon points="18,0 36,8 18,16 0,8" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
          {/* Cap Skull Base */}
          <path d="M7,11 L7,17 C7,21 29,21 29,17 L29,11" fill="#0F172A" />
          {/* Flowing Golden Tassel */}
          <path d="M18,9 C24,11 28,15 28,23" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="24" r="2.2" fill="#F59E0B" />
          <circle cx="18" cy="8" r="1.8" fill="#FBBF24" />
        </motion.g>

        {/* 2. Floating "A+" Achievement Badge (Top-Left) */}
        <motion.g
          id="floating-badge-grade"
          transform="translate(36, 40)"
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect
            x="0"
            y="0"
            width="58"
            height="26"
            rx="13"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1.2"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"
          />
          <circle cx="14" cy="13" r="8" fill="#FEF3C7" />
          <polygon
            points="14,8 15.5,11.5 19.5,12 16.5,14.5 17.5,18.5 14,16.5 10.5,18.5 11.5,14.5 8.5,12 12.5,11.5"
            fill="#F59E0B"
          />
          <text x="29" y="17" fill="#D62828" fontSize="11" fontWeight="900" fontFamily="sans-serif">
            A+
          </text>
        </motion.g>

        {/* 3. Floating Inspiration Lightbulb (Top-Right) */}
        <motion.g
          id="floating-lightbulb"
          transform="translate(268, 36)"
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <circle cx="15" cy="15" r="16" fill="#FEF3C7" opacity="0.6" />
          <circle
            cx="15"
            cy="15"
            r="13"
            fill="#FFFFFF"
            stroke="#FDE68A"
            strokeWidth="1.2"
            filter="drop-shadow(0 3px 6px rgba(245,158,11,0.15))"
          />
          <path d="M12 12 C12 9.5 18 9.5 18 12 C18 14 16 15 16 17 L14 17 C14 15 12 14 12 12 Z" fill="#F59E0B" />
          <rect x="14" y="18" width="2" height="1.5" rx="0.5" fill="#D97706" />
          {/* Spark rays */}
          <line x1="15" y1="2" x2="15" y2="4.5" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="23" y1="6" x2="25" y2="4.5" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="7" y1="6" x2="5" y2="4.5" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>

        {/* 4. Twinkling Golden Academic Sparkles (✦) */}
        <motion.g
          transform="translate(72, 105)"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="url(#welGoldGrad)" />
        </motion.g>

        <motion.g
          transform="translate(308, 95)"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="url(#welGoldGrad)" />
        </motion.g>

        <motion.g
          transform="translate(208, 22)"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <polygon points="4,0 5.2,2.8 8,4 5.2,5.2 4,8 2.8,5.2 0,4 2.8,2.8" fill="url(#welGoldGrad)" />
        </motion.g>
      </svg>

      {/* 3. Floating Interactive Quality Badges Below Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="w-full flex items-center justify-center gap-2 mt-1 px-2"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EE] border border-[#168A5B]/25 text-[#168A5B] text-[10.5px] font-bold shadow-2xs">
          <Award size={12} className="text-[#168A5B]" />
          <span>Akreditasi B BAN-PDM</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] border border-[#D62828]/25 text-[#D62828] text-[10.5px] font-bold shadow-2xs">
          <Sparkles size={11} className="text-[#D62828]" />
          <span>Kurikulum Merdeka</span>
        </span>
      </motion.div>
    </div>
  );
};


// ============================================================================
// 3. ROLE SELECTION SCREEN - HERO SEKOLAH DIGITAL (CLEAN, MODERN & PROFESSIONAL)
// ============================================================================
export const RoleSelectionEducationHero: React.FC = () => {
  return (
    <motion.div
      initial={{ y: -8, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full max-w-[340px] h-[155px] sm:h-[165px] mx-auto mb-2 rounded-3xl overflow-hidden border border-emerald-200/70 bg-gradient-to-br from-[#E8F5EE] via-white to-[#FDECEC] shadow-md select-none flex flex-col justify-between p-3.5"
    >
      {/* Subtle Background Academic Aura & Vectors */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#E8F5EE] blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#FDECEC] blur-2xl pointer-events-none" />

      {/* Top Bar: Academic Identity & Accreditation */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#168A5B]/20 text-[#0F5C40] text-[10px] font-extrabold tracking-wide shadow-2xs">
          <School size={12} className="text-[#168A5B]" />
          <span>PKBM BINA INSANI</span>
        </div>

        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5EE] border border-[#168A5B]/30 text-[#168A5B] text-[9.5px] font-bold">
          <CheckCircle2 size={11} className="text-[#168A5B]" />
          <span>Akreditasi B</span>
        </div>
      </div>

      {/* Middle: Title & Portal Gateway */}
      <div className="relative z-10 my-auto text-left">
        <div className="flex items-center gap-1 text-[10px] font-black text-[#D62828] uppercase tracking-wider mb-0.5">
          <Sparkles size={11} />
          <span>PORTAL AKADEMIK DIGITAL</span>
        </div>
        <h4 className="text-[#0F172A] text-sm sm:text-[15px] font-black tracking-tight leading-snug">
          Pilih Peran Akun Anda
        </h4>
        <p className="text-[#64748B] text-[10.5px] font-medium leading-tight mt-0.5">
          Masuk sebagai Siswa, Tutor Guru, atau Staf Admin
        </p>
      </div>

      {/* Bottom Bar: 3 Role Quick Badges */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-[10px] font-bold text-[#168A5B] shadow-2xs">
          <GraduationCap size={12} className="text-[#168A5B]" />
          <span>Siswa</span>
        </div>
        <span className="text-slate-300 text-xs">•</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[10px] font-bold text-amber-700 shadow-2xs">
          <Users size={12} className="text-amber-600" />
          <span>Tutor Guru</span>
        </div>
        <span className="text-slate-300 text-xs">•</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-[10px] font-bold text-[#D62828] shadow-2xs">
          <ShieldCheck size={12} className="text-[#D62828]" />
          <span>Admin</span>
        </div>
      </div>
    </motion.div>
  );
};


// ============================================================================
// 4. STUDENT DASHBOARD HERO BANNER
// ============================================================================
export const StudentDashboardHeroBanner: React.FC<{
  studentName: string;
  classNameTitle?: string;
  completedModules: number;
  totalModules: number;
  learningStreak: number;
  onContinue: () => void;
}> = ({
  studentName,
  classNameTitle = 'Paket Pembelajaran',
  completedModules,
  totalModules,
  learningStreak,
  onContinue,
}) => {
  const pct = Math.min(100, Math.round((completedModules / (totalModules || 1)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full rounded-3xl bg-gradient-to-br from-[#0F5C40] via-[#168A5B] to-[#116E48] text-white p-4 shadow-lg shadow-emerald-950/20 overflow-hidden select-none"
    >
      <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[#D62828]/25 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left Side: Student Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-extrabold text-emerald-200 uppercase tracking-wider">
            <span>● Ruang Belajar Mandiri</span>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate">
              Halo, {studentName}!
            </h3>
            <p className="text-[11px] text-emerald-100 font-medium truncate mt-0.5">
              {classNameTitle}
            </p>
          </div>

          <div className="bg-black/25 rounded-2xl p-2 border border-white/10 space-y-1 max-w-[210px]">
            <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-100">
              <span>Kurikulum Tuntas</span>
              <span className="font-mono font-bold text-white">{pct}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-300 via-amber-300 to-[#EF5350] rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="bg-white/10 px-2 py-0.5 rounded-md border border-white/15 text-amber-300 font-bold flex items-center gap-1">
              🔥 {learningStreak} Hari Belajar
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md border border-white/15 text-emerald-200 font-bold">
              📚 {completedModules}/{totalModules} Modul
            </span>
          </div>
        </div>

        {/* Right Side: Clean Student Andi at Study Desk Illustration (Panel 7 Style) */}
        <div className="relative w-32 sm:w-36 h-32 sm:h-36 shrink-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              {/* Soft Aura Ring */}
              <circle cx="65" cy="65" r="54" fill="#FFFFFF" fillOpacity="0.12" />
              
              {/* Background Foliage / Plant */}
              <path d="M102 46 C96 34, 106 28, 116 34 C118 44, 110 50, 102 46 Z" fill="#34D399" opacity="0.8" />
              <path d="M112 50 C120 40, 128 44, 126 54 C120 58, 114 56, 112 50 Z" fill="#10B981" opacity="0.8" />

              {/* Modern Study Desk Surface */}
              <rect x="12" y="98" width="108" height="8" rx="4" fill="#1E293B" stroke="#334155" strokeWidth="1" />
              <line x1="24" y1="106" x2="24" y2="124" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <line x1="108" y1="106" x2="108" y2="124" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

              {/* Open Laptop on Desk */}
              <polygon points="34,98 86,98 90,104 30,104" fill="#334155" />
              <rect x="36" y="68" width="48" height="31" rx="3.5" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <rect x="38" y="70" width="44" height="27" rx="2" fill="#F8FAFC" />
              {/* Laptop Screen Content: Learning Analytics & Charts */}
              <circle cx="45" cy="77" r="3.5" fill="#168A5B" />
              <rect x="52" y="75" width="22" height="3" rx="1.5" fill="#D62828" />
              {/* Mini Bar Chart */}
              <rect x="42" y="87" width="5" height="7" rx="1" fill="#94A3B8" />
              <rect x="49" y="83" width="5" height="11" rx="1" fill="#168A5B" />
              <rect x="56" y="85" width="5" height="9" rx="1" fill="#F59E0B" />
              <rect x="63" y="81" width="5" height="13" rx="1" fill="#38BDF8" />
              <rect x="70" y="84" width="8" height="10" rx="1" fill="#10B981" />

              {/* Student Andi (Upper Body Seated behind Desk) */}
              {/* Torso in Dark Green Student Polo */}
              <path d="M48 98 C46 68, 54 62, 68 62 C82 62, 90 68, 88 98 Z" fill="#0F5C40" />
              {/* White Collar */}
              <polygon points="65,62 68,70 71,62" fill="#FFFFFF" />

              {/* Head & Neck */}
              <rect x="65" y="55" width="6" height="8" fill="#FDBA74" rx="2" />
              <circle cx="68" cy="46" r="12" fill="#FED7AA" />

              {/* Smiling Face Features */}
              <circle cx="64" cy="45" r="1.5" fill="#0F172A" />
              <circle cx="72" cy="45" r="1.5" fill="#0F172A" />
              <circle cx="64.5" cy="44.2" r="0.5" fill="#FFFFFF" />
              <circle cx="72.5" cy="44.2" r="0.5" fill="#FFFFFF" />
              <path d="M64 51 Q 68 54, 72 51" stroke="#D62828" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              {/* Cheeks */}
              <circle cx="61" cy="49" r="2" fill="#FCA5A5" opacity="0.6" />
              <circle cx="75" cy="49" r="2" fill="#FCA5A5" opacity="0.6" />

              {/* Dark Styled Hair */}
              <path d="M56 46 C54 32, 74 30, 80 38 C82 42, 80 46, 78 48 C78 40, 74 36, 68 36 C60 36, 58 40, 56 46 Z" fill="#0F172A" />

              {/* Accessories on Desk */}
              {/* Spiral Notebook Left */}
              <g transform="translate(18, 92)">
                <rect x="0" y="0" width="14" height="6" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
                <line x1="2" y1="2" x2="10" y2="2" stroke="#94A3B8" strokeWidth="0.8" />
                <line x1="2" y1="4" x2="8" y2="4" stroke="#CBD5E1" strokeWidth="0.8" />
              </g>

              {/* Coffee Mug Right */}
              <g transform="translate(94, 90)">
                <rect x="0" y="0" width="8" height="8" rx="1.5" fill="#D62828" />
                <path d="M8 2 C10 2, 10 6, 8 6" stroke="#D62828" strokeWidth="1.2" fill="none" />
              </g>

              {/* Floating Academic Star */}
              <g transform="translate(18, 26)">
                <polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 10,12 6,9 2,12 3.5,7.5 0,4.5 4.5,4.5" fill="#FBBF24" />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


// ============================================================================
// 5. TEACHER DASHBOARD HERO BANNER (Panel 6 Style - Bu Sari & Chalkboard)
// ============================================================================
export const TeacherDashboardHeroBanner: React.FC<{
  teacherName: string;
  nip: string;
  activeModulesCount: number;
  assignedClassesCount: number;
  onManageModules: () => void;
}> = ({
  teacherName,
  nip,
  activeModulesCount,
  assignedClassesCount,
  onManageModules,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#164E63] text-white p-4 shadow-lg shadow-slate-950/20 overflow-hidden select-none"
    >
      <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#168A5B]/25 blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[#D62828]/25 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">
            <span>● Ruang Guru Digital BISA</span>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate">
              {teacherName}
            </h3>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              NIP: {nip}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10">
              <span className="text-[9px] text-slate-400 block font-medium">Modul Ajar</span>
              <span className="text-xs font-black text-white">{activeModulesCount} Modul</span>
            </div>
            <div className="bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10">
              <span className="text-[9px] text-slate-400 block font-medium">Kelas Aktif</span>
              <span className="text-xs font-black text-emerald-300">{assignedClassesCount} Rombel</span>
            </div>
          </div>
        </div>

        {/* Right Side: Bu Sari with Glasses, Red Blazer, and Green Chalkboard (Panel 6) */}
        <div className="relative w-32 sm:w-36 h-32 sm:h-36 shrink-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              {/* Green Classroom Chalkboard with Wooden Border */}
              <rect x="10" y="16" width="108" height="66" rx="6" fill="#0A3D2A" stroke="#052E16" strokeWidth="2" />
              <rect x="12" y="18" width="104" height="62" rx="4" fill="#0F4C35" />
              {/* Chalk Tray */}
              <rect x="8" y="82" width="112" height="4" rx="2" fill="#78350F" />

              {/* White Chalk Formulas & Diagrams on Board */}
              <text x="18" y="34" fill="#FFFFFF" fillOpacity="0.85" fontSize="9" fontWeight="bold" fontFamily="monospace">
                a² + b² = c²
              </text>
              {/* Right Triangle Diagram */}
              <polygon points="20,44 20,64 44,64" stroke="#34D399" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="20" y="58" width="6" height="6" stroke="#34D399" strokeWidth="1" fill="none" />
              <text x="32" y="58" fill="#FDE047" fontSize="8" fontWeight="bold" fontFamily="sans-serif">c</text>

              {/* Teacher Bu Sari (Right Foreground) */}
              {/* Red Blazer Torso */}
              <g transform="translate(68, 48)">
                <path d="M6 74 C6 44, 16 36, 30 36 C44 36, 54 44, 54 74 Z" fill="#D62828" />
                {/* White Inner Blouse Collar */}
                <polygon points="26,36 30,46 34,36" fill="#FFFBEB" />
                {/* Lapels */}
                <path d="M22 36 L26 52 L16 46 Z" fill="#B91C1C" />
                <path d="M38 36 L34 52 L44 46 Z" fill="#B91C1C" />

                {/* Head & Neck */}
                <rect x="27" y="28" width="6" height="10" fill="#FDBA74" rx="2" />
                <circle cx="30" cy="20" r="13" fill="#FED7AA" />

                {/* Face: Glasses and Warm Smile */}
                <circle cx="25" cy="20" r="3.2" stroke="#1E293B" strokeWidth="1" fill="none" />
                <circle cx="35" cy="20" r="3.2" stroke="#1E293B" strokeWidth="1" fill="none" />
                <line x1="28.2" y1="20" x2="31.8" y2="20" stroke="#1E293B" strokeWidth="1" />
                <circle cx="25" cy="20" r="1.2" fill="#0F172A" />
                <circle cx="35" cy="20" r="1.2" fill="#0F172A" />
                <path d="M26 26 Q 30 29, 34 26" stroke="#991B1B" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                {/* Hair: Elegant Professional Bob with Side Part */}
                <path d="M17 20 C17 8, 43 6, 43 20 C43 14, 38 12, 30 12 C22 12, 18 14, 17 20 Z" fill="#1E293B" />
                <path d="M17 20 C16 26, 18 30, 20 32 C18 28, 17 24, 17 20 Z" fill="#1E293B" />

                {/* Right Arm Holding Pointer towards Board */}
                <line x1="16" y1="46" x2="-8" y2="24" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="-8" cy="24" r="2.5" fill="#FBBF24" />
              </g>

              {/* Desk Accessories Foreground (Left) */}
              <g transform="translate(18, 92)">
                {/* Book Stack */}
                <rect x="0" y="6" width="22" height="4" rx="1" fill="#DC2626" />
                <rect x="2" y="2" width="20" height="4" rx="1" fill="#168A5B" />
                {/* Potted Plant */}
                <polygon points="26,10 34,10 32,16 28,16" fill="#B45309" />
                <circle cx="30" cy="8" r="3.5" fill="#22C55E" />
                <circle cx="33" cy="6" r="3" fill="#16A34A" />
              </g>

              {/* Golden Star Sparkle */}
              <g transform="translate(112, 10)">
                <polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 10,12 6,9 2,12 3.5,7.5 0,4.5 4.5,4.5" fill="#F59E0B" />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


// ============================================================================
// 6. ADMINISTRATOR DASHBOARD HERO BANNER (Panel 5 Style - Campus Architecture)
// ============================================================================
export const AdminDashboardHeroBanner: React.FC<{
  adminName?: string;
  totalUsers?: number;
  totalStudents?: number;
  totalTeachers?: number;
  systemStatus: string;
}> = ({
  adminName = 'Administrator',
  totalUsers = 120,
  totalStudents,
  totalTeachers,
  systemStatus,
}) => {
  const displayStudents = totalStudents ?? Math.round(totalUsers * 0.85);
  const displayTeachers = totalTeachers ?? Math.max(4, Math.round(totalUsers * 0.15));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#164E63] text-white p-4 shadow-lg shadow-slate-950/20 overflow-hidden select-none"
    >
      <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#168A5B]/25 blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[#D62828]/25 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-[10px] font-extrabold text-sky-300 uppercase tracking-wider">
            <span>● PUSAT KENDALI AKADEMIK BISA</span>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate">
              {adminName} • PKBM Bina Insani
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Platform Manajemen Sekolah & Ekosistem Ujian Mandiri
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10">
              <span className="text-[9px] text-slate-400 block font-medium">Siswa Terdaftar</span>
              <span className="text-xs font-black text-emerald-300">{displayStudents} Siswa</span>
            </div>
            <div className="bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10">
              <span className="text-[9px] text-slate-400 block font-medium">Tenaga Pendidik</span>
              <span className="text-xs font-black text-sky-300">{displayTeachers} Guru</span>
            </div>
          </div>
        </div>

        {/* Right Side: School Campus Architecture & Admin View (Panel 5) */}
        <div className="relative w-32 sm:w-36 h-32 sm:h-36 shrink-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              {/* Soft Sky Aura */}
              <circle cx="65" cy="65" r="54" fill="#FFFFFF" fillOpacity="0.08" />

              {/* Campus Trees on Left and Right */}
              <path d="M14 88 C10 74, 24 66, 30 74 C34 84, 26 92, 14 88 Z" fill="#168A5B" opacity="0.9" />
              <path d="M106 88 C102 74, 116 66, 122 74 C126 84, 118 92, 106 88 Z" fill="#10B981" opacity="0.9" />

              {/* Modern School Administration Complex */}
              {/* Main Hall Base */}
              <rect x="26" y="44" width="78" height="66" rx="5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Modern Glass Window Grid */}
              <line x1="38" y1="58" x2="38" y2="108" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="52" y1="58" x2="52" y2="108" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="78" y1="58" x2="78" y2="108" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="92" y1="58" x2="92" y2="108" stroke="#E2E8F0" strokeWidth="3" />

              {/* Red Gable Roof */}
              <polygon points="20,44 65,22 110,44" fill="#D62828" stroke="#991B1B" strokeWidth="1" />
              {/* Clock Tower Dome */}
              <circle cx="65" cy="35" r="7" fill="#FFFFFF" stroke="#D62828" strokeWidth="1.2" />
              <line x1="65" y1="35" x2="65" y2="31" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
              <line x1="65" y1="35" x2="68" y2="35" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />

              {/* Central Indonesian Flag Flying */}
              <line x1="65" y1="22" x2="65" y2="10" stroke="#94A3B8" strokeWidth="1.8" />
              <rect x="65" y="10" width="14" height="4.5" fill="#D62828" />
              <rect x="65" y="14.5" width="14" height="4.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.4" />

              {/* Arched Green Portal */}
              <path d="M56 110 L56 82 C56 76, 74 76, 74 82 L74 110 Z" fill="#168A5B" />

              {/* Floating Shield & System Indicator */}
              <g transform="translate(10, 18)">
                <circle cx="11" cy="11" r="10" fill="#FDECEC" stroke="#FECDD3" strokeWidth="1.2" />
                <path d="M11 4 L16 7 L16 12 C16 15.5, 11 17.5, 11 17.5 C11 17.5, 6 15.5, 6 12 L6 7 Z" fill="#D62828" />
              </g>
              <circle cx="65" cy="6" r="3" fill="#10B981" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


// ============================================================================
// 7. DETAIL MODUL HERO VISUAL (Panel 8 Style - Study Desk with Laptop & Charts)
// ============================================================================
export const ModuleDetailHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] h-[155px] mx-auto rounded-2xl bg-gradient-to-br from-[#E8F5EE]/90 via-white to-[#FDECEC]/80 border border-slate-200/90 shadow-xs flex items-center justify-center select-none overflow-hidden my-2">
      <svg
        viewBox="0 0 340 150"
        className="w-full h-full drop-shadow-xs overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="modLaptopBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="modScreenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Ambient Leaves Backdrop */}
        <path d="M40 70 C30 50, 50 40, 60 50 C65 65, 55 75, 40 70 Z" fill="#10B981" opacity="0.3" />
        <path d="M290 60 C305 45, 315 60, 305 75 C295 85, 280 75, 290 60 Z" fill="#34D399" opacity="0.35" />

        {/* Modern Study Desk Surface */}
        <rect x="25" y="112" width="290" height="12" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="50" y1="124" x2="50" y2="148" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="290" y1="124" x2="290" y2="148" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />

        {/* Central Large Open Laptop */}
        <g transform="translate(105, 32)">
          {/* Base */}
          <polygon points="12,80 118,80 128,88 2,88" fill="url(#modLaptopBase)" />
          {/* Screen Casing */}
          <rect x="18" y="14" width="94" height="66" rx="6" fill="url(#modScreenGrad)" stroke="#334155" strokeWidth="1.5" />
          <rect x="22" y="18" width="86" height="58" rx="4" fill="#F8FAFC" />

          {/* Screen Content: Math Charts, Graphs & Lesson Curves */}
          <circle cx="32" cy="28" r="4.5" fill="#168A5B" />
          <rect x="42" y="25" width="40" height="4" rx="2" fill="#D62828" />
          <rect x="42" y="32" width="25" height="3" rx="1.5" fill="#94A3B8" />

          {/* Line Chart Wave */}
          <path d="M30 58 Q 50 42, 65 52 T 100 44" stroke="#168A5B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="65" cy="52" r="3" fill="#D62828" />
          <circle cx="100" cy="44" r="3" fill="#168A5B" />

          {/* Progress bar on laptop */}
          <rect x="30" y="66" width="70" height="4" rx="2" fill="#E2E8F0" />
          <rect x="30" y="66" width="45" height="4" rx="2" fill="#168A5B" />
        </g>

        {/* Stack of Textbooks Left */}
        <g transform="translate(42, 82)">
          {/* Bottom Red Book */}
          <rect x="0" y="18" width="48" height="12" rx="2" fill="#D62828" stroke="#B91C1C" strokeWidth="0.8" />
          <line x1="6" y1="24" x2="42" y2="24" stroke="#FECDD3" strokeWidth="1.5" />
          {/* Top Emerald Green Book */}
          <rect x="4" y="8" width="42" height="10" rx="2" fill="#168A5B" stroke="#0F5C40" strokeWidth="0.8" />
          <line x1="10" y1="13" x2="38" y2="13" stroke="#A7F3D0" strokeWidth="1.5" />
          {/* Bookmark Ribbon */}
          <path d="M34 8 L34 26 L37 23 L40 26 L40 8 Z" fill="#F59E0B" />
        </g>

        {/* Stationery Cup & Open Workbook Right */}
        <g transform="translate(245, 80)">
          {/* Open Notebook */}
          <rect x="18" y="12" width="34" height="20" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="22" y1="18" x2="48" y2="18" stroke="#94A3B8" strokeWidth="1" />
          <line x1="22" y1="24" x2="44" y2="24" stroke="#CBD5E1" strokeWidth="1" />

          {/* Ceramic Cup */}
          <rect x="0" y="8" width="14" height="24" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          {/* Pens */}
          <line x1="4" y1="-2" x2="4" y2="12" stroke="#D62828" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="-5" x2="8" y2="12" stroke="#168A5B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="11" y1="0" x2="11" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Academic Cap Badge Top Left */}
        <g transform="translate(52, 22)">
          <polygon points="16,3 30,9 16,15 2,9" fill="#1E293B" />
          <path d="M8,11 L8,15 C8,19 24,19 24,15 L24,11" fill="#0F172A" />
          <path d="M16,9 C20,10 24,13 24,18" stroke="#D62828" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="19" r="1.8" fill="#D62828" />
        </g>

        {/* Golden Star Sparkle Top Right */}
        <g transform="translate(268, 26)">
          <polygon points="7,0 9,5 14,5 10,8 12,14 7,10 2,14 4,8 0,5 5,5" fill="#FBBF24" />
        </g>
      </svg>
    </div>
  );
};


// ============================================================================
// 8. EDUCATION EMPTY STATE HERO (Panel 9 Style - Student Sitting in Nature)
// ============================================================================
export const EducationEmptyStateHero: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] h-[190px] mx-auto flex items-center justify-center select-none my-2">
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#E8F5EE] via-white to-[#FDECEC] blur-xl opacity-90 pointer-events-none" />
      <svg
        viewBox="0 0 320 190"
        className="w-full h-full relative z-10 drop-shadow-xs overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="emptyGrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#168A5B" />
          </linearGradient>
          <linearGradient id="emptyStudentJacket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#168A5B" />
            <stop offset="100%" stopColor="#0F5C40" />
          </linearGradient>
        </defs>

        {/* Soft Hill Ground */}
        <path d="M20 165 Q 160 135, 300 165 L 300 185 L 20 185 Z" fill="url(#emptyGrass)" opacity="0.85" />

        {/* Nature Foliage & Trees in Background */}
        <circle cx="80" cy="115" r="32" fill="#10B981" opacity="0.6" />
        <circle cx="105" cy="100" r="26" fill="#168A5B" opacity="0.7" />
        <circle cx="235" cy="110" r="30" fill="#34D399" opacity="0.6" />
        <circle cx="255" cy="120" r="24" fill="#059669" opacity="0.6" />

        {/* Soft Clouds Floating */}
        <g opacity="0.75">
          <path d="M50 48 Q 58 40, 70 42 Q 80 36, 92 44 Q 102 44, 105 52 L 45 52 Z" fill="#F1F5F9" />
          <path d="M220 38 Q 228 30, 240 32 Q 250 26, 262 34 Q 272 34, 275 42 L 215 42 Z" fill="#F1F5F9" />
        </g>

        {/* Student Sitting on Grass with Laptop on Lap */}
        <g transform="translate(130, 80)">
          {/* Seated Jeans / Trousers */}
          <path d="M20 54 Q 30 68, 55 64 Q 60 56, 45 52 Z" fill="#1E293B" />
          <path d="M10 54 Q 5 68, 25 68 Q 30 60, 20 54 Z" fill="#334155" />
          {/* White Sneakers */}
          <rect x="52" y="60" width="16" height="7" rx="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
          <line x1="54" y1="64" x2="66" y2="64" stroke="#D62828" strokeWidth="1.5" />

          {/* Student Torso */}
          <path d="M12 54 C10 32, 18 26, 32 26 C46 26, 52 32, 48 54 Z" fill="url(#emptyStudentJacket)" />
          <polygon points="29,26 32,32 35,26" fill="#FFFFFF" />

          {/* Head & Neck */}
          <rect x="30" y="19" width="4" height="8" fill="#FDBA74" rx="1" />
          <circle cx="32" cy="12" r="10" fill="#FED7AA" />

          {/* Face: Thoughtful Expression */}
          <circle cx="30" cy="11" r="1.2" fill="#0F172A" />
          <circle cx="36" cy="11" r="1.2" fill="#0F172A" />
          <path d="M30 16 Q 33 18, 36 16" stroke="#B91C1C" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Dark Hair */}
          <path d="M22 12 C20 0, 40 -2, 44 6 C45 9, 44 12, 42 14 C42 8, 38 4, 32 4 C26 4, 24 8, 22 12 Z" fill="#0F172A" />

          {/* Arms holding Laptop on Lap */}
          <path d="M16 36 L24 46 L36 46" stroke="url(#emptyStudentJacket)" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Laptop open on lap */}
          <g transform="translate(24, 36)">
            {/* Screen */}
            <rect x="6" y="0" width="26" height="16" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <rect x="8" y="2" width="22" height="12" rx="1" fill="#F8FAFC" />
            <circle cx="14" cy="7" r="2" fill="#168A5B" />
            <rect x="18" y="6" width="8" height="2" rx="1" fill="#D62828" />
            {/* Keyboard base */}
            <polygon points="2,16 36,16 40,20 -2,20" fill="#475569" />
          </g>
        </g>

        {/* Floating Gentle Leaves */}
        <g transform="translate(65, 140)">
          <path d="M0 0 C6 -6, 14 -4, 14 4 C6 10, 0 6, 0 0 Z" fill="#10B981" />
        </g>
        <g transform="translate(245, 135)">
          <path d="M0 0 C-6 -6, -14 -4, -14 4 C-6 10, 0 6, 0 0 Z" fill="#34D399" />
        </g>
      </svg>
    </div>
  );
};


// ============================================================================
// 9. BOTTOM CORNER WAVE DECOR (Unified Design Reference Across All Screens)
// Signature soft organic curves: Left corner Soft Red, Right corner Soft Green
// ============================================================================
export const BottomCornerWaveDecor: React.FC = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden select-none z-0 h-16 w-full">
      <svg
        viewBox="0 0 360 64"
        className="w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveSoftRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDECEC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="waveSoftGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8F5EE" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Bottom-Left Soft Red Organic Curve */}
        <path
          d="M0 64 L0 26 C45 22, 95 38, 125 64 Z"
          fill="url(#waveSoftRed)"
        />

        {/* Bottom-Right Soft Green Organic Curve */}
        <path
          d="M360 64 L360 20 C310 16, 255 36, 220 64 Z"
          fill="url(#waveSoftGreen)"
        />
      </svg>
    </div>
  );
};

