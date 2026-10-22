import React, { useState } from 'react';
import { ThriftStoreItem, ReviewItem } from '../data/thriftStores';
import { SchoolItem } from '../data/schools';
import {
  AppFeedbackItem,
  validateReviewSubmission,
  persistAppFeedback,
  persistStoreReview
} from '../utils/storage';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  Send,
  School,
  CheckCircle2,
  Filter,
  Check,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

interface ReviewsViewProps {
  stores: ThriftStoreItem[];
  selectedSchool: SchoolItem | null;
  appFeedbackList: AppFeedbackItem[];
  onAddStoreReview: (storeId: string, review: ReviewItem) => void;
  onAddAppFeedback: (feedback: AppFeedbackItem) => void;
  onSelectStore: (store: ThriftStoreItem) => void;
  onToast: (msg: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  stores,
  selectedSchool,
  appFeedbackList,
  onAddStoreReview,
  onAddAppFeedback,
  onSelectStore,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'storeReviews' | 'appFeedback'>('storeReviews');
  const [selectedFilterStoreId, setSelectedFilterStoreId] = useState<string>('all');

  // Store review form
  const [targetStoreId, setTargetStoreId] = useState<string>(stores[0]?.id || '');
  const [storeReviewAuthor, setStoreReviewAuthor] = useState('');
  const [storeReviewSchool, setStoreReviewSchool] = useState(selectedSchool ? selectedSchool.name : '');
  const [storeReviewRating, setStoreReviewRating] = useState(5);
  const [storeReviewComment, setStoreReviewComment] = useState('');
  const [storeReviewHoneypot, setStoreReviewHoneypot] = useState('');
  const [storeFormError, setStoreFormError] = useState<string | null>(null);
  const [isStoreFormOpen, setIsStoreFormOpen] = useState(false);

  // App feedback form
  const [feedbackAuthor, setFeedbackAuthor] = useState('');
  const [feedbackSchool, setFeedbackSchool] = useState(selectedSchool ? selectedSchool.name : '');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuggestion, setFeedbackSuggestion] = useState('');
  const [feedbackHoneypot, setFeedbackHoneypot] = useState('');
  const [feedbackFormError, setFeedbackFormError] = useState<string | null>(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  const [helpfulLikes, setHelpfulLikes] = useState<{ [id: string]: boolean }>({});

  const toggleHelpful = (id: string) => {
    setHelpfulLikes(prev => {
      const next = !prev[id];
      if (next) onToast('Marked as helpful.');
      return { ...prev, [id]: next };
    });
  };

  const handleStoreReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoreFormError(null);

    const validation = validateReviewSubmission({
      author: storeReviewAuthor,
      comment: storeReviewComment,
      rating: storeReviewRating,
      honeypot: storeReviewHoneypot,
    });

    if (!validation.isValid) {
      setStoreFormError(validation.error || 'Please check your submission.');
      onToast(validation.error || 'Invalid submission');
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: storeReviewAuthor.trim(),
      school: storeReviewSchool.trim() || undefined,
      rating: storeReviewRating,
      date: 'Just now',
      comment: storeReviewComment.trim(),
      helpfulCount: 0,
      tags: ['Verified Student'],
    };

    onAddStoreReview(targetStoreId, newRev);
    onToast(`Review submitted for ${stores.find(s => s.id === targetStoreId)?.name || 'store'}.`);
    setStoreReviewAuthor('');
    setStoreReviewComment('');
    setIsStoreFormOpen(false);
  };

  const handleAppFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackFormError(null);

    const validation = validateReviewSubmission({
      author: feedbackAuthor,
      comment: feedbackComment,
      rating: feedbackRating,
      honeypot: feedbackHoneypot,
    });

    if (!validation.isValid) {
      setFeedbackFormError(validation.error || 'Please check your submission.');
      onToast(validation.error || 'Invalid submission');
      return;
    }

    const newFeedback: AppFeedbackItem = {
      id: `app-fb-${Date.now()}`,
      author: feedbackAuthor.trim(),
      school: feedbackSchool.trim() || 'Duval Student',
      rating: feedbackRating,
      date: 'Just now',
      comment: feedbackComment.trim(),
      suggestion: feedbackSuggestion.trim() || 'None',
      helpfulCount: 0,
    };

