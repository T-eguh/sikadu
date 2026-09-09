import React, { useState } from 'react';
import {
  KeyRound,
  School,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { mockBackend } from '../mockApi';
import { AbstractBackgroundDecor } from '../components/EducationalIllustrations';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { THEME } from '../theme';

interface StudentActivationScreenProps {
  currentUser: User;
  onJoinSuccess: (updatedUser: User, classData: any) => void;
  onLogout: () => void;
}

export const StudentActivationScreen: React.FC<StudentActivationScreenProps> = ({
  currentUser,
  onJoinSuccess,
  onLogout,
}) => {
  const [classCode, setClassCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = classCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage('Kode kelas wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await mockBackend.joinClassWithCode(currentUser.id, cleanCode);
      if (result && result.success) {
        const updatedUser: User = {
          ...currentUser,
          student: currentUser.student
            ? { ...currentUser.student, status: 'ACTIVE' }
            : currentUser.student,
        };
        onJoinSuccess(updatedUser, result.class);
      } else {
        setErrorMessage(result.message || 'Kode kelas tidak valid atau sudah kadaluarsa.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memverifikasi kode kelas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      id="bisa-student-activation-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full h-full bg-[#F7F9F8] flex flex-col justify-between p-5 select-none relative overflow-y-auto font-sans"
    >
      {/* Background Decor */}
      <AbstractBackgroundDecor variant="student" />

      {/* Top Header: Back Button, Logo, Title */}
      <div className="z-10 flex items-center justify-between pt-1">
        <motion.button
          type="button"
          onClick={onLogout}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          title="Kembali ke Login"
        >
          <ArrowLeft size={16} />
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-[#168A5B]/30 flex items-center justify-center p-0.5">
            <PkbmOfficialLogo size={24} showText={false} variant="color" />
          </div>
          <span className="text-xs font-black text-[#1F2937] tracking-wider">BISA</span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="text-[11px] font-bold text-slate-400 hover:text-[#D62828] transition"
        >
          Keluar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="z-10 flex-1 flex flex-col justify-center my-auto py-2">
        {/* Judul & Subtitle */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-3"
        >
          <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
            Lengkapi Pendaftaran
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
            Masukkan kode kelas untuk bergabung dengan kelas Anda.
          </p>
        </motion.div>

        {/* 1. PROFILE CARD: Google profile picture, Name, Email (Visual Section) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-3.5"
        >
          <div className="relative">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
              }
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#168A5B] shadow-xs"
            />
            {/* Google Verified Icon */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
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
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-[#1F2937] truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#168A5B] border border-[#168A5B]/30">
                Siswa Terverifikasi
              </span>
            </div>
          </div>
        </motion.div>

        {/* Error Notification */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FDECEC] border border-rose-200 text-[#D62828] text-xs p-2.5 rounded-xl flex items-start gap-2 mt-3"
          >
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#D62828]" />
            <span className="flex-1 font-medium leading-snug">{errorMessage}</span>
          </motion.div>
        )}

        {/* 2. KODE KELAS SECTION: Large Input with Focus Animation */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-3.5 space-y-3"
        >
          <div>
            <label className="block text-xs font-black text-[#1F2937] mb-1">
              Kode Kelas
            </label>

            {/* Large Input with Key Icon and Smooth Focus Transition */}
            <div className="relative">
              <div
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isInputFocused
                    ? 'bg-[#FDECEC] text-[#D62828]'
                    : 'bg-[#E8F5EE] text-[#168A5B]'
                }`}
              >
                <KeyRound size={17} />
              </div>
              <input
                type="text"
                placeholder="Contoh: BISA-7A-X4K9P"
                value={classCode}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                disabled={isSubmitting}
                className={`w-full bg-white text-slate-900 pl-14 pr-4 py-3.5 rounded-2xl border-2 text-xs font-mono font-black tracking-wider uppercase outline-none transition-all duration-200 ${
                  isInputFocused
                    ? 'border-[#D62828] shadow-md shadow-red-500/10 scale-[1.01]'
                    : 'border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Quick Demo Code Buttons for Convenience */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Kode Kelas Uji Coba:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setClassCode('BISA-10MIPA1-K9X2')}
                className="px-2.5 py-1 bg-[#E8F5EE] hover:bg-emerald-100 border border-[#168A5B]/20 text-[#168A5B] rounded-lg text-[10.5px] font-mono font-bold transition"
              >
                BISA-10MIPA1-K9X2
              </button>
              <button
                type="button"
                onClick={() => setClassCode('BISA-10MIPA2-M8Y7')}
                className="px-2.5 py-1 bg-[#E8F5EE] hover:bg-emerald-100 border border-[#168A5B]/20 text-[#168A5B] rounded-lg text-[10.5px] font-mono font-bold transition"
              >
                BISA-10MIPA2-M8Y7
              </button>
            </div>
          </div>

          {/* 3. GABUNG KELAS BUTTON: MERAH (#D62828) as Primary Color, Scale animation, Loading State */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            className="w-full py-3.5 px-4 rounded-[20px] bg-[#D62828] hover:bg-[#b82222] text-white font-black text-xs shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 mt-2 group disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Memverifikasi Kode...</span>
              </>
            ) : (
              <>
                <span>Gabung Kelas</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Help Notice */}
        <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
          <HelpCircle size={15} className="text-[#168A5B] shrink-0 mt-0.5" />
          <span>
            Belum memiliki kode kelas? Hubungi <b>guru wali kelas</b> atau <b>administrator PKBM Bina Insani</b> untuk mendapatkan kode aktivasi.
          </span>
        </div>
      </div>

      <div className="z-10 text-center py-1">
        <p className="text-[10px] text-slate-400">BISA • HEBAT • MANDIRI • KREATIF</p>
      </div>
    </motion.div>
  );
};
