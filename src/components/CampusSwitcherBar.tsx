import React from 'react';
import { SchoolItem, DUVAL_SCHOOLS } from '../data/schools';
import { School, Search, SlidersHorizontal, MapPin } from 'lucide-react';

interface CampusSwitcherBarProps {
  selectedSchool: SchoolItem | null;
  onSelectSchool: (school: SchoolItem) => void;
  maxRadius: number;
  onRadiusChange: (radius: number) => void;
  onOpenSearch?: () => void;
}

export const CampusSwitcherBar: React.FC<CampusSwitcherBarProps> = ({
  selectedSchool,
  onSelectSchool,
  maxRadius,
  onRadiusChange,
  onOpenSearch,
}) => {
  // Quick-pick popular Duval high schools for the horizontal ribbon
  const popularSchools = DUVAL_SCHOOLS.slice(0, 10);

  return (
    <div className="w-full bg-[#F7E09A]/30 border-b border-[#2E1F16]/10 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Quick School Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] shrink-0 mr-1">
            <School className="w-4 h-4 text-[#EFAE6E]" />
            <span className="hidden sm:inline">My Campus:</span>
          </div>

          {popularSchools.map(sch => {
            const isSelected = selectedSchool?.id === sch.id;
            return (
              <button
                key={sch.id}
                onClick={() => onSelectSchool(sch)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#2E1F16] text-[#FBEFD9] shadow-xs font-bold'
                    : 'bg-[#FBEFD9] hover:bg-white text-[#2E1F16]/80 border border-[#2E1F16]/15 hover:border-[#2E1F16]/30'
                }`}
              >
                {sch.name.replace(' High School', '').replace(' School for Advanced Studies', '')}
              </button>
            );
          })}

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#EFAE6E]/40 hover:bg-[#EFAE6E] text-[#2E1F16] transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Search className="w-3 h-3" />
              <span>All 24</span>
            </button>
          )}
        </div>

        {/* Right: Radius Filter */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold w-full md:w-auto justify-end">
          <span className="text-[#2E1F16]/70 hidden lg:inline">Radius:</span>
          {[5, 10, 15, 30].map(r => (
            <button
              key={r}
              onClick={() => onRadiusChange(r)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                maxRadius === r
                  ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                  : 'bg-[#FBEFD9] text-[#2E1F16]/70 hover:text-[#2E1F16] border border-[#2E1F16]/15'
              }`}
            >
              {r === 30 ? 'All Duval' : `${r} mi`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
