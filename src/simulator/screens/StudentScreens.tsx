import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  User as UserIcon,
  CheckCircle2,
  Clock,
  LogOut,
  Info,
  KeyRound,
  AlertCircle,
  Loader2,
  GraduationCap,
  Users,
  Play,
  ArrowRight,
  TrendingUp,
  Compass,
  FileText,
  Calculator,
  Languages,
  Atom,
  ChevronRight,
} from 'lucide-react';

import { StudentModuleTab } from './StudentModuleTab';
import { mockBackend } from '../mockApi';
import { PkbmOfficialLogo } from '../components/LoginVisualAssets';
import { AbstractBackgroundDecor } from '../components/EducationalIllustrations';
import { THEME } from '../theme';
import { motion } from 'motion/react';
import {
  AnimatedLearningProgressBar,
  FloatingBookIllustration,
  WritingPencilIllustration,
  GraduationCapBadge,
  EducationEmptyState,
} from '../components/EducationVisualSystem';
import { StudentDashboardHeroBanner } from '../components/EducationHeroVisuals';

interface StudentScreensProps {
  user: User;
  activeTab: 'dashboard' | 'modul' | 'tugas' | 'profile';
  onNavigateTab: (tab: 'dashboard' | 'modul' | 'tugas' | 'profile') => void;
  onLogout: () => void;
  initialOpenJoinModal?: boolean;
  onOpenModuleDetail?: () => void;
}

