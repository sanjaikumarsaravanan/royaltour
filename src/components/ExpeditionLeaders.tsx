import React from 'react';
import { EXPEDITION_LEADERS } from '../data/toursData';
import { Award, Compass, Shield } from 'lucide-react';

export const ExpeditionLeaders: React.FC = () => {
  return (
    <section id="leaders" className="py-20 bg-stone-950 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Field Naturalists & Navigators
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            Guided by Practicing Scientists and Local Historians
          </h2>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
            We do not hire commercial tour operators. Every Solstice journey is accompanied by certified alpine IFMGA guides, glaciologists, and resident naturalists with deep local roots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPEDITION_LEADERS.map((leader) => (
            <div
              key={leader.id}
              className="bg-stone-900/90 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between space-y-4 hover:border-stone-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-bold flex items-center justify-center text-sm">
                    {leader.avatarText}
                  </div>
                  <span className="text-xs text-stone-500 font-mono tabular-nums">
                    {leader.yearsExperience} Years Field
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {leader.name}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {leader.role}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    {leader.specialty}
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed pt-1">
                  {leader.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800/80 flex items-center gap-1.5 text-[11px] text-stone-500">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Wilderness First Responder Certified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
