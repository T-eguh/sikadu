import React, { useState, useEffect, useCallback } from 'react';
import { User, Role } from './types';
import { mockBackend, TOKEN_STORAGE_KEY, SEED_USERS } from './mockApi';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { AdminScreens } from './screens/AdminScreens';
import { TeacherScreens } from './screens/TeacherScreens';
import { StudentScreens } from './screens/StudentScreens';
import {
  LayoutGrid,
  Users,
  GraduationCap,
  User as UserIcon,
  BookMarked,
  FileText,
  Home,
  BookOpen,
  CheckSquare,
  LogOut,
} from 'lucide-react';

export const MobileApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'app'>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'guru' | 'siswa' | 'profile'>('dashboard');
  const [teacherTab, setTeacherTab] = useState<'dashboard' | 'kelas' | 'modul' | 'profile'>('dashboard');
  const [studentTab, setStudentTab] = useState<'dashboard' | 'modul' | 'tugas' | 'profile'>('dashboard');

  const checkInitialSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return;
    }
    try {
      const u = await mockBackend.getMe(token);
      setUser(u);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkInitialSession();
  }, [checkInitialSession]);

  const handleSplashFinish = () => {
    if (user) {
      setCurrentScreen('app');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAdminTab('dashboard');
    setTeacherTab('dashboard');
    setStudentTab('dashboard');
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setCurrentScreen('login');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === 'login' || !user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Get Role Color Theme & Labels
  const getRoleHeader = () => {
    switch (user.role) {
      case 'ADMIN':
        return {
          title: 'Administrator',
          badgeBg: 'bg-purple-100',
          badgeText: 'text-purple-700',
        };
      case 'TEACHER':
        return {
          title: 'Guru Pengajar',
          badgeBg: 'bg-sky-100',
          badgeText: 'text-sky-700',
        };
      case 'STUDENT':
        return {
          title: 'Siswa',
          badgeBg: 'bg-emerald-100',
          badgeText: 'text-emerald-700',
        };
    }
  };

  const roleInfo = getRoleHeader();

  return (
    <div className="flex-1 w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Mobile Screen Header */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 leading-tight">
              Halo, {user.name.split(' ')[0]}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${roleInfo.badgeBg} ${roleInfo.badgeText}`}
              >
                {roleInfo.title}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition active:scale-95"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Screen Body depending on Role */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {user.role === 'ADMIN' && (
          <AdminScreens
            user={user}
            activeTab={adminTab}
            onNavigateTab={setAdminTab}
            onLogout={handleLogout}
          />
        )}

        {user.role === 'TEACHER' && (
          <TeacherScreens
            user={user}
            activeTab={teacherTab}
            onNavigateTab={setTeacherTab}
            onLogout={handleLogout}
          />
        )}

        {user.role === 'STUDENT' && (
          <StudentScreens
            user={user}
            activeTab={studentTab}
            onNavigateTab={setStudentTab}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Role-Based Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shrink-0 shadow-sm z-10">
        {/* Admin Navigation */}
        {user.role === 'ADMIN' && (
          <>
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                adminTab === 'dashboard' ? 'text-[#1E3A8A] font-bold' : 'text-slate-400'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-[10px] mt-1">Dashboard</span>
            </button>
            <button
              onClick={() => setAdminTab('guru')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                adminTab === 'guru' ? 'text-[#1E3A8A] font-bold' : 'text-slate-400'
              }`}
            >
              <Users size={18} />
              <span className="text-[10px] mt-1">Guru</span>
            </button>
            <button
              onClick={() => setAdminTab('siswa')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                adminTab === 'siswa' ? 'text-[#1E3A8A] font-bold' : 'text-slate-400'
              }`}
            >
              <GraduationCap size={18} />
              <span className="text-[10px] mt-1">Siswa</span>
            </button>
            <button
              onClick={() => setAdminTab('profile')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                adminTab === 'profile' ? 'text-[#1E3A8A] font-bold' : 'text-slate-400'
              }`}
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-1">Profil</span>
            </button>
          </>
        )}

        {/* Teacher Navigation */}
        {user.role === 'TEACHER' && (
          <>
            <button
              onClick={() => setTeacherTab('dashboard')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                teacherTab === 'dashboard' ? 'text-sky-600 font-bold' : 'text-slate-400'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-[10px] mt-1">Dashboard</span>
            </button>
            <button
              onClick={() => setTeacherTab('kelas')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                teacherTab === 'kelas' ? 'text-sky-600 font-bold' : 'text-slate-400'
              }`}
            >
              <BookMarked size={18} />
              <span className="text-[10px] mt-1">Kelas</span>
            </button>
            <button
              onClick={() => setTeacherTab('modul')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                teacherTab === 'modul' ? 'text-sky-600 font-bold' : 'text-slate-400'
              }`}
            >
              <FileText size={18} />
              <span className="text-[10px] mt-1">Modul</span>
            </button>
            <button
              onClick={() => setTeacherTab('profile')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                teacherTab === 'profile' ? 'text-sky-600 font-bold' : 'text-slate-400'
              }`}
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-1">Profil</span>
            </button>
          </>
        )}

        {/* Student Navigation */}
        {user.role === 'STUDENT' && (
          <>
            <button
              onClick={() => setStudentTab('dashboard')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                studentTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-400'
              }`}
            >
              <Home size={18} />
              <span className="text-[10px] mt-1">Beranda</span>
            </button>
            <button
              onClick={() => setStudentTab('modul')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                studentTab === 'modul' ? 'text-emerald-600 font-bold' : 'text-slate-400'
              }`}
            >
              <BookOpen size={18} />
              <span className="text-[10px] mt-1">Modul</span>
            </button>
            <button
              onClick={() => setStudentTab('tugas')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                studentTab === 'tugas' ? 'text-emerald-600 font-bold' : 'text-slate-400'
              }`}
            >
              <CheckSquare size={18} />
              <span className="text-[10px] mt-1">Tugas</span>
            </button>
            <button
              onClick={() => setStudentTab('profile')}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                studentTab === 'profile' ? 'text-emerald-600 font-bold' : 'text-slate-400'
              }`}
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-1">Profil</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