export const StudentScreens: React.FC<StudentScreensProps> = ({
  user: initialUser,
  activeTab,
  onNavigateTab,
  onLogout,
  initialOpenJoinModal = false,
  onOpenModuleDetail,
}) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [myClassData, setMyClassData] = useState<any>(null);
  const [isLoadingClass, setIsLoadingClass] = useState(true);

  // Join Class Modal State
  const [showJoinModal, setShowJoinModal] = useState(initialOpenJoinModal);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  const fetchClassInfo = async () => {
    try {
      setIsLoadingClass(true);
      const data = await mockBackend.getStudentMyClass(currentUser.id);
      setMyClassData(data);
    } catch {
      setMyClassData(null);
    } finally {
      setIsLoadingClass(false);
    }
  };

  useEffect(() => {
    fetchClassInfo();
  }, [currentUser.id]);

  useEffect(() => {
    if (initialOpenJoinModal) {
      setShowJoinModal(true);
    }
  }, [initialOpenJoinModal]);

  const handleJoinClassSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setJoinError(null);
    setJoinSuccess(null);

    const cleanCode = classCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setJoinError('Silakan ketik Kode Kelas BISA.');
      return;
    }

    setIsJoining(true);
    try {
      const res = await mockBackend.joinClassWithCode(currentUser.id, cleanCode);
      setJoinSuccess(res.message);
      setClassCodeInput('');
      setCurrentUser((prev) => ({
        ...prev,
        student: prev.student
          ? { ...prev.student, status: 'ACTIVE' }
          : prev.student,
      }));
      await fetchClassInfo();
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess(null);
      }, 1500);
    } catch (err: any) {
      setJoinError(err.message || 'Gagal bergabung ke kelas.');
    } finally {
      setIsJoining(false);
    }
  };

  const isPendingEnrollment =
    currentUser.student?.status === 'PENDING' || (!isLoadingClass && !myClassData);

  // Dynamic greeting according to time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // 1. MODUL TAB
  if (activeTab === 'modul') {
    return <StudentModuleTab user={currentUser} />;
  }

  // 2. TUGAS / PROGRESS TAB
  if (activeTab === 'tugas') {
    return (
      <div className="flex-1 w-full bg-[#F7F9F8] flex flex-col p-4 overflow-y-auto space-y-3 font-sans select-none">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1B7F5A] flex items-center justify-center">
              <CheckSquare size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1F2937]">Tugas & Evaluasi Siswa</h3>
              <p className="text-[11px] text-slate-500">Latihan mandiri dan evaluasi BISA</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Assignment 1 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E53935] flex items-center justify-center border border-rose-100">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Latihan Eksponen & Logaritma</h4>
                <p className="text-[11px] text-slate-500">Matematika Wajib • Bab 1</p>
                <span className="text-[10px] text-[#E53935] font-semibold">Tenggat: Jumat, 23:59</span>
              </div>
            </div>
            <span className="text-[10px] bg-rose-50 text-[#E53935] font-bold px-2 py-0.5 rounded-full border border-rose-200">
              Belum Selesai
            </span>
          </div>

          {/* Assignment 2 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B7F5A] flex items-center justify-center border border-emerald-100">
                <CheckSquare size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Analisis Teks Eksposisi</h4>
                <p className="text-[11px] text-slate-500">Bahasa Indonesia</p>
                <span className="text-[10px] text-slate-400">Tenggat: Senin Depan</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-[#1B7F5A] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Sudah Dikumpul
            </span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200/80 flex items-start gap-2.5 text-[#064E3B] text-[11px]">
          <Info size={16} className="shrink-0 mt-0.5 text-[#1B7F5A]" />
          <span>Pengumpulan berkas tugas dan tes berkala terhubung otomatis dengan sistem modul PKBM Bina Insani.</span>
        </div>
      </div>
    );
  }

  // 3. PROFILE TAB
  if (activeTab === 'profile') {
    return (
      <div className="flex-1 w-full bg-[#F7F9F8] flex flex-col p-4 overflow-y-auto space-y-3.5 font-sans select-none">
        {/* User Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-2">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#1B7F5A] shadow-md"
            />
            {currentUser.student?.authProvider === 'GOOGLE' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            )}
          </div>

          <h3 className="text-sm font-bold text-[#1F2937]">{currentUser.name}</h3>
          <p className="text-xs text-slate-500">{currentUser.email}</p>

          <div className="flex items-center gap-1.5 mt-2">
            <span className="bg-emerald-50 text-[#1B7F5A] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
              Siswa BISA
            </span>
            <span className="bg-emerald-50 text-[#0F5C40] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} className="text-[#1B7F5A]" />
              <span>Google Verified</span>
            </span>
          </div>
        </div>

        {/* Identity & Status */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="font-bold text-[#1F2937]">Identitas Siswa PKBM Bina Insani</h4>
            <span className="text-[10px] text-slate-400 font-semibold">T.A. 2026/2027</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Status Keanggotaan</span>
            <span
              className={`font-bold ${
                currentUser.student?.status === 'ACTIVE'
                  ? 'text-[#1B7F5A]'
                  : 'text-amber-600'
              }`}
            >
              {currentUser.student?.status === 'ACTIVE' ? 'Aktif Terdaftar' : 'Menunggu Kode Kelas'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Kelas Terdaftar</span>
            <span className="font-semibold text-[#1F2937]">
              {myClassData?.name || 'Belum masuk kelas'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nomor Induk Siswa (NIS)</span>
            <span className="font-semibold text-[#1F2937]">
              {currentUser.student?.studentNumber || '-'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">NISN Nasional</span>
            <span className="font-semibold text-[#1F2937]">
              {currentUser.student?.nisn || '-'}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-500">Lembaga</span>
            <span className="font-semibold text-[#1B7F5A]">PKBM Bina Insani</span>
          </div>
        </div>

        {/* Join Class Action Button in Profile */}
        <button
          onClick={() => setShowJoinModal(true)}
          className="w-full bg-gradient-to-r from-[#1B7F5A] to-[#0F5C40] text-white font-bold text-xs py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <KeyRound size={15} />
          <span>{myClassData ? 'Ganti / Masukkan Kode Kelas Baru' : 'Masukkan Kode Kelas BISA'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-[#E53935] border border-rose-200 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <LogOut size={16} />
          <span>Keluar dari Akun (Logout)</span>
        </button>
      </div>
    );
  }

  // 4. HALAMAN 8: DASHBOARD SISWA (As explicitly specified)
  return (
    <div
      id="bisa-student-dashboard"
      className="flex-1 w-full bg-[#F7F9F8] flex flex-col p-4 overflow-y-auto space-y-3.5 font-sans select-none relative"
    >
      {/* 1. HEADER DASHBOARD as specified */}
      <div className="flex items-center justify-between pt-1 animate-fade-down">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#1B7F5A] tracking-wider uppercase">
              {getGreeting()}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#1F2937] leading-tight">
            Halo, {currentUser.name} 👋
          </h2>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">
            Siap belajar dan berkembang hari ini?
          </p>
        </div>

        {/* Profile Avatar on the Right */}
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="relative focus:outline-none"
        >
          <img
            src={
              currentUser.avatar ||
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
            }
            alt={currentUser.name}
            className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1B7F5A] border-2 border-white" />
        </button>
      </div>

      {/* PENDING CLASS CODE ALERT BANNER (If not enrolled) */}
      {isPendingEnrollment && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5 animate-fade-up">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <KeyRound size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-900">Kamu Belum Masuk Kelas</h4>
              <p className="text-[11px] text-amber-800/90 leading-snug mt-0.5">
                Masukkan <b>Kode Kelas</b> dari Guru atau Admin PKBM Bina Insani untuk membuka modul & tugas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <KeyRound size={14} />
            <span>Masukkan Kode Kelas Sekarang</span>
          </button>
        </div>
      )}

      {/* 2. PROGRESS HERO CARD - RUANG BELAJAR SISWA DIGITAL (HERO LEARNING VISUAL BESAR) */}
      <StudentDashboardHeroBanner
        studentName={currentUser.name}
        classNameTitle={myClassData?.name || 'Paket Belajar BISA'}
        completedModules={7}
        totalModules={20}
        learningStreak={5}
        onContinue={() => onNavigateTab('modul')}
      />

      {/* 3. SECTION: LANJUTKAN BELAJAR */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-black text-slate-900 tracking-tight">
              Lanjutkan Belajar
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#168A5B] animate-pulse" />
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('modul')}
            className="text-[10.5px] font-bold text-[#168A5B] hover:underline"
          >
            Lihat Semua Modul
          </button>
        </div>

        {/* Card Horizontal Modern with Interactive Hover */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            if (onOpenModuleDetail) {
              onOpenModuleDetail();
            } else {
              onNavigateTab('modul');
            }
          }}
          className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3 group hover:border-[#168A5B] cursor-pointer transition"
        >
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#168A5B] shrink-0 group-hover:scale-110 group-hover:bg-[#E8F5EE] transition-all">
            <Calculator size={22} />
          </div>

          {/* Mata Pelajaran & Judul Modul & Progress */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#168A5B] uppercase tracking-wider block">
              Matematika Wajib • Bab 1
            </span>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 group-hover:text-[#168A5B] transition-colors">
              Eksponen dan Bentuk Akar
            </h4>

            {/* Small Progress Indicator */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#168A5B] rounded-full" style={{ width: '65%' }} />
              </div>
              <span className="text-[9.5px] font-bold text-slate-500">65%</span>
            </div>
          </div>

          {/* Button "Lanjutkan" in Red as specified */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenModuleDetail) {
                onOpenModuleDetail();
              } else {
                onNavigateTab('modul');
              }
            }}
            className="px-3 py-2 rounded-xl bg-[#D62828] hover:bg-[#b81d1d] text-white text-[11px] font-bold shadow-xs active:scale-95 transition flex items-center gap-1.5 shrink-0"
          >
            <span>Lanjut</span>
            <Play size={10} fill="currentColor" />
          </button>
        </motion.div>
      </motion.div>

      {/* 4. SECTION: MATA PELAJARAN SAYA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-900 tracking-tight">
            Mata Pelajaran Saya
          </h3>
          <span className="text-[10.5px] font-semibold text-[#168A5B] bg-[#E8F5EE] px-2 py-0.5 rounded-md border border-[#168A5B]/20">
            {myClassData?.name || 'Paket Belajar BISA'}
          </span>
        </div>

        {/* Grid Modern: Matematika, Bahasa Indonesia, Bahasa Inggris, IPA */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Matematika (Red accent) */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onNavigateTab('modul')}
            className="p-3.5 rounded-2xl bg-white border border-rose-200/90 shadow-2xs text-left hover:border-[#D62828] hover:shadow-xs transition active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#D62828] flex items-center justify-center mb-2.5 border border-rose-100 group-hover:scale-110 transition-transform">
              <Calculator size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#D62828] transition-colors">
              Matematika
            </h4>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>4 Modul Digital</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-[#D62828] group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.button>

          {/* 2. Bahasa Indonesia (Emerald Green accent) */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onNavigateTab('modul')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs text-left hover:border-[#168A5B] hover:shadow-xs transition active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#168A5B] flex items-center justify-center mb-2.5 border border-emerald-100 group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#168A5B] transition-colors">
              B. Indonesia
            </h4>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>5 Modul Digital</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-[#168A5B] group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.button>

          {/* 3. Bahasa Inggris (Soft Green accent) */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onNavigateTab('modul')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs text-left hover:border-[#168A5B] hover:shadow-xs transition active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center mb-2.5 border border-[#168A5B]/30 group-hover:scale-110 transition-transform">
              <Languages size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#168A5B] transition-colors">
              B. Inggris
            </h4>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>3 Modul Digital</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-[#168A5B] group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.button>

          {/* 4. IPA (Ruby Red accent) */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onNavigateTab('modul')}
            className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs text-left hover:border-[#D62828] hover:shadow-xs transition active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#D62828] flex items-center justify-center mb-2.5 border border-rose-200 group-hover:scale-110 transition-transform">
              <Atom size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#D62828] transition-colors">
              IPA Terpadu
            </h4>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>6 Modul Digital</span>
              <ChevronRight size={13} className="text-slate-300 group-hover:text-[#D62828] group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* JOIN CLASS MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-slide-up flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1B7F5A] flex items-center justify-center">
                  <KeyRound size={17} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1F2937]">Gabung Kelas BISA</h3>
                  <span className="text-[10px] text-slate-500">PKBM Bina Insani</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinError(null);
                  setJoinSuccess(null);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1"
              >
                Tutup
              </button>
            </div>

            {joinError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl flex items-start gap-2 mt-3 animate-shake">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                <span className="flex-1 font-medium leading-snug">{joinError}</span>
              </div>
            )}

            {joinSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl flex items-start gap-2 mt-3 animate-fade-in">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#1B7F5A]" />
                <span className="flex-1 font-medium leading-snug">{joinSuccess}</span>
              </div>
            )}

            <form onSubmit={handleJoinClassSubmit} className="mt-3.5 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Masukkan Kode Kelas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BISA-10MIPA1-K9X2"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
                  disabled={isJoining}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border-2 border-slate-200 focus:border-[#E53935] focus:bg-white text-xs font-mono font-bold tracking-wider uppercase transition outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Dapatkan kode kelas dari guru atau admin PKBM Bina Insani.
                </span>
              </div>

              {/* Sample Quick Codes */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Pintasan Kode Kelas Demo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setClassCodeInput('BISA-10MIPA1-K9X2')}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-[#1B7F5A] rounded-lg text-[10px] font-mono font-bold text-[#1B7F5A] transition"
                  >
                    BISA-10MIPA1-K9X2
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassCodeInput('BISA-10MIPA2-M8Y7')}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-[#1B7F5A] rounded-lg text-[10px] font-mono font-bold text-[#1B7F5A] transition"
                  >
                    BISA-10MIPA2-M8Y7
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-red-600/20 active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2"
              >
                {isJoining ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memverifikasi Kode...</span>
                  </>
                ) : (
                  <span>Bergabung ke Kelas</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
