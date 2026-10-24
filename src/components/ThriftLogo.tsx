import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';

interface ThriftLogoProps {
  variant?: 'compact' | 'giant' | 'default';
  className?: string;
}

export const ThriftLogo: React.FC<ThriftLogoProps> = ({
  variant = 'default',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <div className="w-9 h-9 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-sm border border-[#2E1F16]/20 relative">
          <Cloud className="w-5 h-5 fill-white text-[#2E1F16]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C1D7C2] border border-[#2E1F16]" />
        </div>
        <div>
          <span className="font-cloud text-xl font-bold tracking-tight text-[#2E1F16] leading-none block">
            ThriftFit <span className="text-[#EFAE6E]">DuvALL</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#2E1F16]/70 leading-none block mt-0.5">
            Duval High Schools
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'giant') {
    return (
      <div className={`select-none ${className}`}>
        <div className="font-cloud text-4xl sm:text-6xl text-[#2E1F16]/15 font-bold tracking-tight text-right">
          ThriftFit <span className="text-[#EFAE6E]/25">DuvALL</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-11 h-11 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-md border-2 border-[#2E1F16]/20 relative">
        <Cloud className="w-6 h-6 fill-white text-[#2E1F16]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C1D7C2] border border-[#2E1F16]" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-cloud text-2xl font-bold tracking-tight text-[#2E1F16] leading-none block">
            ThriftFit <span className="text-[#EFAE6E]">DuvALL</span>
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2E1F16]/70 leading-none block mt-1">
          High School Thrift &amp; Fit Finder
        </span>
      </div>
    </div>
  );
};
