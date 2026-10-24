import React, { useState, useMemo } from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Scale,
  DoorOpen,
  DollarSign,
  Droplets,
  Leaf,
  Check,
  Eye,
  Shirt,
  Scissors
} from 'lucide-react';

interface InteractiveFitFinderProps {
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onSelectStore: (store: ThriftStoreItem) => void;
  onQuickPeek: (store: ThriftStoreItem) => void;
  onToggleSave: (storeId: string) => void;
  savedStores: string[];
  onToggleCompare: (storeId: string) => void;
  compareStoreIds: string[];
}

type VibeId = 'y2k' | 'denim' | 'formal' | 'budget' | 'fitting' | 'charity';

interface VibeOption {
  id: VibeId;
  label: string;
  tagline: string;
  icon: string;
  badge: string;
}

const VIBES: VibeOption[] = [
  {
    id: 'y2k',
    label: '90s & Y2K Streetwear',
    tagline: 'Oversized graphic tees, retro windbreakers & athletic fleece',
    icon: '🎧',
    badge: 'Streetwear Racks',
  },
  {
    id: 'denim',
    label: 'Vintage Denim & Workwear',
    tagline: 'Heavy cotton jeans, chore jackets & durable natural fibers',
    icon: '👖',
    badge: 'Heavy Denim',
  },
  {
    id: 'formal',
    label: 'Homecoming & Prom Suits',
    tagline: 'Evening gowns, tailored blazers & party attire under $30',
    icon: '👗',
    badge: 'Event Ready',
  },
  {
    id: 'budget',
    label: '$1–$5 Bargain Steals',
    tagline: 'Color tag sale days & student-budget clearance racks',
    icon: '🏷️',
    badge: 'Max Savings',
  },
  {
    id: 'fitting',
    label: 'Open Dressing Rooms Only',
    tagline: 'Try everything on in verified, working dressing stalls',
    icon: '🪞',
    badge: 'Try-On Guaranteed',
  },
  {
    id: 'charity',
    label: 'Community Charities',
    tagline: '100% of proceeds fund local Duval families & homeless aid',
    icon: '🌿',
    badge: 'Direct Impact',
  },
];

interface OutfitPiece {
  id: string;
  name: string;
  retailMin: number;
  retailMax: number;
  thriftMin: number;
  thriftMax: number;
  waterGallons: number;
  selected: boolean;
}

