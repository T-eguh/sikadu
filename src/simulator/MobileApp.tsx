import React, { useState, useEffect, useCallback } from 'react';
import { User, Role } from './types';
import { mockBackend, TOKEN_STORAGE_KEY } from './mockApi';
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { RoleSelectionScreen } from './screens/RoleSelectionScreen';
import { StudentLoginScreen } from './screens/StudentLoginScreen';
import { StudentActivationScreen } from './screens/StudentActivationScreen';
import { StudentSuccessScreen } from './screens/StudentSuccessScreen';
import { AdminScreens } from './screens/AdminScreens';
import { TeacherScreens } from './screens/TeacherScreens';
import { StudentScreens } from './screens/StudentScreens';
import { ModuleDetailScreen } from './screens/ModuleDetailScreen';
import { EmptyStateScreen } from './screens/EmptyStateScreen';
import { VisualSystemScreen } from './screens/VisualSystemScreen';
import { SEED_USERS } from './mockApi';
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
  Sparkles,
} from 'lucide-react';
import { PkbmOfficialLogo } from './components/LoginVisualAssets';

export type ScreenState =
  | 'splash'
  | 'welcome'
  | 'role_select'
  | 'student_login'
  | 'student_activation'
  | 'student_success'
  | 'app'
  | 'dashboard_admin'
  | 'dashboard_guru'
  | 'dashboard_siswa'
  | 'module_detail'
  | 'empty_state'
  | 'visual_system';

