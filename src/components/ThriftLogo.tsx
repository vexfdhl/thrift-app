import React from 'react';

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
        <div className="w-8 h-8 rounded-xl bg-[#2E1F16] text-[#FBEFD9] flex items-center justify-center shadow-xs">
          {/* Subtle Coat Hanger SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EFAE6E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3c0 .8.4 1.5 1 2l-7.7 5.8a2 2 0 0 0-.3 2.5l.2.3A2 2 0 0 0 3.8 17H20.2a2 2 0 0 0 1.6-1.4l.2-.3a2 2 0 0 0-.3-2.5L14 7c.6-.5 1-1.2 1-2a3 3 0 0 0-3-3z"/>
          </svg>
        </div>
        <div>
          <span className="font-editorial text-xl font-bold tracking-tight text-[#2E1F16] leading-none block">
            ThriftFit <span className="font-editorial-italic text-[#EFAE6E]">DuvALL</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#2E1F16]/60 leading-none block mt-0.5">
            Duval Student Racks
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'giant') {
    return (
      <div className={`select-none ${className}`}>
        <div className="font-editorial text-4xl sm:text-6xl text-[#2E1F16]/15 font-normal tracking-tight text-right">
          ThriftFit <span className="font-editorial-italic text-[#EFAE6E]/20">DuvALL</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-10 h-10 rounded-2xl bg-[#2E1F16] text-[#FBEFD9] flex items-center justify-center shadow-sm">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EFAE6E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3c0 .8.4 1.5 1 2l-7.7 5.8a2 2 0 0 0-.3 2.5l.2.3A2 2 0 0 0 3.8 17H20.2a2 2 0 0 0 1.6-1.4l.2-.3a2 2 0 0 0-.3-2.5L14 7c.6-.5 1-1.2 1-2a3 3 0 0 0-3-3z"/>
        </svg>
      </div>
      <div>
        <span className="font-editorial text-2xl font-bold tracking-tight text-[#2E1F16] leading-none block">
          ThriftFit <span className="font-editorial-italic text-[#EFAE6E]">DuvALL</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2E1F16]/65 leading-none block mt-1">
          Sustainable Secondhand Racks
        </span>
      </div>
    </div>
  );
};
