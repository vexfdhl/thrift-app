import React from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  X,
  Scale,
  DoorOpen,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Trash2,
  Check
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareStoreIds: string[];
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onRemoveFromCompare: (storeId: string) => void;
  onClearCompare: () => void;
  onSelectStore: (store: ThriftStoreItem) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareStoreIds,
  stores,
  selectedSchool,
  onRemoveFromCompare,
  onClearCompare,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  const compareStores = stores.filter(s => compareStoreIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-5xl rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#2E1F16]/10 flex items-center justify-between bg-[#F7E09A]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl text-[#2E1F16] font-normal leading-tight">
                Compare <span className="font-editorial-italic text-[#EFAE6E]">Thrift Stores</span>
              </h2>
              <p className="text-xs text-[#2E1F16]/75">
                Side-by-side comparison for prices, dressing rooms, distance, and garment selection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareStores.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs font-bold text-[#2E1F16]/70 hover:text-[#2E1F16] flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#FBEFD9] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close compare modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {compareStores.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#F7E09A]/40 border border-[#2E1F16]/20 flex items-center justify-center mx-auto text-[#2E1F16]">
                <Scale className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-editorial text-2xl text-[#2E1F16]">No stores selected</h3>
              <p className="text-xs sm:text-sm text-[#2E1F16]/75">
                Click <strong>"Compare"</strong> on any store card in the directory or homepage to inspect them side-by-side.
              </p>
              <button
                onClick={onClose}
                className="btn-clevr-brown text-xs px-6 py-2.5 mx-auto"
              >
                Explore Stores
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b-2 border-[#2E1F16]/20">
                    <th className="p-3 text-xs font-black uppercase tracking-wider text-[#2E1F16]/60 w-44">
                      Feature
                    </th>
                    {compareStores.map(store => (
                      <th key={store.id} className="p-3 align-top min-w-[200px]">
                        <div className="bg-[#F7E09A]/30 p-4 rounded-2xl border border-[#2E1F16]/15 relative space-y-2">
                          <button
                            onClick={() => onRemoveFromCompare(store.id)}
                            className="absolute top-2 right-2 text-[#2E1F16]/40 hover:text-[#2E1F16] p-1 rounded-full hover:bg-white transition-colors"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFAE6E] text-[#2E1F16] inline-block">
                            {store.priceTier} · {store.city}
                          </span>
                          <h4 className="font-editorial text-base font-bold text-[#2E1F16] leading-tight">
                            {store.name}
                          </h4>
                          <button
                            onClick={() => {
                              onSelectStore(store);
                              onClose();
                            }}
                            className="w-full btn-clevr-brown text-xs py-1.5 justify-center gap-1"
                          >
                            <span>Open Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E1F16]/10 text-xs">
                  {/* Proximity */}
                  <tr>
                    <td className="p-3 font-bold text-[#2E1F16]/70">Campus Distance</td>
                    {compareStores.map(store => {
                      const dist = selectedSchool
                        ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
                        : null;
                      return (
                        <td key={store.id} className="p-3">
                          {dist !== null ? (
                            <span className="font-bold text-[#2E1F16] bg-[#C1D7C2] px-2 py-0.5 rounded text-[11px]">
                              {formatDistance(dist)} away
                            </span>
                          ) : (
                            <span className="text-[#2E1F16]/50">Select high school</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Pricing Overview */}
                  <tr>
                    <td className="p-3 font-bold text-[#2E1F16]/70">Price Range</td>
                    {compareStores.map(store => (
                      <td key={store.id} className="p-3 font-medium">
                        <div className="font-bold text-[#2E1F16]">{store.priceRangeFormatted}</div>
                        <div className="text-[11px] text-[#2E1F16]/70 mt-0.5">{store.priceNotes}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Dressing Rooms */}
                  <tr>
                    <td className="p-3 font-bold text-[#2E1F16]/70">Fitting Rooms</td>
                    {compareStores.map(store => (
                      <td key={store.id} className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                            store.fittingRoomsCount > 0
                              ? 'bg-[#C1D7C2] text-[#2E1F16]'
                              : 'bg-[#2E1F16]/10 text-[#2E1F16]/60'
                          }`}
                        >
                          <DoorOpen className="w-3.5 h-3.5" />
                          <span>
                            {store.fittingRoomsCount > 0
                              ? `${store.fittingRoomsCount} Rooms Open`
                              : 'Closed / None'}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Formalwear / Prom */}
                  <tr>
                    <td className="p-3 font-bold text-[#2E1F16]/70">Formalwear Racks</td>
                    {compareStores.map(store => (
                      <td key={store.id} className="p-3">
                        <div className="flex items-center gap-1 font-medium">
                          {store.hasFormalwear ? (
                            <span className="bg-[#EFAE6E] text-[#2E1F16] font-bold px-2 py-0.5 rounded text-[11px]">
                              Available
                            </span>
                          ) : (
                            <span className="text-[#2E1F16]/50">Casual Only</span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#2E1F16]/70 mt-1">{store.formalwearNotes}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Top Garment Categories */}
                  <tr>
                    <td className="p-3 font-bold text-[#2E1F16]/70">Categories</td>
                    {compareStores.map(store => (
                      <td key={store.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {store.categories.map(c => (
                            <span key={c} className="bg-white border border-[#2E1F16]/10 px-2 py-0.5 rounded text-[10px]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
