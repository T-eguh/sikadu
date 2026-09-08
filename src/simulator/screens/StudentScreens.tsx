import React from 'react';
import { User } from '../types';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  User as UserIcon,
  CheckCircle2,
  Clock,
  ChevronRight,
  LogOut,
  Info,
} from 'lucide-react';

import { StudentModuleTab } from './StudentModuleTab';

interface StudentScreensProps {
  user: User;
  activeTab: 'dashboard' | 'modul' | 'tugas' | 'profile';
  onNavigateTab: (tab: 'dashboard' | 'modul' | 'tugas' | 'profile') => void;
  onLogout: () => void;
}

export const StudentScreens: React.FC<StudentScreensProps> = ({
  user,
  activeTab,
  onNavigateTab,
  onLogout,
}) => {
  if (activeTab === 'modul') {
    return <StudentModuleTab user={user} />;
  }

  if (activeTab === 'tugas') {

    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800">Daftar Tugas & Latihan</h3>
          <p className="text-[11px] text-slate-500">Tugas yang perlu diselesaikan</p>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Latihan Matriks & Vektor</h4>
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
                <h4 className="text-xs font-bold text-slate-800">Analisis Paragraf Eksposisi</h4>
                <p className="text-[11px] text-slate-500">Bahasa Indonesia</p>
                <span className="text-[10px] text-slate-400">Tenggat: Senin Depan</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Sudah Dikumpul
            </span>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2 text-amber-800 text-[11px]">
          <Info size={15} className="shrink-0 mt-0.5" />
          <span>Upload berkas tugas dan ujian timer online akan aktif pada Tahap 2 LMS.</span>
        </div>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-md">
            {user.name.charAt(0)}
          </div>
          <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
          <p className="text-xs text-slate-500">{user.email}</p>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 mt-2.5">
            <Sparkles size={14} />
            <span>Siswa Terdaftar</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-700 mb-2">Identitas Siswa</h4>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nomor Induk Siswa (NIS)</span>
            <span className="font-semibold text-slate-800">
              {user.student?.studentNumber || '24001'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">NISN Nasional</span>
            <span className="font-semibold text-slate-800">
              {user.student?.nisn || '0071234561'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Kelas</span>
            <span className="font-semibold text-slate-800">Kelas X - MIPA</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Status Belajar</span>
            <span className="font-semibold text-emerald-600">Aktif Belajar</span>
          </div>
        </div>

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

  // Dashboard Tab
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3.5">
      {/* Welcome Message Card */}
      <div className="bg-emerald-600 rounded-2xl p-4 text-white shadow-md shadow-emerald-600/20 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles size={26} className="text-white" />
        </div>
        <div>
          <span className="text-[11px] text-emerald-100 font-medium">Semangat Belajar,</span>
          <h3 className="text-sm font-extrabold leading-tight">{user.name}</h3>
          <p className="text-[11px] text-emerald-100/90 mt-0.5">
            Platform Pembelajaran Digital Sekolah Model
          </p>
        </div>
      </div>

      {/* Informasi Akun & Status Akun Siswa */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Informasi & Status Akun Siswa</h4>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">NIS Siswa</span>
              <span className="text-xs font-bold text-slate-800">
                {user.student?.studentNumber || '24001'}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Aktif Terdaftar</span>
            </span>
          </div>

          <div className="border-t border-slate-100 pt-2.5 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">NISN Nasional</span>
              <span className="font-semibold text-slate-700">
                {user.student?.nisn || '0071234561'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Status Kelas</span>
              <span className="font-semibold text-slate-700">Kelas X - Semester 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Cepat Siswa */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Menu Cepat Siswa</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('modul')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <BookOpen size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Modul Saya</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Akses materi digital</span>
          </button>

          <button
            onClick={() => onNavigateTab('tugas')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-amber-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <CheckSquare size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Daftar Tugas</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Tenggat & latihan</span>
          </button>

          <button
            onClick={() => onNavigateTab('profile')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-sky-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <UserIcon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Profil Siswa</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Data NISN & akun</span>
          </button>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col items-start text-left opacity-70">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <Sparkles size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">Nilai & Rapor</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Tersedia di Tahap 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
