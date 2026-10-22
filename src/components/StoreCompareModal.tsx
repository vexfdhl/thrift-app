import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  Check,
  DoorOpen,
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Leaf
} from 'lucide-react';

interface StoreCompareModalProps {
  storesToCompare: ThriftStoreItem[];
  allStores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRemoveStore: (storeId: string) => void;
  onAddStore: (store: ThriftStoreItem) => void;
  onSelectStore: (store: ThriftStoreItem) => void;
}

export const StoreCompareModal: React.FC<StoreCompareModalProps> = ({
  storesToCompare,
  allStores,
  selectedSchool,
  isOpen,
  onClose,
  onRemoveStore,
  onAddStore,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  const availableStoresToAdd = allStores.filter(
    s => !storesToCompare.some(cs => cs.id === s.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E1F16]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FBEFD9] border-2 border-[#2E1F16] rounded-3xl shadow-[6px_6px_0px_#2E1F16] w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-[#2E1F16]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#F7E09A] border-b-2 border-[#2E1F16] flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="thrift-pill bg-[#FFFFFF] text-[#2E1F16]">
                Side-by-Side Comparison
              </span>
              {selectedSchool && (
                <span className="text-xs font-bold text-[#2E1F16]/80 hidden sm:inline">
                  Distances from {selectedSchool.name}
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#2E1F16] mt-1">
              Compare Duval Thrift Racks
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-[#2E1F16] flex items-center justify-center text-[#2E1F16] shadow-[2px_2px_0px_#2E1F16] hover:bg-slate-50 cursor-pointer transition-all"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Body Table */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {storesToCompare.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">⚖️</div>
              <h3 className="font-display text-xl text-[#2E1F16]">
                No Stores Selected for Comparison
              </h3>
              <p className="text-xs sm:text-sm text-[#2E1F16]/70 max-w-md mx-auto">
                Select 2 or 3 stores to compare fitting rooms, road proximity to your high school, pricing tiers, and formalwear selection.
              </p>
              {availableStoresToAdd.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold block mb-2">Quick Add Stores:</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {availableStoresToAdd.slice(0, 3).map(st => (
                      <button
                        key={st.id}
                        onClick={() => onAddStore(st)}
                        className="btn-outline-pill text-xs py-1.5 px-3.5"
                      >
                        + Add {st.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add store dropdown if fewer than 3 */}
              {storesToCompare.length < 3 && availableStoresToAdd.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-white border-1.5 border-[#2E1F16] rounded-2xl text-xs font-bold shadow-[2px_2px_0px_#2E1F16]">
                  <span>Add another store to compare ({3 - storesToCompare.length} slot left):</span>
                  <select
                    onChange={e => {
                      const found = allStores.find(s => s.id === e.target.value);
                      if (found) onAddStore(found);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="bg-[#FBEFD9] border-1.5 border-[#2E1F16] rounded-xl px-3 py-1 font-bold text-xs cursor-pointer focus:outline-none"
                  >
                    <option value="" disabled>
                      Choose store to add...
                    </option>
                    {availableStoresToAdd.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.priceTier})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Grid of Store Columns */}
              <div
                className={`grid gap-4 ${
                  storesToCompare.length === 1
                    ? 'grid-cols-1 max-w-md mx-auto'
                    : storesToCompare.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {storesToCompare.map(store => {
                  const dist = selectedSchool
                    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
                    : null;
                  const avgRating = store.reviews.length > 0
                    ? (store.reviews.reduce((acc, r) => acc + r.rating, 0) / store.reviews.length).toFixed(1)
                    : '5.0';

                  return (
                    <div
                      key={store.id}
                      className="thrift-card p-5 bg-white flex flex-col justify-between space-y-4 relative"
                    >
                      <button
                        onClick={() => onRemoveStore(store.id)}
                        className="absolute top-3 right-3 text-[#2E1F16]/50 hover:text-rose-600 cursor-pointer p-1"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16]">
                          <span className="thrift-pill bg-[#F7E09A] text-[#2E1F16]">
                            {store.priceTier}
                          </span>
                          <span>{store.priceRangeFormatted}</span>
                        </div>

                        <h3 className="font-display text-xl text-[#2E1F16] leading-tight pr-6">
                          {store.name}
                        </h3>

                        <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 truncate font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#2E1F16]/50 shrink-0" />
                          <span>{store.address}</span>
                        </p>

                        {/* Metric Rows */}
                        <div className="space-y-2 pt-2 border-t border-[#2E1F16]/15 text-xs">
                          {/* Distance */}
                          <div className="flex items-center justify-between py-1 border-b border-[#2E1F16]/10">
                            <span className="text-[#2E1F16]/70 font-semibold">Campus Distance:</span>
                            <span className="font-extrabold text-[#325336] bg-[#C1D7C2]/40 px-2 py-0.5 rounded-full border border-[#325336]/30">
                              {dist !== null ? `${formatDistance(dist)} away` : 'Select school'}
                            </span>
                          </div>

                          {/* Fitting Rooms */}
                          <div className="flex items-center justify-between py-1 border-b border-[#2E1F16]/10">
                            <span className="text-[#2E1F16]/70 font-semibold">Fitting Rooms:</span>
                            <span className={`font-bold px-2 py-0.5 rounded-full border ${
                              store.fittingRoomsCount > 0
                                ? 'bg-[#C1D7C2] text-[#2E1F16] border-[#2E1F16]'
                                : 'bg-rose-100 text-rose-900 border-rose-300'
                            }`}>
                              {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Available` : 'None'}
                            </span>
                          </div>

                          {/* Formalwear */}
                          <div className="flex items-center justify-between py-1 border-b border-[#2E1F16]/10">
                            <span className="text-[#2E1F16]/70 font-semibold">Homecoming/Prom:</span>
                            <span className={`font-bold px-2 py-0.5 rounded-full border ${
                              store.hasFormalwear
                                ? 'bg-[#F7E09A] text-[#2E1F16] border-[#2E1F16]'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}>
                              {store.hasFormalwear ? 'Yes, Available' : 'Casual Focused'}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center justify-between py-1 border-b border-[#2E1F16]/10">
                            <span className="text-[#2E1F16]/70 font-semibold">Student Rating:</span>
                            <span className="font-bold flex items-center gap-1 text-[#2E1F16]">
                              <Star className="w-3.5 h-3.5 fill-[#EFAE6E] text-[#EFAE6E]" />
                              <span>{avgRating} ({store.reviews.length})</span>
                            </span>
                          </div>

                          {/* Inventory Split */}
                          <div className="py-1 border-b border-[#2E1F16]/10">
                            <div className="flex justify-between text-[11px] font-bold text-[#2E1F16]/80 mb-1">
                              <span>Inventory Split:</span>
                              <span>W {store.inventorySplit.womensPercent}% / M {store.inventorySplit.mensPercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200 border border-[#2E1F16]/20">
                              <div
                                style={{ width: `${store.inventorySplit.womensPercent}%` }}
                                className="bg-[#C1D7C2]"
                              />
                              <div
                                style={{ width: `${store.inventorySplit.mensPercent}%` }}
                                className="bg-[#EFAE6E]"
                              />
                            </div>
                          </div>

                          {/* Sustainable Materials */}
                          <div className="pt-1">
                            <span className="text-[#2E1F16]/70 font-semibold block mb-1">
                              Sustainable Fabrics:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {store.sustainableMaterials.map(m => (
                                <span
                                  key={m}
                                  className="text-[10px] font-bold bg-[#FBEFD9] px-2 py-0.5 rounded border border-[#2E1F16]/20"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectStore(store);
                          onClose();
                        }}
                        className="w-full btn-primary-tangerine text-xs py-2.5 justify-center mt-3"
                      >
                        <span>View Full Store Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-2 border-[#2E1F16] flex items-center justify-between text-xs font-bold">
          <span className="text-[#2E1F16]/70">
            Comparing {storesToCompare.length} of 3 maximum stores
          </span>
          <button
            onClick={onClose}
            className="btn-outline-pill text-xs py-1.5 px-4"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
};
