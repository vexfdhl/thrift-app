import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  School,
  ShoppingBag,
  Star,
  Check,
  X,
  ArrowRight,
  Filter,
  Sparkles,
  Info,
  Clock,
  Shuffle,
  Menu,
  Leaf,
  Navigation,
  Compass,
  DoorOpen,
  Droplets,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Heart,
  Share2,
  Scale,
  Shirt,
  Calendar,
  ThumbsUp,
  Award,
  BookOpen,
  Eye,
  Smartphone,
  Video as VideoIcon,
  ShieldCheck
} from 'lucide-react';
import { ThriftLogo } from './components/ThriftLogo';
import { DUVAL_SCHOOLS, SchoolItem } from './data/schools';
import { DUVAL_THRIFT_STORES, ThriftStoreItem, ReviewItem } from './data/thriftStores';
import { ThriftMap } from './components/ThriftMap';
import { StoreDetail } from './components/StoreDetail';
import { StoreDirectory } from './components/StoreDirectory';
import { ReviewsView } from './components/ReviewsView';
import { AboutView } from './components/AboutView';
import { MobileBottomDock } from './components/MobileBottomDock';
import { CompareModal } from './components/CompareModal';
import { FavoritesModal } from './components/FavoritesModal';
import { RecommendationsSection } from './components/RecommendationsSection';
import { QuickPeekModal } from './components/QuickPeekModal';
import { InteractiveFitFinder } from './components/InteractiveFitFinder';
import { CampusSwitcherBar } from './components/CampusSwitcherBar';
import { AdminPortalModal } from './components/AdminPortalModal';
import { VideoGuideModal } from './components/VideoGuideModal';
import { IOSStatusBar } from './components/IOSStatusBar';
import {
  HeroThriftShowcase,
  StoreCardVisual,
  SustainabilityShowcaseVisual,
  BudgetSavingsVisual,
  WaterConservationVisual,
  FittingRoomVisual,
  MarcusAvatar,
  MayaAvatar,
  ElenaAvatar,
  FieldGuideVisual
} from './components/ThriftVisuals';
import { calculateDistanceMiles, formatDistance } from './utils/distance';
import {
  loadPersistedStoreReviews,
  persistStoreReview,
  loadPersistedAppFeedback,
  persistAppFeedback,
  AppFeedbackItem,
  loadPersistedSavedStores,
  persistSavedStores,
  loadPersistedSchoolId,
  persistSchoolId,
  loadPersistedCompareList,
  persistCompareList
} from './utils/storage';
import {
  seedInitialStoresIfEmpty,
  subscribeToStores,
  subscribeToReviews,
  createReview,
  FirestoreReviewItem
} from './lib/firebase';

