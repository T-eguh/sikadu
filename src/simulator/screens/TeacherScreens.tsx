import React from 'react';
import { User } from '../types';
import {
  School,
  BookMarked,
  FileText,
  User as UserIcon,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Info,
} from 'lucide-react';

import { TeacherModuleTab } from './TeacherModuleTab';

interface TeacherScreensProps {
  user: User;
  activeTab: 'dashboard' | 'kelas' | 'modul' | 'profile';
  onNavigateTab: (tab: 'dashboard' | 'kelas' | 'modul' | 'profile') => void;
  onLogout: () => void;
}

export const TeacherScreens: React.FC<TeacherScreensProps> = ({
  user,
  activeTab,
  onNavigateTab,
  onLogout,
}) => {
  if (activeTab === 'kelas') {
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800">Jadwal Kelas Aktif</h3>
          <p className="text-[11px] text-slate-500">Kelas yang diampu semester ini</p>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <BookMarked size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Kelas X-A (Matematika)</h4>
                <p className="text-[11px] text-slate-500">Senin, 08:00 - 09:30</p>
                <span className="text-[10px] text-sky-600 font-semibold">32 Siswa Terdaftar</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <BookMarked size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Kelas X-B (Matematika)</h4>
                <p className="text-[11px] text-slate-500">Selasa, 10:00 - 11:30</p>
                <span className="text-[10px] text-sky-600 font-semibold">30 Siswa Terdaftar</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>

        <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 flex items-start gap-2 text-sky-800 text-[11px]">
          <Info size={15} className="shrink-0 mt-0.5" />
          <span>Fitur presensi siswa dan jurnal mengajar akan dibuka pada Tahap 2 LMS.</span>
        </div>
      </div>
    );
  }

  if (activeTab === 'modul') {
    return <TeacherModuleTab user={user} />;
  }

  if (activeTab === 'profile') {

    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-md">
            {user.name.charAt(0)}
          </div>
          <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
          <p className="text-xs text-slate-500">{user.email}</p>
          <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-bold border border-sky-200 mt-2.5">
            <School size={14} />
            <span>Guru Pengajar</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-700 mb-2">Informasi Kepegawaian</h4>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nomor Induk Pegawai (NIP)</span>
            <span className="font-semibold text-slate-800">
              {user.teacher?.teacherNumber || '198501152010011001'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Status Mengajar</span>
            <span className="font-semibold text-emerald-600">Aktif Terverifikasi</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Mata Pelajaran</span>
            <span className="font-semibold text-slate-800">Matematika & Sains</span>
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
      {/* Welcome Message Card with BISA Official Identity */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2563EB] rounded-2xl p-4 text-white shadow-md shadow-blue-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/10">
            <School size={26} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">
                BISA • PKBM BINA INSANI
              </span>
            </div>
            <h3 className="text-sm font-black leading-tight text-white">{user.name}</h3>
            <p className="text-[10px] text-amber-300 font-bold mt-0.5 tracking-wider">
              HEBAT • MANDIRI • KREATIF
            </p>
          </div>
        </div>
      </div>

      {/* Informasi & Status Akun */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Informasi & Status Akun</h4>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">NIP Guru</span>
              <span className="text-xs font-bold text-slate-800">
                {user.teacher?.teacherNumber || '198501152010011001'}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Akun Aktif</span>
            </span>
          </div>

          <div className="border-t border-slate-100 pt-2.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-slate-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-slate-400" />
              <span>Peran: GURU (TEACHER)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Cepat Guru */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Menu Cepat Guru</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('kelas')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-sky-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <BookMarked size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Jadwal Kelas</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Daftar kelas diampu</span>
          </button>

          <button
            onClick={() => onNavigateTab('modul')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-purple-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Materi & Modul</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Bahan ajar digital</span>
          </button>

          <button
            onClick={() => onNavigateTab('profile')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <UserIcon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Profil Pengajar</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Informasi data guru</span>
          </button>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col items-start text-left opacity-70">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">Penilaian Siswa</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Tersedia di Tahap 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
