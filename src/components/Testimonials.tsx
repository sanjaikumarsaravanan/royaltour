import React from 'react';
import { ALUMNI_REVIEWS } from '../data/toursData';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Verified Alumni Records
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            Direct Accounts from the Field
          </h2>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            Real feedback from verified travelers who completed our remote small-group traverses across 2024 and 2025.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ALUMNI_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-stone-950/80 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-[11px] text-stone-500 tabular-nums">
                    {review.travelDate}
                  </div>
                </div>

                <p className="text-stone-300 text-sm leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-stone-400">{review.outcome}</span>
                </div>

                <div className="pt-1">
                  <div className="text-sm font-semibold text-white">
                    {review.travelerName}
                  </div>
                  <div className="text-xs text-stone-500">
                    {review.travelerCity} · <span className="text-amber-400/90">{review.expeditionTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