type ViewMode = 'home' | 'map' | 'directory' | 'detail' | 'reviews' | 'about';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  // Remember selected school from localStorage
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(() => {
    const savedId = loadPersistedSchoolId();
    if (savedId) {
      const found = DUVAL_SCHOOLS.find(s => s.id === savedId);
      if (found) return found;
    }
    return DUVAL_SCHOOLS.find(s => s.id === 'riverside') || DUVAL_SCHOOLS[0];
  });

  const [selectedStore, setSelectedStore] = useState<ThriftStoreItem | null>(null);

  // Secondhand Eco Calculator garments count
  const [calculatorItems, setCalculatorItems] = useState<number>(4);

  // Active category filter in Featured Carousel
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'fitting' | 'budget' | 'formal' | 'vintage'>('all');

  // Carousel scroll index for store cards
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Interactive Student Thrift Tips expanded accordion
  const [expandedTip, setExpandedTip] = useState<number>(0);

  // Saved stores / favorites list from localStorage
  const [savedStores, setSavedStores] = useState<string[]>(() => {
    return loadPersistedSavedStores();
  });

  // Compare store IDs list from localStorage
  const [compareStoreIds, setCompareStoreIds] = useState<string[]>(() => {
    return loadPersistedCompareList();
  });

  // Modal dialog states
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState(false);
  const [isPhoneSimulatorMode, setIsPhoneSimulatorMode] = useState(false);
  const [quickPeekStore, setQuickPeekStore] = useState<ThriftStoreItem | null>(null);
  const [isQuickPeekOpen, setIsQuickPeekOpen] = useState(false);
  const [maxRadius, setMaxRadius] = useState<number>(30);

  const handleOpenQuickPeek = (store: ThriftStoreItem) => {
    setQuickPeekStore(store);
    setIsQuickPeekOpen(true);
  };

  // Raw stores from Firestore (including unpublished/draft stores for admin view)
  const [rawStores, setRawStores] = useState<ThriftStoreItem[]>(() => {
    const persistedReviewsMap = loadPersistedStoreReviews(DUVAL_THRIFT_STORES);
    return DUVAL_THRIFT_STORES.map(st => ({
      ...st,
      published: true,
      reviews: persistedReviewsMap[st.id] || st.reviews,
    }));
  });

  // All reviews from Firestore (including pending and hidden for admin moderation)
  const [allFirestoreReviews, setAllFirestoreReviews] = useState<FirestoreReviewItem[]>([]);

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    // Prime Firestore with initial Duval thrift stores if collection is empty
    seedInitialStoresIfEmpty();

    // Subscribe to stores directory
    const unsubStores = subscribeToStores(
      (firestoreStores) => {
        if (firestoreStores.length > 0) {
          setRawStores(firestoreStores);
        }
      },
      (err) => console.warn('Stores subscription notice:', err)
    );

    // Subscribe to community reviews
    const unsubReviews = subscribeToReviews(
      (firestoreReviews) => {
        setAllFirestoreReviews(firestoreReviews);
      },
      (err) => console.warn('Reviews subscription notice:', err)
    );

    return () => {
      unsubStores();
      unsubReviews();
    };
  }, []);

  // Public stores: Only published stores with approved community reviews
  const stores = useMemo<ThriftStoreItem[]>(() => {
    return rawStores
      .filter(st => st.published !== false)
      .map(st => {
        const approvedFromFirestore = allFirestoreReviews.filter(
          r => r.storeId === st.id && r.status === 'approved'
        );
        return {
          ...st,
          reviews: approvedFromFirestore.length > 0 ? approvedFromFirestore : st.reviews,
        };
      });
  }, [rawStores, allFirestoreReviews]);

  // App-wide community feedback loaded from localStorage
  const [appFeedbackList, setAppFeedbackList] = useState<AppFeedbackItem[]>(() => {
    return loadPersistedAppFeedback();
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreNavDropdownOpen, setIsStoreNavDropdownOpen] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // School Autocomplete search state
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3400);
  };

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteContainerRef.current &&
        !autocompleteContainerRef.current.contains(event.target as Node)
      ) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Duval schools for autocomplete
  const filteredSchools = DUVAL_SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
    s.zip.includes(schoolSearchQuery)
  );

  const handleSelectSchool = (school: SchoolItem) => {
    setSelectedSchool(school);
    persistSchoolId(school.id);
    setSchoolSearchQuery('');
    setIsAutocompleteOpen(false);
    showToast(`Centered on ${school.name}. Distances recalculated.`);
  };

  const handleClearSchool = () => {
    setSelectedSchool(null);
    persistSchoolId(null);
    showToast('Showing all Duval County stores.');
  };

  const handleOpenStoreDetail = (store: ThriftStoreItem) => {
    setSelectedStore(store);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveStore = (storeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedStores(prev => {
      const exists = prev.includes(storeId);
      const next = exists ? prev.filter(id => id !== storeId) : [...prev, storeId];
      persistSavedStores(next);
      showToast(exists ? 'Removed from saved racks' : 'Saved to favorites list');
      return next;
    });
  };

  const handleToggleCompareStore = (storeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareStoreIds(prev => {
      const exists = prev.includes(storeId);
      if (!exists && prev.length >= 4) {
        showToast('You can compare up to 4 stores at once.');
        return prev;
      }
      const next = exists ? prev.filter(id => id !== storeId) : [...prev, storeId];
      persistCompareList(next);
      showToast(exists ? 'Removed from comparison' : 'Added to comparison table');
      return next;
    });
  };

  const handleClearCompare = () => {
    setCompareStoreIds([]);
    persistCompareList([]);
    showToast('Comparison list cleared.');
  };

  const handleAddStoreReview = async (storeId: string, review: ReviewItem) => {
    persistStoreReview(storeId, review);

    try {
      await createReview({
        id: review.id,
        storeId,
        author: review.author,
        school: review.school,
        rating: review.rating,
        date: review.date,
        comment: review.comment,
        tags: review.tags,
        helpfulCount: review.helpfulCount || 0,
        status: 'approved',
      });
    } catch (err) {
      console.warn('Firestore review write deferred:', err);
    }

    if (selectedStore && selectedStore.id === storeId) {
      setSelectedStore(prev => (prev ? { ...prev, reviews: [review, ...prev.reviews] } : null));
    }
  };

  // Sync selectedStore when stores list updates from Firestore
  useEffect(() => {
    if (selectedStore) {
      const refreshed = stores.find(s => s.id === selectedStore.id);
      if (refreshed) {
        setSelectedStore(refreshed);
      }
    }
  }, [stores]);

  const handleAddAppFeedback = (feedback: AppFeedbackItem) => {
    const updated = persistAppFeedback(feedback);
    setAppFeedbackList(updated);
  };

  const handleRandomStore = () => {
    const randomIndex = Math.floor(Math.random() * stores.length);
    const store = stores[randomIndex];
    handleOpenStoreDetail(store);
    showToast(`Featured find: ${store.name}`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true);
      showToast('Subscribed! Student discount alerts on their way.');
      setNewsletterEmail('');
    }
  };

  const categoryFilteredStores = useMemo(() => {
    return stores.filter(st => {
      if (activeCategoryTab === 'fitting') return st.fittingRoomsCount > 0;
      if (activeCategoryTab === 'budget') return st.priceTier === '$';
      if (activeCategoryTab === 'formal') return st.hasFormalwear;
      if (activeCategoryTab === 'vintage') {
        return (
          st.categories.some(c => c.toLowerCase().includes('vintage') || c.toLowerCase().includes('denim')) ||
          st.sustainableMaterials.includes('Heavy Denim')
        );
      }
      return true;
    });
  }, [stores, activeCategoryTab]);

  const popularSchools = [
    { id: 'riverside', name: 'Riverside High' },
    { id: 'stanton', name: 'Stanton Prep' },
    { id: 'fletcher', name: 'Fletcher High' },
    { id: 'atlantic-coast', name: 'Atlantic Coast' },
    { id: 'douglas-anderson', name: 'Douglas Anderson' },
    { id: 'paxon', name: 'Paxon SAS' },
  ];

  // Practical student thrifting tips & guide
  const thriftTipsList = [
    {
      title: 'Tag Color Discount Days',
      description: 'Charity thrift stores like St. Vincent de Paul, Hope Deals, and Goodwill offer 25%–50% off specific tag colors every week. Ask at the front counter before browsing!',
    },
    {
      title: 'Inspect Natural Fiber Tags',
      description: 'Check the inside care tag for 100% Cotton, Linen, Wool, or Silk. Natural fibers outlast fast-fashion polyester and breathe comfortably in Florida weather.',
    },
    {
      title: 'Check Fitting Rooms Ahead of Time',
      description: 'Several independent shops closed dressing rooms post-pandemic. ThriftFit DuvALL verifies open dressing rooms so you can try on pieces before buying.',
    },
    {
      title: 'Homecoming & Prom Hack',
      description: 'Instead of renting a $150 tuxedo or buying a $200 fast-fashion dress that wears out in one night, shops like St. Vincent de Paul and City Thrift stock suits for $25 and formal dresses for $15–$30.',
    },
  ];

  // Calculated eco savings
  const waterSaved = calculatorItems * 700;
  const moneySaved = calculatorItems * 24.5;
  const co2Prevented = (calculatorItems * 8.2).toFixed(1);

  return (
    <div className={`min-h-screen ${isPhoneSimulatorMode ? 'bg-[#18110D] py-4 sm:py-8 px-2 sm:px-4' : 'bg-[#FBEFD9]'} text-[#2E1F16] font-['Nunito',sans-serif] flex flex-col selection:bg-[#C1D7C2] selection:text-[#2E1F16]`}>
      {/* Phone Simulator Floating Control Banner */}
      {isPhoneSimulatorMode && (
        <div className="max-w-[430px] mx-auto mb-3 bg-[#2E1F16] text-[#FBEFD9] px-4 py-2 rounded-2xl flex items-center justify-between shadow-xl border border-[#EFAE6E]/50 text-xs w-full shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">📱 Duval Student iPhone View</span>
          </div>
          <button
            onClick={() => setIsPhoneSimulatorMode(false)}
            className="px-2.5 py-1 bg-[#EFAE6E] text-[#2E1F16] rounded-xl font-black text-[11px] hover:bg-[#e5a05b] cursor-pointer"
          >
            Exit Phone View
          </button>
        </div>
      )}

      {/* Main Container / Phone Mockup Frame */}
      <div className={isPhoneSimulatorMode ? 'max-w-[430px] mx-auto w-full bg-[#FBEFD9] rounded-[48px] border-[10px] border-[#2E1F16] shadow-2xl overflow-hidden flex flex-col relative min-h-[860px]' : 'w-full flex flex-col flex-1'}>
        {isPhoneSimulatorMode && (
          <IOSStatusBar
            islandText="ThriftFit DuvALL"
            onIslandClick={() => showToast('ThriftFit Dynamic Island · FL-04')}
          />
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 bg-[#2E1F16] text-[#FBEFD9] px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fade-in border border-[#EFAE6E]/40">
            <Check className="w-4 h-4 text-[#EFAE6E] stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareStoreIds={compareStoreIds}
        stores={stores}
        selectedSchool={selectedSchool}
        onRemoveFromCompare={(id) => handleToggleCompareStore(id)}
        onClearCompare={handleClearCompare}
        onSelectStore={handleOpenStoreDetail}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        savedStoreIds={savedStores}
        stores={stores}
        selectedSchool={selectedSchool}
        onToggleSave={(id) => handleToggleSaveStore(id)}
        onSelectStore={handleOpenStoreDetail}
        onToggleCompare={(id) => handleToggleCompareStore(id)}
        compareStoreIds={compareStoreIds}
      />

      {/* Quick Peek Modal */}
      <QuickPeekModal
        store={quickPeekStore}
        isOpen={isQuickPeekOpen}
        onClose={() => setIsQuickPeekOpen(false)}
        selectedSchool={selectedSchool}
        onOpenFullDetail={handleOpenStoreDetail}
        isSaved={quickPeekStore ? savedStores.includes(quickPeekStore.id) : false}
        onToggleSave={(id) => handleToggleSaveStore(id)}
        isCompared={quickPeekStore ? compareStoreIds.includes(quickPeekStore.id) : false}
        onToggleCompare={(id) => handleToggleCompareStore(id)}
      />

      {/* Teacher & District Admin Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        stores={rawStores}
        allReviews={allFirestoreReviews}
        onToast={showToast}
      />

      {/* Competition Presentation & Video Guide Modal */}
      <VideoGuideModal
        isOpen={isVideoGuideOpen}
        onClose={() => setIsVideoGuideOpen(false)}
        onToast={showToast}
      />

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#2E1F16] text-[#FBEFD9] text-[11px] sm:text-xs py-2 px-4 border-b border-[#2E1F16] flex items-center justify-between">
        <button
          onClick={() => showToast('Student discounts verified across 12 Jacksonville thrift stores')}
          className="text-[#FBEFD9]/70 hover:text-[#EFAE6E] cursor-pointer transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 font-medium tracking-wide text-center truncate">
          <span className="font-bold text-[#EFAE6E]">Thrift More. Waste Less:</span>
          <span className="truncate">
            Connecting 24 Duval High Schools to verified secondhand clothing &amp; open dressing rooms!
          </span>
        </div>

        <button
          onClick={() => showToast('Updated weekly for Duval County student shoppers')}
          className="text-[#FBEFD9]/70 hover:text-[#EFAE6E] cursor-pointer transition-colors"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. MAIN HEADER (3-ZONE CONTRACT) */}
      <header className="w-full bg-[#FBEFD9]/95 backdrop-blur-md border-b border-[#2E1F16]/10 sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
          {/* Zone 1: Wordmark */}
          <div
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer shrink-0"
          >
            <ThriftLogo variant="compact" />
          </div>

          {/* Zone 2: Minimalist Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {[
              { id: 'home', label: 'Discover' },
              { id: 'directory', label: `Directory (${stores.length})` },
              { id: 'map', label: 'Duval Map' },
              { id: 'reviews', label: 'Student Reviews' },
              { id: 'about', label: 'Mission' },
            ].map(tab => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentView(tab.id as ViewMode);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                      : 'text-[#2E1F16]/75 hover:text-[#2E1F16] hover:bg-[#F7E09A]/40'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Phone View Simulator Toggle */}
            <button
              onClick={() => {
                const nextMode = !isPhoneSimulatorMode;
                setIsPhoneSimulatorMode(nextMode);
                showToast(nextMode ? '📱 Switched to Phone Simulator View' : '💻 Switched to Full Desktop View');
              }}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                isPhoneSimulatorMode
                  ? 'bg-[#EFAE6E] text-[#2E1F16] border-[#2E1F16]/30 shadow-xs'
                  : 'bg-[#C1D7C2]/50 hover:bg-[#C1D7C2] text-[#2E1F16] border-[#2E1F16]/15'
              }`}
              title="Toggle iPhone Phone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isPhoneSimulatorMode ? 'Exit Phone' : 'Phone View'}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#F7E09A]/50 hover:bg-[#F7E09A] px-2.5 py-1.5 rounded-full border border-[#2E1F16]/15 transition-colors cursor-pointer"
              title="Teacher & District Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E1F16]" />
              <span>Admin</span>
            </button>

            {/* Video Script Guide Button */}
            <button
              onClick={() => setIsVideoGuideOpen(true)}
              className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#EFAE6E]/30 hover:bg-[#EFAE6E]/60 px-2.5 py-1.5 rounded-full border border-[#2E1F16]/15 transition-colors cursor-pointer"
              title="Competition Video Presentation Script & Rubric Guide"
            >
              <VideoIcon className="w-3.5 h-3.5 text-[#2E1F16]" />
              <span>Video Script</span>
            </button>

            {/* Compare Pill */}
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] cursor-pointer bg-[#F7E09A]/40 hover:bg-[#F7E09A]/70 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#2E1F16]/15 transition-colors"
              title="Compare selected stores side-by-side"
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
              <span className="w-4 h-4 rounded-full bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center text-[10px] font-bold">
                {compareStoreIds.length}
              </span>
            </button>

            {/* Saved Stores Pill */}
            <button
              onClick={() => setIsFavoritesModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] cursor-pointer bg-[#F7E09A]/40 hover:bg-[#F7E09A]/70 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#2E1F16]/15 transition-colors"
              title="View saved thrift racks"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  savedStores.length > 0 ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]'
                }`}
              />
              <span className="hidden sm:inline">Saved</span>
              <span className="w-4 h-4 rounded-full bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center text-[10px] font-bold">
                {savedStores.length}
              </span>
            </button>

            {/* Surprise Me Button */}
            <button
              onClick={handleRandomStore}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-[#2E1F16]/80 hover:text-[#2E1F16] px-2.5 py-1.5 rounded-full hover:bg-[#F7E09A]/40 cursor-pointer transition-colors"
              title="Pick a random store"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Surprise</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full border border-[#2E1F16]/15 bg-[#FBEFD9] flex items-center justify-center text-[#2E1F16]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-[#2E1F16]" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FBEFD9] border-b border-[#2E1F16]/15 p-4 space-y-2 animate-fade-in text-sm font-semibold text-[#2E1F16] shadow-md">
            {[
              { id: 'home', label: 'Discover & Vibe Finder' },
              { id: 'directory', label: `Store Directory (${stores.length} Stores)` },
              { id: 'map', label: 'Interactive Duval Map' },
              { id: 'reviews', label: 'Student Reviews & Ratings' },
              { id: 'about', label: 'Why Thrifting Matters' },
            ].map(tab => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentView(tab.id as ViewMode);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#EFAE6E] font-bold text-[#2E1F16]'
                      : 'hover:bg-[#F7E09A]/40 text-[#2E1F16]/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#2E1F16]/40" />
                </button>
              );
            })}

            <div className="pt-2 border-t border-[#2E1F16]/10 space-y-2">
              <button
                onClick={() => {
                  setIsPhoneSimulatorMode(!isPhoneSimulatorMode);
                  setIsMobileMenuOpen(false);
                  showToast(!isPhoneSimulatorMode ? '📱 Switched to Phone Simulator View' : '💻 Switched to Full Desktop View');
                }}
                className="w-full text-left p-2.5 rounded-xl bg-[#C1D7C2]/40 text-[#2E1F16] font-bold flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Phone Simulator Mode</span>
                </div>
                <span className="text-[10px] bg-[#2E1F16] text-[#FBEFD9] px-2 py-0.5 rounded-full uppercase">
                  {isPhoneSimulatorMode ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsAdminModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-[#F7E09A]/40 text-[#2E1F16] font-bold flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Teacher &amp; District Admin Portal</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E1F16]/50" />
              </button>

              <button
                onClick={() => {
                  setIsVideoGuideOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-[#EFAE6E]/30 text-[#2E1F16] font-bold flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <VideoIcon className="w-4 h-4" />
                  <span>Competition Video Script &amp; Rubric</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E1F16]/50" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setIsFavoritesModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-[#F7E09A]/40 text-[#2E1F16] font-bold flex items-center justify-center gap-1.5 text-xs"
              >
                <Heart className="w-4 h-4 fill-[#EFAE6E] text-[#EFAE6E]" />
                <span>Saved ({savedStores.length})</span>
              </button>
              <button
                onClick={() => {
                  setIsCompareModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-[#F7E09A]/40 text-[#2E1F16] font-bold flex items-center justify-center gap-1.5 text-xs"
              >
                <Scale className="w-4 h-4" />
                <span>Compare ({compareStoreIds.length})</span>
              </button>
            </div>
            <button
              onClick={() => {
                handleRandomStore();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left p-3 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] font-bold flex items-center justify-between mt-1 cursor-pointer"
            >
              <span>🎲 Surprise Store Pick</span>
              <ArrowRight className="w-4 h-4 text-[#2E1F16]" />
            </button>
          </div>
        )}
      </header>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1 w-full pb-20 md:pb-0">
        {/* VIEW 1: HOME VIEW */}
        {currentView === 'home' && (
          <div className="w-full">
            {/* SECTION 1: HERO SECTION */}
            <section className="w-full bg-[#FBEFD9] py-12 sm:py-20 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Hero Left Content */}
                <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
                  <div className="inline-block">
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#2E1F16]/70 block">
                      DUVAL COUNTY STUDENT FASHION NETWORK · EST. 2026
                    </span>
                  </div>

                  <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl text-[#2E1F16] font-normal tracking-normal leading-[1.08]">
                    Find Your <br />
                    <span className="font-editorial-italic font-normal text-[#EFAE6E]">Fit.</span>
                  </h1>

                  <p className="text-[#2E1F16]/85 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
                    Your next favorite find is closer than you think. Discover student-verified thrift stores across Jacksonville with accurate campus driving distances, verified dressing rooms, and sustainable secondhand styles.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={() => {
                        if (searchInputRef.current) {
                          searchInputRef.current.focus();
                          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="btn-clevr-brown text-sm"
                    >
                      <span>Find Stores Near My School</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('directory');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-clevr-outline text-sm"
                    >
                      <span>Browse All Stores ({stores.length})</span>
                    </button>
                  </div>
                </div>

                {/* Hero Right Visual Showcase */}
                <div className="lg:col-span-7 relative flex justify-center items-center">
                  <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F7E09A]/30">
                    <HeroThriftShowcase className="w-full h-full object-cover" />

                    {/* Warm gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F16]/40 via-transparent to-transparent pointer-events-none" />

                    {/* Bottom caption card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-[#FBEFD9]/95 backdrop-blur-md rounded-2xl p-4 border border-[#2E1F16]/10 shadow-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#2E1F16]">
                          Duval County Thrift Network
                        </div>
                        <div className="text-[11px] text-[#2E1F16]/70">
                          {stores.length} verified stores · 24 high school routes mapped
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#2E1F16] bg-[#C1D7C2] px-2.5 py-1 rounded-full">
                        100% Free
                      </span>
                    </div>

                    {/* Savings Badge */}
                    <div className="absolute top-3 right-3 rotate-6 z-10">
                      <div className="bg-[#EFAE6E] text-[#2E1F16] px-3.5 py-1.5 rounded-full shadow-lg border border-[#2E1F16]/20 flex items-center gap-1 text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#2E1F16]" />
                        <span>Save 70–90% Off Retail</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CAMPUS QUICK SWITCHER & RADIUS BAR */}
            <CampusSwitcherBar
              selectedSchool={selectedSchool}
              onSelectSchool={handleSelectSchool}
              maxRadius={maxRadius}
              onRadiusChange={(r) => {
                setMaxRadius(r);
                showToast(r === 30 ? 'Showing all Duval County stores' : `Filtered to ${r}-mile campus radius`);
              }}
              onOpenSearch={() => {
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                  searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            />

            {/* SECTION 2: 3-STEP EXPERIENCE GUIDE */}
            <section className="w-full bg-[#F7E09A]/20 py-12 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                    HOW IT WORKS
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16]">
                    Thrifting Made Simple in 3 Steps
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#FBEFD9] p-6 rounded-2xl border border-[#2E1F16]/15 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center font-bold text-sm shadow-xs">
                      1
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-[#2E1F16]">
                      Find Your School
                    </h3>
                    <p className="text-xs text-[#2E1F16]/80 leading-relaxed">
                      Select your Duval County high school to automatically compute exact driving miles to every local thrift shop.
                    </p>
                  </div>

                  <div className="bg-[#FBEFD9] p-6 rounded-2xl border border-[#2E1F16]/15 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#C1D7C2] text-[#2E1F16] flex items-center justify-center font-bold text-sm shadow-xs">
                      2
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-[#2E1F16]">
                      Discover Nearby Thrift Stores
                    </h3>
                    <p className="text-xs text-[#2E1F16]/80 leading-relaxed">
                      Explore the 2–3 closest stores on an interactive map. Check verified open fitting rooms, price notes, and hours.
                    </p>
                  </div>

                  <div className="bg-[#FBEFD9] p-6 rounded-2xl border border-[#2E1F16]/15 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#F7E09A] text-[#2E1F16] flex items-center justify-center font-bold text-sm shadow-xs">
                      3
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-[#2E1F16]">
                      Find Your Fit
                    </h3>
                    <p className="text-xs text-[#2E1F16]/80 leading-relaxed">
                      Save favorite racks, compare stores side-by-side, and score vintage clothing while keeping textiles out of landfills.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: DUVAL HIGH SCHOOL AUTOCOMPLETE SEARCH */}
            <section className="w-full bg-[#FBEFD9] py-10 sm:py-14 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-5xl mx-auto space-y-4" ref={autocompleteContainerRef}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block mb-1">
                      CAMPUS RADIUS CALCULATOR
                    </span>
                    <h2 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16]">
                      Find Thrift Stores Near <span className="font-editorial-italic text-[#EFAE6E]">Your High School</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#2E1F16]/70">
                      Select your school to calculate exact driving distances and preview the closest racks in Jacksonville.
                    </p>
                  </div>

                  {selectedSchool && (
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <span className="text-[#2E1F16]/60 font-semibold">Active:</span>
                      <span className="font-bold text-[#2E1F16] bg-[#EFAE6E] px-3 py-1 rounded-full shadow-xs">
                        {selectedSchool.name}
                      </span>
                      <button
                        onClick={handleClearSchool}
                        className="text-[#2E1F16]/60 hover:text-[#2E1F16] font-bold underline cursor-pointer ml-1"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                {/* Input container with autocomplete */}
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#2E1F16]/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Type your Duval County high school (e.g. Riverside, Stanton, Fletcher, Paxon, Wolfson)..."
                      value={schoolSearchQuery}
                      onChange={e => {
                        setSchoolSearchQuery(e.target.value);
                        setIsAutocompleteOpen(true);
                      }}
                      onFocus={() => setIsAutocompleteOpen(true)}
                      onKeyDown={e => {
                        if (e.key === 'Escape') setIsAutocompleteOpen(false);
                      }}
                      className="w-full pl-11 pr-11 py-3 bg-[#F7E09A]/30 border border-[#2E1F16]/15 rounded-2xl text-xs sm:text-sm font-semibold text-[#2E1F16] placeholder-[#2E1F16]/40 focus:outline-none focus:bg-white focus:border-[#2E1F16]/40 shadow-xs transition-colors"
                    />
                    {schoolSearchQuery && (
                      <button
                        onClick={() => {
                          setSchoolSearchQuery('');
                          setIsAutocompleteOpen(false);
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2E1F16]/40 hover:text-[#2E1F16] p-1"
                        aria-label="Clear school search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {isAutocompleteOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#FBEFD9] border border-[#2E1F16]/15 rounded-2xl shadow-xl z-40 max-h-72 overflow-y-auto p-2">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-[#2E1F16]/60 uppercase tracking-wider">
                        Duval County Public Schools ({filteredSchools.length} matches)
                      </div>
                      {filteredSchools.length === 0 ? (
                        <div className="p-4 text-center text-xs font-semibold text-[#2E1F16]/60">
                          No school found matching "{schoolSearchQuery}".
                        </div>
                      ) : (
                        filteredSchools.map(sch => (
                          <div
                            key={sch.id}
                            onClick={() => handleSelectSchool(sch)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all text-xs mb-1 ${
                              selectedSchool?.id === sch.id
                                ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                                : 'hover:bg-[#F7E09A]/40 text-[#2E1F16]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <School className="w-4 h-4 text-[#2E1F16]/60 shrink-0" />
                              <div>
                                <div className="font-bold text-sm text-[#2E1F16]">{sch.name}</div>
                                <div className="text-[11px] text-[#2E1F16]/60">{sch.address}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#2E1F16] bg-white px-2.5 py-0.5 rounded-full border border-[#2E1F16]/15">
                              {sch.type}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Popular School Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-[#2E1F16]/60 font-semibold">Popular Campuses:</span>
                  {popularSchools.map(sch => {
                    const fullSchool = DUVAL_SCHOOLS.find(s => s.id === sch.id);
                    if (!fullSchool) return null;
                    const isSelected = selectedSchool?.id === sch.id;
                    return (
                      <button
                        key={sch.id}
                        onClick={() => handleSelectSchool(fullSchool)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                            : 'bg-[#F7E09A]/30 text-[#2E1F16] border border-[#2E1F16]/15 hover:border-[#2E1F16]/40'
                        }`}
                      >
                        {sch.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* INTERACTIVE FIT FINDER & OUTFIT PRICE BATTLE */}
            <InteractiveFitFinder
              stores={stores}
              selectedSchool={selectedSchool}
              onSelectStore={handleOpenStoreDetail}
              onQuickPeek={handleOpenQuickPeek}
              onToggleSave={handleToggleSaveStore}
              savedStores={savedStores}
              onToggleCompare={handleToggleCompareStore}
              compareStoreIds={compareStoreIds}
            />

            {/* SECTION 4: FEATURED STORES CAROUSEL */}
            <section className="w-full bg-[#FBEFD9] py-14 sm:py-20 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-7xl mx-auto space-y-10">
                {/* Heading */}
                <div className="text-center space-y-3">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                    CURATED DUVAL RACKS
                  </span>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-[#2E1F16] font-normal">
                    Featured <span className="font-editorial-italic font-normal text-[#EFAE6E]">Thrift Stores</span>
                  </h2>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-3">
                    {[
                      { id: 'all', label: 'All Stores', icon: '✨' },
                      { id: 'fitting', label: 'Verified Fitting Rooms', icon: '🚪' },
                      { id: 'budget', label: 'Under $10 Steals ($)', icon: '🏷️' },
                      { id: 'formal', label: 'Homecoming & Prom', icon: '👗' },
                      { id: 'vintage', label: 'Vintage Denim', icon: '🌿' },
                    ].map(tab => {
                      const isActive = activeCategoryTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveCategoryTab(tab.id as any);
                            setCarouselIndex(0);
                          }}
                          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs border border-[#2E1F16]/20'
                              : 'bg-[#F7E09A]/40 text-[#2E1F16] border border-[#2E1F16]/10 hover:bg-[#F7E09A]'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cards Carousel Grid */}
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryFilteredStores.slice(carouselIndex, carouselIndex + 4).map((store, idx) => {
                      const dist = selectedSchool
                        ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
                        : null;
                      const isSaved = savedStores.includes(store.id);
                      const isCompared = compareStoreIds.includes(store.id);

                      return (
                        <div
                          key={store.id}
                          className="bg-white/95 p-5 rounded-3xl border border-[#2E1F16]/10 shadow-[0_4px_20px_-4px_rgba(46,31,22,0.06)] hover:shadow-[0_10px_25px_-5px_rgba(46,31,22,0.12)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                        >
                          {/* Top Quiet Meta */}
                          <div className="flex items-center justify-between mb-2 z-10 text-xs text-[#2E1F16]/75 font-semibold">
                            <span className="font-bold text-[#2E1F16]">
                              {store.priceTier} · {store.priceRangeFormatted}
                            </span>
                            {store.fittingRoomsCount > 0 && (
                              <span className="text-[#2E1F16] bg-[#C1D7C2] px-2 py-0.5 rounded-full font-bold">
                                {store.fittingRoomsCount} Rooms
                              </span>
                            )}
                          </div>

                          {/* Image Box */}
                          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-[#FBEFD9] border border-[#2E1F16]/10">
                            <StoreCardVisual
                              variant={idx}
                              name={store.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 flex items-center gap-1.5">
                              <button
                                onClick={(e) => handleToggleCompareStore(store.id, e)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
                                  isCompared
                                    ? 'bg-[#EFAE6E] text-[#2E1F16]'
                                    : 'bg-[#FBEFD9]/90 text-[#2E1F16] hover:bg-white'
                                }`}
                                title={isCompared ? 'Remove from compare' : 'Compare store'}
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleToggleSaveStore(store.id, e)}
                                className="w-8 h-8 rounded-full bg-[#FBEFD9]/90 flex items-center justify-center text-[#2E1F16] hover:bg-white transition-colors shadow-xs cursor-pointer"
                                title="Save Store"
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-1.5 flex-1 flex flex-col justify-between text-center">
                            <div>
                              <div className="flex items-center justify-center gap-1 text-[#EFAE6E] text-xs">
                                <span>★★★★★</span>
                                <span className="text-[11px] text-[#2E1F16]/70 font-semibold">
                                  ({store.reviews.length})
                                </span>
                              </div>

                              <h3 className="font-editorial text-xl text-[#2E1F16] font-normal leading-snug mt-1 group-hover:text-[#EFAE6E] transition-colors">
                                {store.name}
                              </h3>

                              <p className="text-[11px] text-[#2E1F16]/70 line-clamp-1">
                                {store.priceNotes}
                              </p>
                            </div>

                            {dist !== null && (
                              <div className="text-[11px] font-bold text-[#2E1F16] bg-[#F7E09A] px-2 py-0.5 rounded-full inline-block mx-auto mt-1">
                                {formatDistance(dist)} from campus
                              </div>
                            )}

                            <div className="pt-3 flex items-center gap-2">
                              <button
                                onClick={() => handleOpenQuickPeek(store)}
                                className="flex-1 py-2 px-2.5 rounded-full text-xs font-semibold bg-[#F7E09A] hover:bg-[#fae7a8] text-[#2E1F16] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Peek</span>
                              </button>
                              <button
                                onClick={() => handleOpenStoreDetail(store)}
                                className="flex-1 py-2 px-3 rounded-full text-xs font-bold bg-[#EFAE6E] hover:bg-[#e59f5a] text-[#2E1F16] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Details</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center justify-between pt-6">
                    <button
                      onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 2))}
                      disabled={carouselIndex === 0}
                      className="w-9 h-9 rounded-full border border-[#2E1F16]/15 bg-[#F7E09A]/40 hover:bg-[#F7E09A] flex items-center justify-center text-[#2E1F16] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Previous stores"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-bold text-[#2E1F16]/60">
                      Showing {carouselIndex + 1}–{Math.min(carouselIndex + 4, categoryFilteredStores.length)} of {categoryFilteredStores.length} stores
                    </span>
                    <button
                      onClick={() => setCarouselIndex(Math.min(categoryFilteredStores.length - 4, carouselIndex + 2))}
                      disabled={carouselIndex + 4 >= categoryFilteredStores.length}
                      className="w-9 h-9 rounded-full border border-[#2E1F16]/15 bg-[#F7E09A]/40 hover:bg-[#F7E09A] flex items-center justify-center text-[#2E1F16] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Next stores"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: CONTRASTING FRESH MINT SUSTAINABILITY SECTION */}
            <section className="w-full bg-[#C1D7C2] text-[#2E1F16] py-16 sm:py-24 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#2E1F16]/70 block">
                      WHY SECONDHAND MATTERS
                    </span>

                    <h2 className="font-editorial text-4xl sm:text-6xl text-[#2E1F16] font-normal leading-tight">
                      Thrift More. <br />
                      <span className="font-editorial-italic font-normal text-[#EFAE6E]">Waste Less.</span>
                    </h2>

                    <p className="text-[#2E1F16]/85 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                      Every year, thousands of tons of synthetic fast fashion end up in Florida landfills, shedding microplastics into the St. Johns River and Atlantic beaches. Thrifting gives quality clothing a second life, saves students hundreds of dollars, and builds an individual style that mall chains can't match.
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setCurrentView('directory');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-clevr-brown text-sm"
                      >
                        <span>Browse Duval Stores</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('about');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 rounded-full border border-[#2E1F16]/30 hover:bg-[#2E1F16]/10 text-xs font-bold text-[#2E1F16] transition-all cursor-pointer"
                      >
                        <span>Read Our Full Mission</span>
                      </button>
                    </div>
                  </div>

                  {/* Sustainability Right Visual */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#2E1F16]/15 shadow-2xl relative bg-[#F7E09A]/20">
                      <SustainabilityShowcaseVisual className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F16]/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <span className="text-xs font-bold text-[#FBEFD9] uppercase tracking-widest block">
                          Secondhand First
                        </span>
                        <span className="font-editorial-italic text-sm text-[#FBEFD9]/90">
                          Protecting the St. Johns River &amp; student budgets
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="rounded-3xl overflow-hidden bg-[#FBEFD9] text-[#2E1F16] border border-[#2E1F16]/10 shadow-sm">
                    <div className="h-32 overflow-hidden bg-[#F7E09A]/40">
                      <BudgetSavingsVisual className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#F7E09A] px-2.5 py-0.5 rounded-full w-fit">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Save $500+ Annually</span>
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[#2E1F16]">
                        Student Budgets
                      </h3>
                      <p className="text-xs text-[#2E1F16]/80 leading-relaxed font-normal">
                        Avoid $80 mall jackets and $200 formalwear rentals. Jacksonville thrift stores feature $5–$25 quality garments, leaving money for college savings and school fees.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-3xl overflow-hidden bg-[#FBEFD9] text-[#2E1F16] border border-[#2E1F16]/10 shadow-sm">
                    <div className="h-32 overflow-hidden bg-[#EFAE6E]/30">
                      <WaterConservationVisual className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#C1D7C2] px-2.5 py-0.5 rounded-full w-fit">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>700 Gallons per Shirt</span>
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[#2E1F16]">
                        Water Conservation
                      </h3>
                      <p className="text-xs text-[#2E1F16]/80 leading-relaxed font-normal">
                        Manufacturing a single new cotton shirt requires 700 gallons of freshwater. Choosing secondhand directly keeps water reservoirs safe and lowers chemical dyes in runoff.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-3xl overflow-hidden bg-[#FBEFD9] text-[#2E1F16] border border-[#2E1F16]/10 shadow-sm">
                    <div className="h-32 overflow-hidden bg-[#C1D7C2]/40">
                      <FittingRoomVisual className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#EFAE6E] px-2.5 py-0.5 rounded-full w-fit">
                        <DoorOpen className="w-3.5 h-3.5" />
                        <span>Try Before Buying</span>
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[#2E1F16]">
                        Verified Fitting Rooms
                      </h3>
                      <p className="text-xs text-[#2E1F16]/80 leading-relaxed font-normal">
                        Nothing is more frustrating than driving to a store only to find dressing rooms closed. ThriftFit DuvALL checks and lists dressing room availability for every location.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: PERSONALIZED RECOMMENDATIONS WIDGET */}
            <RecommendationsSection
              stores={stores}
              selectedSchool={selectedSchool}
              onSelectStore={handleOpenStoreDetail}
              onToggleSave={handleToggleSaveStore}
              savedStores={savedStores}
              onToggleCompare={handleToggleCompareStore}
              compareStoreIds={compareStoreIds}
            />

            {/* SECTION 7: INTERACTIVE SECONDHAND ECO CALCULATOR */}
            <section className="w-full bg-[#F7E09A]/20 py-14 sm:py-20 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-4xl mx-auto space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                    INTERACTIVE IMPACT ESTIMATOR
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
                    Calculate Your <span className="font-editorial-italic text-[#EFAE6E]">Thrift Savings</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#2E1F16]/75 max-w-lg mx-auto">
                    Move the slider to see how many secondhand garments you thrift this school semester instead of buying brand new.
                  </p>
                </div>

                <div className="bg-white/95 p-6 sm:p-10 rounded-3xl border border-[#2E1F16]/10 shadow-xs space-y-8">
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[11px] font-bold text-[#2E1F16]/60 uppercase tracking-wider mr-1">
                      Quick Presets:
                    </span>
                    {[
                      { count: 2, label: 'Single Outfit (2)' },
                      { count: 6, label: 'Semester Capsule (6)' },
                      { count: 12, label: 'School Year (12)' },
                      { count: 20, label: 'Club / Spirit Week (20)' },
                    ].map(preset => (
                      <button
                        key={preset.count}
                        onClick={() => setCalculatorItems(preset.count)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          calculatorItems === preset.count
                            ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                            : 'bg-[#FBEFD9] text-[#2E1F16] hover:bg-[#F7E09A]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2E1F16]">
                      <span>Garments Thrifted:</span>
                      <span className="font-editorial text-2xl text-[#EFAE6E]">
                        {calculatorItems} piece{calculatorItems > 1 ? 's' : ''}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={calculatorItems}
                      onChange={(e) => setCalculatorItems(parseInt(e.target.value, 10))}
                      className="w-full accent-[#EFAE6E] cursor-pointer h-2 bg-[#FBEFD9] rounded-lg"
                    />

                    <div className="flex justify-between text-[10px] text-[#2E1F16]/50 font-bold">
                      <span>1 outfit</span>
                      <span>12 semester wardrobe</span>
                      <span>25 full club haul</span>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
                    <div className="bg-[#FBEFD9] p-4 rounded-2xl border border-[#2E1F16]/8 space-y-1 text-center">
                      <div className="text-xs font-bold text-[#2E1F16]/70 flex items-center justify-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#EFAE6E]" />
                        <span>Money Saved</span>
                      </div>
                      <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#2E1F16]">
                        ${moneySaved.toFixed(0)}
                      </div>
                      <div className="text-[10px] text-[#2E1F16]/60">vs retail mall prices</div>
                    </div>

                    <div className="bg-[#FBEFD9] p-4 rounded-2xl border border-[#2E1F16]/8 space-y-1 text-center">
                      <div className="text-xs font-bold text-[#2E1F16]/70 flex items-center justify-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-[#C1D7C2]" />
                        <span>Water Saved</span>
                      </div>
                      <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#2E1F16]">
                        {waterSaved.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#2E1F16]/60">gallons conserved</div>
                    </div>

                    <div className="bg-[#FBEFD9] p-4 rounded-2xl border border-[#2E1F16]/8 space-y-1 text-center">
                      <div className="text-xs font-bold text-[#2E1F16]/70 flex items-center justify-center gap-1">
                        <Leaf className="w-3.5 h-3.5 text-[#EFAE6E]" />
                        <span>CO₂ Prevented</span>
                      </div>
                      <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#2E1F16]">
                        {co2Prevented} lbs
                      </div>
                      <div className="text-[10px] text-[#2E1F16]/60">carbon diverted</div>
                    </div>

                    <div className="bg-[#FBEFD9] p-4 rounded-2xl border border-[#2E1F16]/8 space-y-1 text-center">
                      <div className="text-xs font-bold text-[#2E1F16]/70 flex items-center justify-center gap-1">
                        <Shirt className="w-3.5 h-3.5 text-[#F7E09A]" />
                        <span>Textile Kept</span>
                      </div>
                      <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#2E1F16]">
                        {(calculatorItems * 1.8).toFixed(1)} lbs
                      </div>
                      <div className="text-[10px] text-[#2E1F16]/60">out of Duval landfills</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 8: INTERACTIVE MAP VIEWPORT */}
            <section className="w-full bg-[#FBEFD9] py-14 sm:py-20 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block mb-1">
                      LOCAL GEOSPATIAL MAP
                    </span>
                    <h2 className="font-editorial text-3xl sm:text-5xl text-[#2E1F16]">
                      Interactive Duval <span className="font-editorial-italic text-[#EFAE6E]">Thrift Map</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#2E1F16]/70 mt-1">
                      Click any pin to inspect verified open fitting rooms, price notes, and driving routes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('map');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-clevr-outline text-xs px-4 py-2 shrink-0 self-start sm:self-auto"
                  >
                    <span>Open Full Map Screen</span>
                  </button>
                </div>

                <div className="rounded-3xl overflow-hidden border border-[#2E1F16]/15 shadow-md">
                  <ThriftMap
                    selectedSchool={selectedSchool}
                    stores={stores}
                    onSelectStore={handleOpenStoreDetail}
                    onClearSchool={handleClearSchool}
                    heightClassName="h-[460px] sm:h-[520px]"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 9: DUVAL STUDENT THRIFT REVIEWS */}
            <section className="w-full bg-[#FBEFD9] py-16 sm:py-24 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                    LOCAL STUDENT VOICES
                  </span>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-[#2E1F16]">
                    What Duval Students <span className="font-editorial-italic text-[#EFAE6E]">Are Finding</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#2E1F16]/70 max-w-md mx-auto">
                    Real reviews from high schoolers finding homecoming suits, denim jackets, and everyday styles.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Testimonial 1 */}
                  <div className="clevr-card p-6 bg-[#F7E09A]/30 border border-[#2E1F16]/10 flex flex-col justify-between space-y-6">
                    <p className="font-editorial-italic text-lg text-[#2E1F16] leading-snug">
                      “Found a complete navy two-piece wool suit for homecoming for literally $25 at St. Vincent de Paul. Huge win over renting!”
                    </p>
                    <div className="space-y-3">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBEFD9] border border-[#2E1F16]/10">
                        <MarcusAvatar className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-[#2E1F16]">Tung Tung Sahur</div>
                        <div className="text-[11px] text-[#2E1F16]/60">Duncan U. Fletcher High School · 12th Grade</div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="clevr-card p-6 bg-[#F7E09A]/30 border border-[#2E1F16]/10 flex flex-col justify-between space-y-6">
                    <p className="font-editorial-italic text-lg text-[#2E1F16] leading-snug">
                      “Our environmental club used ThriftFit to map City Thrift down Edgewood Ave. Outfitted 15 members for spirit week without buying fast fashion!”
                    </p>
                    <div className="space-y-3">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBEFD9] border border-[#2E1F16]/10">
                        <MayaAvatar className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-[#2E1F16]">Tralalelo Tralala</div>
                        <div className="text-[11px] text-[#2E1F16]/60">Riverside High School · Green Club Leader</div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="clevr-card p-6 bg-[#F7E09A]/30 border border-[#2E1F16]/10 flex flex-col justify-between space-y-6">
                    <p className="font-editorial-italic text-lg text-[#2E1F16] leading-snug">
                      “Being able to filter stores by verified open dressing rooms saved me from buying jeans that didn't fit. The distance calculator is super fast.”
                    </p>
                    <div className="space-y-3">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBEFD9] border border-[#2E1F16]/10">
                        <ElenaAvatar className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm text-[#2E1F16]">Skibidi Ohio</div>
                        <div className="text-[11px] text-[#2E1F16]/60">Stanton College Prep · Junior</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setCurrentView('reviews');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-clevr-brown text-xs px-6 py-2.5"
                  >
                    <span>Read All Reviews &amp; Submit Yours</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 10: STUDENT THRIFT GUIDE ACCORDION */}
            <section className="w-full bg-[#F7E09A]/20 py-16 sm:py-24 px-4 sm:px-8 border-b border-[#2E1F16]/10">
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block mb-1">
                    SMART SHOPPING ADVICE
                  </span>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-[#2E1F16] font-normal">
                    Student Thrifter's <br />
                    <span className="font-editorial-italic font-normal text-[#EFAE6E]">Field Guide</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column Tips (0, 1) */}
                  <div className="lg:col-span-4 space-y-4">
                    {thriftTipsList.slice(0, 2).map((tip, idx) => {
                      const isExpanded = expandedTip === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setExpandedTip(isExpanded ? -1 : idx)}
                          className="bg-[#FBEFD9] p-5 rounded-2xl border border-[#2E1F16]/15 cursor-pointer transition-all hover:bg-white"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-bold text-sm text-[#2E1F16]">
                              {tip.title}
                            </h4>
                            <span className="w-6 h-6 rounded-full bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shrink-0">
                              {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </span>
                          </div>
                          {isExpanded && (
                            <p className="text-xs text-[#2E1F16]/80 leading-relaxed mt-2 pt-2 border-t border-[#2E1F16]/10 animate-fade-in">
                              {tip.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Center Visual */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="w-56 sm:w-64 aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#FBEFD9]">
                      <FieldGuideVisual className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column Tips (2, 3) */}
                  <div className="lg:col-span-4 space-y-4">
                    {thriftTipsList.slice(2, 4).map((tip, idx) => {
                      const realIdx = idx + 2;
                      const isExpanded = expandedTip === realIdx;
                      return (
                        <div
                          key={realIdx}
                          onClick={() => setExpandedTip(isExpanded ? -1 : realIdx)}
                          className="bg-[#FBEFD9] p-5 rounded-2xl border border-[#2E1F16]/15 cursor-pointer transition-all hover:bg-white"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-bold text-sm text-[#2E1F16]">
                              {tip.title}
                            </h4>
                            <span className="w-6 h-6 rounded-full bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shrink-0">
                              {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </span>
                          </div>
                          {isExpanded && (
                            <p className="text-xs text-[#2E1F16]/80 leading-relaxed mt-2 pt-2 border-t border-[#2E1F16]/10 animate-fade-in">
                              {tip.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 11: STATEMENT BANNER */}
            <section className="w-full bg-[#2E1F16] py-20 sm:py-28 px-4 text-center">
              <div className="max-w-4xl mx-auto space-y-4">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#FBEFD9]/70 block">
                  JACKSONVILLE'S STUDENT SECONDHAND MOVEMENT
                </span>
                <h2 className="font-editorial-italic text-4xl sm:text-6xl lg:text-7xl text-[#EFAE6E] font-normal leading-tight">
                  Your Next Favorite Find Is Closer Than You Think.
                </h2>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setCurrentView('directory');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-clevr-clay text-sm"
                  >
                    <span>Explore All 12 Duval Stores</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: MAP VIEW */}
        {currentView === 'map' && (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#2E1F16]/10">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16] bg-[#C1D7C2]/50 px-2 py-0.5 rounded-full inline-block mb-2">
                  FULL COUNTY CARTOGRAPHY
                </span>
                <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-[#2E1F16]">
                  Duval Thrift <span className="font-editorial-italic text-[#EFAE6E]">Map</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#2E1F16]/70 mt-1 max-w-xl">
                  Explore verified secondhand clothing stores across Jacksonville and surrounding Duval neighborhoods.
                </p>
              </div>

              {/* Campus Selector */}
              <div className="clevr-card p-4 min-w-[280px] self-start md:self-auto bg-[#F7E09A]/30 border border-[#2E1F16]/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2E1F16]/60 block mb-1">
                  Reference High School:
                </span>
                <select
                  value={selectedSchool ? selectedSchool.id : ''}
                  onChange={e => {
                    const found = DUVAL_SCHOOLS.find(s => s.id === e.target.value);
                    if (found) handleSelectSchool(found);
                    else handleClearSchool();
                  }}
                  className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none cursor-pointer"
                >
                  <option value="">Select a high school...</option>
                  {DUVAL_SCHOOLS.map(sch => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="clevr-card overflow-hidden p-2 bg-[#F7E09A]/20 border border-[#2E1F16]/10">
              <ThriftMap
                selectedSchool={selectedSchool}
                stores={stores}
                onSelectStore={handleOpenStoreDetail}
                onClearSchool={handleClearSchool}
                heightClassName="h-[520px] sm:h-[640px]"
              />
            </div>

            {/* Store Grid */}
            <div className="clevr-card p-6 sm:p-8 bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-2xl text-[#2E1F16]">
                  {selectedSchool ? `Distance from ${selectedSchool.name}` : 'All Mapped Duval Stores'}
                </h3>
                <span className="text-xs font-semibold text-[#2E1F16]/70">
                  {stores.length} locations
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map(st => {
                  const dist = selectedSchool
                    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, st.lat, st.lng)
                    : null;
                  const isSaved = savedStores.includes(st.id);
                  const isCompared = compareStoreIds.includes(st.id);

                  return (
                    <div
                      key={st.id}
                      onClick={() => handleOpenStoreDetail(st)}
                      className="p-5 rounded-2xl bg-white border border-[#2E1F16]/10 hover:border-[#EFAE6E] cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-[#2E1F16]/70 mb-1">
                          <span className="font-bold text-[#2E1F16] uppercase bg-[#F7E09A]/50 px-2 py-0.5 rounded text-[10px]">{st.priceTier}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleToggleCompareStore(st.id, e)}
                              className={`p-1 rounded-full text-xs transition-colors ${
                                isCompared ? 'text-[#2E1F16] bg-[#F7E09A]' : 'text-[#2E1F16]/40 hover:text-[#2E1F16]'
                              }`}
                              title="Compare store"
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleToggleSaveStore(st.id, e)}
                              className="p-1 rounded-full text-xs"
                              title="Save store"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]/40'}`} />
                            </button>
                            {dist !== null && (
                              <span className="text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded text-[11px]">
                                {formatDistance(dist)}
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 className="font-editorial text-lg text-[#2E1F16] font-bold truncate">
                          {st.name}
                        </h4>
                        <p className="text-xs text-[#2E1F16]/60 truncate">
                          {st.address}
                        </p>
                      </div>
                      <span className="text-xs text-[#2E1F16] font-bold hover:text-[#EFAE6E] mt-4 flex items-center gap-1 transition-colors">
                        View Details →
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DIRECTORY VIEW */}
        {currentView === 'directory' && (
          <StoreDirectory
            stores={stores}
            selectedSchool={selectedSchool}
            onSelectStore={handleOpenStoreDetail}
            onQuickPeek={handleOpenQuickPeek}
            onSelectSchool={handleSelectSchool}
            allSchools={DUVAL_SCHOOLS}
            savedStores={savedStores}
            onToggleSave={handleToggleSaveStore}
            compareStoreIds={compareStoreIds}
            onToggleCompare={handleToggleCompareStore}
            onOpenCompare={() => setIsCompareModalOpen(true)}
          />
        )}

        {/* VIEW 4: STORE DETAIL VIEW */}
        {currentView === 'detail' && selectedStore && (
          <StoreDetail
            store={selectedStore}
            selectedSchool={selectedSchool}
            onBack={() => setCurrentView('home')}
            onViewOnMap={() => {
              setCurrentView('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddReview={handleAddStoreReview}
            onToast={showToast}
            isSaved={savedStores.includes(selectedStore.id)}
            onToggleSave={handleToggleSaveStore}
            isCompared={compareStoreIds.includes(selectedStore.id)}
            onToggleCompare={handleToggleCompareStore}
          />
        )}

        {/* VIEW 5: REVIEWS VIEW */}
        {currentView === 'reviews' && (
          <ReviewsView
            stores={stores}
            selectedSchool={selectedSchool}
            appFeedbackList={appFeedbackList}
            onAddStoreReview={handleAddStoreReview}
            onAddAppFeedback={handleAddAppFeedback}
            onSelectStore={handleOpenStoreDetail}
            onToast={showToast}
          />
        )}

        {/* VIEW 6: ABOUT VIEW */}
        {currentView === 'about' && (
          <AboutView
            onStartSearch={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                  searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 250);
            }}
            onExploreDirectory={() => {
              setCurrentView('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 3. FOOTER CONTAINER */}
      <footer className="w-full bg-[#2E1F16] px-4 sm:px-8 py-10 sm:py-16 pb-28 sm:pb-20 text-[#2E1F16]">
        <div className="max-w-7xl mx-auto bg-[#FBEFD9] rounded-3xl sm:rounded-[36px] p-8 sm:p-14 space-y-12 shadow-2xl border border-[#FBEFD9]/20">
          {/* Top Row: Newsletter + 4 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Student Discount Alerts Newsletter */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
                Student Thrift Alerts
              </h3>
              <p className="text-xs sm:text-sm text-[#2E1F16]/80 font-normal">
                Get weekly updates on Jacksonville tag sale days, 50% discount colors, and formalwear drops.
              </p>

              {newsletterSubmitted ? (
                <div className="p-3 bg-[#C1D7C2]/40 border border-[#C1D7C2] rounded-xl text-xs font-bold text-[#2E1F16] flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3] text-[#2E1F16]" />
                  <span>Welcome! You will receive thrift tag alerts in your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your school or personal email"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      className="w-full pb-2 pt-1 bg-transparent border-b border-[#2E1F16] text-sm text-[#2E1F16] placeholder-[#2E1F16]/50 focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#2E1F16] hover:bg-[#EFAE6E] hover:border-[#EFAE6E] flex items-center justify-center transition-colors cursor-pointer text-[#2E1F16]"
                      aria-label="Submit newsletter"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#2E1F16]/60 leading-relaxed">
                    Zero spam. Only student clothing tips and verified discount dates for Duval County shoppers.
                  </p>
                </form>
              )}
            </div>

            {/* Right: 4 Columns (Stores, Explore, Features, Connect) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-medium">
              <div className="space-y-3">
                <div className="font-bold text-sm text-[#2E1F16]">Stores</div>
                <ul className="space-y-2 text-[#2E1F16]/75">
                  <li><button onClick={() => setCurrentView('directory')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">All Stores</button></li>
                  <li><button onClick={() => setCurrentView('directory')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Fitting Rooms Open</button></li>
                  <li><button onClick={() => setCurrentView('directory')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Under $10 Steals</button></li>
                  <li><button onClick={() => setCurrentView('directory')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Prom &amp; Homecoming</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-sm text-[#2E1F16]">Explore</div>
                <ul className="space-y-2 text-[#2E1F16]/75">
                  <li><button onClick={() => setCurrentView('map')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Interactive Map</button></li>
                  <li><button onClick={() => setCurrentView('about')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">About Mission</button></li>
                  <li><button onClick={() => setCurrentView('reviews')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Student Reviews</button></li>
                  <li><button onClick={() => setIsVideoGuideOpen(true)} className="hover:text-[#EFAE6E] cursor-pointer transition-colors font-bold text-[#EFAE6E]">🎬 Video Script</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-sm text-[#2E1F16]">Features</div>
                <ul className="space-y-2 text-[#2E1F16]/75">
                  <li><button onClick={() => setIsCompareModalOpen(true)} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Compare Stores</button></li>
                  <li><button onClick={() => setIsFavoritesModalOpen(true)} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Saved Racks</button></li>
                  <li><button onClick={handleRandomStore} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Random Store</button></li>
                  <li><button onClick={() => setIsPhoneSimulatorMode(!isPhoneSimulatorMode)} className="hover:text-[#EFAE6E] cursor-pointer transition-colors font-bold">📱 {isPhoneSimulatorMode ? 'Exit Phone Mode' : 'Phone Simulator'}</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-sm text-[#2E1F16]">Admin &amp; District</div>
                <ul className="space-y-2 text-[#2E1F16]/75">
                  <li><button onClick={() => setIsAdminModalOpen(true)} className="hover:text-[#EFAE6E] cursor-pointer transition-colors font-bold text-[#2E1F16]">🛡️ District Admin Portal</button></li>
                  <li><button onClick={() => showToast('Shared ThriftFit DuvALL link!')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Share With Friends</button></li>
                  <li><button onClick={() => showToast('Student club partnerships welcome!')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">High School Clubs</button></li>
                  <li><button onClick={() => showToast('Donations support local Duval families')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Donation Guide</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Colossal Brand Wordmark */}
          <div className="pt-8 flex justify-end">
            <ThriftLogo variant="giant" />
          </div>

          {/* Bottom Copyright and Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#2E1F16]/60 pt-6 border-t border-[#2E1F16]/10 gap-2 font-normal">
            <div>
              © 2026 ThriftFit DuvALL · Duval County Student Secondhand &amp; Sustainable Fashion Network
            </div>
            <div className="flex items-center gap-4">
              <span onClick={() => setCurrentView('about')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">About Mission</span>
              <span>·</span>
              <span onClick={() => setCurrentView('reviews')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Student Feedback</span>
              <span>·</span>
              <span onClick={() => setIsAdminModalOpen(true)} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Teacher Portal</span>
              <span>·</span>
              <span onClick={() => setCurrentView('map')} className="hover:text-[#EFAE6E] cursor-pointer transition-colors">Duval Cartography</span>
            </div>
          </div>
        </div>
      </footer>

        {/* iOS Home Indicator Bar when in simulator mode */}
        {isPhoneSimulatorMode && (
          <div className="w-full py-2.5 bg-[#2E1F16] flex justify-center shrink-0">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM DOCK */}
      <MobileBottomDock
        currentView={currentView}
        onChangeView={view => {
          setCurrentView(view as ViewMode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
