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
  Eye
} from 'lucide-react';

interface StoreDirectoryProps {
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  onSelectStore: (store: ThriftStoreItem) => void;
  onQuickPeek?: (store: ThriftStoreItem) => void;
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
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number>(50);
  const [fittingRoomsOnly, setFittingRoomsOnly] = useState<boolean>(initialFittingRoomsOnly);
  const [formalwearOnly, setFormalwearOnly] = useState<boolean>(false);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'distance' | 'priceAsc' | 'priceDesc' | 'rating' | 'reviewsCount' | 'name'>('distance');

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    stores.forEach(s => s.categories.forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [stores]);

  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    stores.forEach(s => s.sustainableMaterials.forEach(m => set.add(m)));
    return Array.from(set).sort();
  }, [stores]);

  const storesWithDistance = useMemo(() => {
    return stores.map(store => {
      const dist = selectedSchool
        ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
        : null;
      const avgRating = store.reviews.length > 0
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
          const matchNotes = store.priceNotes.toLowerCase().includes(q);
          const matchFormal = store.formalwearNotes.toLowerCase().includes(q);
          const matchCat = store.categories.some(c => c.toLowerCase().includes(q));
          const matchMat = store.sustainableMaterials.some(m => m.toLowerCase().includes(q));
          if (!matchName && !matchAddress && !matchNotes && !matchCat && !matchMat && !matchFormal) {
            return false;
          }
        }

        if (selectedPriceTier !== 'all' && store.priceTier !== selectedPriceTier) {
          return false;
        }

        if (selectedCategory !== 'all' && !store.categories.includes(selectedCategory)) {
          return false;
        }

        if (selectedMaterial !== 'all' && !store.sustainableMaterials.includes(selectedMaterial)) {
          return false;
        }

        if (fittingRoomsOnly && store.fittingRoomsCount <= 0) {
          return false;
        }

        if (formalwearOnly && !store.hasFormalwear) {
          return false;
        }

        if (openNowOnly && !store.isOpenNow) {
          return false;
        }

        if (savedOnly && !savedStores.includes(store.id)) {
          return false;
        }

        if (selectedSchool && dist !== null && dist > maxDistanceMiles) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && selectedSchool) {
          return (a.dist ?? 999) - (b.dist ?? 999);
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
        if (sortBy === 'reviewsCount') {
          return b.store.reviews.length - a.store.reviews.length;
        }
        if (sortBy === 'name') {
          return a.store.name.localeCompare(b.store.name);
        }
        return (a.dist ?? 999) - (b.dist ?? 999);
      });
  }, [
    storesWithDistance,
    searchQuery,
    selectedPriceTier,
    selectedCategory,
    selectedMaterial,
    fittingRoomsOnly,
    formalwearOnly,
    openNowOnly,
    savedOnly,
    savedStores,
    maxDistanceMiles,
    sortBy,
    selectedSchool
  ]);

  const activeFiltersCount = [
    selectedPriceTier !== 'all',
    selectedCategory !== 'all',
    selectedMaterial !== 'all',
    fittingRoomsOnly,
    formalwearOnly,
    openNowOnly,
    savedOnly,
    selectedSchool && maxDistanceMiles < 50,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPriceTier('all');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setMaxDistanceMiles(50);
    setFittingRoomsOnly(false);
    setFormalwearOnly(false);
    setOpenNowOnly(false);
    setSavedOnly(false);
    setSortBy('distance');
  };

  const storesWithFittingRoomsCount = stores.filter(s => s.fittingRoomsCount > 0).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-[#844A26]">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#2E1F16]/10 font-['Nunito',sans-serif]">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16] bg-[#C1D7C2]/60 px-2.5 py-0.5 rounded-full inline-block mb-2">
            ALL VERIFIED LOCATIONS
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-[#2E1F16]">
            Duval Thrift <span className="font-editorial-italic text-[#EFAE6E]">Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#2E1F16]/70 mt-2 max-w-xl">
            Compare secondhand shops across Jacksonville by verified dressing rooms, pricing tiers, and driving proximity to your campus.
          </p>
        </div>

        {/* Reference High School Selector */}
        <div className="clevr-card p-4 self-start md:self-auto min-w-[280px] bg-[#F7E09A]/30 border border-[#2E1F16]/10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2E1F16]/60 block mb-1">
            Calculate Distances From:
          </span>
          <select
            value={selectedSchool ? selectedSchool.id : ''}
            onChange={e => {
              const found = allSchools.find(s => s.id === e.target.value);
              if (found) onSelectSchool(found);
            }}
            className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none cursor-pointer"
          >
            <option value="">Select high school for proximity...</option>
            {allSchools.map(sch => (
              <option key={sch.id} value={sch.id}>
                {sch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="clevr-card p-5 sm:p-6 space-y-4 bg-[#F7E09A]/20 border border-[#2E1F16]/10 font-['Nunito',sans-serif]">
        {/* Row 1: Search + Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#2E1F16]/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stores by name, address, or items (vintage, prom, denim, wool)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl text-xs sm:text-sm font-medium text-[#2E1F16] placeholder-[#2E1F16]/40 focus:outline-none focus:border-[#EFAE6E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2E1F16]/40 hover:text-[#2E1F16]"
                aria-label="Clear search query"
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
              <option value="priceAsc">Price: Low to High ($ to $$$$)</option>
              <option value="priceDesc">Price: High to Low ($$$$ to $)</option>
              <option value="rating">Customer Rating</option>
              <option value="reviewsCount">Most Reviews</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#2E1F16]/10 text-xs">
          {/* Fitting Room Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={fittingRoomsOnly}
            onClick={() => setFittingRoomsOnly(!fittingRoomsOnly)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
              fittingRoomsOnly
                ? 'bg-[#C1D7C2] text-[#2E1F16] shadow-xs'
                : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20 hover:border-[#EFAE6E]'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Fitting Rooms Only</span>
            <span className="text-[11px] opacity-75">({storesWithFittingRoomsCount})</span>
          </button>

          {/* Formalwear Toggle */}
          <button
            onClick={() => setFormalwearOnly(!formalwearOnly)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              formalwearOnly
                ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20 hover:border-[#EFAE6E]'
            }`}
          >
            {formalwearOnly && <Check className="w-3.5 h-3.5 text-[#2E1F16] stroke-[3]" />}
            <span>Formalwear Racks</span>
          </button>

          {/* Price Selector */}
          <div className="flex items-center gap-1 bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-full p-0.5">
            <span className="pl-2.5 pr-1 text-[11px] text-[#2E1F16]/60 font-bold uppercase">Price:</span>
            {['all', '$', '$$', '$$$', '$$$$'].map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedPriceTier(tier)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer uppercase ${
                  selectedPriceTier === tier
                    ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                    : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
                }`}
              >
                {tier === 'all' ? 'All' : tier}
              </button>
            ))}
          </div>

          {/* Fabric Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-full px-3 py-1">
            <Leaf className="w-3.5 h-3.5 text-[#2E1F16]" />
            <select
              value={selectedMaterial}
              onChange={e => setSelectedMaterial(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#2E1F16] focus:outline-none cursor-pointer"
            >
              <option value="all">All Fabrics</option>
              {allMaterials.map(mat => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-full px-3 py-1">
            <Tag className="w-3.5 h-3.5 text-[#2E1F16]/60" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#2E1F16] focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Open Now */}
          <button
            onClick={() => setOpenNowOnly(!openNowOnly)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              openNowOnly
                ? 'bg-[#C1D7C2] text-[#2E1F16]'
                : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20 hover:border-[#EFAE6E]'
            }`}
          >
            {openNowOnly && <Check className="w-3.5 h-3.5 text-[#2E1F16] stroke-[3]" />}
            <span>Open Now</span>
          </button>

          {/* Saved Only */}
          {savedStores.length > 0 && (
            <button
              onClick={() => setSavedOnly(!savedOnly)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                savedOnly
                  ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                  : 'bg-[#FBEFD9] text-[#2E1F16]/80 border border-[#2E1F16]/20 hover:border-[#EFAE6E]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${savedOnly ? 'fill-[#2E1F16]' : 'text-[#2E1F16]'}`} />
              <span>Saved Racks ({savedStores.length})</span>
            </button>
          )}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-[#2E1F16] hover:text-[#EFAE6E] ml-auto cursor-pointer flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Count Bar */}
      <div className="flex items-center justify-between text-xs text-[#2E1F16]/70 font-semibold px-1 font-['Nunito',sans-serif]">
        <span>
          Showing <strong>{filteredStores.length}</strong> of <strong>{stores.length}</strong> verified locations
          {fittingRoomsOnly && ` (fitting rooms guaranteed)`}
        </span>
        {selectedSchool && (
          <span className="hidden sm:inline">
            Road distances calculated from <strong>{selectedSchool.name}</strong>
          </span>
        )}
      </div>

      {/* STORE LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-['Nunito',sans-serif]">
        {filteredStores.length === 0 ? (
          <div className="col-span-2 clevr-card p-12 text-center bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-3">
            <h3 className="font-editorial text-2xl text-[#2E1F16]">
              No Stores Match Your Filter Criteria
            </h3>
            <p className="text-xs sm:text-sm text-[#2E1F16]/70 max-w-sm mx-auto">
              Try adjusting the price tier or toggling off fitting rooms to view all options.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-clevr-brown text-xs px-5 py-2.5 mt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredStores.map(({ store, dist, avgRating }) => (
            <div
              key={store.id}
              onClick={() => onSelectStore(store)}
              className="bg-white p-6 rounded-3xl border border-[#2E1F16]/12 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Unboxed Metadata & Card Actions */}
                <div className="flex items-center justify-between text-xs text-[#2E1F16]/75 font-medium">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-[#2E1F16] bg-[#F7E09A]/40 px-1.5 py-0.5 rounded text-[10px]">{store.priceTier}</span>
                    <span>·</span>
                    <span>{store.priceRangeFormatted}</span>
                    {dist !== null && (
                      <>
                        <span>·</span>
                        <span className="text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded text-[11px]">{formatDistance(dist)}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Compare Button */}
                    {onToggleCompare && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(store.id, e);
                        }}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          compareStoreIds.includes(store.id)
                            ? 'bg-[#EFAE6E] text-[#2E1F16]'
                            : 'text-[#2E1F16]/60 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40'
                        }`}
                        title={compareStoreIds.includes(store.id) ? 'Remove compare' : 'Compare store'}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Favorite Button */}
                    {onToggleSave && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(store.id, e);
                        }}
                        className="p-1.5 rounded-full text-[#2E1F16]/60 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40 transition-colors cursor-pointer"
                        title={savedStores.includes(store.id) ? 'Remove from saved' : 'Save store'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            savedStores.includes(store.id) ? 'fill-[#EFAE6E] text-[#EFAE6E]' : ''
                          }`}
                        />
                      </button>
                    )}

                    <div className="flex items-center gap-1 text-[#2E1F16] font-bold pl-1 text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-[#EFAE6E] text-[#EFAE6E]" />
                      <span>{avgRating.toFixed(1)}</span>
                      <span className="text-[#2E1F16]/50">({store.reviews.length})</span>
                    </div>
                  </div>
                </div>

                {/* Store Name */}
                <h3 className="font-editorial text-2xl text-[#2E1F16] group-hover:text-[#EFAE6E] transition-colors leading-tight">
                  {store.name}
                </h3>

                <p className="text-xs text-[#2E1F16]/65 flex items-center gap-1.5 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-[#2E1F16]/40 shrink-0" />
                  <span>{store.address} · {store.city}, FL {store.zip}</span>
                </p>

                <p className="text-xs text-[#2E1F16]/80 leading-relaxed line-clamp-2">
                  {store.priceNotes}
                </p>

                {/* Quiet Unboxed Feature Info */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-[#2E1F16]/80 border-t border-[#2E1F16]/8">
                  <span className="flex items-center gap-1">
                    <DoorOpen className="w-3.5 h-3.5 text-[#2E1F16]" />
                    <span>{store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms Open` : 'No Dressing Rooms'}</span>
                  </span>

                  {store.hasFormalwear && (
                    <>
                      <span>·</span>
                      <span className="text-[#2E1F16] font-semibold bg-[#F7E09A] px-1.5 py-0.5 rounded text-[11px]">Formalwear Racks</span>
                    </>
                  )}

                  {store.categories.slice(0, 2).map(cat => (
                    <React.Fragment key={cat}>
                      <span>·</span>
                      <span className="text-[#2E1F16]/70">{cat}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[#2E1F16]/8 flex items-center gap-2">
                {onQuickPeek && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickPeek(store);
                    }}
                    className="py-2 px-3.5 rounded-full text-xs font-semibold bg-[#F7E09A]/40 hover:bg-[#F7E09A]/80 text-[#2E1F16] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Peek</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStore(store);
                  }}
                  className="flex-1 btn-clevr-brown text-xs py-2 font-bold"
                >
                  <span>Explore Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full border border-[#2E1F16]/15 bg-[#FBEFD9] hover:bg-white flex items-center justify-center text-[#2E1F16] transition-colors shrink-0"
                  title="Open GPS Directions"
                >
                  <Navigation className="w-4 h-4 text-[#2E1F16]" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Compare Dock */}
      {compareStoreIds.length > 0 && onOpenCompare && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#2E1F16] text-[#FBEFD9] px-5 py-3 rounded-2xl shadow-2xl border border-[#EFAE6E] flex items-center gap-4 animate-fade-in font-['Nunito',sans-serif]">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Scale className="w-4 h-4 text-[#EFAE6E]" />
            <span>Comparing {compareStoreIds.length} store{compareStoreIds.length > 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={onOpenCompare}
            className="bg-[#EFAE6E] text-[#2E1F16] hover:bg-[#e5a05b] text-xs font-black px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            View Comparison Table
          </button>
        </div>
      )}
    </div>
  );
};
