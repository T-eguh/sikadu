import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import {
  AbstractBackgroundDecor,
  StudentLoginIllustration,
} from '../components/EducationalIllustrations';
import { GoogleAccountModal } from './GoogleAccountModal';
import { mockBackend, TOKEN_STORAGE_KEY } from '../mockApi';
import { User } from '../types';
import { THEME } from '../theme';

interface StudentLoginScreenProps {
  onBackToRoles: () => void;
  onStudentLoginSuccess: (user: User, token: string, requiresClassCode?: boolean) => void;
}

export const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({
  onBackToRoles,
  onStudentLoginSuccess,
}) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Button Press Interaction: scale down, "Menghubungkan...", spinner, then open picker
  const handlePressGoogle = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowAccountModal(true);
    }, 450);
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
      id="bisa-student-login-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-y-auto font-sans"
    >
      {/* Background Subtle Shapes */}
      <AbstractBackgroundDecor variant="student" />

      {/* 1. HEADER: Back Button & Logo (Fade) */}
      <div className="z-10 flex items-center justify-between pt-1">
        {/* Back Button */}
        <motion.button
          type="button"
          onClick={onBackToRoles}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          title="Kembali ke Pilih Role"
        >
          <ArrowLeft size={16} />
        </motion.button>

        {/* Logo existing BISA kecil & Nama (Fade) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2"
        >
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
        </motion.div>

        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* 2 & 3. CONTENT: Judul (Fade Up) & Ilustrasi (Slide Up) */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center text-center my-auto py-2">
        {/* 3. Modern Digital Learning Illustration (Slide Up) */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="w-full mb-3"
        >
          <StudentLoginIllustration />
        </motion.div>

        {/* 2. Judul: Login Siswa (Fade Up) */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
          className="max-w-[280px]"
        >
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
            Login Siswa
          </h2>

          <p className="text-xs text-slate-500 font-normal mt-2 leading-relaxed">
            Masuk dengan akun Google kamu untuk melanjutkan.
          </p>
        </motion.div>

        {/* Error Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[290px] bg-[#FDECEC] border border-rose-200 text-[#D62828] text-xs p-2.5 rounded-xl flex items-start gap-2 mt-3 text-left"
          >
            <span className="flex-1 font-medium">{errorMessage}</span>
          </motion.div>
        )}
      </div>

      {/* 4. GOOGLE BUTTON (Fade Up Terakhir, Micro-interaction: Scale down, Menghubungkan..., Spinner) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.4, ease: 'easeOut' }}
        className="z-10 pb-2 space-y-2.5"
      >
        <motion.button
          type="button"
          onClick={handlePressGoogle}
          disabled={isConnecting || isLoading}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full py-3.5 px-4 rounded-[20px] bg-white border-2 border-slate-200/90 shadow-md hover:border-[#168A5B] hover:shadow-lg transition-all duration-200 flex items-center justify-between group disabled:opacity-75"
        >
          <div className="flex items-center gap-3">
            {/* Google Icon */}
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center p-1.5 shadow-2xs border border-slate-100">
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

            <div className="text-left">
              <span className="text-xs font-bold text-[#1F2937] block leading-tight">
                {isConnecting ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
              </span>
              <span className="text-[10px] text-slate-400">
                Masuk aman sekali ketuk
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#168A5B] group-hover:text-white group-hover:translate-x-1 transition-all">
            {isConnecting ? (
              <Loader2 size={14} className="animate-spin text-[#168A5B]" />
            ) : (
              <ArrowRight size={14} />
            )}
          </div>
        </motion.button>

        {/* Security Assurance Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck size={12} className="text-[#168A5B]" />
          <span>Akun Google kamu aman dan terlindungi.</span>
        </div>
      </motion.div>

      {/* HALAMAN 5: GOOGLE ACCOUNT MODAL */}
      <GoogleAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSelectAccount={handleSelectGoogleAccount}
        isLoading={isLoading}
      />
    </motion.div>
  );
};
