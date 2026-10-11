import React, { useState, useEffect } from 'react';
import { INITIAL_CUSTOMER_REVIEWS } from '../data/customerReviewsData';
import { CustomerReview } from '../types';
import { Star, CheckCircle2, MessageCircle, ExternalLink, Send, ShieldCheck, MapPin, Sparkles, Building2, ThumbsUp } from 'lucide-react';

interface ReviewsAndRatingsSectionProps {
  onOpenQuoteModal: (varietyName?: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const ReviewsAndRatingsSection: React.FC<ReviewsAndRatingsSectionProps> = ({
  onOpenQuoteModal,
  onSuccessToast,
}) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('hashir_rice_customer_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_CUSTOMER_REVIEWS];
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMER_REVIEWS;
  });

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formBusiness, setFormBusiness] = useState('');
  const [formBuyerType, setFormBuyerType] = useState<CustomerReview['buyerType']>('Grain Wholesaler');
  const [formCity, setFormCity] = useState('');
  const [formVariety, setFormVariety] = useState('1121 Kainat Steam');
  const [formRating, setFormRating] = useState(5);
  const [formCookingRating, setFormCookingRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formHoverStar, setFormHoverStar] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const initials = formName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AR';

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      authorName: formName.trim(),
      businessName: formBusiness.trim() || 'Direct Wholesale Buyer',
      buyerType: formBuyerType,
      city: formCity.trim() || 'Pakistan',
      rating: formRating,
      cookingRating: formCookingRating,
      varietyPurchased: formVariety,
      reviewTitle: formTitle.trim() || 'Satisfied with quality & delivery',
      comment: formComment.trim(),
      date: 'Just now',
      verified: true,
      source: 'direct',
      avatarInitials: initials,
      googleProfileUrl: 'https://share.google/Xog0BKr0oU1NiGIUL',
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    try {
      const savedOnly = JSON.parse(localStorage.getItem('hashir_rice_customer_reviews') || '[]');
      localStorage.setItem('hashir_rice_customer_reviews', JSON.stringify([newReview, ...savedOnly]));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitted(true);
    if (onSuccessToast) {
      onSuccessToast('Thank you! Your verified review has been published.');
    }

    // Reset Form
    setFormName('');
    setFormBusiness('');
    setFormCity('');
    setFormTitle('');
    setFormComment('');
  };

  const filteredReviews = selectedFilter === 'all'
    ? reviews
    : reviews.filter((r) => {
        if (selectedFilter === 'wholesaler') return r.buyerType === 'Grain Wholesaler';
        if (selectedFilter === 'catering') return r.buyerType === 'Catering Contractor' || r.buyerType === 'Restaurant / Hotelier';
        if (selectedFilter === 'exporter') return r.buyerType === 'Rice Exporter';
        return true;
      });

  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section id="customer-reviews" className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header & Google Business Rating Summary */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Google Reviews & Buyer Ratings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
              What Grain Wholesalers & Catering Masters Say
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Read authentic feedback from restaurant chains, grain dealers, and bulk buyers across Pakistan who source their Basmati, 1121 Kainat, and IRRI lots through Hashir Rice Supplier.
            </p>
          </div>

          {/* Google Official Rating Badge Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-xl text-neutral-900 shadow-2xs">
                <span className="text-emerald-900 font-serif font-black">G</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-serif text-2xl font-bold text-neutral-950">{averageRating}</span>
                  <div className="flex items-center text-amber-500 ml-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-600 font-medium">
                  Verified Google Business Reviews ({reviews.length}+ ratings)
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col justify-end gap-2 pt-2 sm:pt-0 sm:border-l sm:border-neutral-200 sm:pl-4">
              <a
                href="https://share.google/Xog0BKr0oU1NiGIUL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-neutral-100 text-emerald-950 text-xs font-bold rounded-lg border border-neutral-300 shadow-2xs transition-colors"
              >
                <span>View Google Maps Profile</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive "Write Customer Review" Form Drawer/Section */}
        {showReviewForm && (
          <div className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm animate-fadeIn">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Customer Sourcing Feedback
                </span>
                <h3 className="font-serif text-2xl font-bold text-neutral-950">
                  Share Your Experience with Hashir Rice Supplier
                </h3>
                <p className="text-xs text-neutral-600">
                  Your feedback helps rice traders and restaurant owners make confident wholesale purchasing decisions.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 bg-white rounded-xl border border-emerald-300 shadow-2xs text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-neutral-950">
                    Review Submitted Successfully!
                  </h4>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto">
                    Thank you for reviewing Hashir Rice Supplier. Your feedback is now live below. You can also share your review directly on Google Maps.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="https://share.google/Xog0BKr0oU1NiGIUL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <span>Post on Google Business Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs rounded-lg border border-neutral-300 transition-colors"
                    >
                      Write Another Review
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Haji Tariq Mehmood"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Business / Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mehmood Catering & Banquets"
                        value={formBusiness}
                        onChange={(e) => setFormBusiness(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Business Type
                      </label>
                      <select
                        value={formBuyerType}
                        onChange={(e) => setFormBuyerType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                      >
                        <option value="Grain Wholesaler">Grain Wholesaler / Dealer</option>
                        <option value="Catering Contractor">Daig / Catering Contractor</option>
                        <option value="Restaurant / Hotelier">Restaurant / Biryani Centre</option>
                        <option value="Rice Exporter">Rice Exporter / Trade House</option>
                        <option value="Supermarket / Retailer">Supermarket / Retail Brand</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        City / Market Location *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karachi (Jodia Bazar) or Lahore"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Rice Variety Sourced
                      </label>
                      <select
                        value={formVariety}
                        onChange={(e) => setFormVariety(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                      >
                        <option value="1121 Kainat Steam (22mm+)">1121 Kainat Steam (22mm+)</option>
                        <option value="Super Kernel Basmati (Aged)">Super Kernel Basmati (Aged)</option>
                        <option value="1121 Kainat Golden Sella">1121 Kainat Golden Sella</option>
                        <option value="IRRI-6 White Rice (5% Broken)">IRRI-6 White Rice (5% Broken)</option>
                        <option value="IRRI-9 Long Grain">IRRI-9 Long Grain</option>
                        <option value="PK 386 Fragrant Rice">PK 386 Fragrant Rice</option>
                        <option value="Basmati Broken (Tota)">Basmati Broken (Tota)</option>
                      </select>
                    </div>

                    {/* Star Rating Selectors */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Overall Experience Rating
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormRating(star)}
                            onMouseEnter={() => setFormHoverStar(star)}
                            onMouseLeave={() => setFormHoverStar(null)}
                            className="p-1 focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                (formHoverStar !== null ? formHoverStar >= star : formRating >= star)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-neutral-700 ml-2">
                          {formRating} of 5 Stars
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Excellent grain elongation, 100% matched our approved sample"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Your Detailed Review / Cooking & Delivery Feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience regarding sample approval, truck loading consistency, cooking test in daig, or broker transparency..."
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:border-emerald-800 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Reviews are verified for genuine commercial rice transactions.
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Verified Review</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'wholesaler', label: 'Grain Wholesalers' },
              { id: 'catering', label: 'Catering & Restaurants' },
              { id: 'exporter', label: 'Rice Exporters' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedFilter === f.id
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-neutral-500">
            Showing <strong>{filteredReviews.length}</strong> verified reviews
          </span>
        </div>

        {/* Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-emerald-700/50 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header with Avatar & Star Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">
                      {rev.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-neutral-950 text-xs">
                          {rev.authorName}
                        </h4>
                        {rev.verified && (
                          <span title="Verified Wholesale Buyer">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate max-w-[170px]">
                        {rev.businessName}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-400">
                    {[...Array(Math.max(1, Math.min(5, rev.rating || 5)))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Location & Variety Pill */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium">
                    <MapPin className="w-2.5 h-2.5 text-emerald-700" />
                    {rev.city}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                    {rev.varietyPurchased}
                  </span>
                </div>

                {/* Review Title & Body */}
                <div>
                  <h5 className="font-serif text-sm font-bold text-neutral-950 mb-1">
                    "{rev.reviewTitle}"
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              </div>

              {/* Card Footer with Date & Source */}
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span>{rev.date}</span>
                <span className="inline-flex items-center gap-1 text-emerald-900 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Google Business Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-neutral-950">
              Experience the Same Verified Quality in Your Commercial Kitchen or Shop
            </h4>
            <p className="text-xs text-neutral-600">
              Order a Free Sample packet to test grain elongation before booking bulk truck volume.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuoteModal()}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
            >
              Request Bulk Rate
            </button>
            <a
              href="https://share.google/Xog0BKr0oU1NiGIUL"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs rounded-xl border border-neutral-300 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>More Google Reviews</span>
              <ExternalLink className="w-3 h-3 text-emerald-700" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
