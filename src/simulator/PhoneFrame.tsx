import React from 'react';
import { DeviceType } from './types';
import { Wifi, BatteryMedium, Signal, Smartphone, RotateCcw, Sparkles, Layers } from 'lucide-react';
import { ScreenState } from './MobileApp';

interface PhoneFrameProps {
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
  currentScreen?: ScreenState;
  onScreenChange?: (s: ScreenState) => void;
  onResetSession?: () => void;
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  device,
  onDeviceChange,
  currentScreen = 'splash',
  onScreenChange,
  onResetSession,
  children,
}) => {
  const currentTime = '09:41';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 py-4 px-3 font-sans select-none">
      {/* Top Simulator Control Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3 max-w-2xl">
        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 shadow-md text-xs">
          <Smartphone size={13} className="text-emerald-400" />
          <button
            onClick={() => onDeviceChange('android')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              device === 'android'
                ? 'bg-[#168A5B] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Android (Pixel 8)
          </button>
          <button
            onClick={() => onDeviceChange('ios')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              device === 'ios'
                ? 'bg-[#D62828] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            iOS
          </button>
        </div>

        {/* Screen Selector Bar - 10 Panels matching Reference */}
        {onScreenChange && (
          <div className="flex flex-wrap items-center justify-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-md text-xs max-w-2xl">
            <span className="text-[10px] text-slate-500 font-bold px-1.5 flex items-center gap-1">
              <Layers size={11} className="text-[#168A5B]" />
              Layar:
            </span>
            <button
              onClick={() => onScreenChange('splash')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'splash'
                  ? 'bg-[#D62828] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              1. Splash
            </button>
            <button
              onClick={() => onScreenChange('welcome')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'welcome'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              2. Welcome
            </button>
            <button
              onClick={() => onScreenChange('role_select')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'role_select'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              3. Role
            </button>
            <button
              onClick={() => onScreenChange('student_login')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'student_login'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              4. Login
            </button>
            <button
              onClick={() => onScreenChange('dashboard_admin')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'dashboard_admin'
                  ? 'bg-[#D62828] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              5. Admin
            </button>
            <button
              onClick={() => onScreenChange('dashboard_guru')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'dashboard_guru'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              6. Guru
            </button>
            <button
              onClick={() => onScreenChange('dashboard_siswa')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'dashboard_siswa' || currentScreen === 'app'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              7. Siswa
            </button>
            <button
              onClick={() => onScreenChange('module_detail')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'module_detail'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              8. Modul
            </button>
            <button
              onClick={() => onScreenChange('empty_state')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'empty_state'
                  ? 'bg-[#168A5B] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              9. Kosong
            </button>
            <button
              onClick={() => onScreenChange('visual_system')}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10.5px] transition-all ${
                currentScreen === 'visual_system'
                  ? 'bg-[#D62828] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              10. Panduan
            </button>
          </div>
        )}

        {/* Reset Session Button */}
        {onResetSession && (
          <button
            onClick={onResetSession}
            title="Bersihkan sesi login dan putar dari Splash Screen"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 text-[11px] font-medium transition shadow-md"
          >
            <RotateCcw size={12} />
            <span>Reset Flow</span>
          </button>
        )}
      </div>

      {/* Outer Phone Shell */}
      <div
        className={`relative transition-all duration-300 shadow-2xl bg-black ${
          device === 'ios'
            ? 'w-[390px] h-[812px] rounded-[50px] p-[11px] ring-1 ring-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
            : 'w-[392px] h-[808px] rounded-[42px] p-[9px] ring-1 ring-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Hardware side buttons */}
        {device === 'ios' ? (
          <>
            <div className="absolute -left-[14px] top-[115px] w-[3px] h-[26px] bg-slate-700 rounded-l-sm" />
            <div className="absolute -left-[14px] top-[160px] w-[3px] h-[48px] bg-slate-700 rounded-l-sm" />
            <div className="absolute -left-[14px] top-[218px] w-[3px] h-[48px] bg-slate-700 rounded-l-sm" />
            <div className="absolute -right-[14px] top-[170px] w-[3px] h-[64px] bg-slate-700 rounded-r-sm" />
          </>
        ) : (
          <>
            <div className="absolute -right-[12px] top-[170px] w-[3px] h-[44px] bg-slate-700 rounded-r-sm" />
            <div className="absolute -right-[12px] top-[230px] w-[3px] h-[70px] bg-slate-700 rounded-r-sm" />
          </>
        )}

        {/* Inner Screen Display */}
        <div
          className={`relative w-full h-full bg-slate-50 overflow-hidden flex flex-col ${
            device === 'ios' ? 'rounded-[40px]' : 'rounded-[34px]'
          }`}
        >
          {/* Top Status Bar */}
          <div className="relative z-30 h-11 w-full flex items-center justify-between px-6 pt-1 text-slate-800 text-[13px] font-semibold">
            <span>{currentTime}</span>

            {/* Notch / Dynamic Island / Camera cutout */}
            {device === 'ios' ? (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[110px] h-[26px] bg-black rounded-full flex items-center justify-end pr-2.5 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>
            ) : (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 bg-black rounded-full shadow-inner" />
            )}

            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal size={12} strokeWidth={2.5} />
              <Wifi size={13} strokeWidth={2.5} />
              <BatteryMedium size={15} strokeWidth={2.5} />
            </div>
          </div>

          {/* Actual Mobile App Screen Content */}
          <div className="flex-1 w-full overflow-hidden flex flex-col relative">
            {children}

            {/* Quick Screen Pill Bar directly inside Phone for instant user preview navigation */}
            {onScreenChange && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700/80 shadow-lg flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => onScreenChange('splash')}
                  className={`px-2 py-0.5 rounded-full font-bold transition ${
                    currentScreen === 'splash'
                      ? 'bg-[#D62828] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Splash
                </button>
                <button
                  type="button"
                  onClick={() => onScreenChange('welcome')}
                  className={`px-2 py-0.5 rounded-full font-bold transition ${
                    currentScreen === 'welcome'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Welcome
                </button>
                <button
                  type="button"
                  onClick={() => onScreenChange('role_select')}
                  className={`px-2 py-0.5 rounded-full font-bold transition ${
                    currentScreen === 'role_select'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pilih Role
                </button>
                <button
                  type="button"
                  onClick={() => onScreenChange('student_login')}
                  className={`px-2 py-0.5 rounded-full font-bold transition ${
                    currentScreen === 'student_login'
                      ? 'bg-[#168A5B] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Login Siswa
                </button>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator / Gesture Bar */}
          <div className="h-6 w-full flex items-center justify-center bg-transparent pointer-events-none z-30">
            <div
              className={`h-1 bg-slate-400/80 rounded-full ${
                device === 'ios' ? 'w-32' : 'w-24'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
