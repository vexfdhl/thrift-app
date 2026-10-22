import React, { useState } from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  Sparkles,
  Sparkle,
  Compass,
  ArrowRight,
  Heart,
  DoorOpen,
  DollarSign,
  Tag,
  Check,
  Scale
} from 'lucide-react';

interface RecommendationsSectionProps {
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onSelectStore: (store: ThriftStoreItem) => void;
  onToggleSave: (storeId: string) => void;
  savedStores: string[];
  onToggleCompare: (storeId: string) => void;
  compareStoreIds: string[];
}

type PreferenceType = 'formal' | 'budget' | 'fitting' | 'vintage' | 'closest';

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  stores,
  selectedSchool,
  onSelectStore,
  onToggleSave,
  savedStores,
  onToggleCompare,
  compareStoreIds,
}) => {
  const [selectedPreference, setSelectedPreference] = useState<PreferenceType>('formal');

  const preferences = [
    {
      id: 'formal' as PreferenceType,
      title: 'Prom & Homecoming',
      subtitle: 'Formal suits, dresses & event racks under $30',
      badge: 'Event Ready',
      icon: '👗',
    },
    {
      id: 'budget' as PreferenceType,
      title: 'Super Budget ($)',
      subtitle: '$1–$10 items, community charity thrift',
      badge: 'Max Savings',
      icon: '🏷️',
    },
    {
      id: 'fitting' as PreferenceType,
      title: 'Open Fitting Rooms',
      subtitle: 'Guaranteed dressing rooms to try on before buying',
      badge: 'Try-On Verified',
      icon: '🚪',
    },
    {
      id: 'vintage' as PreferenceType,
      title: 'Vintage & Natural Fibers',
      subtitle: 'Heavy denim, 100% cotton, wool & retro street style',
      badge: 'Eco Fabrics',
      icon: '🌿',
    },
    {
      id: 'closest' as PreferenceType,
      title: 'Closest to My School',
      subtitle: 'Shortest driving distance from your campus',
      badge: 'Campus Radius',
      icon: '📍',
    },
  ];

  // Compute matched recommendations based on selected preference
  const recommendedStores = React.useMemo(() => {
    let pool = [...stores];

    if (selectedPreference === 'formal') {
      pool = pool.filter(s => s.hasFormalwear);
      // Sort by price tier or suitability
      pool.sort((a, b) => (a.priceTier === '$' ? -1 : 1));
    } else if (selectedPreference === 'budget') {
      pool = pool.filter(s => s.priceTier === '$');
    } else if (selectedPreference === 'fitting') {
      pool = pool.filter(s => s.fittingRoomsCount > 0);
      pool.sort((a, b) => b.fittingRoomsCount - a.fittingRoomsCount);
    } else if (selectedPreference === 'vintage') {
      pool = pool.filter(
        s =>
          s.categories.some(c => c.toLowerCase().includes('vintage') || c.toLowerCase().includes('denim')) ||
          s.sustainableMaterials.includes('Heavy Denim') ||
          s.sustainableMaterials.includes('100% Cotton')
      );
    } else if (selectedPreference === 'closest') {
      if (selectedSchool) {
        pool.sort((a, b) => {
          const distA = calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, a.lat, a.lng);
          const distB = calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, b.lat, b.lng);
          return distA - distB;
        });
      }
    }

    return pool.slice(0, 3);
  }, [stores, selectedPreference, selectedSchool]);

  const activePref = preferences.find(p => p.id === selectedPreference);

  return (
    <section className="w-full bg-[#FBEFD9] py-14 sm:py-20 px-4 sm:px-8 border-b border-[#2E1F16]/10 font-['Nunito',sans-serif]">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C1D7C2]/60 text-[#2E1F16] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2E1F16]" />
            <span>Personalized Match Engine</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#2E1F16] font-normal leading-tight">
            Find Your <span className="font-editorial-italic font-normal text-[#EFAE6E]">Ideal Rack</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2E1F16]/75">
            What are you shopping for today? Select your priority below to get matched Duval County recommendations with instant details.
          </p>
        </div>

        {/* Preference Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {preferences.map(pref => {
            const isSelected = selectedPreference === pref.id;
            return (
              <button
                key={pref.id}
                onClick={() => setSelectedPreference(pref.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                    : 'bg-[#F7E09A]/30 text-[#2E1F16] hover:bg-[#F7E09A]/60 border border-[#2E1F16]/12'
                }`}
              >
                <span>{pref.icon}</span>
                <span>{pref.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Preference Subtitle Box */}
        <div className="bg-[#F7E09A]/20 border border-[#2E1F16]/10 rounded-2xl p-3.5 text-center max-w-xl mx-auto flex items-center justify-center gap-2">
          <span className="text-sm">{activePref?.icon}</span>
          <span className="text-xs text-[#2E1F16]">
            Showing stores matched for <strong>{activePref?.title}</strong>: {activePref?.subtitle}
          </span>
        </div>

        {/* Recommended Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedStores.map((store, idx) => {
            const dist = selectedSchool
              ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
              : null;
            const isSaved = savedStores.includes(store.id);
            const isCompared = compareStoreIds.includes(store.id);

            return (
              <div
                key={store.id}
                className="bg-white p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all border border-[#2E1F16]/12 group"
              >
                <div className="space-y-3">
                  {/* Top unboxed tag & actions */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#2E1F16]/75 font-semibold">
                    <span className="text-[#2E1F16] font-bold bg-[#C1D7C2]/60 px-2 py-0.5 rounded-full">
                      Match #{idx + 1} · {activePref?.badge}
                    </span>
                    <button
                      onClick={() => onToggleSave(store.id)}
                      className="text-[#2E1F16]/60 hover:text-[#2E1F16] hover:scale-110 transition-transform p-1 cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save store'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : ''}`}
                      />
                    </button>
                  </div>

                  {/* Store Name & City */}
                  <div>
                    <h3 className="font-editorial text-2xl font-normal text-[#2E1F16] leading-snug">
                      {store.name}
                    </h3>
                    <p className="text-xs text-[#2E1F16]/65 mt-1 line-clamp-1">
                      {store.address}
                    </p>
                  </div>

                  {/* Why it matches */}
                  <div className="bg-[#FBEFD9] p-3 rounded-2xl border border-[#2E1F16]/8 text-xs space-y-1">
                    <span className="font-bold text-[#2E1F16] block text-[10px] uppercase tracking-wide">
                      Why this matches:
                    </span>
                    <p className="text-[#2E1F16]/85 text-[11px] leading-relaxed">
                      {selectedPreference === 'formal' && store.formalwearNotes}
                      {selectedPreference === 'budget' && store.priceNotes}
                      {selectedPreference === 'fitting' && store.fittingRoomsNote}
                      {selectedPreference === 'vintage' &&
                        `Natural fibers: ${store.sustainableMaterials.slice(0, 3).join(', ')}`}
                      {selectedPreference === 'closest' &&
                        `${formatDistance(dist || 0)} from ${selectedSchool?.name || 'campus'}`}
                    </p>
                  </div>

                  {/* Quiet Unboxed Stats Strip */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#2E1F16]/80 font-medium pt-1 border-t border-[#2E1F16]/8">
                    <span className="font-bold text-[#2E1F16] bg-[#F7E09A]/40 px-1.5 py-0.5 rounded text-[10px]">{store.priceTier}</span>
                    <span>·</span>
                    <span>{store.priceRangeFormatted}</span>
                    <span>·</span>
                    <span>{store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms` : 'No Rooms'}</span>
                    {dist !== null && (
                      <>
                        <span>·</span>
                        <span className="text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded text-[10px]">{formatDistance(dist)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#2E1F16]/8 flex items-center gap-2">
                  <button
                    onClick={() => onSelectStore(store)}
                    className="flex-1 btn-clevr-brown text-xs py-2 justify-center gap-1 font-bold"
                  >
                    <span>View Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleCompare(store.id)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
                      isCompared
                        ? 'bg-[#EFAE6E] text-[#2E1F16] border-[#EFAE6E]'
                        : 'bg-[#FBEFD9] text-[#2E1F16] border-[#2E1F16]/15 hover:bg-white'
                    }`}
                    title={isCompared ? 'In Compare List' : 'Add to Compare'}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isCompared ? 'Added' : 'Compare'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
