import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  MapPin,
  Clock,
  DoorOpen,
  Navigation,
  Heart,
  Scale,
  ArrowRight,
  Phone,
  Sparkles,
  Shirt,
  UserCheck
} from 'lucide-react';

interface QuickPeekModalProps {
  store: ThriftStoreItem | null;
  isOpen: boolean;
  onClose: () => void;
  selectedSchool: SchoolItem | null;
  onOpenFullDetail: (store: ThriftStoreItem) => void;
  onOpenNavigate?: (store: ThriftStoreItem) => void;
  isSaved?: boolean;
  onToggleSave?: (storeId: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (storeId: string) => void;
}

export const QuickPeekModal: React.FC<QuickPeekModalProps> = ({
  store,
  isOpen,
  onClose,
  selectedSchool,
  onOpenFullDetail,
  onOpenNavigate,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
}) => {
  if (!isOpen || !store) return null;

  const dist = selectedSchool
    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
    : null;

  const handleNavigate = () => {
    onClose();
    if (onOpenNavigate) {
      onOpenNavigate(store);
    } else {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-lg rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2E1F16]/10 flex items-start justify-between bg-[#F7E09A]/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold mb-1">
              <span className="bg-[#EFAE6E] text-[#2E1F16] px-2.5 py-0.5 rounded text-[10px] uppercase font-black">
                {store.priceTier} · {store.priceRangeFormatted}
              </span>
              {dist !== null && (
                <span className="bg-[#C1D7C2] text-[#2E1F16] px-2 py-0.5 rounded text-[11px] font-bold">
                  {formatDistance(dist)} from {selectedSchool?.name.split(' ')[0]}
                </span>
              )}
            </div>

            <h3 className="font-cloud text-2xl font-bold text-[#2E1F16] leading-tight">
              {store.name}
            </h3>

            <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#EFAE6E] shrink-0" />
              <span>{store.address} · {store.city}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close quick peek"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Dressing Room & Hours Status */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-[#2E1F16]/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C1D7C2]/50 text-[#2E1F16] flex items-center justify-center shrink-0">
                <DoorOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#2E1F16]/60">Fitting Rooms</div>
                <div className="font-bold text-[#2E1F16]">
                  {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Open Stalls` : 'Closed'}
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-[#2E1F16]/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EFAE6E]/30 text-[#2E1F16] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#2E1F16]/60">Status</div>
                <div className="font-bold text-[#2E1F16]">
                  {store.isOpenNow ? 'Open Now' : 'Closed'}
                </div>
              </div>
            </div>
          </div>

          {/* Amount of Women's and Men's Clothing from PDF */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#2E1F16]/10 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <Shirt className="w-4 h-4 text-[#EFAE6E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#2E1F16] block">Women’s Clothing:</span>
                <span className="text-[#2E1F16]/80">{store.womensClothingAmount}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-[#2E1F16]/10">
              <UserCheck className="w-4 h-4 text-[#2E1F16] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#2E1F16] block">Men’s Clothing:</span>
                <span className="text-[#2E1F16]/80">{store.mensClothingAmount}</span>
              </div>
            </div>
          </div>

          {/* Price Notes */}
          <div className="p-3.5 bg-[#FBEFD9]/70 rounded-2xl border border-[#2E1F16]/10 text-xs">
            <span className="font-bold text-[#2E1F16] block mb-0.5">Price &amp; Discounts:</span>
            <p className="text-[#2E1F16]/80 leading-relaxed font-medium">
              {store.priceNotes}
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#2E1F16]/60 tracking-wider block">
              Categories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {store.categories.map(c => (
                <span
                  key={c}
                  className="bg-white border border-[#2E1F16]/10 px-2.5 py-1 rounded-full text-xs font-semibold text-[#2E1F16]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {store.bonusInfo && (
            <div className="p-3 bg-[#C1D7C2]/30 rounded-xl border border-[#2E1F16]/10 text-xs">
              <span className="font-bold text-[#2E1F16] block">PDF Field Notes:</span>
              <p className="text-[#2E1F16]/85 font-medium mt-0.5">{store.bonusInfo}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F7E09A]/30 border-t border-[#2E1F16]/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(store.id)}
                className="p-2.5 rounded-2xl bg-white border border-[#2E1F16]/15 hover:bg-[#FBEFD9] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title={isSaved ? 'Remove from saved' : 'Save to rack'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]'}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(store.id)}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isCompared
                    ? 'bg-[#EFAE6E] text-[#2E1F16] border-[#EFAE6E]'
                    : 'bg-white border-[#2E1F16]/15 hover:bg-[#FBEFD9]'
                }`}
                title="Compare store"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            )}

            <button
              onClick={handleNavigate}
              className="p-2.5 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] border border-[#2E1F16]/15 hover:bg-[#e5a05b] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Launch Navigation"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate</span>
            </button>
          </div>

          <button
            onClick={() => {
              onOpenFullDetail(store);
              onClose();
            }}
            className="btn-clevr-brown text-xs py-2.5 px-4 font-bold cursor-pointer"
          >
            <span>Full Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
