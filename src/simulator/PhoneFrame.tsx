import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
}) => {
  const currentTime = '09:41';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 py-6 px-3 font-sans select-none">
      {/* Outer Phone Shell - Android (Pixel 8) Authentic Chassis */}
      <div className="relative transition-all duration-300 shadow-2xl bg-black w-[392px] h-[808px] rounded-[42px] p-[9px] ring-1 ring-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        {/* Android Hardware Side Buttons */}
        <div className="absolute -right-[12px] top-[170px] w-[3px] h-[44px] bg-slate-700 rounded-r-sm" />
        <div className="absolute -right-[12px] top-[230px] w-[3px] h-[70px] bg-slate-700 rounded-r-sm" />

        {/* Inner Screen Display */}
        <div className="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col rounded-[34px]">
          {/* Top Android Status Bar */}
          <div className="relative z-30 h-11 w-full flex items-center justify-between px-6 pt-1 text-slate-800 text-[13px] font-semibold">
            <span>{currentTime}</span>

            {/* Android Front Camera Cutout */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 bg-black rounded-full shadow-inner" />

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

          {/* Bottom Android Gesture / Navigation Bar */}
          <div className="h-6 w-full flex items-center justify-center bg-transparent pointer-events-none z-30">
            <div className="h-1 bg-slate-400/80 rounded-full w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
