import React, { useEffect } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 w-full bg-[#1E3A8A] flex flex-col items-center justify-between py-12 px-6 text-white select-none">
      <div />
      <div className="flex flex-col items-center animate-fade-in text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-xl">
          <GraduationCap size={44} className="text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-white">SEKOLAH MODEL</h1>
        <p className="text-xs text-sky-200 mt-1 font-medium tracking-wide">
          Sistem Pembelajaran Digital
        </p>
      </div>

      <div className="flex flex-col items-center">
        <Loader2 size={24} className="animate-spin text-white/80" />
        <span className="text-[11px] text-white/70 mt-2 font-medium">Memuat sistem...</span>
        <span className="text-[10px] text-white/40 mt-1">Versi 1.0.0 (Tahap 1)</span>
      </div>
    </div>
  );
};
