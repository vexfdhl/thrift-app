import React, { useState } from 'react';
import { ThriftStoreItem, ReviewItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import { validateReviewSubmission } from '../utils/storage';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Layers,
  Leaf,
  Navigation,
  MessageSquare,
  ThumbsUp,
  Share2,
  AlertCircle,
  DoorOpen,
  Heart,
  Scale,
  Sparkles,
  Info,
  Shirt,
  UserCheck
} from 'lucide-react';

interface StoreDetailProps {
  store: ThriftStoreItem;
  selectedSchool: SchoolItem | null;
  onBack: () => void;
  onViewOnMap: () => void;
  onOpenNavigate?: (store: ThriftStoreItem) => void;
  onAddReview: (storeId: string, review: ReviewItem) => void;
  onToast: (msg: string) => void;
  isSaved?: boolean;
  onToggleSave?: (storeId: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (storeId: string) => void;
}

export const StoreDetail: React.FC<StoreDetailProps> = ({
  store,
  selectedSchool,
  onBack,
  onViewOnMap,
  onOpenNavigate,
  onAddReview,
  onToast,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorSchool, setAuthorSchool] = useState(selectedSchool ? selectedSchool.name : '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const distance = selectedSchool
    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
    : null;

  const averageRating = store.reviews?.length > 0
    ? (store.reviews.reduce((acc, r) => acc + r.rating, 0) / store.reviews.length).toFixed(1)
    : '5.0';

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateReviewSubmission({
      author: authorName,
      comment: comment,
      rating: rating,
      honeypot: honeypot,
    });

    if (!validation.isValid) {
      setFormError(validation.error || 'Please correct errors.');
      onToast(validation.error || 'Invalid submission');
      return;
    }

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      school: authorSchool.trim() || undefined,
      rating: rating,
      date: 'Just now',
      comment: comment.trim(),
      helpfulCount: 0,
      tags: ['Student Review', 'Verified Shopper'],
    };

    onAddReview(store.id, newReview);
    onToast('Review submitted and stored in local database.');
    setIsFormOpen(false);
    setAuthorName('');
    setComment('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${store.name} - ThriftFit DuvALL`,
        text: `Check out ${store.name} on ThriftFit DuvALL! Prices: ${store.priceRangeFormatted}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onToast('Store link copied to clipboard.');
    }
  };

  const handleNavigateClick = () => {
    if (onOpenNavigate) {
      onOpenNavigate(store);
    } else {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-[#2E1F16] font-['Nunito',sans-serif]">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="btn-clevr-outline text-xs px-4 py-2 cursor-pointer gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(store.id)}
              className={`btn-clevr-outline text-xs px-3.5 py-2 gap-1.5 cursor-pointer ${
                isCompared ? 'bg-[#EFAE6E] text-[#2E1F16] border-[#EFAE6E]' : ''
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Added to Compare' : 'Compare'}</span>
            </button>
          )}

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(store.id)}
              className="btn-clevr-outline text-xs px-3.5 py-2 gap-1.5 cursor-pointer"
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          <button
            onClick={onViewOnMap}
            className="btn-clevr-outline text-xs px-3.5 py-2 gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View on Map</span>
          </button>

