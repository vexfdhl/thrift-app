import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  Heart,
  MapPin,
  Scale,
  DoorOpen,
  ArrowRight,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedStoreIds: string[];
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onToggleSave: (storeId: string) => void;
  onSelectStore: (store: ThriftStoreItem) => void;
  onToggleCompare?: (storeId: string) => void;
  compareStoreIds?: string[];
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
  compareStoreIds = [],
}) => {
  if (!isOpen) return null;

  const savedStores = stores.filter(s => savedStoreIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-3xl rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#2E1F16]/10 flex items-center justify-between bg-[#F7E09A]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-[#2E1F16]" />
            </div>
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl text-[#2E1F16] font-normal leading-tight">
                Saved <span className="font-editorial-italic text-[#EFAE6E]">Thrift Racks</span> ({savedStores.length})
              </h2>
              <p className="text-xs text-[#2E1F16]/75">
                Quick access to your curated favorite stores and verified dressing rooms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close saved racks"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {savedStores.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#F7E09A]/40 border border-[#2E1F16]/20 flex items-center justify-center mx-auto text-[#2E1F16]">
                <Heart className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-editorial text-2xl text-[#2E1F16]">Your thrift rack is empty</h3>
              <p className="text-xs sm:text-sm text-[#2E1F16]/75">
                Tap the heart button on any thrift store card to save your favorite Jacksonville spots here.
              </p>
              <button
                onClick={onClose}
                className="btn-clevr-brown text-xs px-6 py-2.5 mx-auto"
              >
                Browse Duval Stores
              </button>
            </div>
          ) : (
            savedStores.map(store => {
              const dist = selectedSchool
                ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
                : null;
              const isCompared = compareStoreIds.includes(store.id);

              return (
                <div
                  key={store.id}
                  className="bg-white p-5 rounded-2xl border border-[#2E1F16]/12 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#2E1F16] bg-[#EFAE6E] px-2 py-0.5 rounded text-[11px] uppercase">
                        {store.priceTier} · {store.city}
                      </span>
                      {dist !== null && (
                        <span className="bg-[#C1D7C2] text-[#2E1F16] font-bold px-2 py-0.5 rounded text-[11px]">
                          {formatDistance(dist)} away
                        </span>
                      )}
                      <span className="text-[11px] text-[#2E1F16]/60">
                        {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms Open` : 'No Rooms'}
                      </span>
                    </div>

                    <h4 className="font-editorial text-xl font-bold text-[#2E1F16] leading-tight">
                      {store.name}
                    </h4>

                    <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 truncate font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2E1F16]/40 shrink-0" />
                      <span>{store.address}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onToggleCompare && (
                      <button
                        onClick={() => onToggleCompare(store.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          isCompared
                            ? 'bg-[#EFAE6E] text-[#2E1F16] border-[#EFAE6E]'
                            : 'border-[#2E1F16]/20 hover:bg-[#FBEFD9]'
                        }`}
                        title="Compare store"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Compare</span>
                      </button>
                    )}

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-[#2E1F16]/20 hover:bg-[#FBEFD9] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Open Google Maps Directions"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Directions</span>
                    </a>

                    <button
                      onClick={() => {
                        onSelectStore(store);
                        onClose();
                      }}
                      className="btn-clevr-brown text-xs py-2 px-3.5"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleSave(store.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
