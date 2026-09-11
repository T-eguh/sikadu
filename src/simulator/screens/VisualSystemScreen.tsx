import React from 'react';
import { ArrowLeft, Palette, Sparkles, Check, Layers, BookOpen, GraduationCap, School } from 'lucide-react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { BottomCornerWaveDecor } from '../components/EducationHeroVisuals';

interface VisualSystemScreenProps {
  onBack: () => void;
}

export const VisualSystemScreen: React.FC<VisualSystemScreenProps> = ({ onBack }) => {
  const colorTokens = [
    {
      name: 'Merah Utama',
      hex: '#D62828',
      bgClass: 'bg-[#D62828]',
      textClass: 'text-white',
      usage: 'Aksen tombol primer, alert penting, motto BISA',
    },
    {
      name: 'Hijau Utama',
      hex: '#168A5B',
      bgClass: 'bg-[#168A5B]',
      textClass: 'text-white',
      usage: 'Warna brand utama, progress tuntas, tombol aksi',
    },
    {
      name: 'Merah Lembut',
      hex: '#FDECEC',
      bgClass: 'bg-[#FDECEC]',
      textClass: 'text-[#D62828]',
      usage: 'Latar aksen peringatan, badge HEBAT, dekoratif',
    },
    {
      name: 'Hijau Lembut',
      hex: '#E8F5EE',
      bgClass: 'bg-[#E8F5EE]',
      textClass: 'text-[#168A5B]',
      usage: 'Latar pill status, badge MANDIRI, kartu aktif',
    },
    {
      name: 'Latar Canvas',
      hex: '#F7F9F8',
      bgClass: 'bg-[#F7F9F8]',
      textClass: 'text-[#1F2937]',
      usage: 'Background netral aplikasi yang ramah di mata',
    },
    {
      name: 'Teks Utama',
      hex: '#1F2937',
      bgClass: 'bg-[#1F2937]',
      textClass: 'text-white',
      usage: 'Tipografi judul, headline, kontras tinggi WCAG AA',
    },
  ];

  return (
    <motion.div
      id="bisa-visual-system-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between overflow-y-auto select-none font-sans relative"
    >
      {/* 1. TOP BAR */}
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
              Desain & Standar UI
            </span>
            <h2 className="text-sm font-black text-[#1F2937] leading-none mt-0.5">
              Panduan Visual Sistem BISA
            </h2>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#168A5B] border border-[#168A5B]/20">
          Panel 10
        </span>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-4 space-y-4 z-10 flex-1">
        {/* BRAND IDENTITY BANNER */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#168A5B]/30 flex items-center justify-center p-1.5">
              <PkbmOfficialLogo size={36} showText={false} variant="color" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1F2937]">BISA Smart Academy</h3>
              <p className="text-xs text-[#168A5B] font-bold">PKBM Bina Insani</p>
            </div>
          </div>

          {/* MOTTO BADGE */}
          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#E8F5EE] border border-[#168A5B]/20">
            <span className="text-xs font-black text-[#D62828] tracking-wider">HEBAT</span>
            <span className="text-[#168A5B]/40">•</span>
            <span className="text-xs font-black text-[#168A5B] tracking-wider">MANDIRI</span>
            <span className="text-[#168A5B]/40">•</span>
            <span className="text-xs font-black text-[#D62828] tracking-wider">KREATIF</span>
          </div>
        </div>

        {/* COLOR PALETTE SWATCHES */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-black text-[#1F2937] tracking-tight flex items-center gap-1.5">
            <Palette size={14} className="text-[#168A5B]" />
            <span>Palet Warna Resmi (Brand Tokens)</span>
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            {colorTokens.map((token, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2"
              >
                <div
                  className={`w-full h-12 rounded-xl ${token.bgClass} ${token.textClass} flex items-center justify-center font-mono text-xs font-bold shadow-inner border border-black/5`}
                >
                  {token.hex}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#1F2937] leading-tight">
                    {token.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 10 SCREEN ARCHITECTURE OVERVIEW */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
          <h4 className="text-xs font-black text-[#1F2937] tracking-tight flex items-center gap-1.5">
            <Layers size={14} className="text-[#D62828]" />
            <span>10 Layar Utama Terintegrasi</span>
          </h4>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">1. Splash Screen</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Logo & Loading 65%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">2. Welcome Screen</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Dua Siswa & Tombol Mulai</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">3. Pilih Role</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Admin, Guru, Siswa</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">4. Masuk ke Akun</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Email, Sandi & Google</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">5. Dashboard Admin</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Gedung Kampus & 4 Metrik</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">6. Dashboard Guru</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Bu Sari & Papan Tulis</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">7. Dashboard Siswa</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Andi, Ring 65% & Streak</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">8. Detail Modul</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Laptop 3D & 4 Pokok Bahasan</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800">9. Empty State</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Data Tidak Ditemukan</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-semibold text-slate-800">10. Panduan Visual</span>
              <span className="text-[10px] text-[#168A5B] font-bold">Palet Warna & Komponen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Corner Waves */}
      <BottomCornerWaveDecor />
    </motion.div>
  );
};