          <button
            onClick={handleNavigateClick}
            className="btn-clevr-brown text-xs px-4 py-2 gap-1.5 cursor-pointer font-bold shadow-md"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Navigate</span>
          </button>

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full border border-[#2E1F16]/20 bg-[#F7E09A]/40 hover:bg-[#F7E09A] flex items-center justify-center text-[#2E1F16] transition-colors cursor-pointer"
            title="Share Store"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. STORE HEADER CARD */}
      <div className="clevr-card p-6 sm:p-10 bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#2E1F16]/10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="bg-[#EFAE6E] text-[#2E1F16] px-3 py-1 rounded text-[11px] uppercase tracking-wider font-extrabold shadow-2xs">
                {store.priceTier} · {store.priceRangeFormatted}
              </span>
              {distance !== null && (
                <span className="bg-[#C1D7C2] text-[#2E1F16] px-3 py-1 rounded text-[11px] font-bold">
                  {formatDistance(distance)} from {selectedSchool?.name}
                </span>
              )}
              <span className={`px-3 py-1 rounded text-[11px] font-bold ${
                store.isOpenNow ? 'bg-[#C1D7C2] text-[#2E1F16]' : 'bg-[#2E1F16]/15 text-[#2E1F16]'
              }`}>
                {store.openNowText}
              </span>
            </div>

            <h1 className="font-cloud text-3xl sm:text-5xl font-bold text-[#2E1F16] tracking-tight">
              {store.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#2E1F16]/75 flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-[#EFAE6E] shrink-0" />
              <span>{store.address} · {store.city}, FL {store.zip}</span>
            </p>
          </div>

          <div className="bg-[#FBEFD9] border border-[#2E1F16]/20 p-5 rounded-2xl text-center shrink-0 self-start md:self-auto min-w-[160px] shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-[#2E1F16]">
              <Star className="w-6 h-6 fill-[#EFAE6E] text-[#EFAE6E]" />
              <span className="font-cloud text-3xl font-bold">{averageRating}</span>
              <span className="text-xs text-[#2E1F16]/50 font-normal">/ 5.0</span>
            </div>
            <div className="text-xs font-bold text-[#2E1F16]/70 mt-1">
              {store.reviews?.length ?? 0} Student Reviews
            </div>
          </div>
        </div>

        {/* Overview Summary */}
        <div className="p-5 bg-white rounded-2xl border border-[#2E1F16]/10">
          <p className="text-xs sm:text-sm text-[#2E1F16]/85 leading-relaxed font-normal">
            {store.overallSummary}
          </p>
        </div>

        {/* Bonus info from PDF if available */}
        {store.bonusInfo && (
          <div className="p-4 bg-[#C1D7C2]/30 rounded-2xl border border-[#2E1F16]/15 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#2E1F16] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#2E1F16] block">Notes from Mags’s PDF Audit:</span>
              <p className="text-[#2E1F16]/85 font-medium mt-0.5">{store.bonusInfo}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. SPECIFICATION GRID (Includes all sections from PDF Page 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hours & Contact */}
        <div className="clevr-card p-6 sm:p-7 bg-[#F7E09A]/20 border border-[#2E1F16]/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#EFAE6E]" />
              <h2 className="font-cloud text-xl text-[#2E1F16]">
                Hours &amp; Weekly Schedule
              </h2>
            </div>

            <div className="bg-white border border-[#2E1F16]/10 rounded-xl p-3 text-xs font-medium">
              <span className="font-bold text-[#2E1F16] block mb-0.5">
                Pricing Overview:
              </span>
              <p className="text-[#2E1F16]/70">
                {store.priceNotes}
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              {Object.entries(store.hours).map(([day, hrs]) => (
                <div
                  key={day}
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg capitalize font-medium text-[#2E1F16]/75 hover:bg-[#FBEFD9]"
                >
                  <span>{day}</span>
                  <span className="font-semibold text-[#2E1F16]">{hrs}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E1F16]/10 flex items-center justify-between text-xs text-[#2E1F16]/80 font-semibold">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#2E1F16]/50" />
              <span>{store.phone}</span>
            </span>
            <span className="text-[11px] text-[#2E1F16]/50">Verified Duval Location</span>
          </div>
        </div>

        {/* Clothing Amounts, Fitting Rooms & Categories */}
        <div className="clevr-card p-6 sm:p-7 bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#EFAE6E]" />
            <h2 className="font-cloud text-xl text-[#2E1F16]">
              Clothing Breakdown &amp; Amenities
            </h2>
          </div>

          {/* PDF Page 1 Specific Requirement: Amount of Women's and Men's Clothing */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-white border border-[#2E1F16]/10 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-[#2E1F16] font-bold mb-1">
                <Shirt className="w-4 h-4 text-[#EFAE6E]" />
                <span>Amount of Women’s Clothing:</span>
              </div>
              <p className="text-[#2E1F16]/80 font-medium pl-6">
                {store.womensClothingAmount || 'Moderate to high casual & vintage selections.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#2E1F16]/10 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-[#2E1F16] font-bold mb-1">
                <UserCheck className="w-4 h-4 text-[#2E1F16]" />
                <span>Amount of Men’s Clothing:</span>
              </div>
              <p className="text-[#2E1F16]/80 font-medium pl-6">
                {store.mensClothingAmount || 'Good amount of casual & streetwear.'}
              </p>
            </div>
          </div>

          {/* Fitting Rooms */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#2E1F16]/10 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <DoorOpen className="w-5 h-5 text-[#EFAE6E]" />
              <div>
                <span className="font-bold text-[#2E1F16] block">Fitting Rooms Status:</span>
                <span className="text-[#2E1F16]/70">{store.fittingRoomsNote}</span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              store.fittingRoomsCount > 0 ? 'bg-[#C1D7C2] text-[#2E1F16]' : 'bg-[#2E1F16]/10 text-[#2E1F16]/60'
            }`}>
              {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Open` : 'Closed'}
            </span>
          </div>

          {store.hasFormalwear && (
            <div className="p-4 rounded-xl bg-[#F7E09A]/40 border border-[#2E1F16]/10 text-xs space-y-1">
              <span className="font-bold text-[#2E1F16] block">Homecoming &amp; Prom Formalwear:</span>
              <p className="text-[#2E1F16]/80 font-medium">{store.formalwearNotes}</p>
            </div>
          )}

          <div className="space-y-2">
            <span className="font-bold text-xs text-[#2E1F16]/70 uppercase tracking-wider block">
              Main Categories of Clothing:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {store.categories.map(c => (
                <span key={c} className="bg-white border border-[#2E1F16]/10 px-3 py-1 rounded-full text-xs font-semibold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. STUDENT REVIEWS SECTION */}
      <div className="clevr-card p-6 sm:p-10 bg-white border border-[#2E1F16]/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E1F16]/10 pb-5">
          <div>
            <h2 className="font-cloud text-2xl sm:text-3xl text-[#2E1F16]">
              Student Reviews &amp; Thrifting Tips ({store.reviews?.length ?? 0})
            </h2>
            <p className="text-xs text-[#2E1F16]/70 mt-1">
              Real advice from high school students across Duval County.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn-clevr-brown text-xs px-4 py-2 self-start sm:self-auto cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Cancel' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Review Form (PDF Page 1: "review for the user to fil out on each thrift store") */}
        {isFormOpen && (
          <form onSubmit={handleSubmitReview} className="bg-[#FBEFD9] p-5 rounded-2xl border border-[#2E1F16]/15 space-y-4 text-xs font-semibold">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#2E1F16] mb-1 font-bold">Your Name / Handle *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full bg-white border border-[#2E1F16]/20 rounded-xl p-2.5 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                />
              </div>

              <div>
                <label className="block text-[#2E1F16] mb-1 font-bold">Your Duval High School</label>
                <input
                  type="text"
                  value={authorSchool}
                  onChange={e => setAuthorSchool(e.target.value)}
                  placeholder="e.g. Duncan U. Fletcher High"
                  className="w-full bg-white border border-[#2E1F16]/20 rounded-xl p-2.5 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#2E1F16] mb-1 font-bold">Star Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-[#EFAE6E] text-[#EFAE6E]'
                          : 'text-[#2E1F16]/20'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-[#2E1F16]/70 ml-2 font-bold">{rating} Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-[#2E1F16] mb-1 font-bold">Your Thrifting Review / Tip *</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share sizing advice, best days to go, fitting room status, or best finds..."
                className="w-full bg-white border border-[#2E1F16]/20 rounded-xl p-2.5 text-xs text-[#2E1F16] focus:outline-none focus:border-[#EFAE6E]"
              />
            </div>

            {/* Honeypot anti-spam */}
            <input
              type="text"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn-clevr-outline text-xs px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-clevr-brown text-xs px-5 py-2 cursor-pointer font-bold"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {store.reviews?.length === 0 ? (
            <div className="text-center py-8 text-[#2E1F16]/60 text-xs">
              <p>No reviews submitted yet for this store.</p>
              <p className="mt-1">Be the first Duval student to share a thrift tip!</p>
            </div>
          ) : (
            store.reviews?.map(rev => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FBEFD9]/50 border border-[#2E1F16]/10 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#2E1F16]">{rev.author}</span>
                    {rev.school && (
                      <span className="text-[11px] bg-[#C1D7C2] text-[#2E1F16] px-2 py-0.5 rounded font-bold">
                        {rev.school}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#EFAE6E] text-[#EFAE6E]" />
                    ))}
                    <span className="text-[10px] text-[#2E1F16]/50 ml-1">{rev.date}</span>
                  </div>
                </div>

                <p className="text-xs text-[#2E1F16]/85 font-normal leading-relaxed">
                  {rev.comment}
                </p>

                {rev.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.tags.map(t => (
                      <span key={t} className="text-[10px] bg-white text-[#2E1F16]/70 px-2 py-0.5 rounded-full border border-[#2E1F16]/10">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
