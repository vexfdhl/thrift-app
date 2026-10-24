import React, { useState, useEffect, useRef } from 'react';
import { ThriftStoreItem, INITIAL_THRIFT_STORES, ReviewItem } from './data/thriftStores';
import { SchoolItem, DUVAL_SCHOOLS } from './data/schools';
import {
  subscribeToStores,
  subscribeToReviews,
  submitReviewToFirestore,
  seedInitialStoresToFirestore
} from './services/firestoreService';
import {
  getSavedStoreIds,
  saveStoreIds,
  getCompareStoreIds,
  saveCompareStoreIds,
  getStoredSchoolId,
  saveStoredSchoolId
} from './utils/storage';
import { calculateDistanceMiles, formatDistance } from './utils/distance';

import { ThriftLogo } from './components/ThriftLogo';
import { ThriftMap } from './components/ThriftMap';
import { StoreDirectory } from './components/StoreDirectory';
import { StoreDetail } from './components/StoreDetail';
import { InteractiveFitFinder } from './components/InteractiveFitFinder';
import { CampusSwitcherBar } from './components/CampusSwitcherBar';
import { MobileBottomDock } from './components/MobileBottomDock';
import { IOSStatusBar } from './components/IOSStatusBar';
import { HeroThriftShowcase } from './components/HeroThriftShowcase';

import { CompareModal } from './components/CompareModal';
import { FavoritesModal } from './components/FavoritesModal';
import { QuickPeekModal } from './components/QuickPeekModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { VideoGuideModal } from './components/VideoGuideModal';

