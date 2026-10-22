import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  Heart,
  MapPin,
  DoorOpen,
  ArrowRight,
  Trash2,
  Layers,
  Star
} from 'lucide-react';

interface SavedStoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedStoreIds: string[];
  allStores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onSelectStore: (store: ThriftStoreItem) => void;
  onRemoveSaved: (storeId: string) => void;
  onClearAllSaved: () => void;
  onStartCompare: (store: ThriftStoreItem) => void;
}

export const SavedStoresModal: React.FC<SavedStoresModalProps> = ({
  isOpen,
  onClose,
  savedStoreIds,
  allStores,
  selectedSchool,
  onSelectStore,
  onRemoveSaved,
  onClearAllSaved,
  onStartCompare,
}) => {
  if (!isOpen) return null;

  const savedStores = allStores.filter(st => savedStoreIds.includes(st.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E1F16]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF6ED] border-2 border-[#2E1F16] rounded-3xl shadow-[6px_6px_0px_#2E1F16] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-[#2E1F16]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#C1D7C2] border-b-2 border-[#2E1F16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-[#2E1F16] flex items-center justify-center text-[#EFAE6E]">
              <Heart className="w-5 h-5 fill-[#EFAE6E]" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#2E1F16]">
                My Saved Thrift Racks
              </h2>
              <span className="text-xs font-bold text-[#2E1F16]/70">
                {savedStores.length} {savedStores.length === 1 ? 'store' : 'stores'} bookmarked
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-[#2E1F16] flex items-center justify-center text-[#2E1F16] shadow-[2px_2px_0px_#2E1F16] hover:bg-slate-50 cursor-pointer transition-all"
            aria-label="Close saved stores"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {savedStores.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">🏷️</div>
              <h3 className="font-display text-xl text-[#2E1F16]">
                No Saved Racks Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#2E1F16]/70 max-w-sm mx-auto">
                Tap the heart icon on any store card across the map or directory to save locations for weekend shopping trips!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedStores.map(store => {
                const dist = selectedSchool
                  ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
                  : null;

                return (
                  <div
                    key={store.id}
                    className="p-4 bg-white border-1.5 border-[#2E1F16] rounded-2xl shadow-[2px_2px_0px_#2E1F16] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF6ED] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="thrift-pill bg-[#F7E09A] text-[#2E1F16]">
                          {store.priceTier}
                        </span>
                        {dist !== null && (
                          <span className="font-extrabold text-[#325336] bg-[#C1D7C2]/40 px-2 py-0.5 rounded-full border border-[#325336]/30">
                            {formatDistance(dist)} away
                          </span>
                        )}
                        <span className="text-[#2E1F16]/70">
                          {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Fitting Rooms` : 'No Fitting Rooms'}
                        </span>
                      </div>

                      <h4 className="font-display text-lg text-[#2E1F16]">
                        {store.name}
                      </h4>
                      <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 truncate font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#2E1F16]/50 shrink-0" />
                        <span>{store.address}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2E1F16]/10 shrink-0">
                      <button
                        onClick={() => onStartCompare(store)}
                        className="btn-outline-pill text-xs py-1.5 px-3"
                        title="Add to comparison"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Compare</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectStore(store);
                          onClose();
                        }}
                        className="btn-primary-mint text-xs py-1.5 px-3.5 font-bold"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemoveSaved(store.id)}
                        className="p-2 text-[#2E1F16]/40 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedStores.length > 0 && (
          <div className="p-4 bg-white border-t-2 border-[#2E1F16] flex items-center justify-between text-xs font-bold">
            <button
              onClick={onClearAllSaved}
              className="text-[#2E1F16]/60 hover:text-rose-600 underline cursor-pointer"
            >
              Clear All Saved Racks
            </button>
            <button
              onClick={onClose}
              className="btn-outline-pill text-xs py-1.5 px-4"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
