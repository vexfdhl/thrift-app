import React, { useState } from 'react';
import { SchoolItem, DUVAL_SCHOOLS } from '../data/schools';
import { Search, X, School, Check, MapPin } from 'lucide-react';

interface SchoolPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSchool: SchoolItem | null;
  onSelectSchool: (school: SchoolItem) => void;
}

export const SchoolPickerSheet: React.FC<SchoolPickerSheetProps> = ({
  isOpen,
  onClose,
  selectedSchool,
  onSelectSchool,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = DUVAL_SCHOOLS.filter(
    s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase()) ||
      s.zip.includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-0 sm:p-4">
      <div
        className="w-full max-w-lg bg-[#FDFBF7] border-t-2 sm:border-2 border-slate-900 rounded-t-3xl sm:rounded-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.25)] sm:shadow-[6px_6px_0px_#0f172a] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle Bar on Mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Sheet Header */}
        <div className="p-4 sm:p-5 pb-3 border-b-2 border-slate-900 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-950">
              Select Your High School
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              24 Duval County Public Schools
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search school name, street, or zip..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#FDFBF7] border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[1px_1px_0px_#0f172a]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Schools List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2 max-h-[50vh]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-semibold text-slate-500">
              No Duval school found matching "{query}".
            </div>
          ) : (
            filtered.map(school => {
              const isSelected = selectedSchool?.id === school.id;
              return (
                <div
                  key={school.id}
                  onClick={() => {
                    onSelectSchool(school);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#C1D7C2] border-slate-900 text-slate-950 font-bold shadow-[2px_2px_0px_#0f172a]'
                      : 'bg-white border-slate-300 hover:border-slate-900 hover:bg-[#FDFBF7] text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-slate-900/30 bg-[#FDFBF7] flex items-center justify-center shrink-0">
                      <School className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-950 truncate">
                        {school.name}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate font-medium">
                        {school.address} · {school.zip}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900/20 bg-[#FDFBF7]">
                      {school.type}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
