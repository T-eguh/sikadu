import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import {
  AbstractBackgroundDecor,
} from '../components/EducationalIllustrations';
import { WelcomeEducationBigHero, BottomCornerWaveDecor } from '../components/EducationHeroVisuals';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStart = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    // Smooth page exit transition before invoking onStart
    setTimeout(() => {
      onStart();
    }, 220);
  };

  return (
    <motion.div
      id="bisa-welcome-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isNavigating ? 0 : 1,
        y: isNavigating ? -8 : 0,
      }}
      transition={{
        duration: isNavigating ? 0.22 : 0.35,
        ease: 'easeOut',
      }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-hidden font-sans"
    >
      {/* Decorative Abstract Background */}
      <AbstractBackgroundDecor variant="welcome" />

      {/* Signature Bottom Corner Curves (Left Soft Red, Right Soft Green) */}
      <BottomCornerWaveDecor />

      {/* BRANDING AREA (Bagian Atas) */}
      <div className="z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {/* Logo BISA Existing (Fade Down) */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-[#168A5B]/25 flex items-center justify-center p-1 relative"
          >
            <PkbmOfficialLogo size={32} showText={false} variant="color" />
          </motion.div>

          {/* App Branding Text (Fade Up) */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.18, ease: 'easeOut' }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-[#1F2937] tracking-wider">
                BISA
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#168A5B] font-bold border border-[#168A5B]/20">
                Smart Academy
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] font-medium leading-tight mt-0.5">
              PKBM Bina Insani
            </p>
          </motion.div>
        </div>

        {/* Decorative Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="flex items-center gap-1 text-[10px] text-[#168A5B] font-bold bg-white/90 px-2.5 py-1 rounded-full border border-[#168A5B]/20 shadow-2xs"
        >
          <Sparkles size={11} className="text-[#D62828]" />
          <span>LMS Mobile</span>
        </motion.div>
      </div>

      {/* CENTER SECTION: HERO ILLUSTRATION & HEADLINE TYPOGRAPHY */}
      <div className="z-10 flex flex-col items-center text-center my-auto py-1">
        {/* HERO ILLUSTRATION BESAR DUA SISWA BELAJAR DIGITAL */}
        <div className="w-full my-0.5">
          <WelcomeEducationBigHero />
        </div>

        {/* HEADLINE BESAR: Belajar Lebih Mudah Bersama BISA (Panel 2 Style) */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.45, ease: 'easeOut' }}
          className="px-2 mt-2"
        >
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight leading-snug">
            Belajar Lebih Mudah
            <br />
            <span className="text-[#168A5B]">Bersama BISA</span>
          </h2>
        </motion.div>

        {/* DESKRIPSI (Panel 2 Reference) */}
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.6, ease: 'easeOut' }}
          className="text-xs text-[#64748B] font-normal mt-1 leading-normal max-w-[280px] mx-auto"
        >
          Platform pembelajaran digital untuk masa depan yang lebih baik.
        </motion.p>

        {/* MOTTO BADGE ("HEBAT • MANDIRI • KREATIF") */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.75, ease: 'easeOut' }}
          className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EE] border border-[#168A5B]/25 shadow-2xs"
        >
          <span className="text-[9.5px] font-black text-[#D62828] tracking-wider">
            HEBAT
          </span>
          <span className="text-[#168A5B]/40 text-xs">•</span>
          <span className="text-[9.5px] font-black text-[#168A5B] tracking-wider">
            MANDIRI
          </span>
          <span className="text-[#168A5B]/40 text-xs">•</span>
          <span className="text-[9.5px] font-black text-[#D62828] tracking-wider">
            KREATIF
          </span>
        </motion.div>
      </div>

      {/* BOTTOM SECTION: PAGING INDICATOR & PRIMARY CTA BUTTON */}
      <div className="z-10 pb-1 space-y-3">
        {/* PAGING INDICATOR (3 dots: 1 active hijau, 2 inactive light gray) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.9 }}
          className="flex items-center justify-center gap-1.5"
        >
          <div className="w-5 h-1.5 rounded-full bg-[#168A5B] shadow-2xs" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
        </motion.div>

        {/* PRIMARY CTA BUTTON: Solid Green (#168A5B) + Arrow in White Circle */}
        <motion.button
          type="button"
          onClick={handleStart}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 1.05, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-3.5 px-5 rounded-[22px] bg-[#168A5B] hover:bg-[#0F5C40] text-white font-bold text-sm shadow-lg shadow-emerald-950/15 flex items-center justify-between transition-all duration-200 group active:scale-[0.97]"
        >
          <div className="w-7" /> {/* Centering balance spacer */}
          <span className="tracking-wide font-black text-white text-center text-sm">
            Mulai
          </span>
          <div className="w-7 h-7 rounded-full bg-white text-[#168A5B] flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
            <ArrowRight size={15} strokeWidth={2.5} />
          </div>
        </motion.button>

        <p className="text-[9.5px] text-[#64748B] text-center font-medium">
          Versi 4.5 • Hebat • Mandiri • Kreatif
        </p>
      </div>
    </motion.div>
  );
};
