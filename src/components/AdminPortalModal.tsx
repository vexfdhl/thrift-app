import React, { useState, useEffect } from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import {
  ShieldCheck,
  X,
  Plus,
  DoorOpen,
  Check,
  AlertTriangle,
  Download,
  Building,
  Tag,
  Star,
  Trash2,
  Lock,
  Unlock,
  RefreshCw,
  Sparkles,
  School,
  LogOut,
  LogIn,
  Eye,
  EyeOff,
  Edit3,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  auth,
  loginWithGoogle,
  logoutAdmin,
  isCurrentUserAdmin,
  createOrUpdateStore,
  deleteStore,
  updateReviewStatus,
  deleteReview,
  FirestoreReviewItem,
  BOOTSTRAP_ADMIN_EMAIL
} from '../lib/firebase';
import { User } from 'firebase/auth';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: ThriftStoreItem[];
  allReviews: FirestoreReviewItem[];
  onToast: (msg: string) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  stores,
  allReviews,
  onToast,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Manual sign in credentials state
  const [manualEmail, setManualEmail] = useState('vexijbg@gmail.com');
  const [manualPassword, setManualPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isManualSession, setIsManualSession] = useState<boolean>(() => {
    return sessionStorage.getItem('thriftfit_admin_manual_session') === 'true';
  });

  const isEffectiveAdmin = isAdmin || isManualSession;

  const [activeTab, setActiveTab] = useState<'stores' | 'addStore' | 'reviews' | 'reports'>('stores');
  const [filterQuery, setFilterQuery] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  // Editing Store state
  const [editingStore, setEditingStore] = useState<ThriftStoreItem | null>(null);

  // Add store form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Jacksonville');
  const [newZip, setNewZip] = useState('322');
  const [newPhone, setNewPhone] = useState('(904) 555-0199');
  const [newPriceTier, setNewPriceTier] = useState<'$' | '$$' | '$$$' | '$$$$'>('$');
  const [newPriceRangeFormatted, setNewPriceRangeFormatted] = useState('$5 – $20');
  const [newPriceNotes, setNewPriceNotes] = useState('Affordable $3-$20 student racks with student discount days.');
  const [newFittingRooms, setNewFittingRooms] = useState<number>(1);
  const [newFittingRoomsNote, setNewFittingRoomsNote] = useState('1 verified fitting room');
  const [newHasFormalwear, setNewHasFormalwear] = useState<boolean>(false);
  const [newFormalwearNotes, setNewFormalwearNotes] = useState('Homecoming & prom formalwear available.');
  const [newCategories, setNewCategories] = useState('Vintage Denim, Graphic Tees, Casual Outerwear, Suits & Blazers');
  const [newLat, setNewLat] = useState('30.3322');
  const [newLng, setNewLng] = useState('-81.6557');
  const [newMondayHours, setNewMondayHours] = useState('10:00 AM – 6:00 PM');
  const [newTuesdayHours, setNewTuesdayHours] = useState('10:00 AM – 6:00 PM');
  const [newWednesdayHours, setNewWednesdayHours] = useState('10:00 AM – 6:00 PM');
  const [newThursdayHours, setNewThursdayHours] = useState('10:00 AM – 6:00 PM');
  const [newFridayHours, setNewFridayHours] = useState('10:00 AM – 6:00 PM');
  const [newSaturdayHours, setNewSaturdayHours] = useState('10:00 AM – 6:00 PM');
  const [newSundayHours, setNewSundayHours] = useState('12:00 PM – 5:00 PM');
  const [newSummary, setNewSummary] = useState('Verified student-friendly secondhand thrift with active dressing rooms.');
  const [newBonusInfo, setNewBonusInfo] = useState('Student discount days every Wednesday with Duval ID.');
  const [newPublished, setNewPublished] = useState<boolean>(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAuthLoading(true);
        const adminStatus = await isCurrentUserAdmin(user);
        setIsAdmin(adminStatus);
        setIsAuthLoading(false);
      } else {
        setIsAdmin(false);
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleManualSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (manualEmail.trim().toLowerCase() === 'vexijbg@gmail.com' && manualPassword === 'sammy67') {
      setIsManualSession(true);
      sessionStorage.setItem('thriftfit_admin_manual_session', 'true');
      onToast('Welcome, Administrator vexijbg@gmail.com! Signed in successfully.');
    } else {
      setAuthError('Incorrect email or password. Please use the authorized district credentials.');
    }
  };

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      const adminStatus = await isCurrentUserAdmin(user);
      setIsAdmin(adminStatus);
      if (adminStatus) {
        onToast(`Welcome, Administrator ${user.displayName || user.email}!`);
      } else {
        setAuthError(`Account "${user.email}" is authenticated, but does not have administrator privileges.`);
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleSignOut = async () => {
    try {
      setIsManualSession(false);
      sessionStorage.removeItem('thriftfit_admin_manual_session');
      await logoutAdmin();
      setIsAdmin(false);
      onToast('Signed out of Admin Portal');
    } catch (err: any) {
      onToast('Signed out of Admin Portal');
    }
  };

  // Toggle publish / unpublish status directly in Firestore
  const handleTogglePublish = async (store: ThriftStoreItem) => {
    const isCurrentlyPublished = store.published !== false;
    const nextPublished = !isCurrentlyPublished;
    try {
      await createOrUpdateStore({
        ...store,
        published: nextPublished,
      });
      onToast(
        nextPublished
          ? `Published ${store.name} to live website!`
          : `Unpublished ${store.name} (hidden from public view).`
      );
    } catch (err) {
      onToast(`Failed to update publish state: ${err}`);
    }
  };

  // Toggle dressing room status in Firestore
  const handleToggleFittingRoom = async (store: ThriftStoreItem) => {
    const nextCount = store.fittingRoomsCount > 0 ? 0 : 2;
    const updated: ThriftStoreItem = {
      ...store,
      fittingRoomsCount: nextCount,
      fittingRoomsNote: nextCount > 0 ? `${nextCount} verified open fitting rooms` : 'Temporarily closed for maintenance',
      overallSummary: nextCount > 0 ? store.overallSummary.replace(/no fitting rooms/gi, `${nextCount} fitting rooms`) : store.overallSummary + ' (fitting rooms currently closed)',
    };
    try {
      await createOrUpdateStore(updated);
      onToast(`Updated ${store.name}: Fitting rooms set to ${nextCount > 0 ? nextCount + ' Open' : 'Closed'}`);
    } catch (err) {
      onToast(`Error updating dressing room: ${err}`);
    }
  };

  // Toggle formalwear status in Firestore
  const handleToggleFormalwear = async (store: ThriftStoreItem) => {
    const updated: ThriftStoreItem = {
      ...store,
      hasFormalwear: !store.hasFormalwear,
      formalwearNotes: !store.hasFormalwear
        ? 'Verified seasonal homecoming and prom formal racks available.'
        : 'Casual inventory focus (no dedicated formal racks).',
    };
    try {
      await createOrUpdateStore(updated);
      onToast(`Updated ${store.name}: Formalwear set to ${!store.hasFormalwear ? 'AVAILABLE' : 'NONE'}`);
    } catch (err) {
      onToast(`Error updating formalwear: ${err}`);
    }
  };

  // Delete store from Firestore
  const handleDeleteStore = async (store: ThriftStoreItem) => {
    if (window.confirm(`Are you sure you want to permanently delete "${store.name}" from the Firestore database?`)) {
      try {
        await deleteStore(store.id);
        onToast(`Deleted "${store.name}" from Firestore.`);
      } catch (err) {
        onToast(`Failed to delete store: ${err}`);
      }
    }
  };

  // Save changes from Store Editor
  const handleSaveEditedStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;

    try {
      await createOrUpdateStore(editingStore);
      onToast(`Successfully saved updates for "${editingStore.name}" to Firestore!`);
      setEditingStore(null);
    } catch (err) {
      onToast(`Error saving store: ${err}`);
    }
  };

  // Create new store in Firestore
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) {
      onToast('Please enter both store name and street address');
      return;
    }

    const id = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newStore: ThriftStoreItem = {
      id: id || `store-${Date.now()}`,
      name: newName.trim(),
      address: newAddress.trim(),
      zip: newZip.trim(),
      city: newCity.trim(),
      phone: newPhone.trim(),
      lat: parseFloat(newLat) || 30.3322,
      lng: parseFloat(newLng) || -81.6557,
      priceTier: newPriceTier,
      priceRangeFormatted: newPriceRangeFormatted,
      priceNotes: newPriceNotes,
      hours: {
        monday: newMondayHours,
        tuesday: newTuesdayHours,
        wednesday: newWednesdayHours,
        thursday: newThursdayHours,
        friday: newFridayHours,
        saturday: newSaturdayHours,
        sunday: newSundayHours,
      },
      openNowText: 'Open Today · 10 AM – 6 PM',
      isOpenNow: true,
      categories: newCategories.split(',').map(c => c.trim()).filter(Boolean),
      sustainableMaterials: ['100% Cotton', 'Upcycled Denim', 'Linen'],
      fittingRoomsCount: newFittingRooms,
      fittingRoomsNote: newFittingRoomsNote,
      hasBathroom: true,
      hasFormalwear: newHasFormalwear,
      formalwearNotes: newFormalwearNotes,
      inventorySplit: { womensPercent: 60, mensPercent: 40 },
      bonusInfo: newBonusInfo,
      overallSummary: newSummary,
      nearestSchoolIds: ['riverside', 'stanton', 'fletcher'],
      reviews: [],
      published: newPublished,
    };

    try {
      await createOrUpdateStore(newStore);
      onToast(`Successfully registered and published "${newName}" to Firestore!`);
      setActiveTab('stores');
      setNewName('');
      setNewAddress('');
    } catch (err) {
      onToast(`Failed to add store to Firestore: ${err}`);
    }
  };

  // Review moderation actions
  const handleApproveReview = async (review: FirestoreReviewItem) => {
    try {
      await updateReviewStatus(review.id, 'approved');
      onToast(`Approved review by ${review.author} (now visible publicly).`);
    } catch (err) {
      onToast(`Failed to approve review: ${err}`);
    }
  };

  const handleHideReview = async (review: FirestoreReviewItem) => {
    try {
      await updateReviewStatus(review.id, 'hidden');
      onToast(`Review by ${review.author} is now hidden from public website.`);
    } catch (err) {
      onToast(`Failed to hide review: ${err}`);
    }
  };

  const handleDeleteReview = async (review: FirestoreReviewItem) => {
    if (window.confirm(`Permanently delete review by "${review.author}"?`)) {
      try {
        await deleteReview(review.id);
        onToast(`Permanently deleted review from Firestore.`);
      } catch (err) {
        onToast(`Failed to delete review: ${err}`);
      }
    }
  };

  // Export handlers
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stores, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `duval-thriftfit-district-report-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('Exported Duval County District Data JSON!');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Address,Zip,PriceTier,FittingRooms,HasFormalwear,Published,Lat,Lng\n';
    const rows = stores
      .map(s => `"${s.id}","${s.name.replace(/"/g, '""')}","${s.address.replace(/"/g, '""')}","${s.zip}","${s.priceTier}",${s.fittingRoomsCount},${s.hasFormalwear},${s.published !== false},${s.lat},${s.lng}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `duval-thriftfit-stores-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('Exported Duval Stores CSV!');
  };

  const totalFittingRooms = stores.reduce((acc, s) => acc + s.fittingRoomsCount, 0);
  const formalwearStores = stores.filter(s => s.hasFormalwear).length;
  const publishedStoresCount = stores.filter(s => s.published !== false).length;

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredReviews = allReviews.filter(rev => {
    const matchesStatus = reviewStatusFilter === 'all' || rev.status === reviewStatusFilter;
    const matchesSearch =
      rev.author.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
      (rev.school && rev.school.toLowerCase().includes(reviewSearchQuery.toLowerCase())) ||
      (rev.storeId && rev.storeId.toLowerCase().includes(reviewSearchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = allReviews.filter(r => r.status === 'pending').length;
  const approvedCount = allReviews.filter(r => r.status === 'approved').length;
  const hiddenCount = allReviews.filter(r => r.status === 'hidden').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#2E1F16]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-5xl max-h-[92vh] rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl flex flex-col overflow-hidden text-[#2E1F16]">
        {/* Header */}
        <div className="bg-[#2E1F16] text-[#FBEFD9] p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial text-xl sm:text-2xl text-[#FBEFD9]">
                  Duval District Admin Dashboard
                </h2>
                {isEffectiveAdmin ? (
                  <span className="bg-[#C1D7C2] text-[#2E1F16] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    <span>Firestore Connected</span>
                  </span>
                ) : (
                  <span className="bg-[#EFAE6E] text-[#2E1F16] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Protected Portal</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#FBEFD9]/75 mt-0.5">
                {isEffectiveAdmin
                  ? `Authenticated as ${currentUser?.email || (isManualSession ? 'vexijbg@gmail.com' : BOOTSTRAP_ADMIN_EMAIL)}. Full administrative write permissions enabled.`
                  : 'Manage Duval County thrift store registry, review moderation, and operating hours.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEffectiveAdmin && (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FBEFD9] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign out of Admin Dashboard"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FBEFD9]/10 hover:bg-[#FBEFD9]/20 flex items-center justify-center text-[#FBEFD9] transition-colors cursor-pointer"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isEffectiveAdmin ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#2E1F16]/15 shadow-lg space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F7E09A] text-[#2E1F16] flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-bold text-[#2E1F16]">
                  District Admin Sign In
                </h3>
                <p className="text-xs text-[#2E1F16]/70 leading-relaxed">
                  Log in with your administrator credentials to manage stores, operating hours, clothing categories, and moderate reviews.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* MANUAL CREDENTIAL FORM */}
              <form onSubmit={handleManualSignIn} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1F16]/80 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                    placeholder="vexijbg@gmail.com"
                    className="w-full bg-[#FBEFD9]/60 border border-[#2E1F16]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2E1F16] font-medium focus:outline-none focus:border-[#EFAE6E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1F16]/80 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={manualPassword}
                      onChange={e => setManualPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full bg-[#FBEFD9]/60 border border-[#2E1F16]/20 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-[#2E1F16] font-medium focus:outline-none focus:border-[#EFAE6E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2E1F16]/50 hover:text-[#2E1F16] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E1F16] hover:bg-[#422c20] text-[#FBEFD9] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <LogIn className="w-4 h-4 text-[#EFAE6E]" />
                  <span>Sign In as Admin</span>
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[#2E1F16]/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16]/40">or</span>
                <div className="flex-1 h-px bg-[#2E1F16]/10" />
              </div>

              {/* GOOGLE SIGN IN BUTTON */}
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 text-[#2E1F16] font-bold text-xs border border-[#2E1F16]/20 transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {/* Google Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.54 0 2.9.54 3.98 1.43l2.97-2.97C17.15 1.8 14.77 1 12 1 7.42 1 3.52 3.65 1.63 7.51l3.58 2.78C6.1 7.42 8.8 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.21 14.71c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.63 7.35C.6 9.4 0 11.68 0 14.07s.6 4.67 1.63 6.72l3.58-2.78z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.07.72-2.45 1.16-4.23 1.16-3.2 0-5.9-2.42-6.79-5.29L1.63 15.87C3.52 19.73 7.42 23 12 23z"
                  />
                </svg>
                <span>{isAuthLoading ? 'Authenticating...' : 'Sign in with Google Admin'}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-[#F7E09A]/40 border-b border-[#2E1F16]/10 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setActiveTab('stores');
                    setEditingStore(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'stores' && !editingStore
                      ? 'bg-[#2E1F16] text-[#FBEFD9] shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#2E1F16]'
                  }`}
                >
                  Stores Directory ({stores.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('addStore');
                    setEditingStore(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'addStore'
                      ? 'bg-[#2E1F16] text-[#FBEFD9] shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#2E1F16]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Store</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('reviews');
                    setEditingStore(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'bg-[#2E1F16] text-[#FBEFD9] shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#2E1F16]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Review Moderation ({allReviews.length})</span>
                  {pendingCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('reports');
                    setEditingStore(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'reports'
                      ? 'bg-[#2E1F16] text-[#FBEFD9] shadow-xs'
                      : 'bg-white/60 hover:bg-white text-[#2E1F16]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>District Reports</span>
                </button>
              </div>

              <div className="text-xs font-semibold text-[#2E1F16]/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Firestore Sync</span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: STORES LIST & CONTROLS */}
              {activeTab === 'stores' && !editingStore && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Filter store name or address..."
                      value={filterQuery}
                      onChange={e => setFilterQuery(e.target.value)}
                      className="bg-white border border-[#2E1F16]/20 rounded-xl px-3.5 py-2 text-xs font-medium text-[#2E1F16] w-full sm:w-72 focus:outline-none focus:border-[#EFAE6E]"
                    />
                    <div className="text-xs font-bold text-[#2E1F16]/70 flex items-center gap-4 flex-wrap">
                      <span>Published: <strong className="text-emerald-700">{publishedStoresCount}</strong>/{stores.length}</span>
                      <span>Fitting Rooms: <strong className="text-[#2E1F16]">{totalFittingRooms}</strong></span>
                      <span>Formalwear: <strong className="text-[#2E1F16]">{formalwearStores}</strong></span>
                    </div>
                  </div>

                  <div className="divide-y divide-[#2E1F16]/10 bg-white rounded-2xl border border-[#2E1F16]/15 shadow-xs overflow-hidden">
                    {filteredStores.map(store => {
                      const isPublished = store.published !== false;
                      return (
                        <div key={store.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7E09A]/10 transition-colors">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-[#2E1F16]">{store.name}</span>
                              <span className="bg-[#C1D7C2] text-[#2E1F16] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                {store.priceTier} ({store.priceRangeFormatted})
                              </span>
                              {isPublished ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  <span>Live / Published</span>
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                  <span>Hidden Draft</span>
                                </span>
                              )}
                              {store.hasFormalwear && (
                                <span className="bg-[#F7E09A] text-[#2E1F16] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Formalwear
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#2E1F16]/70">{store.address} · {store.phone}</p>
                            <div className="flex items-center gap-2 flex-wrap text-[11px] text-[#2E1F16]/60">
                              <span>Categories: <strong>{store.categories?.slice(0, 4).join(', ')}</strong></span>
                              <span>·</span>
                              <span>Hours: {store.hours?.monday || '10AM-6PM'}</span>
                            </div>
                          </div>

                          {/* Action Controls */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {/* Publish / Unpublish Toggle */}
                            <button
                              onClick={() => handleTogglePublish(store)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isPublished
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                              }`}
                              title={isPublished ? 'Unpublish from live site' : 'Publish to live website'}
                            >
                              {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                            </button>

                            {/* Fitting Room Toggle */}
                            <button
                              onClick={() => handleToggleFittingRoom(store)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                store.fittingRoomsCount > 0
                                  ? 'bg-[#C1D7C2] text-[#2E1F16] hover:bg-[#a9c7ab]'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                              title="Toggle Fitting Room Status"
                            >
                              <DoorOpen className="w-3.5 h-3.5" />
                              <span>{store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms` : 'Closed'}</span>
                            </button>

                            {/* Formalwear Toggle */}
                            <button
                              onClick={() => handleToggleFormalwear(store)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                store.hasFormalwear
                                  ? 'bg-[#EFAE6E] text-[#2E1F16]'
                                  : 'bg-neutral-100 text-[#2E1F16]/60 hover:bg-neutral-200'
                              }`}
                              title="Toggle Formalwear Availability"
                            >
                              <Tag className="w-3.5 h-3.5" />
                              <span>{store.hasFormalwear ? 'Prom Racks' : 'Casual'}</span>
                            </button>

                            {/* Edit Store Full Details */}
                            <button
                              onClick={() => setEditingStore({ ...store })}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FBEFD9] hover:bg-[#F7E09A] text-[#2E1F16] transition-colors flex items-center gap-1.5 cursor-pointer border border-[#2E1F16]/10"
                              title="Edit all store details, hours, categories and prices"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Store */}
                            <button
                              onClick={() => handleDeleteStore(store)}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete store from Firestore"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STORE EDITOR DRAWER */}
              {editingStore && (
                <form onSubmit={handleSaveEditedStore} className="bg-white rounded-2xl p-6 border border-[#2E1F16]/15 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#2E1F16]/10 pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EFAE6E]">Editing Store</span>
                      <h3 className="font-editorial text-2xl text-[#2E1F16]">{editingStore.name}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingStore(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#2E1F16]/70 hover:text-[#2E1F16] bg-[#FBEFD9] cursor-pointer"
                    >
                      Back to Directory
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Store Name *</label>
                      <input
                        type="text"
                        required
                        value={editingStore.name}
                        onChange={e => setEditingStore({ ...editingStore, name: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={editingStore.address}
                        onChange={e => setEditingStore({ ...editingStore, address: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={editingStore.zip}
                        onChange={e => setEditingStore({ ...editingStore, zip: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Phone Number</label>
                      <input
                        type="text"
                        value={editingStore.phone}
                        onChange={e => setEditingStore({ ...editingStore, phone: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Price Tier</label>
                      <select
                        value={editingStore.priceTier}
                        onChange={e => setEditingStore({ ...editingStore, priceTier: e.target.value as any })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none cursor-pointer"
                      >
                        <option value="$">$ (Ultra Budget: $2–$20)</option>
                        <option value="$$">$$ (Moderate: $15–$60)</option>
                        <option value="$$$">$$$ (Curated Vintage: $30–$150)</option>
                        <option value="$$$$">$$$$ (High-End Designer: $60–$350+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Formatted Price Range</label>
                      <input
                        type="text"
                        value={editingStore.priceRangeFormatted}
                        onChange={e => setEditingStore({ ...editingStore, priceRangeFormatted: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-[#2E1F16]">Pricing Notes &amp; Student Discounts</label>
                      <input
                        type="text"
                        value={editingStore.priceNotes}
                        onChange={e => setEditingStore({ ...editingStore, priceNotes: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    {/* Operating Hours by Day */}
                    <div className="sm:col-span-2 space-y-2 pt-2 border-t border-[#2E1F16]/10">
                      <div className="font-bold text-sm text-[#2E1F16] flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#EFAE6E]" />
                        <span>Operating Hours</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <div key={day}>
                            <label className="block uppercase text-[10px] text-[#2E1F16]/70 mb-0.5">{day}</label>
                            <input
                              type="text"
                              value={(editingStore.hours as any)?.[day] || ''}
                              onChange={e =>
                                setEditingStore({
                                  ...editingStore,
                                  hours: {
                                    ...editingStore.hours,
                                    [day]: e.target.value,
                                  },
                                })
                              }
                              className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-lg px-2.5 py-1.5 text-[11px] text-[#2E1F16] focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clothing Categories */}
                    <div className="sm:col-span-2 pt-2 border-t border-[#2E1F16]/10">
                      <label className="block mb-1 text-[#2E1F16]">Clothing Categories (comma-separated)</label>
                      <input
                        type="text"
                        value={editingStore.categories?.join(', ')}
                        onChange={e =>
                          setEditingStore({
                            ...editingStore,
                            categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean),
                          })
                        }
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Fitting Rooms Count</label>
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={editingStore.fittingRoomsCount}
                        onChange={e => setEditingStore({ ...editingStore, fittingRoomsCount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Fitting Rooms Note</label>
                      <input
                        type="text"
                        value={editingStore.fittingRoomsNote}
                        onChange={e => setEditingStore({ ...editingStore, fittingRoomsNote: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2E1F16]">
                        <input
                          type="checkbox"
                          checked={editingStore.hasFormalwear}
                          onChange={e => setEditingStore({ ...editingStore, hasFormalwear: e.target.checked })}
                          className="w-4 h-4 accent-[#EFAE6E] rounded"
                        />
                        <span>Has Homecoming / Prom Formalwear Racks</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2E1F16]">
                        <input
                          type="checkbox"
                          checked={editingStore.published !== false}
                          onChange={e => setEditingStore({ ...editingStore, published: e.target.checked })}
                          className="w-4 h-4 accent-[#EFAE6E] rounded"
                        />
                        <span>Published (Visible on Live Website)</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-[#2E1F16]">Overall Summary</label>
                      <textarea
                        rows={2}
                        value={editingStore.overallSummary}
                        onChange={e => setEditingStore({ ...editingStore, overallSummary: e.target.value })}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2E1F16]/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingStore(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#2E1F16]/70 hover:text-[#2E1F16] bg-[#FBEFD9] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#2E1F16] bg-[#EFAE6E] hover:bg-[#e5a05b] shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save Changes to Firestore</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER NEW STORE */}
              {activeTab === 'addStore' && (
                <form onSubmit={handleCreateStore} className="bg-white rounded-2xl p-6 border border-[#2E1F16]/15 space-y-4 shadow-xs">
                  <div className="border-b border-[#2E1F16]/10 pb-3">
                    <h3 className="font-editorial text-xl text-[#2E1F16]">
                      Register New Duval Secondhand Shop
                    </h3>
                    <p className="text-xs text-[#2E1F16]/70">
                      Creates a document in Firestore. Automatically syncs to the live map, directory, school radius filters, and student recommendations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Store Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jax Thrift & Vintage"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1234 Atlantic Blvd, Jacksonville, FL"
                        value={newAddress}
                        onChange={e => setNewAddress(e.target.value)}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">City</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">ZIP Code</label>
                      <input
                        type="text"
                        value={newZip}
                        onChange={e => setNewZip(e.target.value)}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Phone Number</label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Price Tier</label>
                      <select
                        value={newPriceTier}
                        onChange={e => {
                          const val = e.target.value as any;
                          setNewPriceTier(val);
                          setNewPriceRangeFormatted(val === '$' ? '$3 – $20' : val === '$$' ? '$15 – $60' : '$30 – $150');
                        }}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none cursor-pointer"
                      >
                        <option value="$">$ (Ultra Budget: $2–$20)</option>
                        <option value="$$">$$ (Moderate: $15–$60)</option>
                        <option value="$$$">$$$ (Curated Vintage: $30–$150)</option>
                        <option value="$$$$">$$$$ (High-End Designer: $60–$350+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Dressing Rooms Count</label>
                      <input
                        type="number"
                        min={0}
                        max={12}
                        value={newFittingRooms}
                        onChange={e => {
                          const count = parseInt(e.target.value) || 0;
                          setNewFittingRooms(count);
                          setNewFittingRoomsNote(count > 0 ? `${count} verified open fitting rooms` : 'No fitting rooms available');
                        }}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[#2E1F16]">Latitude &amp; Longitude</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Lat (30.3322)"
                          value={newLat}
                          onChange={e => setNewLat(e.target.value)}
                          className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Lng (-81.6557)"
                          value={newLng}
                          onChange={e => setNewLng(e.target.value)}
                          className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-[#2E1F16]">Clothing Categories (comma separated)</label>
                      <input
                        type="text"
                        value={newCategories}
                        onChange={e => setNewCategories(e.target.value)}
                        className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs text-[#2E1F16] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2E1F16]">
                        <input
                          type="checkbox"
                          checked={newHasFormalwear}
                          onChange={e => setNewHasFormalwear(e.target.checked)}
                          className="w-4 h-4 accent-[#EFAE6E] rounded"
                        />
                        <span>Has Dedicated Homecoming / Prom Formalwear Racks</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2E1F16]">
                        <input
                          type="checkbox"
                          checked={newPublished}
                          onChange={e => setNewPublished(e.target.checked)}
                          className="w-4 h-4 accent-[#EFAE6E] rounded"
                        />
                        <span>Publish Immediately to Live Site</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('stores')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#2E1F16]/70 hover:text-[#2E1F16] bg-[#FBEFD9] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold text-[#2E1F16] bg-[#EFAE6E] hover:bg-[#e5a05b] shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Save &amp; Publish Store to Firestore</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: REVIEW MODERATION SYSTEM */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Filter Sub-header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setReviewStatusFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          reviewStatusFilter === 'all'
                            ? 'bg-[#2E1F16] text-[#FBEFD9]'
                            : 'bg-white/80 hover:bg-white text-[#2E1F16]'
                        }`}
                      >
                        All ({allReviews.length})
                      </button>
                      <button
                        onClick={() => setReviewStatusFilter('pending')}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                          reviewStatusFilter === 'pending'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        <span>Pending ({pendingCount})</span>
                      </button>
                      <button
                        onClick={() => setReviewStatusFilter('approved')}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          reviewStatusFilter === 'approved'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        Approved ({approvedCount})
                      </button>
                      <button
                        onClick={() => setReviewStatusFilter('hidden')}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          reviewStatusFilter === 'hidden'
                            ? 'bg-neutral-600 text-white'
                            : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                        }`}
                      >
                        Hidden ({hiddenCount})
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Search author, comment, school..."
                      value={reviewSearchQuery}
                      onChange={e => setReviewSearchQuery(e.target.value)}
                      className="bg-white border border-[#2E1F16]/20 rounded-xl px-3 py-1.5 text-xs text-[#2E1F16] w-full sm:w-64 focus:outline-none"
                    />
                  </div>

                  {filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-[#2E1F16]/60 border border-[#2E1F16]/10 text-xs">
                      No reviews found matching the current filter.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#2E1F16]/10 bg-white rounded-2xl border border-[#2E1F16]/15 shadow-xs overflow-hidden">
                      {filteredReviews.map(rev => {
                        const targetStore = stores.find(s => s.id === rev.storeId);
                        return (
                          <div key={rev.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-[#F7E09A]/10 transition-colors">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-[#2E1F16]">{rev.author}</span>
                                {rev.school && (
                                  <span className="text-[11px] text-[#2E1F16]/70 italic">· {rev.school}</span>
                                )}
                                <div className="flex items-center text-amber-500">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'
                                      }`}
                                    />
                                  ))}
                                </div>

                                {/* Moderation Status Badge */}
                                {rev.status === 'approved' && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>Approved</span>
                                  </span>
                                )}
                                {rev.status === 'pending' && (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Pending Moderation</span>
                                  </span>
                                )}
                                {rev.status === 'hidden' && (
                                  <span className="bg-neutral-200 text-neutral-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    <span>Hidden</span>
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-[#2E1F16] leading-relaxed bg-[#FBEFD9]/40 p-2.5 rounded-xl border border-[#2E1F16]/5">
                                "{rev.comment}"
                              </p>

                              <div className="flex items-center gap-3 text-[11px] text-[#2E1F16]/60">
                                <span>Store: <strong className="text-[#2E1F16]">{targetStore ? targetStore.name : rev.storeId}</strong></span>
                                <span>·</span>
                                <span>Date: {rev.date}</span>
                                {rev.helpfulCount !== undefined && (
                                  <>
                                    <span>·</span>
                                    <span>Helpful count: {rev.helpfulCount}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Moderation Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                              {rev.status !== 'approved' && (
                                <button
                                  onClick={() => handleApproveReview(rev)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                                  title="Approve review (shows on live website)"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {rev.status !== 'hidden' && (
                                <button
                                  onClick={() => handleHideReview(rev)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1.5 cursor-pointer transition-colors"
                                  title="Hide review (keeps in database, hides from public)"
                                >
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hide</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteReview(rev)}
                                className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                title="Permanently delete review"
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
              )}

              {/* TAB 4: DISTRICT REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#2E1F16]/12 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16]/60">Total Locations</span>
                      <div className="font-editorial text-3xl font-bold text-[#2E1F16]">{stores.length}</div>
                      <span className="text-xs text-emerald-700 font-bold">{publishedStoresCount} live on website</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#2E1F16]/12 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16]/60">Fitting Rooms</span>
                      <div className="font-editorial text-3xl font-bold text-[#2E1F16]">{totalFittingRooms}</div>
                      <span className="text-xs text-[#2E1F16]/75">Verified student dressing stalls</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#2E1F16]/12 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16]/60">Community Reviews</span>
                      <div className="font-editorial text-3xl font-bold text-[#2E1F16]">{allReviews.length}</div>
                      <span className="text-xs text-[#2E1F16]/75">{approvedCount} approved, {pendingCount} pending</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#2E1F16]/12 shadow-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1F16]/60">Average Haul Savings</span>
                      <div className="font-editorial text-3xl font-bold text-[#2E1F16]">$148</div>
                      <span className="text-xs text-[#2E1F16]/75">Per student outfit haul</span>
                    </div>
                  </div>

                  {/* District Export Actions */}
                  <div className="bg-white rounded-2xl p-6 border border-[#2E1F16]/15 space-y-4 shadow-xs">
                    <div>
                      <h3 className="font-editorial text-xl text-[#2E1F16]">
                        Download District Reports &amp; Datasets
                      </h3>
                      <p className="text-xs text-[#2E1F16]/70 mt-1">
                        Export live Firestore directory records and geospatial data for school board presentations, competition rubrics, or offline reference.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleExportJSON}
                        className="px-4 py-2.5 rounded-xl bg-[#C1D7C2] hover:bg-[#a9c7ab] text-[#2E1F16] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                      >
                        <Download className="w-4 h-4 text-[#2E1F16]" />
                        <span>Download Full District JSON (.json)</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2.5 rounded-xl bg-[#F7E09A] hover:bg-[#edd17b] text-[#2E1F16] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                      >
                        <Download className="w-4 h-4 text-[#2E1F16]" />
                        <span>Download Stores Table (.csv)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="bg-[#F7E09A]/30 border-t border-[#2E1F16]/10 px-6 py-4 flex items-center justify-between text-xs text-[#2E1F16]/75 shrink-0">
          <span>Duval County Public Schools · Sustainable Fashion Registry</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#2E1F16] text-[#FBEFD9] font-bold cursor-pointer hover:bg-[#422c20] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
