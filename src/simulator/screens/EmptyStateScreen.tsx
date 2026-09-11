import React from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { EducationEmptyStateHero, BottomCornerWaveDecor } from '../components/EducationHeroVisuals';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';

interface EmptyStateScreenProps {
  onBack: () => void;
  onGoHome: () => void;
}

export const EmptyStateScreen: React.FC<EmptyStateScreenProps> = ({
  onBack,
  onGoHome,
}) => {
  return (
    <motion.div
      id="bisa-empty-state-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none font-sans relative overflow-hidden"
    >
      {/* 1. TOP BAR (Panel 9 Style: Back Arrow Button) */}
      <div className="z-10 flex items-center justify-between pt-1">
        <motion.button
          type="button"
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-slate-200/90 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          title="Kembali"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </motion.button>

        {/* Small Logo Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
          <PkbmOfficialLogo size={16} showText={false} variant="color" />
          <span className="text-[10px] font-black text-[#1F2937]">BISA</span>
        </div>

        <div className="w-9" /> {/* Balance spacer */}
      </div>

      {/* 2. CENTER CONTENT: High Quality Education Empty State Illustration & Typography */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center text-center my-auto px-2">
        {/* High quality vector hero illustration of thoughtful student with laptop in nature */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
          className="w-full max-w-[320px] mb-2"
        >
          <EducationEmptyStateHero />
        </motion.div>

        {/* Headline: "Data tidak ditemukan" (Panel 9 Reference) */}
        <motion.h3
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
          className="text-lg sm:text-xl font-black text-[#1F2937] tracking-tight mt-1"
        >
          Data tidak ditemukan
        </motion.h3>

        {/* Description: "Maaf, data yang Anda cari belum tersedia atau belum terdaftar." */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.35, ease: 'easeOut' }}
          className="text-xs text-[#64748B] font-normal mt-2 leading-relaxed max-w-[280px] mx-auto"
        >
          Maaf, data yang Anda cari belum tersedia atau belum terdaftar.
        </motion.p>
      </div>

      {/* 3. BOTTOM CTA BUTTON: "Kembali ke Beranda" (Panel 9 Reference - Solid Green '#168A5B') */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.42, ease: 'easeOut' }}
        className="z-10 pb-2 w-full max-w-[320px] mx-auto"
      >
        <motion.button
          type="button"
          onClick={onGoHome}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#168A5B] hover:bg-[#0F5C40] text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition duration-200"
        >
          <Home size={15} />
          <span>Kembali ke Beranda</span>
        </motion.button>
      </motion.div>

      {/* Bottom Corner Waves */}
      <BottomCornerWaveDecor />
    </motion.div>
  );
};