export interface MobileAppProps {
  currentScreen?: ScreenState;
  onScreenChange?: (screen: ScreenState) => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({
  currentScreen: externalScreen,
  onScreenChange: externalOnScreenChange,
}) => {
  const [internalScreen, setInternalScreen] = useState<ScreenState>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [joinedClassData, setJoinedClassData] = useState<any>(null);

  const currentScreen = externalScreen ?? internalScreen;
  const navigateScreen = (screen: ScreenState) => {
    setInternalScreen(screen);
    externalOnScreenChange?.(screen);
  };

  // Tabs for each role
  const [adminTab, setAdminTab] = useState<'dashboard' | 'guru' | 'siswa' | 'profile'>('dashboard');
  const [teacherTab, setTeacherTab] = useState<'dashboard' | 'kelas' | 'modul' | 'profile'>('dashboard');
  const [studentTab, setStudentTab] = useState<'dashboard' | 'modul' | 'tugas' | 'profile'>('dashboard');

  // Check initial session
  const checkInitialSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return;
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

  // Halaman 1 -> Halaman 2 (Selalu ke Welcome Screen agar alur onboarding dapat terlihat)
  const handleSplashFinish = () => {
    navigateScreen('welcome');
  };

  // Halaman 2 -> Halaman 3 (Welcome -> Role Selection)
  const handleStartWelcome = () => {
    navigateScreen('role_select');
  };

  // Halaman 3 Role Selection
  const handleSelectRole = (role: 'SISWA' | 'ADMIN' | 'GURU') => {
    if (role === 'SISWA') {
      navigateScreen('student_login');
    }
  };

  // Staff (Admin/Guru) login success from RoleSelectionScreen
  const handleStaffLoginSuccess = (loggedInUser: User, token: string) => {
    setUser(loggedInUser);
    setAdminTab('dashboard');
    setTeacherTab('dashboard');
    navigateScreen('app');
  };

  // Halaman 4: Student Google Login Success
  const handleStudentLoginSuccess = (
    loggedInUser: User,
    token: string,
    requiresClassCode?: boolean
  ) => {
    setUser(loggedInUser);
    setStudentTab('dashboard');

    if (requiresClassCode || loggedInUser.student?.status === 'PENDING') {
      // Direct transition to Halaman 6: Lengkapi Pendaftaran!
      navigateScreen('student_activation');
    } else {
      // Directly to Halaman 8: Dashboard Siswa
      navigateScreen('app');
    }
  };

  // Halaman 6: Class Code Submitted Successfully -> Halaman 7: Success Screen
  const handleClassJoinSuccess = (updatedUser: User, classData: any) => {
    setUser(updatedUser);
    setJoinedClassData(classData);
    navigateScreen('student_success');
  };

  // Halaman 7 -> Halaman 8: Mulai Belajar -> Dashboard Siswa
  const handleContinueToDashboard = () => {
    navigateScreen('app');
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setJoinedClassData(null);
    navigateScreen('welcome');
  };

  // ==================== SCREEN ROUTER ====================
  // 1. SPLASH SCREEN
  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 2. WELCOME SCREEN
  if (currentScreen === 'welcome') {
    return <WelcomeScreen onStart={handleStartWelcome} />;
  }

  // 3. ROLE SELECTION SCREEN
  if (currentScreen === 'role_select') {
    return (
      <RoleSelectionScreen
        onSelectRole={handleSelectRole}
        onStaffLoginSuccess={handleStaffLoginSuccess}
        onBackToWelcome={() => navigateScreen('welcome')}
      />
    );
  }

  // 4. STUDENT LOGIN SCREEN
  if (currentScreen === 'student_login') {
    return (
      <StudentLoginScreen
        onBackToRoles={() => navigateScreen('role_select')}
        onStudentLoginSuccess={handleStudentLoginSuccess}
      />
    );
  }

  // 6. STUDENT ACTIVATION / LENGKAPI PENDAFTARAN SCREEN
  if (currentScreen === 'student_activation' && user) {
    return (
      <StudentActivationScreen
        currentUser={user}
        onJoinSuccess={handleClassJoinSuccess}
        onLogout={handleLogout}
      />
    );
  }

  // 7. STUDENT SUCCESS SCREEN
  if (currentScreen === 'student_success' && user) {
    return (
      <StudentSuccessScreen
        currentUser={user}
        classData={joinedClassData}
        onContinueToDashboard={handleContinueToDashboard}
      />
    );
  }

  // 8. PANEL 8: DETAIL MODUL
  if (currentScreen === 'module_detail') {
    return (
      <ModuleDetailScreen
        onBack={() => {
          if (!user) {
            setUser(SEED_USERS[3]);
          }
          navigateScreen('app');
        }}
        onContinueLearning={() => {
          if (!user) {
            setUser(SEED_USERS[3]);
          }
          setStudentTab('modul');
          navigateScreen('app');
        }}
      />
    );
  }

  // 9. PANEL 9: EMPTY STATE (DATA TIDAK DITEMUKAN)
  if (currentScreen === 'empty_state') {
    return (
      <EmptyStateScreen
        onBack={() => navigateScreen('app')}
        onGoHome={() => {
          if (!user) {
            setUser(SEED_USERS[3]);
          }
          navigateScreen('app');
        }}
      />
    );
  }

  // 10. PANEL 10: PANDUAN VISUAL SISTEM & BRANDING
  if (currentScreen === 'visual_system') {
    return (
      <VisualSystemScreen
        onBack={() => navigateScreen('app')}
      />
    );
  }

  // DIRECT ROLE DASHBOARD SHORTCUTS
  if (currentScreen === 'dashboard_admin') {
    if (!user || user.role !== 'ADMIN') {
      setUser(SEED_USERS[0]);
    }
    setAdminTab('dashboard');
  } else if (currentScreen === 'dashboard_guru') {
    if (!user || user.role !== 'TEACHER') {
      setUser(SEED_USERS[1]);
    }
    setTeacherTab('dashboard');
  } else if (currentScreen === 'dashboard_siswa') {
    if (!user || user.role !== 'STUDENT') {
      setUser(SEED_USERS[3]);
    }
    setStudentTab('dashboard');
  }

  // Fallback if no user is authenticated
  const activeUser = user || (
    currentScreen === 'dashboard_admin'
      ? SEED_USERS[0]
      : currentScreen === 'dashboard_guru'
      ? SEED_USERS[1]
      : SEED_USERS[3]
  );

  if (!user && currentScreen !== 'dashboard_admin' && currentScreen !== 'dashboard_guru' && currentScreen !== 'dashboard_siswa') {
    return (
      <RoleSelectionScreen
        onSelectRole={handleSelectRole}
        onStaffLoginSuccess={handleStaffLoginSuccess}
        onBackToWelcome={() => navigateScreen('welcome')}
      />
    );
  }

  const effectiveUser = user || activeUser;

  // 8. MAIN APP SCREEN (Dashboard & tabs for Student, Teacher, or Admin)
  const getRoleHeader = () => {
    switch (effectiveUser.role) {
      case 'ADMIN':
        return {
          title: 'Administrator',
          badgeBg: 'bg-rose-50 border border-rose-200',
          badgeText: 'text-[#E53935]',
          avatarBg: 'bg-[#E53935]',
          themeColor: '#E53935',
        };
      case 'TEACHER':
        return {
          title: 'Guru Pengajar',
          badgeBg: 'bg-emerald-50 border border-emerald-200',
          badgeText: 'text-[#0F5C40]',
          avatarBg: 'bg-[#0F5C40]',
          themeColor: '#0F5C40',
        };
      case 'STUDENT':
        return {
          title: 'Siswa',
          badgeBg: 'bg-emerald-50 border border-emerald-200',
          badgeText: 'text-[#1B7F5A]',
          avatarBg: 'bg-[#1B7F5A]',
          themeColor: '#1B7F5A',
        };
    }
  };

  const roleInfo = getRoleHeader();

  return (
    <div className="flex-1 w-full flex flex-col bg-[#F7F9F8] overflow-hidden select-none font-sans">
      {/* Mobile Screen Header */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-2xs">
            <PkbmOfficialLogo size={24} showText={false} variant="color" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#1F2937] leading-none">
                BISA
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${roleInfo.badgeBg} ${roleInfo.badgeText}`}
              >
                {roleInfo.title}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">
              PKBM Bina Insani
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Keluar"
          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#E53935] flex items-center justify-center transition active:scale-95 border border-rose-100"
        >
          <LogOut size={15} />
        </button>
      </div>

      {/* Screen Body depending on Role */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {effectiveUser.role === 'ADMIN' && (
          <AdminScreens
            user={effectiveUser}
            activeTab={adminTab}
            onNavigateTab={setAdminTab}
            onLogout={handleLogout}
          />
        )}

        {effectiveUser.role === 'TEACHER' && (
          <TeacherScreens
            user={effectiveUser}
            activeTab={teacherTab}
            onNavigateTab={setTeacherTab}
            onLogout={handleLogout}
          />
        )}

        {effectiveUser.role === 'STUDENT' && (
          <StudentScreens
            user={effectiveUser}
            activeTab={studentTab}
            onNavigateTab={setStudentTab}
            onLogout={handleLogout}
            onOpenModuleDetail={() => navigateScreen('module_detail')}
          />
        )}
      </div>

      {/* MODERN BOTTOM NAVIGATION BAR (Docked, Soft Shadow, Active Pill Highlight) */}
      <div className="bg-white border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around shrink-0 shadow-lg z-10">
        {/* Administrator Navigation (Merah Elegan) */}
        {effectiveUser.role === 'ADMIN' && (
          <>
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                adminTab === 'dashboard'
                  ? 'text-[#E53935] font-bold bg-rose-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-[10px] mt-0.5">Dashboard</span>
            </button>
            <button
              onClick={() => setAdminTab('guru')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                adminTab === 'guru'
                  ? 'text-[#E53935] font-bold bg-rose-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Users size={18} />
              <span className="text-[10px] mt-0.5">Guru</span>
            </button>
            <button
              onClick={() => setAdminTab('siswa')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                adminTab === 'siswa'
                  ? 'text-[#E53935] font-bold bg-rose-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <GraduationCap size={18} />
              <span className="text-[10px] mt-0.5">Siswa</span>
            </button>
            <button
              onClick={() => setAdminTab('profile')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                adminTab === 'profile'
                  ? 'text-[#E53935] font-bold bg-rose-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-0.5">Profil</span>
            </button>
          </>
        )}

        {/* Teacher Navigation (Hijau Profesional) */}
        {effectiveUser.role === 'TEACHER' && (
          <>
            <button
              onClick={() => setTeacherTab('dashboard')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                teacherTab === 'dashboard'
                  ? 'text-[#0F5C40] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-[10px] mt-0.5">Dashboard</span>
            </button>
            <button
              onClick={() => setTeacherTab('kelas')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                teacherTab === 'kelas'
                  ? 'text-[#0F5C40] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <BookMarked size={18} />
              <span className="text-[10px] mt-0.5">Kelas</span>
            </button>
            <button
              onClick={() => setTeacherTab('modul')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                teacherTab === 'modul'
                  ? 'text-[#0F5C40] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText size={18} />
              <span className="text-[10px] mt-0.5">Modul</span>
            </button>
            <button
              onClick={() => setTeacherTab('profile')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                teacherTab === 'profile'
                  ? 'text-[#0F5C40] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-0.5">Profil</span>
            </button>
          </>
        )}

        {/* Student Navigation as specified: Beranda, Belajar, Progress, Profil */}
        {effectiveUser.role === 'STUDENT' && (
          <>
            <button
              onClick={() => setStudentTab('dashboard')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                studentTab === 'dashboard'
                  ? 'text-[#1B7F5A] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home size={18} />
              <span className="text-[10px] mt-0.5">Beranda</span>
            </button>
            <button
              onClick={() => setStudentTab('modul')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                studentTab === 'modul'
                  ? 'text-[#1B7F5A] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <BookOpen size={18} />
              <span className="text-[10px] mt-0.5">Belajar</span>
            </button>
            <button
              onClick={() => setStudentTab('tugas')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                studentTab === 'tugas'
                  ? 'text-[#1B7F5A] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CheckSquare size={18} />
              <span className="text-[10px] mt-0.5">Progress</span>
            </button>
            <button
              onClick={() => setStudentTab('profile')}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
                studentTab === 'profile'
                  ? 'text-[#1B7F5A] font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserIcon size={18} />
              <span className="text-[10px] mt-0.5">Profil</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
