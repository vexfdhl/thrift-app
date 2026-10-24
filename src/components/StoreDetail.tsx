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
  Check,
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
  Scale
} from 'lucide-react';

interface StoreDetailProps {
  store: ThriftStoreItem;
  selectedSchool: SchoolItem | null;
  onBack: () => void;
  onViewOnMap: () => void;
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
  const [helpfulLiked, setHelpfulLiked] = useState<{ [id: string]: boolean }>({});

  const distance = selectedSchool
    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
    : null;

  const averageRating = store.reviews.length > 0
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
      setFormError(validation.error || 'Please correct the highlighted issues.');
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

  const toggleHelpful = (id: string) => {
    setHelpfulLiked(prev => {
      const next = !prev[id];
      if (next) {
        onToast('Marked review as helpful.');
      }
      return { ...prev, [id]: next };
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out ${store.name} in Duval County on ThriftFit DuvALL!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onToast('Store link copied to clipboard.');
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
            className="btn-clevr-outline text-xs px-3.5 py-2 gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View on Map</span>
          </button>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(store.name + ' ' + store.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-clevr-brown text-xs px-4 py-2 gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>

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
              <span className="bg-[#EFAE6E] text-[#2E1F16] px-3 py-1 rounded text-[11px] uppercase tracking-wider font-extrabold">
                {store.priceTier} · {store.priceRangeFormatted}
              </span>
              {distance !== null && (
                <span className="bg-[#C1D7C2] text-[#2E1F16] px-3 py-1 rounded text-[11px]">
                  {formatDistance(distance)} from {selectedSchool?.name}
                </span>
              )}
              <span className={`px-3 py-1 rounded text-[11px] font-bold ${
                store.isOpenNow ? 'bg-[#C1D7C2] text-[#2E1F16]' : 'bg-[#2E1F16]/15 text-[#2E1F16]'
              }`}>
                {store.openNowText}
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-[#2E1F16]">
              {store.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#2E1F16]/70 flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-[#2E1F16]/50 shrink-0" />
              <span>{store.address} · {store.city}, FL {store.zip}</span>
            </p>
          </div>

          <div className="bg-[#FBEFD9] border border-[#2E1F16]/20 p-5 rounded-2xl text-center shrink-0 self-start md:self-auto min-w-[160px] shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-[#2E1F16]">
              <Star className="w-6 h-6 fill-[#EFAE6E] text-[#EFAE6E]" />
              <span className="font-editorial text-3xl font-bold">{averageRating}</span>
              <span className="text-xs text-[#2E1F16]/50 font-normal">/ 5.0</span>
            </div>
            <div className="text-xs font-bold text-[#2E1F16]/70 mt-1">
              {store.reviews.length} Student Reviews
            </div>
          </div>
        </div>

        {/* Overview Summary */}
        <div className="p-5 bg-white rounded-2xl border border-[#2E1F16]/10">
          <p className="text-xs sm:text-sm text-[#2E1F16]/85 leading-relaxed font-normal">
            {store.overallSummary}
          </p>
        </div>
      </div>

      {/* 2. SPECIFICATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hours & Contact */}
        <div className="clevr-card p-6 sm:p-7 bg-[#F7E09A]/20 border border-[#2E1F16]/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#EFAE6E]" />
              <h2 className="font-editorial text-xl text-[#2E1F16]">
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
              {Object.entries(store.hours).map(([day, hrs]) => {
                const isToday =
                  new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between py-1.5 px-3 rounded-lg capitalize font-medium ${
                      isToday
                        ? 'bg-[#C1D7C2] text-[#2E1F16] font-bold shadow-xs'
                        : 'text-[#2E1F16]/70 hover:bg-[#FBEFD9]'
                    }`}
                  >
                    <span>{day}</span>
                    <span className="font-semibold text-[#2E1F16]">{hrs}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E1F16]/10 flex items-center justify-between text-xs text-[#2E1F16]/80 font-semibold">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#2E1F16]/50" />
              <span>{store.phone}</span>
            </span>
            <span className="text-[11px] text-[#2E1F16]/50">Verified Location</span>
          </div>
        </div>

        {/* Inventory, Fitting Rooms & Fabrics */}
        <div className="clevr-card p-6 sm:p-7 bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#EFAE6E]" />
            <h2 className="font-editorial text-xl text-[#2E1F16]">
              Inventory &amp; Amenities
            </h2>
          </div>

          {/* Fitting Rooms Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#2E1F16]/10 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <DoorOpen className="w-5 h-5 text-[#2E1F16]/70" />
              <div>
                <div className="font-bold text-[#2E1F16]">
                  Fitting Rooms: {store.fittingRoomsCount > 0 ? 'Available' : 'Unavailable'}
                </div>
                <div className="text-[11px] text-[#2E1F16]/60 mt-0.5">
                  {store.fittingRoomsNote}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-bold ${
              store.fittingRoomsCount > 0
                ? 'bg-[#C1D7C2] text-[#2E1F16]'
                : 'bg-[#2E1F16]/15 text-[#2E1F16]'
            }`}>
              {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms` : 'None'}
            </span>
          </div>

          {/* Formalwear Availability */}
          <div className="p-3.5 rounded-xl border border-[#2E1F16]/10 bg-white text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2E1F16]">Formal &amp; Semi-Formal:</span>
              <span className="text-[11px] font-bold text-[#2E1F16] bg-[#F7E09A] px-2.5 py-0.5 rounded-full">
                {store.hasFormalwear ? 'Available' : 'Casual Focused'}
              </span>
            </div>
            <p className="text-[11px] text-[#2E1F16]/70 leading-relaxed">
              {store.formalwearNotes}
            </p>
          </div>

          {/* Inventory Split Progress */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#2E1F16] mb-1.5">
              <span>Inventory Split</span>
              <span className="text-[#2E1F16]/60 font-medium">
                Women's {store.inventorySplit.womensPercent}% / Men's {store.inventorySplit.mensPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#2E1F16]/15">
              <div
                style={{ width: `${store.inventorySplit.womensPercent}%` }}
                className="bg-[#EFAE6E] h-full"
                title={`Women's: ${store.inventorySplit.womensPercent}%`}
              />
              <div
                style={{ width: `${store.inventorySplit.mensPercent}%` }}
                className="bg-[#C1D7C2] h-full"
                title={`Men's: ${store.inventorySplit.mensPercent}%`}
              />
            </div>
          </div>

          {/* Sustainable Natural Materials */}
          <div>
            <span className="text-xs font-bold text-[#2E1F16] block mb-1.5 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-[#2E1F16]" />
              <span>Verified Sustainable Fabrics:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {store.sustainableMaterials.map(mat => (
                <span
                  key={mat}
                  className="bg-[#C1D7C2]/60 text-[#2E1F16] text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Bonus Info */}
          <div className="p-3 rounded-xl bg-white border border-[#2E1F16]/10 text-xs text-[#2E1F16]">
            <strong>Student Tip:</strong> {store.bonusInfo}
          </div>
        </div>
      </div>

      {/* 3. REVIEWS SECTION */}
      <div className="clevr-card p-6 sm:p-8 bg-[#F7E09A]/20 border border-[#2E1F16]/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2E1F16]/10">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#EFAE6E]" />
              <h2 className="font-editorial text-2xl text-[#2E1F16]">
                Student Reviews for {store.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#2E1F16]/70 mt-0.5">
              Authentic student feedback on selection, fitting room status, and pricing.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="btn-clevr-brown text-xs px-4 py-2 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>{isFormOpen ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Review Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="p-6 bg-white border border-[#2E1F16]/20 rounded-2xl space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg text-[#2E1F16]">
                Submit Your Review
              </h3>
              <span className="text-[11px] font-bold text-[#2E1F16]/50 uppercase tracking-wide">
                Saved Locally
              </span>
            </div>

            {formError && (
              <div className="p-3 bg-[#EFAE6E]/20 border border-[#EFAE6E] rounded-xl text-xs font-bold text-[#2E1F16] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#2E1F16]" />
                <span>{formError}</span>
              </div>
            )}

            <div className="hidden">
              <input
                type="text"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#2E1F16] block mb-1">
                  Your Name / Handle *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya L."
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#2E1F16] block mb-1">
                  Your High School (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Riverside High School"
                  value={authorSchool}
                  onChange={e => setAuthorSchool(e.target.value)}
                  className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none"
                />
              </div>
            </div>

            {/* Star Rating Select */}
            <div>
              <label className="font-bold text-[#2E1F16] text-xs block mb-1">
                Rating: {rating} of 5 Stars
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(starVal => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= rating
                          ? 'fill-[#EFAE6E] text-[#EFAE6E]'
                          : 'text-[#2E1F16]/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Body */}
            <div>
              <label className="font-bold text-[#2E1F16] text-xs block mb-1">
                Review Comments * (Minimum 10 characters)
              </label>
              <textarea
                rows={3}
                placeholder="Share your experience with fitting rooms, inventory variety, pricing, or parking..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl p-3 text-xs font-medium text-[#2E1F16] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="btn-clevr-outline text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-clevr-brown text-xs px-5 py-2 font-bold"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-3">
          {store.reviews.map(rev => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-[#2E1F16]/10 space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2E1F16] text-sm">{rev.author}</span>
                  {rev.school && (
                    <span className="text-[11px] font-semibold text-[#2E1F16]/60">({rev.school})</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5 text-[#EFAE6E]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[#2E1F16]/85 leading-relaxed font-normal">
                {rev.comment}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#2E1F16]/50 font-medium pt-2 border-t border-[#2E1F16]/10">
                <span>{rev.date}</span>
                <button
                  onClick={() => toggleHelpful(rev.id)}
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${
                    helpfulLiked[rev.id] ? 'text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded-full' : 'hover:text-[#EFAE6E]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({(rev.helpfulCount ?? 0) + (helpfulLiked[rev.id] ? 1 : 0)})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
