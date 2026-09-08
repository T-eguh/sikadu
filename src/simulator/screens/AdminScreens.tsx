import React, { useState, useEffect } from 'react';
import { User } from '../types';
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
} from 'lucide-react';
import { mockBackend } from '../mockApi';

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
  const [studentView, setStudentView] = useState<'list' | 'add' | 'detail' | 'edit' | 'reset-password'>('list');

  // Student Form State
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sNis, setSNis] = useState('');
  const [sNisn, setSNisn] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sNewPassword, setSNewPassword] = useState('');
  const [sMessage, setSMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    const st = await mockBackend.getStats();
    setStats(st);
    const tList = await mockBackend.getTeachers(teacherSearch);
    setTeachers(tList);
    const sList = await mockBackend.getStudents(studentSearch);
    setStudents(sList);
  };

  useEffect(() => {
    loadData();
  }, [teacherSearch, studentSearch]);

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
                  placeholder="Contoh: guru.budi@sekolahmodel.sch.id"
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
            <div className="text-center py-8 text-slate-400 text-xs">
              Tidak ada data guru ditemukan.
            </div>
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
                  placeholder="Contoh: siswa.rizky@sekolahmodel.sch.id"
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

    // Default Student List View
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-y-auto">
        <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Manajemen Siswa</h2>
            <p className="text-[11px] text-slate-500">{students.length} Siswa Terdaftar</p>
          </div>
          <button
            onClick={handleOpenAddStudent}
            className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
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
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-emerald-600">
                      NIS: {item.student?.studentNumber || '-'}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600">
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
            <div className="text-center py-8 text-slate-400 text-xs">
              Tidak ada data siswa ditemukan.
            </div>
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
    <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3.5">
      {/* Welcome Banner Card */}
      <div className="bg-[#1E3A8A] rounded-2xl p-4 text-white shadow-md shadow-blue-900/10 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ShieldCheck size={26} className="text-white" />
        </div>
        <div>
          <span className="text-[11px] text-blue-200 font-medium">Selamat Datang,</span>
          <h3 className="text-sm font-extrabold leading-tight">{user.name}</h3>
          <p className="text-[11px] text-blue-100/90 mt-0.5">
            Panel Pengendalian Utama Sekolah Model LMS
          </p>
        </div>
      </div>

      {/* Status Sistem Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Status Sistem
            </span>
            <span className="text-xs font-bold text-slate-800">Aktif & Terhubung Database</span>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200">
          {stats.systemStatus}
        </span>
      </div>

      {/* Core Statistics Cards (Dynamic from Database) */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Statistik Pengguna</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Guru Card */}
          <div
            onClick={() => onNavigateTab('guru')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-center text-center cursor-pointer hover:border-blue-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5">
              <Users size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 leading-tight">
              {stats.totalTeachers}
            </span>
            <span className="text-xs font-bold text-slate-700">Total Guru</span>
            <span className="text-[10px] text-slate-400">Ketuk untuk kelola</span>
          </div>

          {/* Total Siswa Card */}
          <div
            onClick={() => onNavigateTab('siswa')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col items-center text-center cursor-pointer hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
              <GraduationCap size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 leading-tight">
              {stats.totalStudents}
            </span>
            <span className="text-xs font-bold text-slate-700">Total Siswa</span>
            <span className="text-[10px] text-slate-400">Ketuk untuk kelola</span>
          </div>
        </div>
      </div>

      {/* Quick Navigations */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">Manajemen Pengguna</h4>
        <div className="space-y-2">
          <div
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
          </div>

          <div
            onClick={() => onNavigateTab('siswa')}
            className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Kelola Siswa</h5>
                <p className="text-[10px] text-slate-500">
                  Daftar peserta didik, NIS, NISN & reset password
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          <div
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
                  <span className="text-[9px] font-extrabold bg-amber-500 text-white px-1.5 py-0.2 rounded-full">
                    Tahap 4
                  </span>
                </div>
                <p className="text-[10px] text-purple-700">
                  Verifikasi, tinjau materi & publikasikan modul guru
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-purple-400" />
          </div>
        </div>
      </div>

      {/* Phase 4 info banner */}
      <div className="bg-slate-100 rounded-xl p-2.5 flex items-start gap-2 text-slate-600 text-[11px] leading-relaxed">
        <ShieldCheck size={15} className="shrink-0 text-blue-600 mt-0.5" />
        <span>
          Tahap 4 aktif: Manajemen Modul & Materi Pembelajaran interaktif, penugasan mengajar terverifikasi, dan kalkulasi progres siswa otomatis.
        </span>
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
