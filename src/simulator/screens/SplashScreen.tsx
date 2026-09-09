import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { THEME } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth, real progress animation 0% -> 100% over 2000ms
    const interval = 25; // update every 25ms
    const stepIncrement = 100 / (1800 / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onFinish();
          }, 250);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <motion.div
      id="bisa-splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col items-center justify-between py-10 px-6 select-none relative overflow-hidden font-sans"
    >
      {/* STEP 2: Decorative Abstract Wave Shapes (Slide + Fade) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Soft Red Blob Top-Left */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            x: [0, 8, 0],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-[#FDECEC] blur-3xl opacity-80"
        />

        {/* Soft Green Blob Bottom-Right */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -10, 0],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full bg-[#E8F5EE] blur-3xl opacity-85"
        />

        {/* Bottom Left Subtle Decorative Shape */}
        <div className="absolute bottom-10 left-6 w-20 h-20 rounded-3xl bg-[#FDECEC]/60 blur-xl pointer-events-none" />

        {/* Bottom Right Subtle Decorative Shape */}
        <div className="absolute bottom-12 right-8 w-24 h-24 rounded-full bg-[#E8F5EE]/70 blur-xl pointer-events-none" />

        {/* Behind Logo Gentle Halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-[#E8F5EE] to-[#FDECEC] blur-2xl opacity-60" />

        {/* Floating Geometric Particle Accents */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-8 w-4 h-4 rounded-full border-2 border-[#168A5B]/30"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 left-8 w-3.5 h-3.5 rounded-full border-2 border-[#D62828]/30"
        />
      </motion.div>

      {/* Spacer */}
      <div />

      {/* Center Branding Presentation */}
      <div className="flex flex-col items-center text-center z-10 w-full max-w-[280px]">
        {/* STEP 3: Existing BISA Logo with Natural Spring (Scale 0.7 -> 1, Opacity 0 -> 1) */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 18,
            delay: 0.25,
          }}
          className="relative mb-4"
        >
          <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-emerald-950/10 border-2 border-[#E8F5EE] flex items-center justify-center p-2.5">
            {/* Existing Official Logo Preserved */}
            <PkbmOfficialLogo size={72} showText={false} variant="color" />
          </div>

          {/* Subtle Primary Red Badge Accent */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.55, type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#D62828] text-white flex items-center justify-center shadow-md border-2 border-white"
          >
            <span className="text-[10px] font-black leading-none">★</span>
          </motion.div>
        </motion.div>

        {/* STEP 4: BISA Name Fade Up (delay after logo) */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
          className="text-3xl font-black tracking-wider text-[#1F2937]"
        >
          BISA
        </motion.h1>

        {/* STEP 5: Subtitle & Institution Fade Up */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.75, ease: 'easeOut' }}
          className="mt-1"
        >
          <p className="text-xs font-bold text-[#168A5B] tracking-wide">
            Bisa Insani Smart Academy
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EE] border border-[#168A5B]/20 text-[11px] text-[#168A5B] font-bold mt-2">
            <span>PKBM Bina Insani</span>
          </div>
        </motion.div>

        {/* STEP 6: Motto Fade Up */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.95, ease: 'easeOut' }}
          className="mt-3.5 flex items-center gap-2 text-[10.5px] font-black tracking-wider"
        >
          <span className="text-[#D62828]">HEBAT</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#168A5B]">MANDIRI</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#D62828]">KREATIF</span>
        </motion.div>
      </div>

      {/* STEP 7: Loading Section with Real Animated Progress Line */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.1 }}
        className="w-full max-w-[240px] flex flex-col items-center z-10"
      >
        <p className="text-[11px] text-slate-500 font-medium mb-2.5">
          Menyiapkan pengalaman belajarmu...
        </p>

        {/* Progress Track & Animated Line */}
        <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#168A5B] via-[#36A269] to-[#D62828] rounded-full"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Micro Percentage Text */}
        <span className="text-[9.5px] text-slate-400 font-mono font-semibold mt-1.5">
          {Math.min(100, Math.round(progress))}%
        </span>
      </motion.div>
    </motion.div>
  );
};
