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
              Categories Available:
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
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#2E1F16]">
              Student Reviews &amp; Tips ({store.reviews?.length ?? 0})
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

        {/* Review Form */}
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
                  placeholder="e.g. Jordan D."
                  className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[#2E1F16] mb-1 font-bold">High School</label>
                <input
                  type="text"
                  value={authorSchool}
                  onChange={e => setAuthorSchool(e.target.value)}
                  placeholder="e.g. Riverside High School"
                  className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#2E1F16] mb-1 font-bold">Rating (Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRating(st)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        st <= rating ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#2E1F16] mb-1 font-bold">Your Review &amp; Thrifting Tips *</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What did you score? How are the fitting rooms? Best day to visit?"
                className="w-full p-2.5 bg-white border border-[#2E1F16]/20 rounded-xl"
              />
            </div>

            {/* Honeypot field for anti-spam */}
            <input
              type="text"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
            />

            <button
              type="submit"
              className="btn-clevr-brown text-xs py-2.5 px-6 font-bold cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {!store.reviews || store.reviews.length === 0 ? (
            <p className="text-xs text-[#2E1F16]/60 italic py-4">
              No reviews yet for this location. Be the first Duval student to share a thrift tip!
            </p>
          ) : (
            store.reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-[#FBEFD9]/50 rounded-2xl border border-[#2E1F16]/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-[#2E1F16]">
                    {rev.author} {rev.school && <span className="text-[#2E1F16]/60">· {rev.school}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[#EFAE6E]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#EFAE6E]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#2E1F16]/80 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.tags.map(t => (
                      <span key={t} className="text-[10px] bg-white border border-[#2E1F16]/10 px-2 py-0.5 rounded-full text-[#2E1F16]/70">
                        {t}
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
