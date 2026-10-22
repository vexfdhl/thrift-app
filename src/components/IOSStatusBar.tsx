import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface IOSStatusBarProps {
  islandText?: string;
  onIslandClick?: () => void;
  className?: string;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({
  islandText,
  onIslandClick,
  className = '',
}) => {
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [islandExpanded, setIslandExpanded] = useState<boolean>(false);

  // Keep a live clock or standard 9:41
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      // Format as 12-hour or standard
      hours = hours % 12 || 12;
      const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setCurrentTime(`${hours}:${minutesStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full pt-2.5 pb-1 px-6 flex items-center justify-between text-slate-900 select-none shrink-0 relative z-50 text-[13px] font-semibold tracking-tight ${className}`}
    >
      {/* iOS Time (Left) */}
      <div className="w-16 flex items-center">
        <span className="font-semibold text-slate-900 tracking-tight text-[13px]">
          {currentTime}
        </span>
      </div>

      {/* Dynamic Island (Center) */}
      <div className="flex-1 flex justify-center items-center">
        <div
          onClick={() => {
            setIslandExpanded(!islandExpanded);
            if (onIslandClick) onIslandClick();
          }}
          className={`bg-black text-white rounded-full transition-all duration-300 ease-out cursor-pointer flex items-center justify-between px-2.5 shadow-sm hover:scale-[1.02] active:scale-95 ${
            islandExpanded
              ? 'h-8 px-4 w-56 justify-between'
              : 'h-6 w-28'
          }`}
          title="Dynamic Island"
        >
          {/* Front Camera & TrueDepth Sensor */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#151515] border border-neutral-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900/60" />
            </div>
            {islandExpanded && (
              <span className="text-[10px] font-bold text-emerald-400 tracking-tight truncate max-w-[120px]">
                {islandText || 'ThriftIt DuvALL'}
              </span>
            )}
          </div>

          {/* Sensor indicator or small pulse */}
          <div className="flex items-center gap-1">
            {islandExpanded ? (
              <span className="text-[9px] font-extrabold text-[#F7E09A] uppercase tracking-wider">
                FL-04
              </span>
            ) : (
              <div className="w-2 h-2 rounded-full bg-neutral-900" />
            )}
          </div>
        </div>
      </div>

      {/* Status Icons: Cellular, Wi-Fi, Battery (Right) */}
      <div className="w-16 flex items-center justify-end gap-1.5 text-slate-900">
        {/* Cellular 4 bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <div className="w-[2.5px] h-1 bg-slate-900 rounded-[0.5px]" />
          <div className="w-[2.5px] h-1.5 bg-slate-900 rounded-[0.5px]" />
          <div className="w-[2.5px] h-2 bg-slate-900 rounded-[0.5px]" />
          <div className="w-[2.5px] h-2.5 bg-slate-900 rounded-[0.5px]" />
        </div>

        {/* 5G label */}
        <span className="text-[10px] font-bold tracking-tighter text-slate-800">5G</span>

        {/* Wi-Fi Icon */}
        <Wifi className="w-3.5 h-3.5 text-slate-900 stroke-[2.4]" />

        {/* iOS Battery Capsule */}
        <div className="flex items-center">
          <div className="w-[20px] h-[10.5px] rounded-[3px] border-[1.5px] border-slate-900 p-[1px] flex items-center">
            <div className="h-full w-full bg-slate-900 rounded-[1.5px]" />
          </div>
          <div className="w-[1px] h-[3.5px] bg-slate-900 rounded-r-[1px] -ml-[0.5px]" />
        </div>
      </div>
    </div>
  );
};
