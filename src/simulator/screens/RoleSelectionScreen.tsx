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
  School,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { AbstractBackgroundDecor } from '../components/EducationalIllustrations';
import { THEME } from '../theme';

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
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-y-auto font-sans"
    >
      {/* Abstract Background Decor */}
      <AbstractBackgroundDecor variant="light" />

      {/* Top Bar with Back Button and Logo */}
      <div className="z-10 flex items-center justify-between pt-1">
        <motion.button
          type="button"
          onClick={onBackToWelcome}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          title="Kembali ke Welcome"
        >
          <ArrowLeft size={16} />
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#168A5B]/30 flex items-center justify-center p-0.5">
            <PkbmOfficialLogo size={24} showText={false} variant="color" />
          </div>
          <span className="text-xs font-black text-[#1F2937] tracking-wider">BISA</span>
        </div>

        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Greeting Header as Specified */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="z-10 mt-3 mb-2"
      >
        <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight flex items-center gap-2">
          <span>Selamat Datang</span>
          <span>👋</span>
        </h2>
        <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
          Masuk untuk melanjutkan perjalanan belajarmu.
        </p>
      </motion.div>

      {/* 3 Modern Vertical Cards: ADMINISTRATOR, GURU, SISWA with STAGGER ENTRANCE */}
      <div className="z-10 flex-1 flex flex-col justify-center space-y-3 py-2">
        {/* CARD 1: ADMINISTRATOR (Aksen MERAH #D62828) */}
        <motion.button
          type="button"
          onClick={openAdminModal}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left p-4 rounded-[22px] bg-white border-2 border-rose-100 shadow-sm hover:shadow-md hover:border-[#D62828] transition-all duration-200 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#FDECEC] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-125" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] border border-rose-200 flex items-center justify-center text-[#D62828] shadow-2xs group-hover:bg-[#D62828] group-hover:text-white transition-colors duration-200">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1F2937] group-hover:text-[#D62828] transition-colors">
                    Administrator
                  </h3>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#FDECEC] text-[#D62828] border border-rose-200">
                    Akses Sistem
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Kelola sistem dan aktivitas pembelajaran.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#FDECEC] text-[#D62828] flex items-center justify-center group-hover:bg-[#D62828] group-hover:text-white group-hover:translate-x-1 transition-all">
              <ArrowRight size={15} />
            </div>
          </div>
        </motion.button>

        {/* CARD 2: GURU (Aksen HIJAU #168A5B) */}
        <motion.button
          type="button"
          onClick={openGuruModal}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.32, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left p-4 rounded-[22px] bg-white border-2 border-emerald-100 shadow-sm hover:shadow-md hover:border-[#168A5B] transition-all duration-200 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#E8F5EE] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-125" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] border border-[#168A5B]/30 flex items-center justify-center text-[#168A5B] shadow-2xs group-hover:bg-[#168A5B] group-hover:text-white transition-colors duration-200">
                <BookOpen size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1F2937] group-hover:text-[#168A5B] transition-colors">
                    Guru
                  </h3>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#168A5B] border border-[#168A5B]/30">
                    Pendidik
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Kelola kelas dan materi pembelajaran.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center group-hover:bg-[#168A5B] group-hover:text-white group-hover:translate-x-1 transition-all">
              <ArrowRight size={15} />
            </div>
          </div>
        </motion.button>

        {/* CARD 3: SISWA (Soft Green #E8F5EE dengan Aksen Merah Kecil) */}
        <motion.button
          type="button"
          onClick={() => onSelectRole('SISWA')}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.44, ease: 'easeOut' }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left p-4 rounded-[22px] bg-white border-2 border-emerald-200/90 shadow-sm hover:shadow-md hover:border-[#168A5B] transition-all duration-200 group relative overflow-hidden"
        >
          {/* Subtle green accent gradient strip */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#E8F5EE] -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-125" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] border border-emerald-200 flex items-center justify-center text-[#168A5B] shadow-2xs group-hover:bg-[#168A5B] group-hover:text-white transition-colors duration-200">
                <GraduationCap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#1F2937] group-hover:text-[#168A5B] transition-colors">
                    Siswa
                  </h3>
                  {/* Small red accent */}
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#FDECEC] text-[#D62828] border border-rose-200">
                    Google Login
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">
                  Belajar dan kembangkan kemampuanmu.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center group-hover:bg-[#168A5B] group-hover:text-white group-hover:translate-x-1 transition-all">
              <ArrowRight size={15} />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer Info */}
      <div className="z-10 text-center py-1">
        <p className="text-[10px] text-slate-400">
          PKBM Bina Insani • HEBAT • MANDIRI • KREATIF
        </p>
      </div>

      {/* STAFF LOGIN MODAL / DRAWER (Administrator & Guru) */}
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
                      <ShieldCheck size={18} />
                    ) : (
                      <BookOpen size={18} />
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
    </motion.div>
  );
};
