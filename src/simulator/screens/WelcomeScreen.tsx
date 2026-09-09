import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import {
  AbstractBackgroundDecor,
  WelcomeHeroIllustration,
} from '../components/EducationalIllustrations';
import { THEME } from '../theme';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      id="bisa-welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-hidden font-sans"
    >
      {/* Background Decor (Subtle Red & Green Abstract Waves) */}
      <AbstractBackgroundDecor variant="welcome" />

      {/* 1. TOP HEADER: Existing Logo (Fade Down) & App Name (Fade Up) */}
      <div className="z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          {/* Logo Fade Down */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
            className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-[#168A5B]/20 flex items-center justify-center p-1"
          >
            <PkbmOfficialLogo size={32} showText={false} variant="color" />
          </motion.div>

          {/* App Name Fade Up */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-[#1F2937] tracking-wider">
                BISA
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E8F5EE] text-[#168A5B] font-bold">
                Smart Academy
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              PKBM Bina Insani
            </p>
          </motion.div>
        </div>

        {/* Decorative LMS Mobile Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex items-center gap-1 text-[10px] text-[#168A5B] font-bold bg-white/90 px-2.5 py-1 rounded-full border border-[#168A5B]/20 shadow-2xs"
        >
          <Sparkles size={12} className="text-[#D62828]" />
          <span>LMS Mobile</span>
        </motion.div>
      </div>

      {/* 2. CENTER SECTION: Large Educational Hero Illustration & Typography */}
      <div className="z-10 flex flex-col items-center text-center my-auto py-2">
        {/* 3 & 4. HERO ILLUSTRATION BESAR (Slide Up + Fade with Subtle Floating Animation) */}
        <motion.div
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
          className="w-full mb-3"
        >
          <WelcomeHeroIllustration />
        </motion.div>

        {/* 5. Headline Fade Up */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
        >
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight leading-tight">
            Belajar, Berkembang,
            <br />
            <span className="text-[#168A5B]">dan Berkarya Bersama.</span>
          </h2>

          <p className="text-xs text-slate-500 font-normal mt-2 leading-relaxed max-w-[280px] mx-auto">
            Platform Pembelajaran Digital PKBM Bina Insani.
          </p>
        </motion.div>

        {/* 6. Motto Pill Fade Up (Soft Red / Soft Green Background) */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.65, ease: 'easeOut' }}
          className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EE] border border-[#168A5B]/25 shadow-2xs"
        >
          <span className="text-[10px] font-black text-[#D62828] tracking-wider">
            HEBAT
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-[10px] font-black text-[#168A5B] tracking-wider">
            MANDIRI
          </span>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-[10px] font-black text-[#D62828] tracking-wider">
            KREATIF
          </span>
        </motion.div>
      </div>

      {/* 3. BOTTOM SECTION: Paging Indicator & Welcome Button */}
      <div className="z-10 pb-1 space-y-3">
        {/* PAGING INDICATOR: 3 dots (1 active red/green, 2 inactive) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="flex items-center justify-center gap-1.5"
        >
          <div className="w-5 h-1.5 rounded-full bg-[#168A5B]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
        </motion.div>

        {/* 7. WELCOME BUTTON: Wide, Rounded, Gradient MERAH -> HIJAU Halus */}
        <motion.button
          type="button"
          onClick={onStart}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.85, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-3.5 px-5 rounded-[20px] bg-gradient-to-r from-[#D62828] via-[#8B3B3B] to-[#168A5B] text-white font-bold text-sm shadow-lg shadow-red-950/15 flex items-center justify-between transition-shadow duration-200 group active:scale-[0.97]"
        >
          <div className="w-6" /> {/* Balance spacer */}
          <span className="tracking-wide font-black text-white text-center text-sm">
            Mulai
          </span>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={15} strokeWidth={2.5} className="text-white" />
          </div>
        </motion.button>

        <p className="text-[9.5px] text-slate-400 text-center font-medium">
          Versi 4.5 • Hebat • Mandiri • Kreatif
        </p>
      </div>
    </motion.div>
  );
};
