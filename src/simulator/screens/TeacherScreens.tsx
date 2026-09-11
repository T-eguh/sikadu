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
  BookOpen,
  Sparkles,
  Calendar,
  Users,
  Award,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  EducationStatCard,
  AnimatedLearningProgressBar,
  FloatingBookIllustration,
  WritingPencilIllustration,
} from '../components/EducationVisualSystem';
import { TeacherDashboardHeroBanner } from '../components/EducationHeroVisuals';

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

  // Dashboard Tab - Ruang Guru Digital
  return (
    <div className="flex-1 w-full bg-[#F7F9F8] flex flex-col p-4 overflow-y-auto space-y-3.5 select-none font-sans">
      {/* 1. Ruang Guru Digital Hero Visual Besar */}
      <TeacherDashboardHeroBanner
        teacherName={user.name}
        nip={user.teacher?.teacherNumber || '198501152010011001'}
        activeModulesCount={4}
        assignedClassesCount={2}
        onManageModules={() => onNavigateTab('modul')}
      />

      {/* 2. Teaching Activity Summary (Stat Cards with Animation) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-800 tracking-tight">Aktivitas Mengajar</h4>
          <span className="text-[10px] font-semibold text-[#168A5B] bg-[#E8F5EE] px-2 py-0.5 rounded-full border border-[#168A5B]/20">
            Semester Genap 2026
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <EducationStatCard
            index={0}
            title="Modul Ajar"
            value="4 Modul"
            subtitle="2 Terbit • 2 Review"
            icon={BookOpen}
            accent="green"
            onClick={() => onNavigateTab('modul')}
          />
          <EducationStatCard
            index={1}
            title="Kelas Aktif"
            value="2 Rombel"
            subtitle="62 Siswa Diampu"
            icon={Calendar}
            accent="blue"
            onClick={() => onNavigateTab('kelas')}
          />
          <EducationStatCard
            index={2}
            title="NIP Guru"
            value={user.teacher?.teacherNumber?.slice(0, 7) || '1985011'}
            subtitle="Terverifikasi Kemdikbud"
            icon={Award}
            accent="purple"
            onClick={() => onNavigateTab('profile')}
          />
          <EducationStatCard
            index={3}
            title="Status Akun"
            value="AKTIF"
            subtitle="Layanan LMS Siap"
            icon={CheckCircle2}
            accent="green"
          />
        </div>
      </div>

      {/* 3. Kurikulum Mengajar & Progres Penyusunan Materi */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center">
              <WritingPencilIllustration size={22} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Target Bahan Ajar Mandiri</h5>
              <p className="text-[10px] text-slate-400">Penyusunan modul ajar semester ini</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#D62828] bg-[#FDECEC] px-2 py-0.5 rounded-md border border-[#D62828]/20">
            Target 6 Modul
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-0.5">
            <span>Matematika X-A & X-B (Penyusunan Modul)</span>
            <span className="font-bold text-[#168A5B]">66% Selesai</span>
          </div>
          <AnimatedLearningProgressBar value={66} height="h-2" variant="green" showLabel={false} />
        </div>
      </motion.div>

      {/* 4. Menu Cepat Guru with Micro-Interactions */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Akses Cepat Pengajar</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab('kelas')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-sky-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 border border-sky-100">
              <BookMarked size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Jadwal Kelas</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Daftar kelas & jam mengajar</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab('modul')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-purple-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 border border-purple-100">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Materi & Modul</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Kelola modul pembelajaran</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab('profile')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-start text-left hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
              <UserIcon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Profil Pengajar</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Informasi data diri & NIP</span>
          </motion.button>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col items-start text-left opacity-75">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <Award size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500">Penilaian Siswa</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Buku nilai & evaluasi LMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
