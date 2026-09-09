import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Sparkles, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';

interface LoginScreenProps {
  onLoginSuccess: (user: User, token: string, requiresClassCode?: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Tabs: 'student' (Google Sign-In) vs 'staff' (Email/Password)
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  // Staff Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Student Modal / Simulation State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Handle Staff Email/Password Login
  const handleStaffLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Alamat email staf wajib diisi.');
      return;
    }
    if (!password) {
      setErrorMessage('Kata sandi staf wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await mockBackend.login(email, password);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      onLoginSuccess(user, token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk ke akun staf.');
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

  const fillStaffAccount = (staffEmail: string, staffPass: string) => {
    setActiveTab('staff');
    setEmail(staffEmail);
    setPassword(staffPass);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col justify-between p-5 overflow-y-auto font-sans">
      {/* Top Branding Section */}
      <div className="flex flex-col items-center pt-2">
        {/* BISA Logo Badge */}
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F172A] via-[#1E3A8A] to-[#2563EB] flex flex-col items-center justify-center shadow-lg shadow-blue-900/25 p-2 border border-white/20">
            <span className="text-xl font-black tracking-widest text-white">BISA</span>
            <div className="w-6 h-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full mt-0.5" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles size={10} />
          </div>
        </div>

        <h2 className="text-base font-black text-slate-900 tracking-wider">BISA</h2>
        <p className="text-[11px] font-semibold text-blue-700 tracking-tight">
          Bisa Insani Smart Academy
        </p>
        <span className="text-[10px] font-medium text-slate-500 mt-0.5">
          PKBM Bina Insani
        </span>

        {/* Motto Pill */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-bold text-amber-800 tracking-wide">
          <span>HEBAT</span>
          <span className="text-amber-400">•</span>
          <span>MANDIRI</span>
          <span className="text-amber-400">•</span>
          <span>KREATIF</span>
        </div>
      </div>

      {/* Role Segregation Tabs */}
      <div className="w-full mt-4 bg-slate-200/80 p-1 rounded-xl flex text-xs font-bold text-slate-600">
        <button
          type="button"
          onClick={() => {
            setActiveTab('student');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'student'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck size={14} className="text-blue-600" />
          <span>Siswa (Google)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('staff');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'staff'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={14} className="text-slate-600" />
          <span>Staf & Guru</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 mt-3 animate-shake">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
          <span className="flex-1 font-medium leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: SISWA (GOOGLE AUTHENTICATION) */}
      {activeTab === 'student' && (
        <div className="w-full mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            {/* Google SVG Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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

          <h3 className="text-sm font-bold text-slate-800">Masuk Akun Siswa</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-1 px-1">
            Sesuai standar BISA, siswa wajib menggunakan akun Google resmi. Siswa baru dapat mendaftar langsung dengan Google lalu memasukkan <b>Kode Kelas</b>.
          </p>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowGoogleModal(true)}
            className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-500 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2.5 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin text-blue-600" />
                <span className="text-blue-900">Menghubungkan Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Lanjutkan dengan Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-3">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>Terintegrasi aman dengan Google Identity Services</span>
          </div>
        </div>
      )}

      {/* TAB 2: STAF & GURU (INTERNAL EMAIL/PASSWORD) */}
      {activeTab === 'staff' && (
        <form onSubmit={handleStaffLogin} className="w-full mt-3 space-y-3">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 text-[11px] text-blue-900 leading-tight">
            Khusus Guru & Tenaga Kependidikan PKBM Bina Insani.
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Email Resmi Staf
            </label>
            <div className="relative flex items-center">
              <Mail size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                placeholder="nama@binainsani.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white text-slate-900 pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white text-slate-900 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-900/20 active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memverifikasi Staf...</span>
              </>
            ) : (
              <span>Masuk Portal Staf</span>
            )}
          </button>
        </form>
      )}

      {/* Google Account Selector Simulation Sheet/Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in">
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
                <span className="text-xs font-bold text-slate-900">Pilih Akun Google Siswa</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1"
              >
                Tutup
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 mb-3">
              Pilih akun Google untuk masuk ke aplikasi <b>BISA (PKBM Bina Insani)</b>:
            </p>

            <div className="space-y-2">
              {/* Preset 1: Existing Active Student */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('siswa.ahmad@gmail.com', 'Ahmad Fauzi')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
                  alt="Ahmad Fauzi"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">Ahmad Fauzi</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-semibold">Aktif</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">siswa.ahmad@gmail.com</span>
                </div>
              </button>

              {/* Preset 2: Dewi Lestari */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('dewi.lestari@gmail.com', 'Dewi Lestari')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
                  alt="Dewi Lestari"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">Dewi Lestari</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-semibold">Aktif</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">dewi.lestari@gmail.com</span>
                </div>
              </button>

              {/* Preset 3: New / Pending Student (Will trigger Enter Class Code flow!) */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('rian.baru@gmail.com', 'Rian Firmansyah')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-50 transition text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                  alt="Rian Firmansyah"
                  className="w-9 h-9 rounded-full object-cover border border-amber-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">Rian Firmansyah</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">Siswa Baru</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block truncate">rian.baru@gmail.com (Belum Masuk Kelas)</span>
                </div>
              </button>
            </div>

            {/* Custom Google Email input */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Atau Masukkan Akun Google Lain:
              </span>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="email.siswa@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail.trim()) {
                      handleGoogleSignIn(customGoogleEmail);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Accounts Switcher Bar */}
      <div className="pt-3 border-t border-slate-200/70 flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Pintasan Uji Coba Cepat (Simulator)
        </span>
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button
            type="button"
            onClick={() => handleGoogleSignIn('siswa.ahmad@gmail.com', 'Ahmad Fauzi')}
            className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition active:scale-95"
          >
            Google: Ahmad (Aktif)
          </button>
          <button
            type="button"
            onClick={() => handleGoogleSignIn('rian.baru@gmail.com', 'Rian Firmansyah')}
            className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-[10px] font-bold hover:bg-amber-100 transition active:scale-95"
          >
            Google: Rian (Baru)
          </button>
          <button
            type="button"
            onClick={() => fillStaffAccount('guru.budi@binainsani.sch.id', 'Guru123!')}
            className="px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-800 text-[10px] font-bold hover:bg-sky-100 transition active:scale-95"
          >
            Staf: Guru Budi
          </button>
          <button
            type="button"
            onClick={() => fillStaffAccount('admin@binainsani.sch.id', 'Admin123!')}
            className="px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50 text-purple-800 text-[10px] font-bold hover:bg-purple-100 transition active:scale-95"
          >
            Staf: Admin
          </button>
        </div>
        <span className="text-[10px] text-slate-400 mt-2 text-center">
          BISA • Platform Pembelajaran Digital PKBM Bina Insani
        </span>
      </div>
    </div>
  );
};
