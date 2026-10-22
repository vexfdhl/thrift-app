import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  MapPin,
  Clock,
  DoorOpen,
  DollarSign,
  Heart,
  Scale,
  Navigation,
  ExternalLink,
  Check,
  Star,
  Leaf,
  Calendar,
  Sparkles
} from 'lucide-react';

interface QuickPeekModalProps {
  store: ThriftStoreItem | null;
  isOpen: boolean;
  onClose: () => void;
  selectedSchool: SchoolItem | null;
  onOpenFullDetail: (store: ThriftStoreItem) => void;
  isSaved: boolean;
  onToggleSave: (storeId: string) => void;
  isCompared: boolean;
  onToggleCompare: (storeId: string) => void;
}

export const QuickPeekModal: React.FC<QuickPeekModalProps> = ({
  store,
  isOpen,
  onClose,
  selectedSchool,
  onOpenFullDetail,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
}) => {
  if (!isOpen || !store) return null;

  const distance = selectedSchool
    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
    : null;

  // Calculate live open status based on today's day
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const todayKey = days[new Date().getDay()];
  const todayHours = store.hours[todayKey] || 'Hours unavailable';
  const isClosedToday = todayHours.toLowerCase().includes('closed');

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${store.name}, ${store.address}, ${store.city}, FL ${store.zip}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#FBEFD9] rounded-3xl border border-[#2E1F16]/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#2E1F16]/10 flex items-start justify-between gap-4 bg-[#F7E09A]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isClosedToday
                    ? 'bg-[#2E1F16]/10 text-[#2E1F16]'
                    : 'bg-[#C1D7C2] text-[#2E1F16]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isClosedToday ? 'bg-[#2E1F16]' : 'bg-[#2E1F16]'}`} />
                {isClosedToday ? 'Closed Today' : 'Open Today'}
              </span>

              {distance !== null && (
                <span className="text-[11px] font-semibold text-[#2E1F16]/70">
                  · {formatDistance(distance)} from {selectedSchool?.name || 'campus'}
                </span>
              )}
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16] font-normal leading-tight">
              {store.name}
            </h2>
            <p className="text-xs text-[#2E1F16]/70 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2E1F16]/50 shrink-0" />
              <span>{store.address}, {store.city}, FL {store.zip}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2E1F16]/8 hover:bg-[#2E1F16]/15 text-[#2E1F16] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#2E1F16]">
          {/* Unboxed Metadata Strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#2E1F16]/80 font-medium py-1 border-b border-[#2E1F16]/10">
            <span>
              <strong>Price Tier:</strong> {store.priceTier} ({store.priceRangeFormatted})
            </span>
            <span>·</span>
            <span>
              <strong>Fitting Rooms:</strong>{' '}
              {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} open` : 'None'}
            </span>
            <span>·</span>
            <span>
              <strong>Rating:</strong> ★{' '}
              {store.reviews.length > 0
                ? (store.reviews.reduce((acc, r) => acc + r.rating, 0) / store.reviews.length).toFixed(1)
                : '4.8'}{' '}
              ({store.reviews.length} reviews)
            </span>
          </div>

          {/* Quick Note */}
          <div className="bg-white p-4 rounded-2xl border border-[#2E1F16]/10 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16] bg-[#C1D7C2]/50 px-2 py-0.5 rounded-full inline-block">
              Student Value Insight
            </span>
            <p className="text-xs leading-relaxed text-[#2E1F16]/85">
              {store.priceNotes}
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2E1F16]">
                <Clock className="w-3.5 h-3.5 text-[#EFAE6E]" />
                <span>Today's Hours</span>
              </div>
              <p className="text-[11px] text-[#2E1F16]/80 capitalize">
                {todayHours}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2E1F16]">
                <DoorOpen className="w-3.5 h-3.5 text-[#EFAE6E]" />
                <span>Fitting Rooms</span>
              </div>
              <p className="text-[11px] text-[#2E1F16]/80">
                {store.fittingRoomsNote}
              </p>
            </div>
          </div>

          {/* Clothing Categories */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E1F16]/70 block">
              Curated Clothing Racks
            </span>
            <div className="flex flex-wrap gap-1.5">
              {store.categories.map(cat => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-[#2E1F16]/15 text-[#2E1F16]"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Formalwear / Event Note if applicable */}
          {store.hasFormalwear && (
            <div className="p-3 rounded-2xl bg-[#C1D7C2]/30 border border-[#C1D7C2] text-xs space-y-1">
              <span className="font-bold text-[#2E1F16] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EFAE6E]" />
                <span>Homecoming &amp; Formalwear Available</span>
              </span>
              <p className="text-[11px] text-[#2E1F16]/80">
                {store.formalwearNotes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#2E1F16]/10 bg-[#F7E09A]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Save Toggle */}
            <button
              onClick={() => onToggleSave(store.id)}
              className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-[#EFAE6E] text-[#2E1F16]'
                  : 'bg-white text-[#2E1F16] border border-[#2E1F16]/20 hover:border-[#EFAE6E]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#2E1F16]' : 'text-[#2E1F16]'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(store.id)}
              className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isCompared
                  ? 'bg-[#EFAE6E] text-[#2E1F16]'
                  : 'bg-white text-[#2E1F16] border border-[#2E1F16]/20 hover:border-[#EFAE6E]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-white text-[#2E1F16] border border-[#2E1F16]/20 hover:bg-[#FBEFD9] transition-all flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-[#2E1F16]" />
              <span>Directions</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenFullDetail(store);
              }}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#EFAE6E] text-[#2E1F16] hover:bg-[#e5a05b] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs font-['Nunito']"
            >
              <span>Full Details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
