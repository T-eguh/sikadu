import React, { useState, useEffect } from 'react';
import { User, ClassInvitationCode } from '../types';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  ChevronRight,
  LogOut,
  Plus,
  Search,
  Key,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  FileText,
} from 'lucide-react';
import { mockBackend } from '../mockApi';
import { motion } from 'motion/react';
import {
  EducationStatCard,
  AnimatedLearningProgressBar,
  EducationEmptyState,
  FloatingBookIllustration,
} from '../components/EducationVisualSystem';
import { AdminDashboardHeroBanner } from '../components/EducationHeroVisuals';

import { AdminModuleReviewModal } from './AdminModuleReviewModal';

interface AdminScreensProps {
  user: User;
  activeTab: 'dashboard' | 'guru' | 'siswa' | 'profile';
  onNavigateTab: (tab: 'dashboard' | 'guru' | 'siswa' | 'profile') => void;
  onLogout: () => void;
}

export const AdminScreens: React.FC<AdminScreensProps> = ({
  user,
  activeTab,
  onNavigateTab,
  onLogout,
}) => {
  // Stats state
  const [stats, setStats] = useState({
    totalTeachers: 2,
    totalStudents: 5,
    totalUsers: 8,
    systemStatus: 'ONLINE',
  });

  const [showModuleReview, setShowModuleReview] = useState(false);


  // Guru State
  const [teachers, setTeachers] = useState<User[]>([]);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [teacherView, setTeacherView] = useState<'list' | 'add' | 'detail' | 'edit' | 'reset-password'>('list');

  // Teacher Form State
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tNip, setTNip] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tNewPassword, setTNewPassword] = useState('');
  const [tMessage, setTMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Siswa State
  const [students, setStudents] = useState<User[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [studentView, setStudentView] = useState<'list' | 'add' | 'detail' | 'edit' | 'reset-password' | 'codes'>('list');

  // Student Form State
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sNis, setSNis] = useState('');
  const [sNisn, setSNisn] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sNewPassword, setSNewPassword] = useState('');
  const [sMessage, setSMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Invitation Codes State (Tahap 4.5)
  const [invitationCodes, setInvitationCodes] = useState<ClassInvitationCode[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [selectedClassForCode, setSelectedClassForCode] = useState<string>('');
  const [newCodeMaxUses, setNewCodeMaxUses] = useState<number>(35);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    const st = await mockBackend.getStats();
    setStats(st);
    const tList = await mockBackend.getTeachers(teacherSearch);
    setTeachers(tList);
    const sList = await mockBackend.getStudents(studentSearch);
    setStudents(sList);
    const codes = await mockBackend.getAllInvitationCodes();
    setInvitationCodes(codes);
    const classes = await mockBackend.getClasses();
    setClassList(classes);
    if (classes.length > 0 && !selectedClassForCode) {
      setSelectedClassForCode(classes[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [teacherSearch, studentSearch]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateCode = async () => {
    if (!selectedClassForCode) return;
    try {
      setCodeMessage(null);
      await mockBackend.generateClassInvitationCode(
        selectedClassForCode,
        newCodeMaxUses > 0 ? newCodeMaxUses : null
      );
      const updatedCodes = await mockBackend.getAllInvitationCodes();
      setInvitationCodes(updatedCodes);
      setCodeMessage({ type: 'success', text: 'Kode kelas baru berhasil dibuat!' });
    } catch (err: any) {
      setCodeMessage({ type: 'error', text: err.message || 'Gagal membuat kode kelas.' });
    }
  };

  const handleDeactivateCode = async (codeId: string) => {
    try {
      await mockBackend.deactivateClassInvitationCode(codeId);
      const updatedCodes = await mockBackend.getAllInvitationCodes();
      setInvitationCodes(updatedCodes);
    } catch (err: any) {
      alert(err.message || 'Gagal menonaktifkan kode');
    }
  };

  const handleRegenerateCode = async (classId: string, oldCodeId: string) => {
    try {
      await mockBackend.regenerateClassInvitationCode(classId, oldCodeId);
      const updatedCodes = await mockBackend.getAllInvitationCodes();
      setInvitationCodes(updatedCodes);
      setCodeMessage({ type: 'success', text: 'Kode kelas berhasil diperbarui!' });
    } catch (err: any) {
      alert(err.message || 'Gagal regenerasi kode');
    }
  };

  // Guru Handlers
  const handleOpenAddTeacher = () => {
    setTName('');
    setTEmail('');
    setTNip('');
    setTPassword('');
    setTMessage(null);
    setTeacherView('add');
  };

  const handleOpenDetailTeacher = (t: User) => {
    setSelectedTeacher(t);
    setTMessage(null);
    setTeacherView('detail');
  };

  const handleOpenEditTeacher = (t: User) => {
    setSelectedTeacher(t);
    setTName(t.name);
    setTEmail(t.email);
    setTNip(t.teacher?.teacherNumber || '');
    setTMessage(null);
    setTeacherView('edit');
  };

  const handleOpenResetPasswordTeacher = (t: User) => {
    setSelectedTeacher(t);
    setTNewPassword('');
    setTMessage(null);
    setTeacherView('reset-password');
  };

  const handleSaveAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setTMessage(null);
    try {
      if (!tName || !tEmail || !tNip || !tPassword) {
        throw new Error('Semua kolom wajib diisi.');
      }
      await mockBackend.createTeacher({
        name: tName,
        email: tEmail,
        teacherNumber: tNip,
        password: tPassword,
      });
      await loadData();
      setTMessage({ type: 'success', text: 'Guru baru berhasil ditambahkan.' });
      setTimeout(() => setTeacherView('list'), 1000);
    } catch (err: any) {
      setTMessage({ type: 'error', text: err.message });
    }
  };

  const handleSaveEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setTMessage(null);
    try {
      const updated = await mockBackend.updateTeacher(selectedTeacher.id, {
        name: tName,
        email: tEmail,
        teacherNumber: tNip,
      });
      setSelectedTeacher(updated);
      await loadData();
      setTMessage({ type: 'success', text: 'Data guru berhasil diperbarui.' });
      setTimeout(() => setTeacherView('detail'), 1000);
    } catch (err: any) {
      setTMessage({ type: 'error', text: err.message });
    }
  };

  const handleToggleTeacherStatus = async () => {
    if (!selectedTeacher) return;
    try {
      const newStatus = !selectedTeacher.isActive;
      const updated = await mockBackend.updateStatus(selectedTeacher.id, newStatus);
      setSelectedTeacher(updated);
      await loadData();
      setTMessage({
        type: 'success',
        text: `Akun guru berhasil di${newStatus ? 'aktifkan' : 'nonaktifkan'}.`,
      });
    } catch (err: any) {
      setTMessage({ type: 'error', text: err.message });
    }
  };

  const handleSaveResetPasswordTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setTMessage(null);
    try {
      await mockBackend.resetPassword(selectedTeacher.id, tNewPassword);
      setTMessage({ type: 'success', text: 'Kata sandi akun guru berhasil diperbarui.' });
      setTimeout(() => setTeacherView('detail'), 1000);
    } catch (err: any) {
      setTMessage({ type: 'error', text: err.message });
    }
  };

  // Siswa Handlers
  const handleOpenAddStudent = () => {
    setSName('');
    setSEmail('');
    setSNis('');
    setSNisn('');
    setSPassword('');
    setSMessage(null);
    setStudentView('add');
  };

  const handleOpenDetailStudent = (s: User) => {
    setSelectedStudent(s);
    setSMessage(null);
    setStudentView('detail');
  };

  const handleOpenEditStudent = (s: User) => {
    setSelectedStudent(s);
    setSName(s.name);
    setSEmail(s.email);
    setSNis(s.student?.studentNumber || '');
    setSNisn(s.student?.nisn || '');
    setSMessage(null);
    setStudentView('edit');
  };

  const handleOpenResetPasswordStudent = (s: User) => {
    setSelectedStudent(s);
    setSNewPassword('');
    setSMessage(null);
    setStudentView('reset-password');
  };

  const handleSaveAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSMessage(null);
    try {
      if (!sName || !sEmail || !sNis || !sNisn || !sPassword) {
        throw new Error('Semua kolom wajib diisi.');
      }
      await mockBackend.createStudent({
        name: sName,
        email: sEmail,
        studentNumber: sNis,
        nisn: sNisn,
        password: sPassword,
      });
      await loadData();
      setSMessage({ type: 'success', text: 'Siswa baru berhasil didaftarkan.' });
      setTimeout(() => setStudentView('list'), 1000);
    } catch (err: any) {
      setSMessage({ type: 'error', text: err.message });
    }
  };

  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSMessage(null);
    try {
      const updated = await mockBackend.updateStudent(selectedStudent.id, {
        name: sName,
        email: sEmail,
        studentNumber: sNis,
        nisn: sNisn,
      });
      setSelectedStudent(updated);
      await loadData();
      setSMessage({ type: 'success', text: 'Data siswa berhasil diperbarui.' });
      setTimeout(() => setStudentView('detail'), 1000);
    } catch (err: any) {
      setSMessage({ type: 'error', text: err.message });
    }
  };

  const handleToggleStudentStatus = async () => {
    if (!selectedStudent) return;
    try {
      const newStatus = !selectedStudent.isActive;
      const updated = await mockBackend.updateStatus(selectedStudent.id, newStatus);
      setSelectedStudent(updated);
      await loadData();
      setSMessage({
        type: 'success',
        text: `Akun siswa berhasil di${newStatus ? 'aktifkan' : 'nonaktifkan'}.`,
      });
    } catch (err: any) {
      setSMessage({ type: 'error', text: err.message });
    }
  };

  const handleSaveResetPasswordStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSMessage(null);
    try {
      await mockBackend.resetPassword(selectedStudent.id, sNewPassword);
      setSMessage({ type: 'success', text: 'Kata sandi siswa berhasil diperbarui.' });
      setTimeout(() => setStudentView('detail'), 1000);
    } catch (err: any) {
      setSMessage({ type: 'error', text: err.message });
    }
  };

  // 1. GURU TAB
  if (activeTab === 'guru') {
    if (teacherView === 'add') {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setTeacherView('list')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Tambah Guru Baru</h2>
          </div>

          <form onSubmit={handleSaveAddTeacher} className="p-4 space-y-3">
            {tMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  tMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {tMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{tMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: guru.budi@pkbmbinainsani.sch.id"
                  value={tEmail}
                  onChange={(e) => setTEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nomor Induk Guru (NIP) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 198501152010011001"
                  value={tNip}
                  onChange={(e) => setTNip(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Kata Sandi Awal *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={tPassword}
                  onChange={(e) => setTPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-blue-900 transition"
            >
              Simpan Guru Baru
            </button>
          </form>
        </div>
      );
    }

    if (teacherView === 'detail' && selectedTeacher) {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTeacherView('list')}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-sm font-bold text-slate-800">Detail Guru</h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedTeacher.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {selectedTeacher.isActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {tMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  tMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {tMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{tMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold mb-2">
                {selectedTeacher.name.charAt(0)}
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">{selectedTeacher.name}</h3>
              <p className="text-xs text-slate-500">{selectedTeacher.email}</p>
              <div className="mt-2 bg-blue-50 text-[#1E3A8A] text-xs font-bold px-3 py-1 rounded-full">
                NIP: {selectedTeacher.teacher?.teacherNumber || '-'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Peran Sistem</span>
                <span className="font-semibold text-slate-800">Guru Pengajar</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status Akun</span>
                <span
                  className={`font-semibold ${
                    selectedTeacher.isActive ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {selectedTeacher.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">ID Akun</span>
                <span className="font-semibold text-slate-800">
                  {selectedTeacher.id.slice(0, 12)}...
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleOpenEditTeacher(selectedTeacher)}
                className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Edit2 size={14} className="text-sky-600" />
                <span>Edit Data Guru</span>
              </button>

              <button
                onClick={() => handleOpenResetPasswordTeacher(selectedTeacher)}
                className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Key size={14} className="text-purple-600" />
                <span>Reset Password</span>
              </button>

              <button
                onClick={handleToggleTeacherStatus}
                className={`w-full font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 border transition ${
                  selectedTeacher.isActive
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {selectedTeacher.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{selectedTeacher.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (teacherView === 'edit' && selectedTeacher) {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setTeacherView('detail')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Edit Data Guru</h2>
          </div>

          <form onSubmit={handleSaveEditTeacher} className="p-4 space-y-3">
            {tMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  tMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {tMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{tMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={tEmail}
                  onChange={(e) => setTEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nomor Induk Guru (NIP) *
                </label>
                <input
                  type="text"
                  required
                  value={tNip}
                  onChange={(e) => setTNip(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-blue-900 transition"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      );
    }

    if (teacherView === 'reset-password' && selectedTeacher) {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setTeacherView('detail')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Reset Password Guru</h2>
          </div>

          <form onSubmit={handleSaveResetPasswordTeacher} className="p-4 space-y-3">
            {tMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  tMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {tMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{tMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-600">
                Atur kata sandi baru untuk akun guru <strong>{selectedTeacher.name}</strong>.
              </p>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={tNewPassword}
                  onChange={(e) => setTNewPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-blue-900 transition"
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      );
    }

    // Default Teacher List View
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
        <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Manajemen Guru</h2>
            <p className="text-[11px] text-slate-500">{teachers.length} Guru Terdaftar</p>
          </div>
          <button
            onClick={handleOpenAddTeacher}
            className="flex items-center gap-1 bg-[#1E3A8A] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-900 transition"
          >
            <Plus size={14} />
            <span>Tambah</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Cari guru berdasarkan nama, email, NIP..."
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            className="w-full text-xs py-1 outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="p-4 space-y-2.5">
          {teachers.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetailTeacher(item)}
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.email}</p>
                  <span className="text-[10px] font-semibold text-[#1E3A8A]">
                    NIP: {item.teacher?.teacherNumber || '-'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {item.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
          ))}
          {teachers.length === 0 && (
            <EducationEmptyState
              title="Data Guru Tidak Ditemukan"
              description="Tidak ada guru yang sesuai dengan pencarian atau filter saat ini."
              actionText={teacherSearch ? "Reset Pencarian" : "Tambah Guru"}
              onAction={() => (teacherSearch ? setTeacherSearch('') : handleOpenAddTeacher())}
            />
          )}
        </div>
      </div>
    );
  }

  // 2. SISWA TAB
  if (activeTab === 'siswa') {
    if (studentView === 'add') {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setStudentView('list')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Daftarkan Siswa Baru</h2>
          </div>

          <form onSubmit={handleSaveAddStudent} className="p-4 space-y-3">
            {sMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  sMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {sMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{sMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rizky"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Alamat Email Siswa *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: siswa.rizky@pkbmbinainsani.sch.id"
                  value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nomor Induk Siswa (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 24006"
                    value={sNis}
                    onChange={(e) => setSNis(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    NISN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0071234566"
                    value={sNisn}
                    onChange={(e) => setSNisn(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Kata Sandi Awal *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={sPassword}
                  onChange={(e) => setSPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition"
            >
              Simpan Data Siswa
            </button>
          </form>
        </div>
      );
    }

    if (studentView === 'detail' && selectedStudent) {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStudentView('list')}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-sm font-bold text-slate-800">Detail Siswa</h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedStudent.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {selectedStudent.isActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {sMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  sMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {sMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{sMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-2">
                {selectedStudent.name.charAt(0)}
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">{selectedStudent.name}</h3>
              <p className="text-xs text-slate-500">{selectedStudent.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                  NIS: {selectedStudent.student?.studentNumber || '-'}
                </span>
                <span className="bg-blue-50 text-[#1E3A8A] text-xs font-bold px-2.5 py-0.5 rounded-md">
                  NISN: {selectedStudent.student?.nisn || '-'}
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Peran Sistem</span>
                <span className="font-semibold text-slate-800">Siswa Peserta Didik</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status Akun</span>
                <span
                  className={`font-semibold ${
                    selectedStudent.isActive ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {selectedStudent.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">ID Siswa</span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.id.slice(0, 12)}...
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleOpenEditStudent(selectedStudent)}
                className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Edit2 size={14} className="text-emerald-600" />
                <span>Edit Data Siswa</span>
              </button>

              <button
                onClick={() => handleOpenResetPasswordStudent(selectedStudent)}
                className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Key size={14} className="text-purple-600" />
                <span>Reset Password</span>
              </button>

              <button
                onClick={handleToggleStudentStatus}
                className={`w-full font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 border transition ${
                  selectedStudent.isActive
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {selectedStudent.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{selectedStudent.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (studentView === 'edit' && selectedStudent) {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setStudentView('detail')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Edit Data Siswa</h2>
          </div>

          <form onSubmit={handleSaveEditStudent} className="p-4 space-y-3">
            {sMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  sMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {sMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{sMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nomor Induk Siswa (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={sNis}
                    onChange={(e) => setSNis(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    value={sNisn}
                    onChange={(e) => setSNisn(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      );
    }

    if (studentView === 'reset-password' && selectedStudent) {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => setStudentView('detail')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-slate-800">Reset Password Siswa</h2>
          </div>

          <form onSubmit={handleSaveResetPasswordStudent} className="p-4 space-y-3">
            {sMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  sMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {sMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{sMessage.text}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-600">
                Atur kata sandi baru untuk akun siswa <strong>{selectedStudent.name}</strong>.
              </p>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={sNewPassword}
                  onChange={(e) => setSNewPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition"
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      );
    }

    // Subview: Kelola Kode Kelas (Class Invitation Codes - Tahap 4.5)
    if (studentView === 'codes') {
      return (
        <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto font-sans">
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setStudentView('list');
                  setCodeMessage(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Kode Undangan Kelas BISA</h2>
                <p className="text-[10px] text-slate-500">PKBM Bina Insani • Self-Enrollment Siswa</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3.5">
            {codeMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  codeMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {codeMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{codeMessage.text}</span>
              </div>
            )}

            {/* Form Buat Kode Kelas Baru */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <KeyRound size={16} />
                </div>
                <h3 className="text-xs font-bold text-slate-800">Buat Kode Undangan Baru</h3>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Pilih Kelas Tujuan
                </label>
                <select
                  value={selectedClassForCode}
                  onChange={(e) => setSelectedClassForCode(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 font-medium"
                >
                  {classList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.academicYear?.name || '2026/2027'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Batas Kuota Siswa (Opsional)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newCodeMaxUses}
                  onChange={(e) => setNewCodeMaxUses(parseInt(e.target.value) || 0)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 font-medium"
                  placeholder="35 siswa"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateCode}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>Generate Kode Kelas</span>
              </button>
            </div>

            {/* Daftar Kode Kelas yang Ada */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800">Daftar Kode Aktif</h3>
                <span className="text-[10px] text-slate-500 font-medium">
                  {invitationCodes.length} Kode Terdaftar
                </span>
              </div>

              <div className="space-y-2.5">
                {invitationCodes.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl p-3.5 border shadow-sm transition ${
                      item.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {item.class?.name || 'Kelas Belajar'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          T.A. {item.class?.academicYear?.name || '2026/2027'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>

                    {/* Code Display & 1-Click Copy */}
                    <div className="mt-2.5 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Kode Masuk Siswa:
                        </span>
                        <span className="font-mono font-black text-sm text-blue-900 tracking-wider">
                          {item.code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.code)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                          copiedCode === item.code
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {copiedCode === item.code ? (
                          <>
                            <Check size={14} />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Penggunaan: <b>{item.usedCount}</b>
                        {item.maxUses ? ` / ${item.maxUses} Siswa` : ' (Tanpa batas)'}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivateCode(item.id)}
                            className="text-[10px] font-bold text-red-600 hover:text-red-800"
                          >
                            Nonaktifkan
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleRegenerateCode(item.classId, item.id)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <RefreshCw size={11} />
                          <span>Perbarui</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Student List View
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto font-sans">
        <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Manajemen Siswa BISA</h2>
            <p className="text-[11px] text-slate-500">{students.length} Siswa Terdaftar</p>
          </div>
          <button
            onClick={() => setStudentView('codes')}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm"
          >
            <KeyRound size={14} />
            <span>Kode Kelas</span>
          </button>
        </div>

        {/* Informative Banner on Google Sign-In & Class Code */}
        <div className="mx-4 mt-3 bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-blue-900 text-xs">
          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <KeyRound size={14} />
          </div>
          <div>
            <span className="font-bold block text-blue-950">Pendaftaran Mandiri Siswa BISA</span>
            <span className="text-[11px] text-blue-800 leading-snug">
              Siswa mendaftar mandiri via Google Sign-In dan bergabung ke kelas menggunakan Kode Undangan Kelas.
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2 mt-2 bg-white border-b border-slate-100 flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, email, NIS, atau NISN..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full text-xs py-1 outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="p-4 space-y-2.5">
          {students.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetailStudent(item)}
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={item.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {item.student?.authProvider === 'GOOGLE' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
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
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    {item.student?.status === 'PENDING' && (
                      <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                        Menunggu Kelas
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{item.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-blue-600">
                      NIS: {item.student?.studentNumber || '-'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      NISN: {item.student?.nisn || '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {item.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <EducationEmptyState
              title="Data Siswa Tidak Ditemukan"
              description="Tidak ada peserta didik yang sesuai dengan pencarian atau filter kelas saat ini."
              actionText={studentSearch ? "Reset Pencarian" : "Tambah Siswa"}
              onAction={() => (studentSearch ? setStudentSearch('') : handleOpenAddStudent())}
            />
          )}
        </div>
      </div>
    );
  }

  // 3. PROFILE TAB
  if (activeTab === 'profile') {
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xl font-bold mb-3 shadow-md">
            {user.name.charAt(0)}
          </div>
          <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
          <p className="text-xs text-slate-500">{user.email}</p>
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 mt-2.5">
            <ShieldCheck size={14} />
            <span>Administrator Utama</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-700 mb-2">Status Sistem & Akun</h4>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Database</span>
            <span className="font-semibold text-slate-800">PostgreSQL (Prisma ORM)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Hak Akses</span>
            <span className="font-semibold text-slate-800">Full Access (Admin)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Penyimpanan Token</span>
            <span className="font-semibold text-emerald-600">expo-secure-store</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <LogOut size={16} />
          <span>Keluar dari Aplikasi (Logout)</span>
        </button>
      </div>
    );
  }

  // 4. DASHBOARD TAB
  return (
    <div className="flex-1 w-full bg-[#F7F9F8] flex flex-col p-4 overflow-y-auto space-y-3.5 font-sans select-none">
      {/* 1. Command Center Hero Visual Besar: Digital School Architecture & Management */}
      <AdminDashboardHeroBanner
        adminName={user.name}
        totalUsers={stats.totalUsers}
        systemStatus={stats.systemStatus}
      />

      {/* 2. Core Statistics Grid matching Panel 5 (Total Siswa 248, Total Guru 32, Rombel Aktif 12, Modul Terbit 48) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-800 tracking-tight">Statistik Sekolah Digital</h4>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ● Sistem Aktif
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <EducationStatCard
            index={0}
            title="Total Siswa"
            value="248"
            subtitle="Siswa Terdaftar Aktif"
            icon={GraduationCap}
            accent="green"
            onClick={() => {
              setStudentView('list');
              onNavigateTab('siswa');
            }}
          />
          <EducationStatCard
            index={1}
            title="Total Guru"
            value="32"
            subtitle="Tenaga Pendidik BISA"
            icon={Users}
            accent="red"
            onClick={() => onNavigateTab('guru')}
          />
          <EducationStatCard
            index={2}
            title="Rombel Aktif"
            value="12"
            subtitle="Rombongan Belajar"
            icon={BookOpen}
            accent="blue"
            onClick={() => setShowModuleReview(true)}
          />
          <EducationStatCard
            index={3}
            title="Modul Terbit"
            value="48"
            subtitle="Materi Terpublikasi"
            icon={FileText}
            accent="orange"
            onClick={() => setShowModuleReview(true)}
          />
        </div>
      </div>

      {/* Aktivitas Terbaru Section (Panel 5 Style) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <h5 className="text-xs font-bold text-slate-900">Aktivitas Terbaru</h5>
          <span className="text-[10px] text-[#168A5B] font-bold">Real-time</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center shrink-0">
              <GraduationCap size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-[11px] truncate">Siswa baru mendaftar</p>
              <p className="text-[9.5px] text-slate-400">2 menit yang lalu</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-50/50 border border-rose-100">
            <div className="w-7 h-7 rounded-lg bg-[#FDECEC] text-[#D62828] flex items-center justify-center shrink-0">
              <BookOpen size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-[11px] truncate">Modul Matematika diupdate</p>
              <p className="text-[9.5px] text-slate-400">15 menit yang lalu</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center shrink-0">
              <Users size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-[11px] truncate">Guru mengajar kelas X IPA</p>
              <p className="text-[9.5px] text-slate-400">30 menit yang lalu</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Academic Monitoring: Kurikulum & Paket Pembelajaran BISA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F5EE] text-[#168A5B] flex items-center justify-center">
              <BookOpen size={15} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Kurikulum & Paket Belajar</h5>
              <p className="text-[10px] text-slate-400">Tingkat ketuntasan modul PKBM</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#168A5B] bg-[#E8F5EE] px-2 py-0.5 rounded-md border border-[#168A5B]/20">
            T.A. 2026/2027
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>Paket A (Pendidikan Dasar)</span>
              <span className="font-bold text-[#168A5B]">85%</span>
            </div>
            <AnimatedLearningProgressBar value={85} height="h-2" variant="green" showLabel={false} />
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>Paket B (Pendidikan Menengah Pertama)</span>
              <span className="font-bold text-[#168A5B]">70%</span>
            </div>
            <AnimatedLearningProgressBar value={70} height="h-2" variant="gradient" showLabel={false} />
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>Paket C (Pendidikan Menengah Atas)</span>
              <span className="font-bold text-[#D62828]">92%</span>
            </div>
            <AnimatedLearningProgressBar value={92} height="h-2" variant="red" showLabel={false} />
          </div>
        </div>
      </motion.div>

      {/* 4. Quick Navigations with Micro-Interactions */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Manajemen BISA</h4>
        <div className="space-y-2">
          {/* Class Code Manager Shortcut */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setStudentView('codes');
              onNavigateTab('siswa');
            }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 shadow-sm flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <KeyRound size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-blue-950">Kode Kelas (Undangan Siswa)</h5>
                  <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                    Tahap 4.5
                  </span>
                </div>
                <p className="text-[10px] text-blue-700">
                  Generate & kelola kode registrasi kelas mandiri untuk siswa
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-blue-400" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab('guru')}
            className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Kelola Guru</h5>
                <p className="text-[10px] text-slate-500">
                  Daftar, tambah pengajar baru, edit NIP & status
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setStudentView('list');
              onNavigateTab('siswa');
            }}
            className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Kelola Siswa</h5>
                <p className="text-[10px] text-slate-500">
                  Daftar peserta didik, NIS, status Google & aktivasi
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModuleReview(true)}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 shadow-sm flex items-center justify-between cursor-pointer hover:border-purple-400 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-purple-950">Review Modul Pembelajaran</h5>
                  <span className="text-[9px] font-extrabold bg-purple-600 text-white px-1.5 py-0.2 rounded-full">
                    Tahap 4
                  </span>
                </div>
                <p className="text-[10px] text-purple-700">
                  Verifikasi, tinjau materi & publikasikan modul guru
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-purple-400" />
          </motion.div>
        </div>
      </div>

      {/* Official PKBM Bina Insani Banner */}
      <div className="bg-[#E8F5EE] border border-[#168A5B]/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-[#168A5B] text-[11px] leading-relaxed">
        <ShieldCheck size={16} className="shrink-0 text-[#168A5B] mt-0.5" />
        <div>
          <span className="font-bold block text-slate-900">BISA - PKBM Bina Insani (Platform Sekolah Digital)</span>
          <span className="text-slate-600">
            Sistem terintegrasi untuk pembelajaran mandiri, kurikulum berbasis modul, presensi terpadu, dan administrasi akademik.
          </span>
        </div>
      </div>

      {showModuleReview && (
        <AdminModuleReviewModal
          onClose={() => setShowModuleReview(false)}
          onRefreshStats={loadData}
        />
      )}
    </div>
  );
};
