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
} from 'lucide-react';

import { StudentModuleTab } from './StudentModuleTab';
import { mockBackend } from '../mockApi';

interface StudentScreensProps {
  user: User;
  activeTab: 'dashboard' | 'modul' | 'tugas' | 'profile';
  onNavigateTab: (tab: 'dashboard' | 'modul' | 'tugas' | 'profile') => void;
  onLogout: () => void;
  initialOpenJoinModal?: boolean;
}

export const StudentScreens: React.FC<StudentScreensProps> = ({
  user: initialUser,
  activeTab,
  onNavigateTab,
  onLogout,
  initialOpenJoinModal = false,
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
      // Update local state to ACTIVE
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

  if (activeTab === 'modul') {
    return <StudentModuleTab user={currentUser} />;
  }

  if (activeTab === 'tugas') {
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3 font-sans">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800">Daftar Tugas & Latihan Siswa</h3>
          <p className="text-[11px] text-slate-500">Tugas mandiri dan evaluasi pembelajaran BISA</p>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Latihan Aljabar & Persamaan</h4>
                <p className="text-[11px] text-slate-500">Matematika Wajib</p>
                <span className="text-[10px] text-amber-700 font-semibold">Tenggat: Jumat, 23:59</span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Belum Selesai
            </span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckSquare size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Analisis Teks Eksposisi</h4>
                <p className="text-[11px] text-slate-500">Bahasa Indonesia</p>
                <span className="text-[10px] text-slate-400">Tenggat: Senin Depan</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Sudah Dikumpul
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-start gap-2 text-blue-900 text-[11px]">
          <Info size={15} className="shrink-0 mt-0.5 text-blue-600" />
          <span>Pengumpulan berkas tugas dan tes berkala terhubung dengan sistem modul BISA.</span>
        </div>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3.5 font-sans">
        {/* User Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-2">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
            {currentUser.student?.authProvider === 'GOOGLE' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center">
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

          <h3 className="text-sm font-bold text-slate-900">{currentUser.name}</h3>
          <p className="text-xs text-slate-500">{currentUser.email}</p>

          <div className="flex items-center gap-1.5 mt-2">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-blue-200">
              Siswa BISA
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Google Verified</span>
            </span>
          </div>
        </div>

        {/* Status & Identitas Siswa */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="font-bold text-slate-800">Identitas Siswa PKBM Bina Insani</h4>
            <span className="text-[10px] text-slate-400 font-semibold">T.A. 2026/2027</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Status Keanggotaan</span>
            <span
              className={`font-bold ${
                currentUser.student?.status === 'ACTIVE'
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}
            >
              {currentUser.student?.status === 'ACTIVE' ? 'Aktif Terdaftar' : 'Menunggu Kode Kelas'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Kelas Terdaftar</span>
            <span className="font-semibold text-slate-800">
              {myClassData?.name || 'Belum masuk kelas'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nomor Induk Siswa (NIS)</span>
            <span className="font-semibold text-slate-800">
              {currentUser.student?.studentNumber || '-'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">NISN Nasional</span>
            <span className="font-semibold text-slate-800">
              {currentUser.student?.nisn || '-'}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-500">Lembaga</span>
            <span className="font-semibold text-blue-900">PKBM Bina Insani</span>
          </div>
        </div>

        {/* Join Class Action Button in Profile */}
        <button
          onClick={() => setShowJoinModal(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <KeyRound size={15} />
          <span>{myClassData ? 'Ganti / Masukkan Kode Kelas Baru' : 'Masukkan Kode Kelas BISA'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <LogOut size={16} />
          <span>Keluar dari Akun (Logout)</span>
        </button>
      </div>
    );
  }

  // DASHBOARD TAB
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3 font-sans">
      {/* Official BISA Welcome Card */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2563EB] rounded-2xl p-4 text-white shadow-md shadow-blue-950/20 flex items-center justify-between relative overflow-hidden">
        <div className="z-10 flex items-center gap-3">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
            alt={currentUser.name}
            className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-sky-200 font-bold tracking-wider uppercase">BISA PKBM BINA INSANI</span>
            </div>
            <h3 className="text-sm font-black leading-tight text-white">{currentUser.name}</h3>
            <p className="text-[10px] text-amber-300 font-bold mt-0.5 tracking-wider">
              HEBAT • MANDIRI • KREATIF
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
          <Sparkles size={20} className="text-amber-300" />
        </div>
      </div>

      {/* PENDING CLASS CODE ALERT BANNER */}
      {isPendingEnrollment && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5 animate-pulse-gentle">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <KeyRound size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-900">Anda Belum Terdaftar di Kelas</h4>
              <p className="text-[11px] text-amber-800/90 leading-snug mt-0.5">
                Dapatkan <b>Kode Kelas</b> dari Guru atau Admin PKBM Bina Insani untuk membuka modul dan tugas belajar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <KeyRound size={14} />
            <span>Masukkan Kode Kelas Sekarang</span>
          </button>
        </div>
      )}

      {/* Status Kelas & Akademik */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
            <span className="text-xs font-bold text-slate-800">Status Akademik</span>
          </div>
          {myClassData ? (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Aktif di Kelas</span>
            </span>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Belum Masuk Kelas
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Kelas</span>
            <span className="font-bold text-slate-800 block truncate">
              {myClassData?.name || 'Menunggu Kode Kelas'}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Tahun Ajaran</span>
            <span className="font-bold text-slate-800 block truncate">
              {myClassData?.academicYear?.name || '2026/2027 Ganjil'}
            </span>
          </div>
        </div>

        {myClassData && (
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-blue-600" />
              <span>{myClassData.totalClassmates || 0} Siswa dalam kelas</span>
            </div>
            <button
              onClick={() => setShowJoinModal(true)}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
            >
              Ubah Kode
            </button>
          </div>
        )}
      </div>

      {/* Menu Utama Siswa BISA */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Layanan Pembelajaran</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('modul')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-blue-400 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-bold text-slate-800">Modul Belajar</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Materi digital & PDF</span>
          </button>

          <button
            onClick={() => onNavigateTab('tugas')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-amber-400 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <CheckSquare size={18} />
            </div>
            <span className="text-xs font-bold text-slate-800">Tugas & Evaluasi</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Latihan mandiri</span>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-purple-400 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
              <KeyRound size={18} />
            </div>
            <span className="text-xs font-bold text-slate-800">Kode Kelas</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Gabung kelas baru</span>
          </button>

          <button
            onClick={() => onNavigateTab('profile')}
            className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-sky-400 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5">
              <UserIcon size={18} />
            </div>
            <span className="text-xs font-bold text-slate-800">Profil Saya</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Data & akun Google</span>
          </button>
        </div>
      </div>

      {/* JOIN CLASS MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 animate-slide-up flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <KeyRound size={17} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Gabung Kelas BISA</h3>
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
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
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
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:bg-white text-xs font-mono font-bold tracking-wider uppercase transition outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Kode kelas bersifat unik dan diberikan oleh guru atau admin.
                </span>
              </div>

              {/* Sample Quick Codes Shortcut for Demo */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Pintasan Kode Undangan Uji Coba:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setClassCodeInput('BISA-10MIPA1-K9X2')}
                    className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-lg text-[10px] font-mono font-bold text-blue-800 transition"
                  >
                    BISA-10MIPA1-K9X2
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassCodeInput('BISA-10MIPA2-M8Y7')}
                    className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-lg text-[10px] font-mono font-bold text-blue-800 transition"
                  >
                    BISA-10MIPA2-M8Y7
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-600/20 active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2"
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
