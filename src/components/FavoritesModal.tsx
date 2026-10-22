import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  Heart,
  DoorOpen,
  MapPin,
  Clock,
  ArrowRight,
  Scale,
  Navigation,
  Trash2
} from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedStoreIds: string[];
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onToggleSave: (storeId: string) => void;
  onSelectStore: (store: ThriftStoreItem) => void;
  onToggleCompare: (storeId: string) => void;
  compareStoreIds: string[];
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  savedStoreIds,
  stores,
  selectedSchool,
  onToggleSave,
  onSelectStore,
  onToggleCompare,
  compareStoreIds,
}) => {
  if (!isOpen) return null;

  const savedStores = stores.filter(s => savedStoreIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2E1F16]/70 backdrop-blur-sm animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] text-[#2E1F16] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#2E1F16]/20 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#2E1F16]/15 flex items-center justify-between bg-[#F7E09A]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-[#2E1F16]" />
            </div>
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl text-[#2E1F16] font-normal leading-tight">
                Saved <span className="font-editorial-italic text-[#EFAE6E]">Thrift Racks</span> ({savedStores.length})
              </h2>
              <p className="text-xs text-[#2E1F16]/75">
                Your bookmarked stores across Duval County for quick route planning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close saved stores modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {savedStores.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#F7E09A]/40 border border-[#2E1F16]/20 flex items-center justify-center mx-auto text-[#2E1F16]">
                <Heart className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-editorial text-2xl text-[#2E1F16]">No saved stores yet</h3>
              <p className="text-xs sm:text-sm text-[#2E1F16]/75">
                Tap the heart icon on any store card while browsing to save it to your personal favorites list.
              </p>
              <button
                onClick={onClose}
                className="btn-clevr-brown text-xs px-6 py-2.5 mx-auto"
              >
                Browse Directory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedStores.map(store => {
                const dist = selectedSchool
                  ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
                  : null;
                const isCompared = compareStoreIds.includes(store.id);

                return (
                  <div
                    key={store.id}
                    className="p-5 rounded-2xl bg-white border border-[#2E1F16]/15 hover:border-[#EFAE6E] transition-all flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7E09A] text-[#2E1F16]">
                          {store.priceTier} · {store.city}
                        </span>
                        <button
                          onClick={() => onToggleSave(store.id)}
                          className="text-[#2E1F16]/50 hover:text-red-600 transition-colors p-1"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-editorial text-lg font-bold text-[#2E1F16] leading-tight">
                        {store.name}
                      </h4>

                      <p className="text-xs text-[#2E1F16]/70 mt-1 line-clamp-1">
                        {store.address}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                        {dist !== null && (
                          <span className="bg-[#C1D7C2] text-[#2E1F16] px-2 py-0.5 rounded-full font-bold text-[11px]">
                            {formatDistance(dist)} away
                          </span>
                        )}
                        <span className="bg-[#FBEFD9] text-[#2E1F16] px-2 py-0.5 rounded-md border border-[#2E1F16]/15 text-[11px] font-semibold flex items-center gap-1">
                          <DoorOpen className="w-3 h-3 text-[#2E1F16]" />
                          {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms` : 'No Rooms'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2E1F16]/10 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectStore(store);
                          onClose();
                        }}
                        className="flex-1 btn-clevr-brown text-xs py-2 justify-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onToggleCompare(store.id)}
                        className={`px-3 py-2 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                          isCompared
                            ? 'bg-[#EFAE6E] text-[#2E1F16] border-[#EFAE6E]'
                            : 'bg-[#FBEFD9] text-[#2E1F16] border-[#2E1F16]/20 hover:bg-white'
                        }`}
                        title={isCompared ? 'Remove from compare' : 'Add to compare'}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
                      </button>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#FBEFD9] border border-[#2E1F16]/20 flex items-center justify-center text-[#2E1F16] hover:bg-white transition-colors"
                        title="Get Directions"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
