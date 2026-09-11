import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Play, BookOpen, Clock, FileText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ModuleDetailHeroVisual, BottomCornerWaveDecor } from '../components/EducationHeroVisuals';

interface ModuleDetailScreenProps {
  onBack: () => void;
  onContinueLearning?: () => void;
}

export const ModuleDetailScreen: React.FC<ModuleDetailScreenProps> = ({
  onBack,
  onContinueLearning,
}) => {
  const [activeItem, setActiveItem] = useState<number>(3);
  const [completedItems, setCompletedItems] = useState<number[]>([1, 2, 3]);

  const lessons = [
    {
      id: 1,
      title: 'Konsep Eksponen',
      duration: '15 Menit',
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 2,
      title: 'Sifat-sifat Eksponen',
      duration: '20 Menit',
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 3,
      title: 'Aplikasi dalam Soal',
      duration: '25 Menit',
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 4,
      title: 'Latihan Soal & Kuis',
      duration: '30 Menit',
      isCompleted: false,
      isLocked: true,
    },
  ];

  return (
    <motion.div
      id="bisa-module-detail-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between overflow-y-auto select-none font-sans relative"
    >
      {/* 1. TOP BAR (Panel 8 Style: Back Arrow + Module Subject Name) */}
      <div className="bg-white px-4 py-3 border-b border-slate-200/90 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={onBack}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={17} strokeWidth={2.2} />
          </motion.button>
          <div>
            <span className="text-[10px] font-bold text-[#168A5B] uppercase tracking-wider block">
              Detail Modul
            </span>
            <h2 className="text-sm font-black text-[#1F2937] leading-none mt-0.5">
              Matematika Wajib
            </h2>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#168A5B] border border-[#168A5B]/20">
          Kelas X
        </span>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-4 space-y-3.5 z-10 flex-1">
        {/* HERO BANNER: Floating 3D Laptop with Math Charts & Textbooks (Panel 8 Hero) */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <ModuleDetailHeroVisual />
        </motion.div>

        {/* MODULE TITLE & PROGRESS CARD */}
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-[#D62828] uppercase tracking-wider">
                Bab 1 • Aljabar & Fungsi
              </span>
              <h3 className="text-base font-black text-[#1F2937] mt-0.5 leading-tight">
                Eksponen & Bentuk Akar
              </h3>
            </div>
            <span className="text-[10.5px] font-bold text-[#168A5B] bg-[#E8F5EE] px-2.5 py-1 rounded-full border border-[#168A5B]/25 shrink-0">
              Pertemuan 3 dari 5
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Mempelajari konsep dasar bilangan berpangkat bulat positif, sifat perkalian dan pembagian eksponen, serta bentuk akar rasional.
          </p>

          {/* Progress Bar (60%) */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Progress Pembelajaran</span>
              <span className="text-[#168A5B] font-bold">60% Selesai</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#168A5B] via-[#2BA468] to-[#168A5B] rounded-full transition-all duration-500"
                style={{ width: '60%' }}
              />
            </div>
          </div>
        </motion.div>

        {/* 3. SECTION: MATERI PEMBELAJARAN (Panel 8 Checklist items) */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#1F2937] tracking-tight">
              Materi Pembelajaran
            </h4>
            <span className="text-[10px] font-medium text-slate-400">
              4 Pokok Bahasan
            </span>
          </div>

          <div className="space-y-2">
            {lessons.map((item, idx) => (
              <motion.div
                key={item.id}
                whileHover={!item.isLocked ? { scale: 1.01 } : {}}
                whileTap={!item.isLocked ? { scale: 0.99 } : {}}
                onClick={() => {
                  if (!item.isLocked) {
                    setActiveItem(item.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.isLocked
                    ? 'bg-slate-50/80 border-slate-200/60 opacity-60 cursor-not-allowed'
                    : activeItem === item.id
                    ? 'bg-emerald-50/60 border-[#168A5B] shadow-xs cursor-pointer'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Indicator Icon */}
                  <div className="shrink-0">
                    {item.isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : item.isLocked ? (
                      <div className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-400 flex items-center justify-center">
                        <Lock size={15} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FDECEC] text-[#D62828] flex items-center justify-center">
                        <Play size={14} fill="currentColor" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h5
                      className={`text-xs font-bold truncate ${
                        item.isLocked ? 'text-slate-500' : 'text-[#1F2937]'
                      }`}
                    >
                      {item.id}. {item.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {item.duration}
                      </span>
                      {item.isCompleted && (
                        <span className="text-[#168A5B] font-semibold">Tuntas</span>
                      )}
                      {item.isLocked && (
                        <span className="text-slate-400">Terkunci</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {item.isCompleted ? (
                    <span className="text-[9.5px] font-bold text-[#168A5B] bg-[#E8F5EE] px-2 py-0.5 rounded-full">
                      Selesai
                    </span>
                  ) : item.isLocked ? (
                    <span className="text-[9.5px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Kunci
                    </span>
                  ) : (
                    <span className="text-[9.5px] font-bold text-[#D62828] bg-[#FDECEC] px-2 py-0.5 rounded-full">
                      Pelajari
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 4. BOTTOM ACTION BUTTON (Solid Green '#168A5B' as in Panel 8) */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 sticky bottom-0 z-20 shadow-lg">
        <motion.button
          type="button"
          onClick={() => {
            if (onContinueLearning) {
              onContinueLearning();
            } else {
              onBack();
            }
          }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#168A5B] hover:bg-[#0F5C40] text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition duration-200"
        >
          <Play size={14} fill="currentColor" />
          <span>Lanjutkan Belajar</span>
        </motion.button>
      </div>

      {/* Bottom Corner Waves */}
      <BottomCornerWaveDecor />
    </motion.div>
  );
};
