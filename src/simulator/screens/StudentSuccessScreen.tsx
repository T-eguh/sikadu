import React, { useEffect, useState } from 'react';
import { School, ArrowRight, Sparkles, CheckCircle2, Users } from 'lucide-react';
import {
  AbstractBackgroundDecor,
  AnimatedCheckmarkGreen,
} from '../components/EducationalIllustrations';
import { User } from '../types';

interface StudentSuccessScreenProps {
  currentUser: User;
  classData: any;
  onContinueToDashboard: () => void;
}

export const StudentSuccessScreen: React.FC<StudentSuccessScreenProps> = ({
  currentUser,
  classData,
  onContinueToDashboard,
}) => {
  const [animationStep, setAnimationStep] = useState(1);

  useEffect(() => {
    // Exact requested animation sequence:
    // 1. Checkmark Scale + Spring (0ms)
    // 2. Judul Fade Up (300ms)
    // 3. Class Card Fade Up (600ms)
    // 4. Button muncul terakhir (900ms)
    const t2 = setTimeout(() => setAnimationStep(2), 300);
    const t3 = setTimeout(() => setAnimationStep(3), 600);
    const t4 = setTimeout(() => setAnimationStep(4), 900);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const className = classData?.name || 'Kelas X MIPA 1';
  const academicYear = classData?.academicYear?.name || '2026/2027 Ganjil';

  return (
    <div
      id="bisa-student-success-screen"
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-hidden font-sans"
    >
      {/* Background with abstract red & green elements */}
      <AbstractBackgroundDecor variant="welcome" />

      <div />

      {/* Center Section: Animated Checkmark & Class Card */}
      <div className="z-10 flex flex-col items-center text-center my-auto py-3">
        {/* 1. Animated Checkmark Hijau with confetti */}
        <div className="mb-4">
          <AnimatedCheckmarkGreen />
        </div>

        {/* 2. Judul & Subtitle Fade Up */}
        <div
          className={`transition-all duration-500 transform ${
            animationStep >= 2
              ? 'translate-y-0 opacity-100'
              : 'translate-y-3 opacity-0'
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
            Selamat Datang di BISA 🎉
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-1.5 leading-relaxed">
            Kamu berhasil bergabung ke:
          </p>
        </div>

        {/* 3. CLASS CARD as specified (Nama Kelas, Tahun Ajaran, Icon Sekolah, Soft Shadow) */}
        <div
          className={`w-full max-w-[290px] mt-4 p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-md transition-all duration-500 transform ${
            animationStep >= 3
              ? 'translate-y-0 opacity-100'
              : 'translate-y-3 opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1B7F5A] flex items-center justify-center shrink-0 border border-emerald-200">
              <School size={24} />
            </div>

            <div className="text-left flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#1B7F5A] uppercase tracking-wider block">
                PKBM BINA INSANI
              </span>
              <h3 className="text-sm font-black text-[#1F2937] truncate mt-0.5">
                {className}
              </h3>
              <p className="text-[10.5px] text-slate-500 font-normal mt-0.5">
                Tahun Ajaran {academicYear}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-[#1B7F5A] font-semibold">
              <CheckCircle2 size={13} />
              <span>Status Terverifikasi</span>
            </span>
            <span className="font-bold text-slate-700">Kurikulum Merdeka</span>
          </div>
        </div>
      </div>

      {/* 4. SUCCESS BUTTON as specified (CTA Hijau / Kombinasi Hijau Profesional) */}
      <div
        className={`z-10 pb-2 transition-all duration-500 transform ${
          animationStep >= 4
            ? 'translate-y-0 opacity-100'
            : 'translate-y-3 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={onContinueToDashboard}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1B7F5A] via-[#146346] to-[#0F5C40] hover:from-[#146346] hover:to-[#093826] text-white font-bold text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition flex items-center justify-between group"
        >
          <div className="w-6" /> {/* Balance spacer */}
          <span className="tracking-wide font-extrabold text-white">
            Mulai Belajar
          </span>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={15} strokeWidth={2.5} className="text-white" />
          </div>
        </button>

        <p className="text-[9.5px] text-slate-400 text-center mt-2">
          Platform BISA • Hebat, Mandiri, Kreatif
        </p>
      </div>
    </div>
  );
};
