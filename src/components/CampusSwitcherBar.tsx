import React from 'react';
import { SchoolItem, DUVAL_SCHOOLS } from '../data/schools';
import { School, MapPin, SlidersHorizontal, Check } from 'lucide-react';

interface CampusSwitcherBarProps {
  selectedSchool: SchoolItem | null;
  onSelectSchool: (school: SchoolItem) => void;
  maxRadius: number;
  onRadiusChange: (radius: number) => void;
  onOpenSearch: () => void;
}

const FEATURED_CAMPUSES = [
  'riverside',
  'stanton',
  'fletcher',
  'atlantic-coast',
  'douglas-anderson',
  'paxon',
  'wolfson',
  'sandalwood',
  'mandarin',
  'raines',
];

export const CampusSwitcherBar: React.FC<CampusSwitcherBarProps> = ({
  selectedSchool,
  onSelectSchool,
  maxRadius,
  onRadiusChange,
  onOpenSearch,
}) => {
  return (
    <div className="w-full bg-[#FBEFD9] border-b border-[#2E1F16]/10 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Quick School Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16]/70 shrink-0 pr-1">
            <School className="w-3.5 h-3.5 text-[#EFAE6E]" />
            <span className="hidden sm:inline">Active Campus:</span>
          </div>

          {FEATURED_CAMPUSES.map(id => {
            const sch = DUVAL_SCHOOLS.find(s => s.id === id);
            if (!sch) return null;
            const isSelected = selectedSchool?.id === sch.id;

            return (
              <button
                key={sch.id}
                onClick={() => onSelectSchool(sch)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                    : 'bg-[#F7E09A]/40 text-[#2E1F16] hover:bg-[#F7E09A] border border-[#2E1F16]/10'
                }`}
              >
                {sch.name}
              </button>
            );
          })}

          <button
            onClick={onOpenSearch}
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#2E1F16]/80 hover:text-[#2E1F16] underline shrink-0 cursor-pointer"
          >
            All 24 Schools...
          </button>
        </div>

        {/* Right: Quick Radius Slider */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-semibold text-[#2E1F16]">
          <span className="text-[#2E1F16]/70 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C1D7C2]" />
            <span>Campus Radius:</span>
          </span>

          <div className="flex items-center gap-1.5">
            {[5, 10, 15, 30].map(r => (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  maxRadius === r
                    ? 'bg-[#C1D7C2] text-[#2E1F16] shadow-xs'
                    : 'bg-[#F7E09A]/40 text-[#2E1F16]/70 hover:bg-[#F7E09A] hover:text-[#2E1F16]'
                }`}
              >
                {r === 30 ? 'All' : `${r} mi`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