import {
  Search,
  MapPin,
  Heart,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video as VideoIcon,
  Smartphone,
  Shuffle,
  Menu,
  X,
  Check,
  Droplets,
  DollarSign,
  Leaf,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

type ViewMode = 'home' | 'directory' | 'map' | 'reviews' | 'about' | 'detail';

export default function App() {
  // Always initialize with all 15 authentic Duval stores
  const [stores, setStores] = useState<ThriftStoreItem[]>(INITIAL_THRIFT_STORES);
  const [allFirestoreReviews, setAllFirestoreReviews] = useState<
    (ReviewItem & { storeId: string; status?: 'approved' | 'hidden' | 'pending' })[]
  >([]);

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);
  const [activeStoreDetail, setActiveStoreDetail] = useState<ThriftStoreItem | null>(null);
  const [quickPeekStore, setQuickPeekStore] = useState<ThriftStoreItem | null>(null);

  // Modals
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isQuickPeekOpen, setIsQuickPeekOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isVideoGuideOpen, setIsVideoGuideOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Phone Simulator state
  const [isPhoneSimulatorMode, setIsPhoneSimulatorMode] = useState(false);

  // User Racks & Compare IDs
  const [savedStores, setSavedStores] = useState<string[]>([]);
  const [compareStoreIds, setCompareStoreIds] = useState<string[]>([]);

  // Radius slider
  const [maxRadius, setMaxRadius] = useState<number>(30);

  // Campus search autocomplete
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  // Impact lab calculator
  const [calculatorItems, setCalculatorItems] = useState(6);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Unified scroll helper for window and phone simulator container
  const scrollToTop = () => {
    if (isPhoneSimulatorMode) {
      const scrollElem = document.querySelector('.phone-simulator-scroll');
      if (scrollElem) scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load local preferences on mount
  useEffect(() => {
    setSavedStores(getSavedStoreIds());
    setCompareStoreIds(getCompareStoreIds());

    const savedSchoolId = getStoredSchoolId();
    if (savedSchoolId) {
      const match = DUVAL_SCHOOLS.find(s => s.id === savedSchoolId);
      if (match) setSelectedSchool(match);
    } else {
      // Default to Riverside High School
      setSelectedSchool(DUVAL_SCHOOLS[0]);
    }
  }, []);

  // Subscribe to real-time stores from Firestore
  useEffect(() => {
    const unsubStores = subscribeToStores(updatedStores => {
      // Filter out explicitly unpublished stores for public users
      const published = updatedStores.filter(s => s.isPublished !== false);
      setStores(published.length > 0 ? published : INITIAL_THRIFT_STORES);
    });

    const unsubReviews = subscribeToReviews(reviews => {
      setAllFirestoreReviews(reviews);
    });

    return () => {
      unsubStores();
      unsubReviews();
    };
  }, []);

  // Save changes to localStorage
  const handleToggleSaveStore = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedStores(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveStoreIds(next);
      showToast(next.includes(id) ? 'Saved to Your Thrift Racks' : 'Removed from Saved Racks');
      return next;
    });
  };

  const handleToggleCompareStore = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareStoreIds(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
        showToast('Removed from comparison');
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 stores at once.');
          return prev;
        }
        next = [...prev, id];
        showToast(`Added to compare (${next.length}/4)`);
      }
      saveCompareStoreIds(next);
      return next;
    });
  };

  const handleSelectSchool = (school: SchoolItem) => {
    setSelectedSchool(school);
    saveStoredSchoolId(school.id);
    setSchoolSearchQuery('');
    setIsAutocompleteOpen(false);
    showToast(`Campus set to ${school.name}`);
  };

  const handleClearSchool = () => {
    setSelectedSchool(null);
    saveStoredSchoolId(null);
    showToast('Campus filter cleared (showing all Jacksonville distances)');
  };

  const handleOpenStoreDetail = (store: ThriftStoreItem) => {
    setActiveStoreDetail(store);
    setCurrentView('detail');
    scrollToTop();
  };

  const handleQuickPeek = (store: ThriftStoreItem) => {
    setQuickPeekStore(store);
    setIsQuickPeekOpen(true);
  };

  const handleRandomStore = () => {
    if (stores.length === 0) return;
    const random = stores[Math.floor(Math.random() * stores.length)];
    handleOpenStoreDetail(random);
    showToast(`Surprise pick: ${random.name}!`);
  };

  const handleAddReview = async (storeId: string, review: ReviewItem) => {
    try {
      await submitReviewToFirestore(storeId, review);
      showToast('Thank you! Review saved to database.');
    } catch {
      showToast('Saved review locally.');
    }
  };

  const filteredSchools = DUVAL_SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isPhoneSimulatorMode ? 'bg-[#18110D] py-3 sm:py-6 px-2 flex flex-col items-center justify-center overflow-x-hidden' : 'bg-[#FBEFD9] flex flex-col'} text-[#2E1F16] font-['Nunito',sans-serif]`}>
      {/* Phone Simulator Floating Control Banner */}
      {isPhoneSimulatorMode && (
        <div className="max-w-[412px] mx-auto mb-2 bg-[#2E1F16] text-[#FBEFD9] px-4 py-2 rounded-2xl flex items-center justify-between shadow-xl border border-[#EFAE6E]/50 text-xs w-full shrink-0">
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
      <div className={isPhoneSimulatorMode ? 'phone-simulator-frame' : 'w-full flex flex-col flex-1'}>
        {isPhoneSimulatorMode && (
          <IOSStatusBar
            islandText="ThriftFit DuvALL"
            onIslandClick={() => showToast('ThriftFit Dynamic Island · FL-04')}
          />
        )}

        {/* Scrollable screen view inside phone */}
        <div className={isPhoneSimulatorMode ? 'phone-simulator-scroll' : 'flex-1 w-full flex flex-col'}>
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
            onRemoveFromCompare={id => handleToggleCompareStore(id)}
            onClearCompare={() => {
              setCompareStoreIds([]);
              saveCompareStoreIds([]);
              showToast('Comparison cleared');
            }}
            onSelectStore={handleOpenStoreDetail}
          />

          {/* Favorites Modal */}
          <FavoritesModal
            isOpen={isFavoritesModalOpen}
            onClose={() => setIsFavoritesModalOpen(false)}
            savedStoreIds={savedStores}
            stores={stores}
            selectedSchool={selectedSchool}
            onToggleSave={id => handleToggleSaveStore(id)}
            onSelectStore={handleOpenStoreDetail}
            onToggleCompare={id => handleToggleCompareStore(id)}
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
            onToggleSave={id => handleToggleSaveStore(id)}
            isCompared={quickPeekStore ? compareStoreIds.includes(quickPeekStore.id) : false}
            onToggleCompare={id => handleToggleCompareStore(id)}
          />

          {/* Admin Portal Modal */}
          <AdminPortalModal
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            stores={stores}
            allReviews={allFirestoreReviews}
            onToast={showToast}
          />

          {/* Video Guide Modal */}
          <VideoGuideModal
            isOpen={isVideoGuideOpen}
            onClose={() => setIsVideoGuideOpen(false)}
            onToast={showToast}
          />

          {/* 1. TOP ANNOUNCEMENT BAR */}
          <div className="w-full bg-[#2E1F16] text-[#FBEFD9] text-[11px] sm:text-xs py-2 px-4 border-b border-[#2E1F16] flex items-center justify-between">
            <button
              onClick={() => showToast('Student discounts verified across 15 Jacksonville thrift stores')}
              className="text-[#FBEFD9]/70 hover:text-[#EFAE6E] cursor-pointer transition-colors"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 font-medium tracking-wide text-center truncate">
              <span className="font-bold text-[#EFAE6E]">Thrift More. Waste Less:</span>
              <span className="truncate">
                Connecting 24 Duval High Schools to 15 verified secondhand racks &amp; open dressing rooms!
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

          {/* 2. MAIN HEADER */}
          <header className="w-full bg-[#FBEFD9]/95 backdrop-blur-md border-b border-[#2E1F16]/10 sticky top-0 z-30 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
              {/* Zone 1: Wordmark */}
              <div
                onClick={() => {
                  setCurrentView('home');
                  scrollToTop();
                }}
                className="cursor-pointer shrink-0"
              >
                <ThriftLogo variant="compact" />
              </div>

              {/* Zone 2: Navigation Links */}
              <nav className={`${isPhoneSimulatorMode ? 'hidden' : 'hidden md:flex'} items-center gap-1 lg:gap-1.5`}>
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
                        scrollToTop();
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
                {!isPhoneSimulatorMode && (
                  <button
                    onClick={() => {
                      setIsPhoneSimulatorMode(true);
                      showToast('📱 Switched to Phone Simulator View');
                    }}
                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full border transition-all cursor-pointer bg-[#C1D7C2]/50 hover:bg-[#C1D7C2] text-[#2E1F16] border-[#2E1F16]/15"
                    title="Toggle iPhone Phone Simulator"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Phone View</span>
                  </button>
                )}

                {/* Admin Portal Button */}
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className={`${isPhoneSimulatorMode ? 'hidden' : 'hidden lg:flex'} items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#F7E09A]/50 hover:bg-[#F7E09A] px-2.5 py-1.5 rounded-full border border-[#2E1F16]/15 transition-colors cursor-pointer`}
                  title="Teacher & District Admin Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E1F16]" />
                  <span>Admin</span>
                </button>

                {/* Video Script Guide Button */}
                <button
                  onClick={() => setIsVideoGuideOpen(true)}
                  className={`${isPhoneSimulatorMode ? 'hidden' : 'hidden xl:flex'} items-center gap-1.5 text-xs font-bold text-[#2E1F16] bg-[#EFAE6E]/30 hover:bg-[#EFAE6E]/60 px-2.5 py-1.5 rounded-full border border-[#2E1F16]/15 transition-colors cursor-pointer`}
                  title="Presentation Guide"
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
                  <span className={isPhoneSimulatorMode ? 'hidden' : 'hidden sm:inline'}>Compare</span>
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
                  <span className={isPhoneSimulatorMode ? 'hidden' : 'hidden sm:inline'}>Saved</span>
                  <span className="w-4 h-4 rounded-full bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center text-[10px] font-bold">
                    {savedStores.length}
                  </span>
                </button>

                {/* Surprise Me Button */}
                <button
                  onClick={handleRandomStore}
                  className={`${isPhoneSimulatorMode ? 'hidden' : 'hidden 2xl:flex'} items-center gap-1.5 text-xs font-bold text-[#2E1F16]/80 hover:text-[#2E1F16] px-2.5 py-1.5 rounded-full hover:bg-[#F7E09A]/40 cursor-pointer transition-colors`}
                  title="Pick a random store"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Surprise</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`${isPhoneSimulatorMode ? 'flex' : 'md:hidden'} w-8 h-8 rounded-full border border-[#2E1F16]/15 bg-[#FBEFD9] flex items-center justify-center text-[#2E1F16] cursor-pointer`}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-[#2E1F16]" />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Navigation */}
            {isMobileMenuOpen && (
              <div className={`${isPhoneSimulatorMode ? 'block' : 'md:hidden'} bg-[#FBEFD9] border-b border-[#2E1F16]/15 p-4 space-y-2 animate-fade-in text-sm font-semibold text-[#2E1F16] shadow-md`}>
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
                      setIsAdminModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F7E09A]/40 text-[#2E1F16] font-bold flex items-center gap-2 text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2E1F16]" />
                    <span>Teacher &amp; District Admin Portal</span>
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* MAIN VIEW CONTROLLER */}
          <main className="flex-1 w-full pb-20 md:pb-0">
            {/* VIEW 1: HOME VIEW */}
            {currentView === 'home' && (
              <div className="w-full">
                {/* SECTION 1: HERO SECTION */}
                <section className={`w-full bg-[#FBEFD9] ${isPhoneSimulatorMode ? 'py-6 px-4' : 'py-12 sm:py-20 px-4 sm:px-8'} border-b border-[#2E1F16]/10`}>
                  <div className={isPhoneSimulatorMode ? 'w-full space-y-5 text-center' : 'max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'}>
                    {/* Hero Left Content */}
                    <div className={`${isPhoneSimulatorMode ? 'space-y-4' : 'lg:col-span-5 space-y-5 text-center lg:text-left'}`}>
                      <div className="inline-block">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#2E1F16]/70 block">
                          DUVAL COUNTY STUDENT FASHION NETWORK · EST. 2026
                        </span>
                      </div>

                      <h1 className={`font-editorial ${isPhoneSimulatorMode ? 'text-4xl' : 'text-5xl sm:text-7xl lg:text-8xl'} text-[#2E1F16] font-normal tracking-normal leading-[1.08]`}>
                        Find Your <br />
                        <span className="font-editorial-italic font-normal text-[#EFAE6E]">Fit.</span>
                      </h1>

                      <p className="text-[#2E1F16]/85 text-xs sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
                        Your next favorite find is closer than you think. Discover {stores.length} student-verified thrift stores across Jacksonville with accurate campus driving distances, verified dressing rooms, and sustainable secondhand styles.
                      </p>

                      <div className={`pt-2 flex flex-col sm:flex-row items-center justify-center ${isPhoneSimulatorMode ? '' : 'lg:justify-start'} gap-2.5 sm:gap-3`}>
                        <button
                          onClick={() => {
                            if (searchInputRef.current) {
                              searchInputRef.current.focus();
                              searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="btn-clevr-brown text-xs sm:text-sm w-full sm:w-auto justify-center"
                        >
                          <span>Find Stores Near My School</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentView('directory');
                            scrollToTop();
                          }}
                          className="btn-clevr-outline text-xs sm:text-sm w-full sm:w-auto justify-center"
                        >
                          <span>Browse All Stores ({stores.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* Hero Right Visual Showcase */}
                    <div className={`${isPhoneSimulatorMode ? 'w-full' : 'lg:col-span-7'} relative flex justify-center items-center pt-2`}>
                      <div className="relative w-full max-w-lg aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-[#F7E09A]/30">
                        <HeroThriftShowcase className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F16]/40 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-[#FBEFD9]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-[#2E1F16]/10 shadow-lg flex items-center justify-between">
                          <div>
                            <div className="text-[11px] sm:text-xs font-bold text-[#2E1F16]">
                              Duval County Thrift Network
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#2E1F16]/70 truncate max-w-[190px] sm:max-w-none">
                              {stores.length} verified stores · 24 campus routes
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#2E1F16] bg-[#C1D7C2] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
                            100% Free
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 rotate-6 z-10">
                          <div className="bg-[#EFAE6E] text-[#2E1F16] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-lg border border-[#2E1F16]/20 flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2E1F16]" />
                            <span>Save 70–90%</span>
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
                  onRadiusChange={r => {
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

                {/* DUVAL MAP SECTION ON HOME */}
                <section className="w-full bg-[#FBEFD9] py-10 px-4 sm:px-8 border-b border-[#2E1F16]/10">
                  <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                          INTERACTIVE DUVAL CARTOGRAPHY
                        </span>
                        <h2 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16]">
                          Jacksonville Thrift Map ({stores.length} Locations)
                        </h2>
                        <p className="text-xs text-[#2E1F16]/70 mt-0.5">
                          Click any thrift pin to preview pricing, driving distance, and verified dressing room availability.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView('map');
                          scrollToTop();
                        }}
                        className="btn-clevr-brown text-xs py-2 px-4 self-start sm:self-auto cursor-pointer"
                      >
                        <span>Full Screen Map</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ThriftMap
                      selectedSchool={selectedSchool}
                      stores={stores}
                      onSelectStore={handleOpenStoreDetail}
                      onClearSchool={handleClearSchool}
                      heightClassName={isPhoneSimulatorMode ? 'h-[360px]' : 'h-[460px] sm:h-[520px]'}
                    />
                  </div>
                </section>

                {/* SECTION 2: AESTHETIC & VIBE FINDER */}
                <InteractiveFitFinder
                  stores={stores}
                  selectedSchool={selectedSchool}
                  onSelectStore={handleOpenStoreDetail}
                  onQuickPeek={handleQuickPeek}
                  onToggleSave={id => handleToggleSaveStore(id)}
                  savedStores={savedStores}
                  onToggleCompare={id => handleToggleCompareStore(id)}
                  compareStoreIds={compareStoreIds}
                />

                {/* SECTION 3: DUVAL HIGH SCHOOL AUTOCOMPLETE SEARCH */}
                <section className="w-full bg-[#F7E09A]/20 py-10 px-4 sm:px-8 border-b border-[#2E1F16]/10">
                  <div className="max-w-4xl mx-auto space-y-4" ref={autocompleteContainerRef}>
                    <div className="text-center space-y-1">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                        CAMPUS DISTANCE CALCULATOR
                      </span>
                      <h2 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16]">
                        Find Thrift Stores Near <span className="font-editorial-italic text-[#EFAE6E]">Your School</span>
                      </h2>
                    </div>

                    <div className="relative">
                      <Search className="w-4 h-4 text-[#2E1F16]/40 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Type your high school (Riverside, Stanton, Fletcher, Atlantic Coast, Paxon, Wolfson)..."
                        value={schoolSearchQuery}
                        onChange={e => {
                          setSchoolSearchQuery(e.target.value);
                          setIsAutocompleteOpen(true);
                        }}
                        onFocus={() => setIsAutocompleteOpen(true)}
                        className="w-full pl-11 pr-10 py-3 bg-white border border-[#2E1F16]/15 rounded-2xl text-xs sm:text-sm font-semibold text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E] shadow-xs"
                      />
                      {schoolSearchQuery && (
                        <button
                          onClick={() => {
                            setSchoolSearchQuery('');
                            setIsAutocompleteOpen(false);
                          }}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2E1F16]/40 hover:text-[#2E1F16]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {isAutocompleteOpen && filteredSchools.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#2E1F16]/15 shadow-xl max-h-60 overflow-y-auto z-40 p-2 space-y-1">
                          {filteredSchools.map(sch => (
                            <button
                              key={sch.id}
                              onClick={() => handleSelectSchool(sch)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBEFD9] text-xs font-semibold flex items-center justify-between"
                            >
                              <span>{sch.name}</span>
                              <span className="text-[10px] text-[#2E1F16]/50">{sch.mascot}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* VIEW 2: DIRECTORY */}
            {currentView === 'directory' && (
              <StoreDirectory
                stores={stores}
                selectedSchool={selectedSchool}
                onSelectStore={handleOpenStoreDetail}
                onQuickPeek={handleQuickPeek}
                onSelectSchool={handleSelectSchool}
                allSchools={DUVAL_SCHOOLS}
                savedStores={savedStores}
                onToggleSave={id => handleToggleSaveStore(id)}
                compareStoreIds={compareStoreIds}
                onToggleCompare={id => handleToggleCompareStore(id)}
                onOpenCompare={() => setIsCompareModalOpen(true)}
              />
            )}

            {/* VIEW 3: FULL SCREEN MAP */}
            {currentView === 'map' && (
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-editorial text-3xl text-[#2E1F16]">
                      Duval County Cartography ({stores.length} Stores)
                    </h2>
                    <p className="text-xs text-[#2E1F16]/70">
                      All {stores.length} thrift stores mapped across Jacksonville. Click any store to preview details.
                    </p>
                  </div>
                </div>

                <ThriftMap
                  selectedSchool={selectedSchool}
                  stores={stores}
                  onSelectStore={handleOpenStoreDetail}
                  onClearSchool={handleClearSchool}
                  heightClassName="h-[600px] sm:h-[700px]"
                />
              </div>
            )}

            {/* VIEW 4: STORE DETAIL */}
            {currentView === 'detail' && activeStoreDetail && (
              <StoreDetail
                store={activeStoreDetail}
                selectedSchool={selectedSchool}
                onBack={() => {
                  setCurrentView('directory');
                  scrollToTop();
                }}
                onViewOnMap={() => {
                  setCurrentView('map');
                  scrollToTop();
                }}
                onAddReview={handleAddReview}
                onToast={showToast}
                isSaved={savedStores.includes(activeStoreDetail.id)}
                onToggleSave={id => handleToggleSaveStore(id)}
                isCompared={compareStoreIds.includes(activeStoreDetail.id)}
                onToggleCompare={id => handleToggleCompareStore(id)}
              />
            )}

            {/* VIEW 5: REVIEWS */}
            {currentView === 'reviews' && (
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
                    Student Reviews &amp; Thrifting Tips
                  </h2>
                  <p className="text-xs text-[#2E1F16]/70">
                    Verified tips from high school shoppers across Jacksonville.
                  </p>
                </div>

                <div className="space-y-4">
                  {stores.flatMap(s => s.reviews.map(r => ({ ...r, storeName: s.name, storeId: s.id }))).map(rev => (
                    <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#2E1F16]/12 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#2E1F16]">{rev.author}</span>
                          {rev.school && <span className="text-[#2E1F16]/60"> ({rev.school})</span>}
                          <span className="text-[#2E1F16]/40 ml-1">reviewed <strong>{rev.storeName}</strong></span>
                        </div>
                        <span className="text-[10px] bg-[#EFAE6E] text-[#2E1F16] px-2 py-0.5 rounded font-black">
                          ★ {rev.rating} / 5
                        </span>
                      </div>
                      <p className="text-xs text-[#2E1F16]/85 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 6: ABOUT MISSION */}
            {currentView === 'about' && (
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-6 text-xs sm:text-sm leading-relaxed">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]/70 block">
                    OUR SUSTAINABILITY CHARTER
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
                    ThriftFit DuvALL Initiative
                  </h2>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2E1F16]/12 space-y-4">
                  <p>
                    ThriftFit DuvALL was built for the 130,000 students of Duval County Public Schools. Fast fashion contributes over 85% of synthetic textile pollution to municipal landfills, while consuming 700 gallons of clean water per cotton T-shirt.
                  </p>
                  <p>
                    By connecting student shoppers to verified secondhand racks with open dressing stalls, transparent color tag calendars, and campus driving routes, ThriftFit empowers high schoolers to curate one-of-a-kind vintage wardrobes while protecting Florida’s waterways.
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* FOOTER */}
          <footer className="w-full bg-[#F7E09A]/30 border-t border-[#2E1F16]/10 py-10 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#2E1F16]/70">
              <div>
                <ThriftLogo variant="compact" />
                <p className="mt-2 text-[11px] text-[#2E1F16]/60">
                  Connecting 24 Duval County High Schools to {stores.length} verified secondhand stores.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <button onClick={() => { setCurrentView('home'); scrollToTop(); }} className="hover:text-[#EFAE6E]">Discover</button>
                <button onClick={() => { setCurrentView('directory'); scrollToTop(); }} className="hover:text-[#EFAE6E]">Directory ({stores.length})</button>
                <button onClick={() => { setCurrentView('map'); scrollToTop(); }} className="hover:text-[#EFAE6E]">Duval Map</button>
                <button onClick={() => setIsAdminModalOpen(true)} className="hover:text-[#EFAE6E] font-bold text-[#2E1F16]">Admin Portal</button>
                <button onClick={() => setIsVideoGuideOpen(true)} className="hover:text-[#EFAE6E]">Video Script</button>
              </div>
            </div>
          </footer>
        </div>

        {/* When in simulator mode, dock and home indicator sit pinned inside the phone frame */}
        {isPhoneSimulatorMode && (
          <div className="shrink-0 w-full bg-[#FBEFD9] border-t border-[#2E1F16]/10 z-40">
            <MobileBottomDock
              currentView={currentView}
              isSimulator={true}
              onChangeView={view => {
                setCurrentView(view as ViewMode);
                const scrollElem = document.querySelector('.phone-simulator-scroll');
                if (scrollElem) scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <div className="w-full py-2 bg-[#FBEFD9] flex justify-center">
              <div className="w-28 h-1 bg-[#2E1F16]/30 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM DOCK (For native mobile screens) */}
      {!isPhoneSimulatorMode && (
        <MobileBottomDock
          currentView={currentView}
          onChangeView={view => {
            setCurrentView(view as ViewMode);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
