import React, { useState } from 'react';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { AbstractBackgroundDecor } from '../components/EducationalIllustrations';
import { RoleSelectionEducationHero, BottomCornerWaveDecor } from '../components/EducationHeroVisuals';

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'SISWA' | 'ADMIN' | 'GURU') => void;
  onStaffLoginSuccess: (user: User, token: string) => void;
  onBackToWelcome: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onStaffLoginSuccess,
  onBackToWelcome,
}) => {
  // Modal state for Administrator and Guru credential logins
  const [activeStaffModal, setActiveStaffModal] = useState<'ADMIN' | 'GURU' | null>(null);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNavigatingToSiswa, setIsNavigatingToSiswa] = useState(false);

  // Open Admin Login modal
  const openAdminModal = () => {
    setActiveStaffModal('ADMIN');
    setStaffEmail('admin@pkbmbinainsani.sch.id');
    setStaffPassword('Admin123!');
    setErrorMessage(null);
  };

  // Open Guru Login modal
  const openGuruModal = () => {
    setActiveStaffModal('GURU');
    setStaffEmail('guru.budi@pkbmbinainsani.sch.id');
    setStaffPassword('Guru123!');
    setErrorMessage(null);
  };

  // Select Siswa with smooth transition
  const handleSelectSiswa = () => {
    if (isNavigatingToSiswa) return;
    setIsNavigatingToSiswa(true);
    setTimeout(() => {
      onSelectRole('SISWA');
    }, 200);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!staffEmail.trim() || !staffPassword) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await mockBackend.login(staffEmail, staffPassword);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setActiveStaffModal(null);
      onStaffLoginSuccess(user, token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali email atau kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      id="bisa-role-selection-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isNavigatingToSiswa ? 0 : 1,
        y: isNavigatingToSiswa ? -6 : 0,
      }}
      transition={{ duration: isNavigatingToSiswa ? 0.2 : 0.35, ease: 'easeOut' }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-y-auto font-sans"
    >
      {/* =========================================================================
          STEP 1: Decorative Background (Soft Gradient & Abstract Shapes)
          Primary Red & Primary Green transparent shapes (minimal & non-intrusive)
          ========================================================================= */}
      <AbstractBackgroundDecor variant="light" />

      {/* =========================================================================
          STEP 2: BRANDING HEADER (Back button, Logo BISA existing, App Name)
          Fade Down entrance animation (duration: 350ms)
          ========================================================================= */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
        className="z-10 flex items-center justify-between pt-1"
      >
        <motion.button
          type="button"
          onClick={onBackToWelcome}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-slate-200/90 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          title="Kembali ke Welcome Screen"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </motion.button>

        {/* Small & Proportional Logo and App Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#168A5B]/30 flex items-center justify-center p-0.5">
            <PkbmOfficialLogo size={22} showText={false} variant="color" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black text-[#1F2937] tracking-wider leading-none">
              BISA
            </span>
            <span className="text-[8.5px] text-[#168A5B] font-bold leading-none mt-0.5">
              Smart Academy
            </span>
          </div>
        </div>

        {/* Balance Spacer */}
        <div className="w-9" />
      </motion.div>

      {/* =========================================================================
          STEP 3 & 4: GREETING & SUBTITLE
          Greeting: "Selamat Datang 👋" (Fade Up)
          Subtitle: "Pilih cara masuk untuk melanjutkan perjalanan belajarmu." (Fade Up)
          ========================================================================= */}
      <div className="z-10 mt-2 mb-1">
        <motion.h2
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18, ease: 'easeOut' }}
          className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight flex items-center gap-2"
        >
          <span>Selamat Datang</span>
          <span>👋</span>
        </motion.h2>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.26, ease: 'easeOut' }}
          className="text-xs text-[#64748B] font-normal mt-0.5 leading-relaxed max-w-[320px]"
        >
          Pilih cara masuk untuk melanjutkan perjalanan belajarmu.
        </motion.p>
      </div>

      {/* =========================================================================
          EDUCATION HERO VISUAL BESAR: GERBANG SEKOLAH DIGITAL PKBM BINA INSANI
          Menampilkan Gedung Sekolah, Guru, Siswa, Buku, dan Portal Digital
          ========================================================================= */}
      <div className="z-10 my-1">
        <RoleSelectionEducationHero />
      </div>

      {/* =========================================================================
          ROLE CARDS CONTAINER (3 Vertical Cards with STAGGER ENTRANCE)
          Urutan Stagger:
          1. ADMINISTRATOR (delay: 0.35s)
          2. GURU (delay: 0.48s)
          3. SISWA (delay: 0.61s)
          ========================================================================= */}
      <div className="z-10 flex-1 flex flex-col justify-center space-y-3 py-2">
        {/* =====================================================================
            CARD 1: ADMINISTRATOR
            Aksen: MERAH (#D62828)
            Nama: Administrator
            Deskripsi: Kelola sistem dan aktivitas pembelajaran.
            Icon Container: Soft Red (#FDECEC) + Red Icon (#D62828)
            ===================================================================== */}
        <motion.button
          type="button"
          onClick={openAdminModal}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left p-4 rounded-[22px] bg-white border-2 border-rose-100/90 shadow-sm hover:shadow-md hover:border-[#D62828] transition-all duration-200 group relative overflow-hidden active:scale-[0.97]"
        >
          {/* Subtle Decorative Ambient Corner Tint */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#FDECEC] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-125" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              {/* Role Icon Container (Rounded 2xl, Soft Red, Red Icon) */}
              <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] border border-rose-200/90 flex items-center justify-center text-[#D62828] shadow-2xs group-hover:bg-[#D62828] group-hover:text-white transition-colors duration-200 shrink-0">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>

              {/* Role Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1F2937] group-hover:text-[#D62828] transition-colors">
                    Administrator
                  </h3>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#FDECEC] text-[#D62828] border border-rose-200/80">
                    Sistem
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] font-normal mt-0.5 leading-snug">
                  Kelola sistem dan aktivitas pembelajaran.
                </p>
              </div>
            </div>

            {/* Right Arrow Icon with Touch/Hover Slide Animation */}
            <div className="w-8 h-8 rounded-full bg-[#FDECEC] text-[#D62828] flex items-center justify-center group-hover:bg-[#D62828] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-200 shrink-0 ml-2">
              <ArrowRight size={15} strokeWidth={2.4} />
            </div>
          </div>
        </motion.button>

        {/* =====================================================================
            CARD 2: GURU
            Aksen: HIJAU (#168A5B)
            Nama: Guru
            Deskripsi: Kelola kelas dan materi pembelajaran.
            Icon Container: Soft Green (#E8F5EE) + Green Icon (#168A5B)
            ===================================================================== */}
        <motion.button
          type="button"
          onClick={openGuruModal}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.48, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left p-4 rounded-[22px] bg-white border-2 border-emerald-100/90 shadow-sm hover:shadow-md hover:border-[#168A5B] transition-all duration-200 group relative overflow-hidden active:scale-[0.97]"
        >
          {/* Subtle Decorative Ambient Corner Tint */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#E8F5EE] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-125" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              {/* Role Icon Container (Rounded 2xl, Soft Green, Green Icon) */}
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] border border-[#168A5B]/25 flex items-center justify-center text-[#168A5B] shadow-2xs group-hover:bg-[#168A5B] group-hover:text-white transition-colors duration-200 shrink-0">
                <BookOpen size={22} strokeWidth={2.2} />
              </div>

              {/* Role Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1F2937] group-hover:text-[#168A5B] transition-colors">
                    Guru
                  </h3>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#168A5B] border border-[#168A5B]/30">
                    Pendidik
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] font-normal mt-0.5 leading-snug">
                  Kelola kelas dan materi pembelajaran.
                </p>
              </div>
            </div>

            {/* Right Arrow Icon with Touch/Hover Slide Animation */}
            <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center group-hover:bg-[#168A5B] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-200 shrink-0 ml-2">
              <ArrowRight size={15} strokeWidth={2.4} />
            </div>
          </div>
        </motion.button>

        {/* =====================================================================
            CARD 3: SISWA (Welcoming, Friendly, Soft Green + Subtle Red Accent)
            Aksen: Soft Green (#E8F5EE) dengan aksen merah kecil (#D62828)
            Nama: Siswa
            Deskripsi: Belajar dan kembangkan kemampuanmu.
            Icon Container: Soft Green + Graduation / Student Icon
            ===================================================================== */}
        <motion.button
          type="button"
          onClick={handleSelectSiswa}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.61, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left p-4 rounded-[22px] bg-white border-2 border-emerald-200/90 shadow-sm hover:shadow-md hover:border-[#168A5B] transition-all duration-200 group relative overflow-hidden active:scale-[0.97]"
        >
          {/* Subtle Decorative Ambient Corner Tint */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#E8F5EE] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-125" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              {/* Role Icon Container (Friendly Graduation Cap) */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E8F5EE] to-[#d3eee0] border border-emerald-300/80 flex items-center justify-center text-[#168A5B] shadow-2xs group-hover:bg-[#168A5B] group-hover:text-white transition-colors duration-200 shrink-0">
                <GraduationCap size={24} strokeWidth={2.2} />
              </div>

              {/* Role Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1F2937] group-hover:text-[#168A5B] transition-colors">
                    Siswa
                  </h3>
                  {/* Subtle Red Accent Badge */}
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#FDECEC] text-[#D62828] border border-rose-200 flex items-center gap-1">
                    <Sparkles size={10} />
                    <span>Google Login</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] font-normal mt-0.5 leading-snug">
                  Belajar dan kembangkan kemampuanmu.
                </p>
              </div>
            </div>

            {/* Right Arrow Icon with Touch/Hover Slide Animation */}
            <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center group-hover:bg-[#168A5B] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-200 shrink-0 ml-2">
              <ArrowRight size={15} strokeWidth={2.4} />
            </div>
          </div>
        </motion.button>
      </div>

      {/* =========================================================================
          STEP 7: FOOTER TEXT
          "PKBM Bina Insani • HEBAT • MANDIRI • KREATIF"
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.75 }}
        className="z-10 text-center py-1 mt-auto"
      >
        <p className="text-[10px] text-[#64748B] font-medium tracking-wide">
          PKBM Bina Insani • <span className="text-[#D62828] font-bold">HEBAT</span> •{' '}
          <span className="text-[#168A5B] font-bold">MANDIRI</span> •{' '}
          <span className="text-[#D62828] font-bold">KREATIF</span>
        </p>
      </motion.div>

      {/* =========================================================================
          STAFF LOGIN MODAL (Administrator & Guru with JWT Authorization)
          Preserved strictly: handles admin and teacher login logic intact
          ========================================================================= */}
      <AnimatePresence>
        {activeStaffModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-3">
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                      activeStaffModal === 'ADMIN' ? 'bg-[#D62828]' : 'bg-[#168A5B]'
                    }`}
                  >
                    {activeStaffModal === 'ADMIN' ? (
                      <ShieldCheck size={18} strokeWidth={2.2} />
                    ) : (
                      <BookOpen size={18} strokeWidth={2.2} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2937]">
                      {activeStaffModal === 'ADMIN' ? 'Login Administrator' : 'Login Guru'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      PKBM Bina Insani Smart Academy
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStaffModal(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-[#D62828] text-xs p-2.5 rounded-xl flex items-start gap-2 mt-3">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#D62828]" />
                  <span className="flex-1 font-medium leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleStaffSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="nama@pkbmbinainsani.sch.id"
                      className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#168A5B] focus:bg-white text-xs font-medium transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 text-slate-900 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#168A5B] focus:bg-white text-xs font-medium transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2 ${
                    activeStaffModal === 'ADMIN'
                      ? 'bg-[#D62828] hover:bg-[#b82222] shadow-red-600/20'
                      : 'bg-[#168A5B] hover:bg-[#0f6b46] shadow-emerald-700/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk sebagai {activeStaffModal === 'ADMIN' ? 'Admin' : 'Guru'}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signature Bottom Corner Curves (Left Soft Red, Right Soft Green) */}
      <BottomCornerWaveDecor />
    </motion.div>
  );
};
