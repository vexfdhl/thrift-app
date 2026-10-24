import React, { useState, useEffect } from 'react';
import { ThriftStoreItem, ReviewItem } from '../data/thriftStores';
import {
  createOrUpdateStore,
  deleteStore,
  setStorePublished,
  updateReviewStatus,
  deleteReviewFromFirestore,
  seedInitialStoresToFirestore
} from '../services/firestoreService';
import { auth } from '../services/firebaseConfig';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  X,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  DoorOpen,
  DollarSign,
  Clock,
  Sparkles,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: ThriftStoreItem[];
  allReviews?: (ReviewItem & { storeId: string; status?: 'approved' | 'hidden' | 'pending' })[];
  onToast: (msg: string) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  stores,
  allReviews = [],
  onToast,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isManualLoggedIn, setIsManualLoggedIn] = useState(false);
  const [manualEmail, setManualEmail] = useState('vexijbg@gmail.com');
  const [manualPassword, setManualPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stores' | 'reviews' | 'add'>('stores');
  const [editingStore, setEditingStore] = useState<ThriftStoreItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New store form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Jacksonville');
  const [newZip, setNewZip] = useState('32207');
  const [newPhone, setNewPhone] = useState('(904) ');
  const [newPriceTier, setNewPriceTier] = useState<'$' | '$$' | '$$$' | '$$$$'>('$');
  const [newPriceRange, setNewPriceRange] = useState('$3 – $10 average');
  const [newPriceNotes, setNewPriceNotes] = useState('Weekly discount color tag days.');
  const [newFittingRooms, setNewFittingRooms] = useState(2);
  const [newHasFormal, setNewHasFormal] = useState(false);
  const [newSummary, setNewSummary] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const isEffectiveAdmin = isManualLoggedIn || !!currentUser;

  const handleManualSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (manualEmail.toLowerCase().trim() === 'vexijbg@gmail.com' && manualPassword === 'sammy67') {
      setIsManualLoggedIn(true);
      onToast('Logged in as District Administrator (vexijbg@gmail.com)');
    } else {
      setAuthError('Invalid email or password. Use vexijbg@gmail.com with the assigned credentials.');
    }
  };

  const handleSignOut = () => {
    setIsManualLoggedIn(false);
    signOut(auth).catch(() => {});
    onToast('Signed out of admin dashboard');
  };

  const handleTogglePublish = async (store: ThriftStoreItem) => {
    const nextVal = !(store.isPublished ?? true);
    try {
      await setStorePublished(store.id, nextVal);
      onToast(`${store.name} is now ${nextVal ? 'Published (visible to students)' : 'Hidden (unpublished)'}`);
    } catch (err) {
      onToast(`Failed to update status: ${err}`);
    }
  };

  const handleDelete = async (store: ThriftStoreItem) => {
    if (window.confirm(`Are you sure you want to delete ${store.name} from the database?`)) {
      try {
        await deleteStore(store.id);
        onToast(`Deleted ${store.name}`);
      } catch (err) {
        onToast(`Error deleting store: ${err}`);
      }
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;
    try {
      await createOrUpdateStore(editingStore);
      onToast(`Saved changes to ${editingStore.name}`);
      setEditingStore(null);
    } catch (err) {
      onToast(`Error saving: ${err}`);
    }
  };

  const handleCreateNewStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) {
      onToast('Please provide store name and address');
      return;
    }

    const id = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newStoreItem: ThriftStoreItem = {
      id: id || `store-${Date.now()}`,
      name: newName.trim(),
      address: newAddress.trim(),
      city: newCity.trim(),
      zip: newZip.trim(),
      lat: 30.3322, // Center of Duval default
      lng: -81.6557,
      phone: newPhone.trim(),
      hours: {
        monday: '9:00 AM – 6:00 PM',
        tuesday: '9:00 AM – 6:00 PM',
        wednesday: '9:00 AM – 6:00 PM',
        thursday: '9:00 AM – 6:00 PM',
        friday: '9:00 AM – 6:00 PM',
        saturday: '9:00 AM – 5:00 PM',
        sunday: 'Closed',
      },
      priceTier: newPriceTier,
      priceRangeFormatted: newPriceRange,
      priceNotes: newPriceNotes,
      fittingRoomsCount: newFittingRooms,
      fittingRoomsNote: `${newFittingRooms} fitting rooms open.`,
      hasFormalwear: newHasFormal,
      formalwearNotes: newHasFormal ? 'Prom & homecoming racks available.' : 'Casual focus.',
      categories: ['Casual Wear', 'Denim', 'Jackets'],
      sustainableMaterials: ['Cotton', 'Denim'],
      womensClothingAmount: 'Moderate to high casual & formal selections',
      mensClothingAmount: 'Good selection of men’s casual & streetwear',
      overallSummary: newSummary || `Verified local thrift store in ${newCity}, FL.`,
      isOpenNow: true,
      openNowText: 'Open Today',
      isPublished: true,
      reviews: [],
    };

    try {
      await createOrUpdateStore(newStoreItem);
      onToast(`Created store "${newName}" and published to live website!`);
      setNewName('');
      setNewAddress('');
      setNewSummary('');
      setActiveTab('stores');
    } catch (err) {
      onToast(`Error creating store: ${err}`);
    }
  };

  const handleSeedAll = async () => {
    try {
      await seedInitialStoresToFirestore();
      onToast('All 20 verified PDF thrift stores synced to Firestore!');
    } catch (err) {
      onToast(`Sync error: ${err}`);
    }
  };

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-4xl rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2E1F16]/10 flex items-center justify-between bg-[#2E1F16] text-[#FBEFD9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFAE6E] text-[#2E1F16] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-editorial text-xl sm:text-2xl text-[#FBEFD9] font-normal leading-tight">
                Teacher &amp; District <span className="font-editorial-italic text-[#EFAE6E]">Admin Portal</span>
              </h2>
              <p className="text-[11px] text-[#FBEFD9]/70">
                Live Firestore Database &amp; Review Moderation Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEffectiveAdmin && (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FBEFD9] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FBEFD9] transition-colors cursor-pointer"
              aria-label="Close admin portal"
            >
              <X className="w-4 h-4" />
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
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-left">
                  {authError}
                </div>
              )}

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
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E1F16] hover:bg-[#422c20] text-[#FBEFD9] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4 text-[#EFAE6E]" />
                  <span>Sign In as Admin</span>
                </button>
              </form>

              {/* Quick credential filler for demo */}
              <div className="pt-2 border-t border-[#2E1F16]/10 text-xs text-[#2E1F16]/60">
                <button
                  type="button"
                  onClick={() => {
                    setManualEmail('vexijbg@gmail.com');
                    setManualPassword('sammy67');
                  }}
                  className="text-[11px] text-[#2E1F16] font-bold underline hover:text-[#EFAE6E] cursor-pointer"
                >
                  Click here to auto-fill credentials (vexijbg@gmail.com / sammy67)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Subnav */}
            <div className="bg-[#F7E09A]/40 px-4 sm:px-6 py-2.5 border-b border-[#2E1F16]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('stores')}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    activeTab === 'stores'
                      ? 'bg-[#2E1F16] text-[#FBEFD9]'
                      : 'text-[#2E1F16]/80 hover:bg-[#FBEFD9]'
                  }`}
                >
                  Manage Stores ({stores.length})
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'bg-[#2E1F16] text-[#FBEFD9]'
                      : 'text-[#2E1F16]/80 hover:bg-[#FBEFD9]'
                  }`}
                >
                  Review Moderation
                </button>

                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'add'
                      ? 'bg-[#2E1F16] text-[#FBEFD9]'
                      : 'text-[#2E1F16]/80 hover:bg-[#FBEFD9]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Store</span>
                </button>
              </div>

              <button
                onClick={handleSeedAll}
                className="px-3 py-1 rounded-full bg-[#C1D7C2] text-[#2E1F16] font-bold text-[11px] hover:bg-[#a9c7aa] transition-colors cursor-pointer flex items-center gap-1"
                title="Verify all 20 PDF stores are populated in Firestore"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync All 20 PDF Stores to Firestore</span>
              </button>
            </div>

            {/* TAB 1: STORES LIST */}
            {activeTab === 'stores' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 text-[#2E1F16]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Filter stores by name or address..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#2E1F16]/15 rounded-xl text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredStores.map(store => {
                    const isPublished = store.isPublished ?? true;
                    return (
                      <div
                        key={store.id}
                        className="bg-white p-4 rounded-2xl border border-[#2E1F16]/12 shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-[#2E1F16] bg-[#EFAE6E]/60 px-2 py-0.5 rounded">
                              {store.priceTier} · {store.city}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                isPublished
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isPublished ? 'Published' : 'Hidden'}
                            </span>
                          </div>

                          <h4 className="font-editorial text-lg font-bold text-[#2E1F16] leading-tight">
                            {store.name}
                          </h4>
                          <p className="text-xs text-[#2E1F16]/70 truncate">{store.address}</p>

                          <div className="mt-2 text-xs text-[#2E1F16]/80 flex items-center gap-2">
                            <span>Rooms: <strong>{store.fittingRoomsCount}</strong></span>
                            <span>·</span>
                            <span>Formal: <strong>{store.hasFormalwear ? 'Yes' : 'No'}</strong></span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#2E1F16]/10 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleTogglePublish(store)}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                              isPublished
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                            }`}
                          >
                            {isPublished ? 'Unpublish' : 'Publish'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingStore(store)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#2E1F16] transition-colors cursor-pointer"
                              title="Edit store"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(store)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="Delete store"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: REVIEW MODERATION */}
            {activeTab === 'reviews' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                <div className="text-xs text-[#2E1F16]/70 font-bold mb-2">
                  Student reviews submitted through public website:
                </div>

                {allReviews.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#2E1F16]/10 space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#2E1F16]/40 mx-auto" />
                    <div className="font-bold text-xs text-[#2E1F16]">No reviews awaiting moderation</div>
                    <p className="text-xs text-[#2E1F16]/60">New reviews submitted by high school shoppers appear here automatically.</p>
                  </div>
                ) : (
                  allReviews.map(rev => (
                    <div key={rev.id} className="p-4 bg-white rounded-2xl border border-[#2E1F16]/12 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-[#2E1F16]">
                          {rev.author} {rev.school && <span className="text-[#2E1F16]/60">({rev.school})</span>}
                        </div>
                        <span className="text-[10px] bg-[#EFAE6E] text-[#2E1F16] px-2 py-0.5 rounded font-black">
                          ★ {rev.rating} / 5
                        </span>
                      </div>
                      <p className="text-xs text-[#2E1F16]/80">{rev.comment}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#2E1F16]/10 text-xs">
                        <span className="text-[11px] text-[#2E1F16]/50">Status: {rev.status ?? 'approved'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateReviewStatus(rev.id, rev.status === 'hidden' ? 'approved' : 'hidden')}
                            className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[11px]"
                          >
                            {rev.status === 'hidden' ? 'Approve' : 'Hide'}
                          </button>
                          <button
                            onClick={() => deleteReviewFromFirestore(rev.id)}
                            className="px-2.5 py-1 rounded bg-rose-100 text-rose-900 font-bold text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: ADD NEW STORE FORM */}
            {activeTab === 'add' && (
              <form onSubmit={handleCreateNewStore} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Store Name *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Vintage Vault Duval"
                      className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      placeholder="e.g. 1024 Park St"
                      className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Price Tier</label>
                    <select
                      value={newPriceTier}
                      onChange={e => setNewPriceTier(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                    >
                      <option value="$">$ (Bargain $1–$8)</option>
                      <option value="$$">$$ (Standard $4–$15)</option>
                      <option value="$$$">$$$ (Curated Consignment $8–$30)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Open Dressing Stalls</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={newFittingRooms}
                      onChange={e => setNewFittingRooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2E1F16]">
                      <input
                        type="checkbox"
                        checked={newHasFormal}
                        onChange={e => setNewHasFormal(e.target.checked)}
                        className="rounded"
                      />
                      <span>Prom &amp; Formalwear Racks</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[#2E1F16] font-bold mb-1">Summary / Mission</label>
                  <textarea
                    rows={3}
                    value={newSummary}
                    onChange={e => setNewSummary(e.target.value)}
                    placeholder="Short description of store inventory, cause, and discounts..."
                    className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-clevr-brown text-xs py-2.5 px-6 font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Store to Firestore</span>
                </button>
              </form>
            )}

            {/* EDIT STORE MODAL OVERLAY */}
            {editingStore && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <form onSubmit={handleSaveEdit} className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#2E1F16]/20 shadow-2xl space-y-4 text-xs font-semibold max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#2E1F16]/10 pb-3">
                    <h3 className="font-editorial text-xl font-bold text-[#2E1F16]">
                      Edit: {editingStore.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingStore(null)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Store Name</label>
                    <input
                      type="text"
                      value={editingStore.name}
                      onChange={e => setEditingStore({ ...editingStore, name: e.target.value })}
                      className="w-full p-2 bg-[#FBEFD9]/50 border border-[#2E1F16]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Address</label>
                    <input
                      type="text"
                      value={editingStore.address}
                      onChange={e => setEditingStore({ ...editingStore, address: e.target.value })}
                      className="w-full p-2 bg-[#FBEFD9]/50 border border-[#2E1F16]/20 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#2E1F16] font-bold mb-1">Price Tier</label>
                      <select
                        value={editingStore.priceTier}
                        onChange={e => setEditingStore({ ...editingStore, priceTier: e.target.value as any })}
                        className="w-full p-2 bg-[#FBEFD9]/50 border border-[#2E1F16]/20 rounded-xl"
                      >
                        <option value="$">$</option>
                        <option value="$$">$$</option>
                        <option value="$$$">$$$</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#2E1F16] font-bold mb-1">Fitting Rooms Open</label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={editingStore.fittingRoomsCount}
                        onChange={e => setEditingStore({
                          ...editingStore,
                          fittingRoomsCount: Number(e.target.value),
                          fittingRoomsNote: Number(e.target.value) > 0 ? `${e.target.value} open fitting rooms` : 'Closed',
                        })}
                        className="w-full p-2 bg-[#FBEFD9]/50 border border-[#2E1F16]/20 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#2E1F16] font-bold mb-1">Price Notes / Discounts</label>
                    <input
                      type="text"
                      value={editingStore.priceNotes}
                      onChange={e => setEditingStore({ ...editingStore, priceNotes: e.target.value })}
                      className="w-full p-2 bg-[#FBEFD9]/50 border border-[#2E1F16]/20 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E1F16]/10">
                    <button
                      type="button"
                      onClick={() => setEditingStore(null)}
                      className="px-4 py-2 rounded-xl border border-[#2E1F16]/20 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-clevr-brown text-xs py-2 px-5 font-bold"
                    >
                      Save to Firestore
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