    onAddAppFeedback(newFeedback);
    setIsFeedbackSubmitted(true);
    onToast('Thank you! Your feedback for ThriftIt DuvALL was recorded.');
    setFeedbackAuthor('');
    setFeedbackComment('');
    setFeedbackSuggestion('');
  };

  const allStoreReviews = stores.flatMap(st =>
    st.reviews.map(rev => ({
      ...rev,
      storeName: st.name,
      storeId: st.id,
      storePrice: st.priceTier,
      store: st,
    }))
  );

  const displayedStoreReviews = selectedFilterStoreId === 'all'
    ? allStoreReviews
    : allStoreReviews.filter(r => r.storeId === selectedFilterStoreId);

  const overallAvgRating = allStoreReviews.length > 0
    ? (allStoreReviews.reduce((acc, r) => acc + r.rating, 0) / allStoreReviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-[#2E1F16] font-['Nunito',sans-serif]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16] bg-[#C1D7C2]/50 px-2.5 py-0.5 rounded-full inline-block">
          DUVAL STUDENT FORUM
        </span>

        <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-[#2E1F16]">
          Reviews &amp; <span className="font-editorial-italic text-[#EFAE6E]">Feedback</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#2E1F16]/70">
          Real student experiences on local racks, fitting rooms, and budget deals across Duval.
        </p>

        {/* Clean Segmented Tab Control */}
        <div className="inline-flex rounded-full border border-[#2E1F16]/15 p-1 bg-[#F7E09A]/30 mt-3 text-xs">
          <button
            onClick={() => setActiveTab('storeReviews')}
            className={`px-5 py-2 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === 'storeReviews'
                ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
            }`}
          >
            Store Reviews ({allStoreReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('appFeedback')}
            className={`px-5 py-2 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === 'appFeedback'
                ? 'bg-[#C1D7C2] text-[#2E1F16] shadow-xs'
                : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
            }`}
          >
            Platform Feedback ({appFeedbackList.length})
          </button>
        </div>
      </div>

      {/* SYSTEM 1: STORE REVIEWS */}
      {activeTab === 'storeReviews' && (
        <div className="space-y-6 animate-fade-in">
          {/* Rating Summary & Filter Bar */}
          <div className="clevr-card p-5 sm:p-6 bg-[#F7E09A]/20 border border-[#2E1F16]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#2E1F16] bg-white px-3.5 py-2 rounded-xl border border-[#2E1F16]/15 shadow-xs">
                <Star className="w-5 h-5 fill-[#EFAE6E] text-[#EFAE6E]" />
                <span className="font-editorial text-2xl font-bold">{overallAvgRating}</span>
                <span className="text-xs text-[#2E1F16]/50 font-normal">/ 5.0</span>
              </div>
              <span className="text-xs text-[#2E1F16]/70 font-medium">
                Based on {allStoreReviews.length} student submissions across Duval County
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={selectedFilterStoreId}
                onChange={e => setSelectedFilterStoreId(e.target.value)}
                className="bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none cursor-pointer"
              >
                <option value="all">All Stores ({allStoreReviews.length})</option>
                {stores.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.reviews.length})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsStoreFormOpen(!isStoreFormOpen)}
                className="btn-clevr-brown text-xs px-4 py-2"
              >
                <span>{isStoreFormOpen ? 'Close Form' : 'Write Review'}</span>
              </button>
            </div>
          </div>

          {/* Review Submission Form */}
          {isStoreFormOpen && (
            <form
              onSubmit={handleStoreReviewSubmit}
              className="clevr-card p-6 bg-white border border-[#2E1F16]/15 space-y-4 animate-fade-in text-xs shadow-xs"
            >
              <h3 className="font-editorial text-lg text-[#2E1F16]">
                Submit a Store Review
              </h3>

              {storeFormError && (
                <div className="p-3 bg-[#EFAE6E]/20 border border-[#EFAE6E] rounded-xl text-[#2E1F16] font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#2E1F16]" />
                  <span>{storeFormError}</span>
                </div>
              )}

              <div className="hidden">
                <input
                  type="text"
                  value={storeReviewHoneypot}
                  onChange={e => setStoreReviewHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#2E1F16] block mb-1">
                    Select Store *
                  </label>
                  <select
                    value={targetStoreId}
                    onChange={e => setTargetStoreId(e.target.value)}
                    className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none"
                  >
                    {stores.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#2E1F16] block mb-1">
                    Your Name / Handle *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan T."
                    value={storeReviewAuthor}
                    onChange={e => setStoreReviewAuthor(e.target.value)}
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
                    placeholder="e.g. Fletcher High"
                    value={storeReviewSchool}
                    onChange={e => setStoreReviewSchool(e.target.value)}
                    className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="font-bold text-[#2E1F16] block mb-1">
                  Rating: {storeReviewRating} of 5 Stars
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(starVal => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setStoreReviewRating(starVal)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          starVal <= storeReviewRating
                            ? 'fill-[#EFAE6E] text-[#EFAE6E]'
                            : 'text-[#2E1F16]/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2E1F16] block mb-1">
                  Your Comments *
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about prices, fitting rooms, or inventory variety..."
                  value={storeReviewComment}
                  onChange={e => setStoreReviewComment(e.target.value)}
                  className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl p-3 text-xs font-medium text-[#2E1F16] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStoreFormOpen(false)}
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

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedStoreReviews.map(rev => (
              <div
                key={rev.id}
                className="clevr-card p-6 bg-white border border-[#2E1F16]/10 space-y-3 text-xs flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectStore(rev.store)}
                      className="font-editorial text-lg text-[#2E1F16] hover:text-[#EFAE6E] transition-colors cursor-pointer text-left font-bold"
                    >
                      {rev.storeName}
                    </button>

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

                  <div className="flex items-center gap-2 text-[#2E1F16]/70 font-medium">
                    <span className="font-bold text-[#2E1F16]">{rev.author}</span>
                    {rev.school && (
                      <span className="text-[11px]">({rev.school})</span>
                    )}
                  </div>

                  <p className="text-[#2E1F16]/85 leading-relaxed font-normal pt-1">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#2E1F16]/50 font-medium pt-3 border-t border-[#2E1F16]/10">
                  <span>{rev.date}</span>
                  <button
                    onClick={() => toggleHelpful(rev.id)}
                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                      helpfulLikes[rev.id] ? 'text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded-full' : 'hover:text-[#EFAE6E]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({(rev.helpfulCount ?? 0) + (helpfulLikes[rev.id] ? 1 : 0)})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM 2: APP FEEDBACK */}
      {activeTab === 'appFeedback' && (
        <div className="space-y-6 animate-fade-in text-xs">
          {/* Submission Form */}
          <form
            onSubmit={handleAppFeedbackSubmit}
            className="clevr-card p-6 sm:p-8 bg-white border border-[#2E1F16]/10 space-y-4 shadow-xs"
          >
            <div>
              <h2 className="font-editorial text-2xl text-[#2E1F16]">
                Rate <span className="font-editorial-italic text-[#EFAE6E]">ThriftIt DuvALL</span> &amp; Suggest Ideas
              </h2>
              <p className="text-[#2E1F16]/70 text-xs sm:text-sm mt-1">
                Help Duval student developers keep our community database up to date.
              </p>
            </div>

            {feedbackFormError && (
              <div className="p-3 bg-[#EFAE6E]/20 border border-[#EFAE6E] rounded-xl text-[#2E1F16] font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#2E1F16]" />
                <span>{feedbackFormError}</span>
              </div>
            )}

            {isFeedbackSubmitted && (
              <div className="p-3.5 bg-[#C1D7C2]/40 border border-[#C1D7C2] rounded-xl text-[#2E1F16] font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-[#2E1F16] stroke-[3]" />
                <span>Feedback saved to persistent storage. Thank you!</span>
              </div>
            )}

            <div className="hidden">
              <input
                type="text"
                value={feedbackHoneypot}
                onChange={e => setFeedbackHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2E1F16] block mb-1">
                  Your Name / Grade *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex (11th Grade)"
                  value={feedbackAuthor}
                  onChange={e => setFeedbackAuthor(e.target.value)}
                  className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#2E1F16] block mb-1">
                  Your High School
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanton College Prep"
                  value={feedbackSchool}
                  onChange={e => setFeedbackSchool(e.target.value)}
                  className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#2E1F16] focus:outline-none"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="font-bold text-[#2E1F16] block mb-1">
                Rate Your Experience:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(starVal => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setFeedbackRating(starVal)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        starVal <= feedbackRating
                          ? 'fill-[#EFAE6E] text-[#EFAE6E]'
                          : 'text-[#2E1F16]/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-[#2E1F16] block mb-1">
                What do you love about ThriftIt? *
              </label>
              <textarea
                rows={2}
                placeholder="How does this help you choose sustainable clothing or find stores..."
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
                className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl p-3 text-xs font-medium text-[#2E1F16] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#2E1F16] block mb-1">
                Feature Suggestions
              </label>
              <input
                type="text"
                placeholder="e.g. Add school thrift swap events, more vintage stores..."
                value={feedbackSuggestion}
                onChange={e => setFeedbackSuggestion(e.target.value)}
                className="w-full bg-[#FBEFD9] border border-[#2E1F16]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#2E1F16] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="btn-clevr-brown text-xs px-5 py-2.5 font-bold"
              >
                Submit Feedback
              </button>
            </div>
          </form>

          {/* Feedback Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {appFeedbackList.map(fb => (
              <div
                key={fb.id}
                className="clevr-card p-6 bg-white border border-[#2E1F16]/10 space-y-3 text-xs flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2E1F16] text-sm">{fb.author}</span>
                      <span className="text-[#2E1F16]/50">·</span>
                      <span className="text-[#2E1F16]/70 font-medium">{fb.school}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#EFAE6E]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < fb.rating ? 'fill-[#EFAE6E] text-[#EFAE6E]' : 'text-[#2E1F16]/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#2E1F16]/85 leading-relaxed font-normal">
                    "{fb.comment}"
                  </p>

                  {fb.suggestion && fb.suggestion !== 'None' && (
                    <div className="p-3 rounded-xl bg-[#F7E09A]/20 border border-[#2E1F16]/10 text-[#2E1F16]/80">
                      <strong className="text-[#2E1F16]">Suggestion:</strong> {fb.suggestion}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#2E1F16]/50 font-medium pt-3 border-t border-[#2E1F16]/10">
                  <span>{fb.date}</span>
                  <button
                    onClick={() => toggleHelpful(fb.id)}
                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                      helpfulLikes[fb.id] ? 'text-[#2E1F16] font-bold bg-[#C1D7C2] px-2 py-0.5 rounded-full' : 'hover:text-[#EFAE6E]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({fb.helpfulCount + (helpfulLikes[fb.id] ? 1 : 0)})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
