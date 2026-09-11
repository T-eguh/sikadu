import React, { useState } from 'react';
import {
  ArrowLeft,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { GoogleAccountModal } from './GoogleAccountModal';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';
import { User } from '../types';
import { BottomCornerWaveDecor } from '../components/EducationHeroVisuals';

interface StudentLoginScreenProps {
  onBackToRoles: () => void;
  onStudentLoginSuccess: (user: User, token: string, requiresClassCode?: boolean) => void;
}

export const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({
  onBackToRoles,
  onStudentLoginSuccess,
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('andi@pkbmbinainsani.sch.id');
  const [password, setPassword] = useState('Siswa123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Preset Role Chooser to test all roles easily
  const handleSelectRolePreset = (role: 'SISWA' | 'GURU' | 'ADMIN') => {
    if (role === 'SISWA') {
      setEmailOrUsername('andi@pkbmbinainsani.sch.id');
      setPassword('Siswa123!');
    } else if (role === 'GURU') {
      setEmailOrUsername('guru.budi@pkbmbinainsani.sch.id');
      setPassword('Guru123!');
    } else {
      setEmailOrUsername('admin@pkbmbinainsani.sch.id');
      setPassword('Admin123!');
    }
  };

  // Handle Standard Login (Panel 4 Button "Login")
  const handleDirectLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const identifier = emailOrUsername.trim();
    if (!identifier) {
      setErrorMessage('Silakan masukkan Email atau Username.');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      // Check if user is staff or student
      let resultUser: User;
      let token: string;

      try {
        const staffRes = await mockBackend.login(identifier, password);
        resultUser = staffRes.user;
        token = staffRes.token;
      } catch {
        // Fallback to student login mock
        const googleRes = await mockBackend.loginWithGoogle(
          identifier.includes('@') ? identifier : `${identifier}@pkbmbinainsani.sch.id`,
          'Andi Pratama',
          'simulated_token'
        );
        resultUser = googleRes.user;
        token = googleRes.token;
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      onStudentLoginSuccess(
        resultUser,
        token,
        resultUser.role === 'STUDENT' && resultUser.student?.status === 'PENDING'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa email atau kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login Button Click
  const handlePressGoogle = () => {
    setIsConnectingGoogle(true);
    setTimeout(() => {
      setIsConnectingGoogle(false);
      setShowAccountModal(true);
    }, 350);
  };

  const handleSelectGoogleAccount = async (email: string, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await mockBackend.loginWithGoogle(
        email,
        name,
        'simulated_google_oauth_token'
      );
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      setShowAccountModal(false);
      onStudentLoginSuccess(result.user, result.token, result.requiresClassCode);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      id="bisa-login-screen-panel-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-y-auto font-sans"
    >
      {/* 1. HEADER: Back Button & BISA Logo (Panel 4 Style) */}
      <div className="z-10 flex items-center justify-between pt-1">
        <motion.button
          type="button"
          onClick={onBackToRoles}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-2xl bg-white shadow-2xs border border-slate-200/90 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          title="Kembali"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </motion.button>

        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#168A5B]/30 flex items-center justify-center p-0.5">
            <PkbmOfficialLogo size={24} showText={false} variant="color" />
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-[#1F2937] block leading-none">
              BISA
            </span>
            <span className="text-[9px] text-[#168A5B] font-bold block mt-0.5">
              Bisa Insani Smart Academy
            </span>
          </div>
        </div>

        <div className="w-9" />
      </div>

      {/* 2. FORM SECTION: Masuk ke Akun (Panel 4 Exact Layout) */}
      <div className="z-10 flex-1 flex flex-col justify-center my-auto py-2 max-w-[340px] w-full mx-auto">
        {/* Title and Subtitle */}
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-center mb-5"
        >
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
            Masuk ke Akun
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
            Silakan login untuk melanjutkan
          </p>

          {/* Preset Role Selector Chips */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <button
              type="button"
              onClick={() => handleSelectRolePreset('SISWA')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                emailOrUsername.includes('andi')
                  ? 'bg-[#E8F5EE] text-[#168A5B] border-[#168A5B]/30 shadow-2xs'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              Siswa (Andi)
            </button>
            <button
              type="button"
              onClick={() => handleSelectRolePreset('GURU')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                emailOrUsername.includes('guru')
                  ? 'bg-[#E8F5EE] text-[#168A5B] border-[#168A5B]/30 shadow-2xs'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              Guru (Bu Sari)
            </button>
            <button
              type="button"
              onClick={() => handleSelectRolePreset('ADMIN')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                emailOrUsername.includes('admin')
                  ? 'bg-[#FDECEC] text-[#D62828] border-[#D62828]/30 shadow-2xs'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#FDECEC] border border-rose-200 text-[#D62828] text-xs p-2.5 rounded-xl mb-3 text-left"
          >
            <span className="font-medium">{errorMessage}</span>
          </motion.div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleDirectLogin} className="space-y-3.5">
          {/* Input 1: Email atau Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserIcon size={17} />
            </div>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email atau Username"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#168A5B] focus:ring-2 focus:ring-[#168A5B]/20 shadow-2xs transition"
            />
          </div>

          {/* Input 2: Password with Eye Toggle */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={17} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#168A5B] focus:ring-2 focus:ring-[#168A5B]/20 shadow-2xs transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Row: Ingat saya & Lupa password? */}
          <div className="flex items-center justify-between text-xs px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#168A5B] accent-[#168A5B] border-slate-300 focus:ring-[#168A5B]"
              />
              <span className="text-[11.5px] font-medium">Ingat saya</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Fitur pemulihan kata sandi dapat dihubungi melalui Administrator PKBM.')}
              className="text-[11.5px] font-bold text-[#168A5B] hover:underline"
            >
              Lupa password?
            </button>
          </div>

          {/* BUTTON: LOGIN (Solid Green '#168A5B' as in Panel 4) */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#168A5B] hover:bg-[#0F5C40] text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </motion.button>
        </form>

        {/* Divider: "atau" */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3 text-[11px] text-slate-400 font-medium">atau</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* BUTTON: LOGIN DENGAN GOOGLE (White Card with Google Logo) */}
        <motion.button
          type="button"
          onClick={handlePressGoogle}
          disabled={isConnectingGoogle || isLoading}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#168A5B] hover:shadow-xs transition-all flex items-center justify-center gap-2.5 group disabled:opacity-75"
        >
          {/* Official Google G Logo */}
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

          <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
            {isConnectingGoogle ? 'Menghubungkan Google...' : 'Login dengan Google'}
          </span>
        </motion.button>

        {/* Footer: "Belum punya akun? Daftar" */}
        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={handlePressGoogle}
              className="text-[#168A5B] font-bold hover:underline"
            >
              Daftar
            </button>
          </p>
        </div>
      </div>

      {/* Security Assurance Badge */}
      <div className="z-10 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pb-2">
        <ShieldCheck size={12} className="text-[#168A5B]" />
        <span>Akses aman terenkripsi PKBM Bina Insani</span>
      </div>

      {/* GOOGLE ACCOUNT MODAL */}
      <GoogleAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSelectAccount={handleSelectGoogleAccount}
        isLoading={isLoading}
      />

      {/* Bottom Corner Waves */}
      <BottomCornerWaveDecor />
    </motion.div>
  );
};
