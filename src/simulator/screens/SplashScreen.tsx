import React, { useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      id="bisa-splash-screen"
      className="flex-1 w-full bg-gradient-to-b from-[#0B1536] via-[#0F1E4F] to-[#1E3A8A] flex flex-col items-center justify-between py-12 px-6 text-white select-none relative overflow-hidden"
    >
      {/* Decorative background aura */}
      <div className="absolute top-1/4 -left-20 w-52 h-52 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div />

      {/* Main Branding Presentation */}
      <div className="flex flex-col items-center text-center z-10 animate-fade-in">
        {/* BISA Emblem Logo */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center shadow-2xl shadow-blue-950/60 p-3">
            <span className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-tr from-white via-sky-100 to-sky-300">
              BISA
            </span>
            <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full mt-1" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-[#0F1E4F]">
            <Sparkles size={13} />
          </div>
        </div>

        {/* Official Application Name */}
        <h1 className="text-2xl font-black tracking-wider text-white">
          BISA
        </h1>
        <p className="text-xs text-sky-200 font-semibold tracking-wide mt-0.5">
          Bisa Insani Smart Academy
        </p>

        {/* Institution Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-sky-100 font-medium mt-3">
          <span>PKBM Bina Insani</span>
        </div>

        {/* Official Motto */}
        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-amber-300 tracking-wider">
          <span>HEBAT</span>
          <span className="text-white/40">•</span>
          <span>MANDIRI</span>
          <span className="text-white/40">•</span>
          <span>KREATIF</span>
        </div>
      </div>

      {/* Loading Indicator & Platform Version */}
      <div className="flex flex-col items-center z-10">
        <Loader2 size={24} className="animate-spin text-sky-300" />
        <span className="text-[11px] text-sky-200/80 mt-2 font-medium">Memuat Platform BISA...</span>
        <span className="text-[10px] text-white/40 mt-1">Versi 4.5 • Mobile Native</span>
      </div>
    </div>
  );
};
