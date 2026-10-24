import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface IOSStatusBarProps {
  islandText?: string;
  onIslandClick?: () => void;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({
  islandText = 'ThriftFit DuvALL',
  onIslandClick,
}) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#2E1F16] text-[#FBEFD9] px-6 py-2.5 flex items-center justify-between text-xs font-bold select-none shrink-0 z-50 rounded-t-[38px]">
      {/* Time */}
      <span className="tracking-tight text-[11px] font-black">{time}</span>

      {/* Dynamic Island Capsule */}
      <div
        onClick={onIslandClick}
        className="px-3.5 py-1 bg-black text-[#FBEFD9] rounded-full text-[10px] font-bold tracking-tight border border-white/10 shadow-inner flex items-center gap-1.5 cursor-pointer hover:bg-black/80 transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="truncate max-w-[120px]">{islandText}</span>
      </div>

      {/* Connectivity Icons */}
      <div className="flex items-center gap-1.5 text-[11px]">
        {/* Cellular Bars */}
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 h-1 bg-[#FBEFD9] rounded-xs" />
          <span className="w-0.5 h-1.5 bg-[#FBEFD9] rounded-xs" />
          <span className="w-0.5 h-2 bg-[#FBEFD9] rounded-xs" />
          <span className="w-0.5 h-2.5 bg-[#FBEFD9] rounded-xs" />
        </div>
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-[#FBEFD9]" />
      </div>
    </div>
  );
};
