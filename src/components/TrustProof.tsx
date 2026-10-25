import React from 'react';
import { ShieldCheck, Users, Globe2, Award } from 'lucide-react';

export const TrustProof: React.FC = () => {
  return (
    <section className="bg-stone-900 border-b border-stone-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Stat 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Intimate Group Limit</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-100 tabular-nums font-display">
              6 to 12
            </div>
            <p className="text-sm text-stone-400 leading-snug">
              Strictly capped guest ratios per departure ensure access to fragile habitats without overcrowding.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Award className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Field Leadership</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-100 tabular-nums font-display">
              18+ Yrs
            </div>
            <p className="text-sm text-stone-400 leading-snug">
              Led by certified alpine IFMGA guides, marine biologists, and resident cultural anthropologists.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Alumni Satisfaction</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-100 tabular-nums font-display">
              4.96 <span className="text-lg text-stone-500 font-normal">/ 5.0</span>
            </div>
            <p className="text-sm text-stone-400 leading-snug">
              Across 1,840+ verified travelers since 2008, with over 68% repeat or referral expedition alumni.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Globe2 className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Carbon Balanced</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-100 tabular-nums font-display">
              100%
            </div>
            <p className="text-sm text-stone-400 leading-snug">
              Every nautical mile and overland transit is verified carbon-neutral and funds indigenous conservancies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
