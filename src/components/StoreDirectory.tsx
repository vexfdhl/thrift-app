import React, { useState, useMemo } from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  Search,
  ArrowRight,
  MapPin,
  Clock,
  Tag,
  Check,
  X,
  Star,
  Leaf,
  DoorOpen,
  School,
  RotateCcw,
  Heart,
  Scale,
  Navigation,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface StoreDirectoryProps {
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onSelectStore: (store: ThriftStoreItem) => void;
  onQuickPeek?: (store: ThriftStoreItem) => void;
  onOpenNavigate?: (store: ThriftStoreItem) => void;
  onSelectSchool: (school: SchoolItem) => void;
  allSchools: SchoolItem[];
  initialFittingRoomsOnly?: boolean;
  savedStores?: string[];
  onToggleSave?: (storeId: string, e?: React.MouseEvent) => void;
  compareStoreIds?: string[];
  onToggleCompare?: (storeId: string, e?: React.MouseEvent) => void;
  onOpenCompare?: () => void;
}

export const StoreDirectory: React.FC<StoreDirectoryProps> = ({
  stores,
  selectedSchool,
  onSelectStore,
  onQuickPeek,
  onOpenNavigate,
  onSelectSchool,
  allSchools,
  initialFittingRoomsOnly = false,
  savedStores = [],
  onToggleSave,
  compareStoreIds = [],
  onToggleCompare,
  onOpenCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [fittingRoomsOnly, setFittingRoomsOnly] = useState<boolean>(initialFittingRoomsOnly);
  const [formalwearOnly, setFormalwearOnly] = useState<boolean>(false);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'priceAsc' | 'priceDesc' | 'rating' | 'name'>('distance');

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    stores.forEach(s => s.categories?.forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [stores]);

  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    stores.forEach(s => s.sustainableMaterials?.forEach(m => set.add(m)));
    return Array.from(set).sort();
  }, [stores]);

  const storesWithDistance = useMemo(() => {
    return stores.map(store => {
      const dist = selectedSchool
        ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
        : null;
      const avgRating = store.reviews?.length > 0
        ? store.reviews.reduce((acc, r) => acc + r.rating, 0) / store.reviews.length
        : 5;
      return { store, dist, avgRating };
    });
  }, [stores, selectedSchool]);

  const filteredStores = useMemo(() => {
    return storesWithDistance
      .filter(({ store, dist }) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = store.name.toLowerCase().includes(q);
          const matchAddress = store.address.toLowerCase().includes(q);
          const matchNotes = store.priceNotes?.toLowerCase().includes(q) ?? false;
          const matchFormal = store.formalwearNotes?.toLowerCase().includes(q) ?? false;
          const matchCat = store.categories?.some(c => c.toLowerCase().includes(q)) ?? false;
          const matchMat = store.sustainableMaterials?.some(m => m.toLowerCase().includes(q)) ?? false;
          if (!matchName && !matchAddress && !matchNotes && !matchCat && !matchMat && !matchFormal) {
            return false;
          }
        }

        if (selectedPriceTier !== 'all' && store.priceTier !== selectedPriceTier) {
          return false;
        }

        if (fittingRoomsOnly && store.fittingRoomsCount <= 0) {
          return false;
        }

        if (formalwearOnly && !store.hasFormalwear) {
          return false;
        }

        if (savedOnly && !savedStores.includes(store.id)) {
          return false;
        }

        if (selectedCategory !== 'all' && (!store.categories || !store.categories.includes(selectedCategory))) {
          return false;
        }

        if (selectedMaterial !== 'all' && (!store.sustainableMaterials || !store.sustainableMaterials.includes(selectedMaterial))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          if (a.dist === null && b.dist === null) return 0;
          if (a.dist === null) return 1;
          if (b.dist === null) return -1;
          return a.dist - b.dist;
        }
        if (sortBy === 'priceAsc') {
          return a.store.priceTier.length - b.store.priceTier.length;
        }
        if (sortBy === 'priceDesc') {
          return b.store.priceTier.length - a.store.priceTier.length;
        }
        if (sortBy === 'rating') {
          return b.avgRating - a.avgRating;
        }
        return a.store.name.localeCompare(b.store.name);
      });
  }, [
    storesWithDistance,
    searchQuery,
    selectedPriceTier,
    fittingRoomsOnly,
    formalwearOnly,
    savedOnly,
    selectedCategory,
    selectedMaterial,
    sortBy,
    savedStores,
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPriceTier('all');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setFittingRoomsOnly(false);
    setFormalwearOnly(false);
    setSavedOnly(false);
  };

  const storesWithFittingRoomsCount = stores.filter(s => s.fittingRoomsCount > 0).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Directory Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block mb-1">
            DUVAL COUNTY SECONDHAND DIRECTORY
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
            Verified Thrift Stores in <span className="font-editorial-italic text-[#EFAE6E]">Jacksonville</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2E1F16]/75 mt-1 max-w-xl">
            Compare verified open dressing stalls, color tag discount calendars, and distance calculated directly from your high school.
          </p>
        </div>

        {compareStoreIds.length > 0 && onOpenCompare && (
          <button
            onClick={onOpenCompare}
            className="btn-clevr-brown text-xs py-2 px-4 shadow-sm"
          >
            <Scale className="w-4 h-4" />
            <span>Compare ({compareStoreIds.length})</span>
          </button>
        )}
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="clevr-card p-4 sm:p-6 space-y-4 bg-[#F7E09A]/20 border border-[#2E1F16]/10 font-['Nunito',sans-serif]">
        {/* Row 1: Search + Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#2E1F16]/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stores by name, street, vintage, prom, denim, wool..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl text-xs sm:text-sm font-medium text-[#2E1F16] placeholder-[#2E1F16]/40 focus:outline-none focus:border-[#EFAE6E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2E1F16]/40 hover:text-[#2E1F16]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <span className="text-xs font-bold text-[#2E1F16]/70">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none cursor-pointer"
            >
              <option value="distance">Proximity (Closest First)</option>
              <option value="priceAsc">Price: Low to High ($ to $$$)</option>
              <option value="priceDesc">Price: High to Low ($$$ to $)</option>
              <option value="rating">Rating</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2E1F16]/10 text-xs">
          {/* Fitting Room Toggle */}
          <button
            onClick={() => setFittingRoomsOnly(!fittingRoomsOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              fittingRoomsOnly
                ? 'bg-[#C1D7C2] text-[#2E1F16] shadow-xs'
                : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Fitting Rooms Only ({storesWithFittingRoomsCount})</span>
          </button>

          {/* Formalwear Toggle */}
          <button
            onClick={() => setFormalwearOnly(!formalwearOnly)}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              formalwearOnly
                ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20'
            }`}
          >
            {formalwearOnly && <Check className="w-3.5 h-3.5" />}
            <span>Formalwear Racks</span>
          </button>

          {/* Saved Only */}
          <button
            onClick={() => setSavedOnly(!savedOnly)}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              savedOnly
                ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${savedOnly ? 'fill-[#2E1F16]' : ''}`} />
            <span>Saved Racks ({savedStores.length})</span>
          </button>

          {/* Price Selector */}
          <div className="flex items-center gap-1 bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-full p-0.5">
            <span className="pl-2.5 pr-1 text-[11px] text-[#2E1F16]/60 font-bold uppercase">Price:</span>
            {['all', '$', '$$', '$$$'].map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedPriceTier(tier)}
                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer uppercase ${
                  selectedPriceTier === tier
                    ? 'bg-[#EFAE6E] text-[#2E1F16]'
                    : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
                }`}
              >
                {tier === 'all' ? 'All' : tier}
              </button>
            ))}
          </div>

          {(searchQuery || selectedPriceTier !== 'all' || fittingRoomsOnly || formalwearOnly || savedOnly) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#2E1F16]/60 hover:text-[#2E1F16] font-bold underline cursor-pointer ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Count Bar */}
      <div className="flex items-center justify-between text-xs text-[#2E1F16]/70 font-semibold px-1">
        <span>
          Showing <strong>{filteredStores.length}</strong> of <strong>{stores.length}</strong> verified Duval locations
        </span>
        {selectedSchool && (
          <span className="hidden sm:inline">
            Road distances calculated from <strong>{selectedSchool.name}</strong>
          </span>
        )}
      </div>

      {/* STORE LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.length === 0 ? (
          <div className="col-span-full clevr-card p-12 text-center bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-3">
            <h3 className="font-editorial text-2xl text-[#2E1F16]">
              {savedOnly && savedStores.length === 0 ? 'No Saved Racks Yet' : 'No Stores Match Filter'}
            </h3>
            <p className="text-xs sm:text-sm text-[#2E1F16]/70 max-w-sm mx-auto">
              Try adjusting your price filter or toggling off fitting rooms to view all {stores.length} stores.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-clevr-brown text-xs px-5 py-2 mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredStores.map(({ store, dist }) => {
            const isSaved = savedStores.includes(store.id);
            const isCompared = compareStoreIds.includes(store.id);

            return (
              <div
                key={store.id}
                onClick={() => onSelectStore(store)}
                className="bg-white p-6 rounded-3xl border border-[#2E1F16]/12 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top unboxed badges */}
                  <div className="flex items-center justify-between text-xs text-[#2E1F16]/75 font-medium">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#2E1F16] bg-[#F7E09A]/50 px-2 py-0.5 rounded text-[11px] font-black">
                        {store.priceTier}
                      </span>
                      <span>·</span>
                      <span className="text-[11px] text-[#2E1F16]/80">{store.priceRangeFormatted}</span>
                      {dist !== null && (
                        <>
                          <span>·</span>
                          <span className="text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded text-[11px]">
                            {formatDistance(dist)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {onToggleCompare && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onToggleCompare(store.id, e);
                          }}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            isCompared
                              ? 'bg-[#EFAE6E] text-[#2E1F16]'
                              : 'text-[#2E1F16]/50 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40'
                          }`}
                          title="Compare store"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onToggleSave && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onToggleSave(store.id, e);
                          }}
                          className="p-1.5 rounded-full text-[#2E1F16]/50 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40 transition-colors cursor-pointer"
                          title="Save store"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-cloud text-xl text-[#2E1F16] font-bold group-hover:text-[#EFAE6E] transition-colors leading-tight">
                      {store.name}
                    </h3>
                    <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#EFAE6E] shrink-0" />
                      <span>{store.address} · {store.city}</span>
                    </p>
                  </div>

                  <p className="text-xs text-[#2E1F16]/80 line-clamp-2 leading-relaxed bg-[#FBEFD9]/50 p-2.5 rounded-xl border border-[#2E1F16]/10">
                    {store.priceNotes}
                  </p>

                  {/* Clothing breakdown preview */}
                  <div className="text-[11px] text-[#2E1F16]/75 bg-white p-2 rounded-xl border border-[#2E1F16]/10 space-y-0.5">
                    <p className="truncate"><strong>👗 Women:</strong> {store.womensClothingAmount}</p>
                    <p className="truncate"><strong>👔 Men:</strong> {store.mensClothingAmount}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2E1F16]/80 pt-1">
                    <span className="flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-[#2E1F16]/60" />
                      <span>{store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms Open` : 'No Dressing Rooms'}</span>
                    </span>
                    {store.hasFormalwear && (
                      <>
                        <span>·</span>
                        <span className="text-[#2E1F16] font-bold bg-[#F7E09A] px-2 py-0.5 rounded text-[10px]">
                          Formal Racks
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-[#2E1F16]/10 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    {onQuickPeek && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onQuickPeek(store);
                        }}
                        className="text-xs font-bold text-[#2E1F16]/70 hover:text-[#2E1F16] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Peek</span>
                      </button>
                    )}

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (onOpenNavigate) {
                          onOpenNavigate(store);
                        } else {
                          window.open(
                            `https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`,
                            '_blank'
                          );
                        }
                      }}
                      className="text-xs font-bold text-[#2E1F16] hover:text-[#EFAE6E] flex items-center gap-1 cursor-pointer"
                      title="Open navigation directions"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#EFAE6E]" />
                      <span>Navigate</span>
                    </button>
                  </div>

                  <span className="text-xs font-bold text-[#2E1F16] group-hover:text-[#EFAE6E] flex items-center gap-1 ml-auto">
                    <span>View Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
