'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  images?: string[];
  size?: string;
  fit?: 'small' | 'true' | 'large';
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  initialReviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Marco T.',
    rating: 5,
    title: 'Absolutely stunning quality!',
    content:
      'The jersey quality is exceptional. The stitching is perfect and the material feels premium. I\'ve washed it several times and it still looks brand new. The fit is true to size - I ordered my usual L and it fits perfectly.',
    date: '2026-01-05',
    helpful: 24,
    verified: true,
    size: 'L',
    fit: 'true',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah K.',
    rating: 4,
    title: 'Great jersey, runs slightly large',
    content:
      'Love the design and colors. The quality is top-notch. Only giving 4 stars because it runs a bit large. If you\'re between sizes, definitely go with the smaller one.',
    date: '2026-01-03',
    helpful: 12,
    verified: true,
    size: 'M',
    fit: 'large',
  },
  {
    id: '3',
    userId: '3',
    userName: 'James W.',
    rating: 5,
    title: 'Perfect for game day!',
    content:
      'Wore this to the match last weekend and got so many compliments. The material is breathable and comfortable. Fast shipping too!',
    date: '2025-12-28',
    helpful: 8,
    verified: true,
    size: 'XL',
    fit: 'true',
  },
];

export default function ProductReviews({
  productId,
  productName,
  initialReviews = mockReviews,
  averageRating = 4.7,
  totalReviews = 127,
}: ProductReviewsProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    size: '',
    fit: '' as '' | 'small' | 'true' | 'large',
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in to write a review', 'error');
      return;
    }

    if (reviewForm.rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName.charAt(0)}.`,
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: true,
      size: reviewForm.size || undefined,
      fit: reviewForm.fit || undefined,
    };

    setReviews([newReview, ...reviews]);
    setShowWriteReview(false);
    setReviewForm({ rating: 0, title: '', content: '', size: '', fit: '' });
    showToast('Thank you for your review!', 'success');
  };

  const handleHelpful = (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) return;

    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
    setHelpfulClicked(new Set([...helpfulClicked, reviewId]));
    showToast('Thanks for your feedback!', 'success');
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const filteredReviews = filterRating
    ? sortedReviews.filter((r) => r.rating === filterRating)
    : sortedReviews;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }));

  return (
    <div className="space-y-8">
      {/* Header & Summary */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Rating Summary */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-4 justify-center lg:justify-start mb-4">
              <span
                className="text-5xl font-bold text-gold-400"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {averageRating.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${star <= Math.round(averageRating) ? 'text-gold-400' : 'text-white/20'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-white/50 text-sm">{totalReviews} reviews</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWriteReview(true)}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
            >
              Write a Review
            </motion.button>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 max-w-md">
            {ratingDistribution.map((item) => (
              <button
                key={item.rating}
                onClick={() => setFilterRating(filterRating === item.rating ? null : item.rating)}
                className={`w-full flex items-center gap-3 py-1.5 group ${
                  filterRating === item.rating ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-white/60 text-sm w-12">{item.rating} star</span>
                <div className="flex-1 h-2 bg-night-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    className="h-full bg-gold-400 rounded-full"
                  />
                </div>
                <span className="text-white/40 text-sm w-8">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWriteReview(false)}
              className="fixed inset-0 bg-night-900/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-night-800 rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Write a Review</h3>
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="text-white/50 text-sm mb-2 block">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className={`text-3xl transition-colors ${
                          star <= reviewForm.rating ? 'text-gold-400' : 'text-white/20 hover:text-white/40'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm mb-2 block">Review Title *</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Summarize your experience"
                    required
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/50 text-sm mb-2 block">Your Review *</label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="What did you like or dislike about this product?"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Size Purchased</label>
                    <select
                      value={reviewForm.size}
                      onChange={(e) => setReviewForm({ ...reviewForm, size: e.target.value })}
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="2XL">2XL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">How Did It Fit?</label>
                    <select
                      value={reviewForm.fit}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          fit: e.target.value as '' | 'small' | 'true' | 'large',
                        })
                      }
                      className="w-full px-4 py-3 bg-night-700 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <option value="">Select fit</option>
                      <option value="small">Runs Small</option>
                      <option value="true">True to Size</option>
                      <option value="large">Runs Large</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWriteReview(false)}
                    className="flex-1 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                  >
                    Submit Review
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">Filter:</span>
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="flex items-center gap-1 px-3 py-1 bg-gold-500/20 text-gold-400 text-sm rounded-full"
            >
              {filterRating} Stars
              <span className="ml-1">✕</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-night-700 border border-gold-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/50 cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-4">📝</span>
            <p className="text-white/50">No reviews match your filter.</p>
            <button
              onClick={() => setFilterRating(null)}
              className="text-gold-400 text-sm mt-2 hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-600/30 flex items-center justify-center text-gold-400 font-bold">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{review.userName}</span>
                      {review.verified && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= review.rating ? 'text-gold-400' : 'text-white/20'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-white/40">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-white font-semibold mb-2">{review.title}</h4>
              <p className="text-white/60 leading-relaxed mb-4">{review.content}</p>

              {(review.size || review.fit) && (
                <div className="flex gap-4 mb-4">
                  {review.size && (
                    <span className="text-white/40 text-sm">Size: {review.size}</span>
                  )}
                  {review.fit && (
                    <span className="text-white/40 text-sm">
                      Fit:{' '}
                      {review.fit === 'small'
                        ? 'Runs Small'
                        : review.fit === 'large'
                        ? 'Runs Large'
                        : 'True to Size'}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulClicked.has(review.id)}
                  className={`text-sm transition-colors ${
                    helpfulClicked.has(review.id)
                      ? 'text-gold-400'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  👍 Helpful ({review.helpful})
                </button>
                <button className="text-white/40 text-sm hover:text-white/60 transition-colors">
                  Report
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredReviews.length > 0 && (
        <div className="text-center">
          <button className="text-gold-400 hover:text-gold-300 transition-colors">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}