export const InteractiveFitFinder: React.FC<InteractiveFitFinderProps> = ({
  stores,
  selectedSchool,
  onSelectStore,
  onQuickPeek,
  onToggleSave,
  savedStores,
  onToggleCompare,
  compareStoreIds,
}) => {
  const [activeVibe, setActiveVibe] = useState<VibeId>('y2k');

  const [outfitPieces, setOutfitPieces] = useState<OutfitPiece[]>([
    { id: 'jacket', name: 'Vintage Outerwear / Denim Jacket', retailMin: 85, retailMax: 160, thriftMin: 8, thriftMax: 18, waterGallons: 1800, selected: true },
    { id: 'tee', name: 'Heavyweight Graphic Tee', retailMin: 32, retailMax: 55, thriftMin: 3, thriftMax: 8, waterGallons: 700, selected: true },
    { id: 'pants', name: 'Wide-Leg Skate Jeans / Cargos', retailMin: 68, retailMax: 110, thriftMin: 6, thriftMax: 14, waterGallons: 2000, selected: true },
    { id: 'formal', name: 'Homecoming Blazer / Party Dress', retailMin: 120, retailMax: 220, thriftMin: 15, thriftMax: 30, waterGallons: 2600, selected: false },
    { id: 'hoodie', name: 'Oversized Athletic Hoodie', retailMin: 65, retailMax: 95, thriftMin: 6, thriftMax: 12, waterGallons: 1500, selected: false },
    { id: 'shoes', name: 'Retro Sneakers / Work Boots', retailMin: 90, retailMax: 140, thriftMin: 12, thriftMax: 28, waterGallons: 1200, selected: false },
  ]);

  const togglePiece = (id: string) => {
    setOutfitPieces(prev =>
      prev.map(p => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectedPieces = outfitPieces.filter(p => p.selected);
  const totalRetailMin = selectedPieces.reduce((acc, p) => acc + p.retailMin, 0);
  const totalRetailMax = selectedPieces.reduce((acc, p) => acc + p.retailMax, 0);
  const totalThriftMin = selectedPieces.reduce((acc, p) => acc + p.thriftMin, 0);
  const totalThriftMax = selectedPieces.reduce((acc, p) => acc + p.thriftMax, 0);
  const totalWaterSaved = selectedPieces.reduce((acc, p) => acc + p.waterGallons, 0);

  const totalSavedMin = totalRetailMin - totalThriftMax;
  const totalSavedMax = totalRetailMax - totalThriftMin;
  const avgSaved = Math.round((totalSavedMin + totalSavedMax) / 2);

  const matchedStores = useMemo(() => {
    let list = [...stores];

    switch (activeVibe) {
      case 'y2k':
        list = list.filter(s =>
          s.categories?.some(c => c.toLowerCase().includes('y2k') || c.toLowerCase().includes('streetwear') || c.toLowerCase().includes('graphic'))
        );
        break;
      case 'denim':
        list = list.filter(s =>
          s.categories?.some(c => c.toLowerCase().includes('denim')) ||
          s.sustainableMaterials?.some(m => m.toLowerCase().includes('denim') || m.toLowerCase().includes('cotton'))
        );
        break;
      case 'formal':
        list = list.filter(s => s.hasFormalwear);
        break;
      case 'budget':
        list = list.filter(s => s.priceTier === '$');
        break;
      case 'fitting':
        list = list.filter(s => s.fittingRoomsCount > 0);
        break;
      case 'charity':
        list = list.filter(s =>
          s.overallSummary?.toLowerCase().includes('charity') ||
          s.overallSummary?.toLowerCase().includes('ministry') ||
          s.overallSummary?.toLowerCase().includes('rescue') ||
          s.overallSummary?.toLowerCase().includes('shelter') ||
          s.overallSummary?.toLowerCase().includes('non-profit') ||
          s.overallSummary?.toLowerCase().includes('hospice')
        );
        break;
    }

    if (list.length === 0) list = stores;

    if (selectedSchool) {
      list.sort((a, b) => {
        const distA = calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, a.lat, a.lng);
        const distB = calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return list.slice(0, 3);
  }, [stores, activeVibe, selectedSchool]);

  const currentVibeObj = VIBES.find(v => v.id === activeVibe) || VIBES[0];

  return (
    <section className="w-full bg-[#FBEFD9] py-10 sm:py-16 px-4 sm:px-8 border-b border-[#2E1F16]/10 font-['Nunito',sans-serif]">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#2E1F16]/70 block">
            AESTHETIC &amp; BUDGET VIBE FINDER
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#2E1F16] font-normal">
            Match Your Style to <span className="font-editorial-italic text-[#EFAE6E]">Jacksonville Racks</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2E1F16]/75">
            Select what you are shopping for today to instantly highlight the best 3 Duval thrift stores matching your campus.
          </p>
        </div>

        {/* Interactive Vibe Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {VIBES.map(vibe => {
            const isActive = activeVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setActiveVibe(vibe.id)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                    : 'bg-[#F7E09A]/30 text-[#2E1F16] hover:bg-[#F7E09A]/60 border border-[#2E1F16]/12'
                }`}
              >
                <span>{vibe.icon}</span>
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Matched Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchedStores.map((store, idx) => {
            const distance = selectedSchool
              ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
              : null;
            const isSaved = savedStores.includes(store.id);
            const isCompared = compareStoreIds.includes(store.id);

            return (
              <div
                key={store.id}
                className="bg-white rounded-3xl p-6 border border-[#2E1F16]/12 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#2E1F16]/75 font-semibold">
                    <span className="text-[#2E1F16] font-bold bg-[#C1D7C2]/60 px-2 py-0.5 rounded-full">
                      {currentVibeObj.badge} · #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleCompare(store.id)}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          isCompared
                            ? 'bg-[#EFAE6E] text-[#2E1F16]'
                            : 'text-[#2E1F16]/60 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40'
                        }`}
                        title={isCompared ? 'Remove compare' : 'Compare'}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleSave(store.id)}
                        className="p-1.5 rounded-full text-[#2E1F16]/60 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40 transition-colors cursor-pointer"
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-editorial text-2xl text-[#2E1F16] font-normal leading-snug">
                      {store.name}
                    </h3>
                    <p className="text-xs text-[#2E1F16]/65 mt-1 truncate">
                      {store.address}
                    </p>
                  </div>

                  <div className="text-xs text-[#2E1F16]/85 font-medium flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 border-t border-[#2E1F16]/10">
                    <span>{store.priceTier} · {store.priceRangeFormatted}</span>
                    <span>·</span>
                    <span>{store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms Open` : 'No Rooms'}</span>
                    {distance !== null && (
                      <>
                        <span>·</span>
                        <span className="text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded-full text-[11px]">{formatDistance(distance)}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-[#2E1F16]/75 leading-relaxed line-clamp-2">
                    {activeVibe === 'formal' && store.formalwearNotes}
                    {activeVibe === 'budget' && store.priceNotes}
                    {activeVibe === 'fitting' && store.fittingRoomsNote}
                    {activeVibe !== 'formal' && activeVibe !== 'budget' && activeVibe !== 'fitting' && store.priceNotes}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onQuickPeek(store)}
                    className="flex-1 py-2 px-3 rounded-full text-xs font-semibold bg-[#F7E09A]/40 hover:bg-[#F7E09A]/80 text-[#2E1F16] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#2E1F16]" />
                    <span>Quick Peek</span>
                  </button>

                  <button
                    onClick={() => onSelectStore(store)}
                    className="py-2 px-4 rounded-full text-xs font-semibold bg-[#EFAE6E] hover:bg-[#e5a05b] text-[#2E1F16] transition-colors flex items-center justify-center gap-1 cursor-pointer font-bold shadow-xs"
                  >
                    <span>Full Store</span>
                    <ArrowRight className="w-3 h-3 text-[#2E1F16]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Outfit Cost Simulator Card */}
        <div className="bg-[#F7E09A]/20 rounded-3xl p-6 sm:p-10 border border-[#2E1F16]/10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2E1F16] bg-[#C1D7C2]/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                LIVE OUTFIT COST SIMULATOR
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16] font-normal">
                Mall Fast Fashion <span className="font-editorial-italic font-normal text-[#EFAE6E]">vs.</span> Secondhand DuvALL
              </h3>
              <p className="text-xs text-[#2E1F16]/70 mt-0.5">
                Toggle garments in your basket below to simulate your savings and freshwater impact.
              </p>
            </div>

            <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#2E1F16]/15 text-right shrink-0 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#2E1F16]/60 block">
                Estimated Savings:
              </span>
              <span className="font-editorial text-2xl font-bold text-[#2E1F16]">
                ${totalSavedMin} – ${totalSavedMax} Saved
              </span>
              <span className="text-[11px] font-semibold text-[#2E1F16]/70 block">
                (Avg ~${avgSaved} kept in pocket)
              </span>
            </div>
          </div>

          {/* Interactive Garment Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outfitPieces.map(piece => (
              <button
                key={piece.id}
                onClick={() => togglePiece(piece.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                  piece.selected
                    ? 'bg-white border-[#EFAE6E] shadow-xs'
                    : 'bg-white/50 border-[#2E1F16]/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#2E1F16]">{piece.name}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      piece.selected ? 'bg-[#EFAE6E] text-[#2E1F16]' : 'border border-[#2E1F16]/30'
                    }`}
                  >
                    {piece.selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs gap-1">
                  <span className="text-[#2E1F16]/60 line-through text-[11px]">
                    Mall: ${piece.retailMin}–${piece.retailMax}
                  </span>
                  <span className="font-bold text-[#2E1F16] bg-[#C1D7C2]/70 px-2 py-0.5 rounded text-[11px]">
                    Thrift: ${piece.thriftMin}–${piece.thriftMax}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Live Outcome Comparison Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#2E1F16]/10 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#EFAE6E]/20 text-[#2E1F16] flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-[#2E1F16]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#2E1F16]/60">Your Haul Range</div>
                <div className="text-base sm:text-lg font-bold text-[#2E1F16]">
                  ${totalThriftMin} – ${totalThriftMax}{' '}
                  <span className="text-xs font-normal text-[#2E1F16]/60">
                    (vs ${totalRetailMin} – ${totalRetailMax} mall)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#2E1F16]/10 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#C1D7C2]/40 text-[#2E1F16] flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 text-[#2E1F16]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#2E1F16]/60">Clean Water Conserved</div>
                <div className="text-lg font-bold text-[#2E1F16]">
                  {totalWaterSaved.toLocaleString()} gal{' '}
                  <span className="text-xs font-normal text-[#2E1F16]/60">
                    (~{Math.round(totalWaterSaved / 40)} hot showers)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#2E1F16]/10 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#F7E09A]/40 text-[#2E1F16] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#2E1F16]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#2E1F16]/60">Landfill Impact</div>
                <div className="text-lg font-bold text-[#2E1F16]">
                  {(selectedPieces.length * 1.8).toFixed(1)} lbs diverted{' '}
                  <span className="text-xs font-normal text-[#2E1F16]/60">
                    from Duval disposal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
