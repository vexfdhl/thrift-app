import React from 'react';

interface ThriftLogoProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact' | 'mini' | 'giant';
  className?: string;
  light?: boolean;
}

export const ThriftLogo: React.FC<ThriftLogoProps> = ({
  title = 'ThriftIt',
  subtitle = 'Duval County Student Fashion Network',
  variant = 'compact',
  className = '',
  light = false,
}) => {
  const textColor = light ? 'text-[#FBEFD9]' : 'text-[#2E1F16]';
  const duvalColor = 'text-[#EFAE6E]';

  if (variant === 'giant') {
    return (
      <div className={`select-none text-center sm:text-left ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C1D7C2] text-[#2E1F16] flex items-center justify-center shadow-sm shrink-0 border border-[#2E1F16]/10">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4a3 3 0 0 1 3 3c0 1.2-.8 2.2-1.9 2.7L21 16H3l7.9-6.3A3.01 3.01 0 0 1 12 4z" />
              <circle cx="12" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <span
              className={`font-editorial text-4xl sm:text-6xl tracking-normal block leading-none ${textColor}`}
            >
              {title} <span className={duvalColor}>DuvALL</span>
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#2E1F16]/70 uppercase tracking-widest block mt-1.5 font-['Nunito']">
              Thrift More · Waste Less · Duval County, FL
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div className={`inline-flex items-center gap-2 select-none ${className}`}>
        <div className="w-7 h-7 rounded-xl bg-[#C1D7C2] text-[#2E1F16] flex items-center justify-center text-[10px] font-bold border border-[#2E1F16]/10">
          TD
        </div>
        <span className={`font-editorial text-lg tracking-normal ${textColor}`}>
          {title} <span className={duvalColor}>DuvALL</span>
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#C1D7C2] text-[#2E1F16] flex items-center justify-center shadow-xs shrink-0 border border-[#2E1F16]/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4a3 3 0 0 1 3 3c0 1.2-.8 2.2-1.9 2.7L21 16H3l7.9-6.3A3.01 3.01 0 0 1 12 4z" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-editorial text-xl sm:text-2xl tracking-normal ${textColor}`}>
              {title}
            </span>
            <span className={`font-editorial text-xl sm:text-2xl tracking-normal ${duvalColor}`}>
              DuvALL
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16]/70 mt-0.5 font-['Nunito']">
            Secondhand &amp; Sustainable
          </span>
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="w-11 h-11 rounded-2xl bg-[#C1D7C2] text-[#2E1F16] flex items-center justify-center shadow-xs shrink-0 border border-[#2E1F16]/10">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4a3 3 0 0 1 3 3c0 1.2-.8 2.2-1.9 2.7L21 16H3l7.9-6.3A3.01 3.01 0 0 1 12 4z" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-editorial text-2xl tracking-normal ${textColor}`}>
            {title}
          </span>
          <span className={`font-editorial text-2xl tracking-normal ${duvalColor}`}>
            DuvALL
          </span>
        </div>
        <span className="text-xs font-medium text-[#2E1F16]/75 mt-0.5 font-['Nunito']">
          {subtitle}
        </span>
      </div>
    </div>
  );
};
