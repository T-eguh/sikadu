import React from 'react';
import { DeviceType } from './types';
import { Wifi, BatteryMedium, Signal, Smartphone } from 'lucide-react';

interface PhoneFrameProps {
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  device,
  onDeviceChange,
  children,
}) => {
  const currentTime = '09:41';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 py-6 px-4 font-sans select-none">
      {/* Top Device & Platform Selector Bar */}
      <div className="flex items-center gap-3 mb-4 bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-lg text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Smartphone size={14} className="text-emerald-400" />
          <span>Simulator Mobile:</span>
        </div>
        <button
          onClick={() => onDeviceChange('ios')}
          className={`px-3 py-1 rounded-full font-semibold transition-all ${
            device === 'ios'
              ? 'bg-[#047857] text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          iOS (iPhone 16 Pro)
        </button>
        <button
          onClick={() => onDeviceChange('android')}
          className={`px-3 py-1 rounded-full font-semibold transition-all ${
            device === 'android'
              ? 'bg-[#DC2626] text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Android (Pixel 8)
        </button>
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
