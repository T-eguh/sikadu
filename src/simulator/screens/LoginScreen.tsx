import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  X,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';
import {
  BisaTopHeroBanner,
  AdminAvatar3D,
  TeacherAvatar3D,
  StudentAvatar3D,
  BisaBottomFooterWave,
} from '../components/LoginVisualAssets';

interface LoginScreenProps {
  onLoginSuccess: (user: User, token: string, requiresClassCode?: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Active Staff Modal: null | 'ADMIN' | 'GURU'
  const [activeStaffModal, setActiveStaffModal] = useState<'ADMIN' | 'GURU' | null>(null);

  // Form states for Admin & Guru
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Student Modal / Simulation State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Open Admin Login Modal with default demo credentials
  const openAdminModal = () => {
    setActiveStaffModal('ADMIN');
    setStaffEmail('admin@pkbmbinainsani.sch.id');
    setStaffPassword('Admin123!');
    setErrorMessage(null);
  };

  // Open Guru Login Modal with default demo credentials
  const openGuruModal = (teacherEmail = 'guru.budi@pkbmbinainsani.sch.id', teacherPass = 'Guru123!') => {
    setActiveStaffModal('GURU');
    setStaffEmail(teacherEmail);
    setStaffPassword(teacherPass);
    setErrorMessage(null);
  };

  // Handle Staff Email/Password Login
  const handleStaffLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!staffEmail.trim()) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }
    if (!staffPassword) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await mockBackend.login(staffEmail, staffPassword);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setActiveStaffModal(null);
      onLoginSuccess(user, token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa email atau kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth for Students
  const handleGoogleSignIn = async (googleEmail: string, googleName?: string) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = await mockBackend.loginWithGoogle(
        googleEmail,
        googleName,
        'simulated_google_id_token'
      );
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      setShowGoogleModal(false);
      onLoginSuccess(result.user, result.token, result.requiresClassCode);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-white flex flex-col justify-between overflow-y-auto font-sans select-none relative">
      {/* 1. TOP HERO HEADER (Students, School, Flag, Motto, Slogan) */}
      <BisaTopHeroBanner />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 px-4 pt-1 pb-3 flex flex-col justify-start">
        {/* Welcome Title */}
        <div className="text-center mt-1">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            <span>👋</span>
            <span>Selamat Datang</span>
            <span>👋</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-normal mt-1 leading-relaxed max-w-[290px] mx-auto">
            Masuk untuk melanjutkan perjalanan belajarmu di BISA - Bisa Insani Smart Academy.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl flex items-start gap-2 mt-3 animate-shake">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
            <span className="flex-1 font-medium leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* 3. THREE ROLE CARDS IN 3-COLUMN GRID (Green and Red Theme) */}
        <div className="grid grid-cols-3 gap-2 mt-3.5">
          {/* Card 1: Administrator (Ruby Red Theme) */}
          <button
            type="button"
            onClick={openAdminModal}
            className="group text-left bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECDD3] hover:border-red-400 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow"
          >
            <div>
              {/* 3D Avatar */}
              <div className="flex justify-center mb-1">
                <AdminAvatar3D size={48} />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition leading-tight">
                Administrator
              </h3>
              <p className="text-[9.5px] text-slate-600 mt-1 leading-tight line-clamp-2">
                Kelola sistem dan aktivitas pembelajaran.
              </p>
            </div>
            {/* Round Action Button in Ruby Red */}
            <div className="w-5 h-5 rounded-full bg-[#DC2626] group-hover:bg-[#B91C1C] text-white flex items-center justify-center self-end mt-2 shadow-sm transition">
              <ArrowRight size={11} strokeWidth={2.5} />
            </div>
          </button>

          {/* Card 2: Guru (Crimson/Rose Theme) */}
          <button
            type="button"
            onClick={() => openGuruModal()}
            className="group text-left bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] hover:border-rose-400 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow"
          >
            <div>
              {/* 3D Avatar */}
              <div className="flex justify-center mb-1">
                <TeacherAvatar3D size={48} />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-800 transition leading-tight">
                Guru
              </h3>
              <p className="text-[9.5px] text-slate-600 mt-1 leading-tight line-clamp-2">
                Kelola kelas dan materi pembelajaran.
              </p>
            </div>
            {/* Round Action Button in Crimson */}
            <div className="w-5 h-5 rounded-full bg-[#E11D48] group-hover:bg-[#BE123C] text-white flex items-center justify-center self-end mt-2 shadow-sm transition">
              <ArrowRight size={11} strokeWidth={2.5} />
            </div>
          </button>

          {/* Card 3: Siswa (Emerald Green Theme) */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="group text-left bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] hover:border-emerald-500 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow"
          >
            <div>
              {/* 3D Avatar */}
              <div className="flex justify-center mb-1">
                <StudentAvatar3D size={48} />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition leading-tight">
                Siswa
              </h3>
              <p className="text-[9.5px] text-slate-600 mt-1 leading-tight line-clamp-2">
                Belajar dan kembangkan kemampuanmu.
              </p>
            </div>
            {/* Round Action Button in Emerald Green */}
            <div className="w-5 h-5 rounded-full bg-[#059669] group-hover:bg-[#047857] text-white flex items-center justify-center self-end mt-2 shadow-sm transition">
              <ArrowRight size={11} strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* 4. DIVIDER WITH TEXT */}
        <div className="relative my-3.5 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-2.5 text-[10.5px] font-semibold text-[#047857]">
            Atau masuk langsung sebagai Siswa
          </span>
        </div>

        {/* 5. "LANJUTKAN DENGAN GOOGLE" BUTTON */}
        <div className="w-full">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowGoogleModal(true)}
            className="w-full bg-white hover:bg-emerald-50/40 border-2 border-emerald-300 hover:border-emerald-600 rounded-2xl py-3 px-4 shadow-sm shadow-emerald-900/5 active:scale-[0.98] transition flex items-center justify-between group"
          >
            {/* Google "G" Icon */}
            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            {/* Label */}
            <span className="text-xs sm:text-sm font-bold text-[#047857] group-hover:text-[#065F46] transition">
              Lanjutkan dengan Google
            </span>

            {/* Chevron Right in Emerald */}
            <ChevronRight size={18} className="text-[#059669] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Subtext */}
          <p className="text-[10px] text-slate-500 text-center mt-1.5">
            Gunakan akun <span className="font-bold text-[#DC2626]">Google / Gmail</span> yang kamu miliki
          </p>
        </div>
      </div>

      {/* 6. BOTTOM OCEANIC WAVE & 3D BOOKS FOOTER */}
      <BisaBottomFooterWave />

      {/* MODAL 1: STAFF LOGIN (ADMIN / GURU) */}
      {activeStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-slide-up flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeStaffModal === 'ADMIN'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {activeStaffModal === 'ADMIN' ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <GraduationCap size={18} />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {activeStaffModal === 'ADMIN'
                      ? 'Masuk Portal Administrator'
                      : 'Masuk Portal Guru'}
                  </h3>
                  <p className="text-[10px] text-emerald-800 font-semibold">
                    PKBM Bina Insani • Sistem Internal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStaffModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Account Switcher for Testing */}
            <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Pilih Akun Uji Coba:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeStaffModal === 'ADMIN' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStaffEmail('admin@pkbmbinainsani.sch.id');
                      setStaffPassword('Admin123!');
                    }}
                    className="px-2 py-1 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-400 rounded-lg text-[10px] font-bold text-red-800 transition"
                  >
                    Administrator Utama
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffEmail('guru.budi@pkbmbinainsani.sch.id');
                        setStaffPassword('Guru123!');
                      }}
                      className="px-2 py-1 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 rounded-lg text-[10px] font-bold text-rose-800 transition"
                    >
                      Guru Budi (Wali Kelas)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffEmail('guru.siti@pkbmbinainsani.sch.id');
                        setStaffPassword('Guru123!');
                      }}
                      className="px-2 py-1 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 rounded-lg text-[10px] font-bold text-rose-800 transition"
                    >
                      Guru Siti (Pengajar)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleStaffLogin} className="mt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Alamat Email Resmi
                </label>
                <div className="relative flex items-center">
                  <Mail size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="nama@pkbmbinainsani.sch.id"
                    disabled={isLoading}
                    className="w-full bg-white text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <Lock size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    disabled={isLoading}
                    className="w-full bg-white text-slate-900 pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-red-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-bold text-xs py-3 rounded-xl shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2 ${
                  activeStaffModal === 'ADMIN'
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C] shadow-red-900/20'
                    : 'bg-[#E11D48] hover:bg-[#BE123C] shadow-rose-900/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <span>
                    Masuk sebagai {activeStaffModal === 'ADMIN' ? 'Administrator' : 'Guru'}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GOOGLE ACCOUNT SELECTOR SHEET */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-slide-up flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="text-xs font-bold text-slate-900">
                  Pilih Akun Google Siswa BISA
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 mb-2.5">
              Pilih akun Google siswa untuk masuk atau mengaktifkan kelas:
            </p>

            <div className="space-y-2">
              {/* Preset 1: Existing Active Student (Ahmad Fauzi) */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('siswa.ahmad@gmail.com', 'Ahmad Fauzi')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
                  alt="Ahmad Fauzi"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">Ahmad Fauzi</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Aktif (X-A)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    siswa.ahmad@gmail.com
                  </span>
                </div>
              </button>

              {/* Preset 2: Existing Active Student (Dewi Lestari) */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('dewi.lestari@gmail.com', 'Dewi Lestari')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
                  alt="Dewi Lestari"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">Dewi Lestari</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Aktif (XI-B)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">
                    dewi.lestari@gmail.com
                  </span>
                </div>
              </button>

              {/* Preset 3: New Student (Will trigger Class Code Activation Flow) */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('rian.baru@gmail.com', 'Rian Firmansyah')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-red-300 bg-red-50/40 hover:border-red-500 hover:bg-red-50 transition text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                  alt="Rian Firmansyah"
                  className="w-9 h-9 rounded-full object-cover border border-red-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      Rian Firmansyah
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-bold">
                      Siswa Baru
                    </span>
                  </div>
                  <span className="text-[11px] text-red-700 block truncate">
                    rian.baru@gmail.com (Aktivasi Kode Kelas)
                  </span>
                </div>
              </button>
            </div>

            {/* Custom Google Email input */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Atau Masukkan Akun Google Siswa Lain:
              </span>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="email.siswa@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail.trim()) {
                      handleGoogleSignIn(customGoogleEmail);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#047857] text-white rounded-lg text-xs font-bold hover:bg-[#065F46]"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
