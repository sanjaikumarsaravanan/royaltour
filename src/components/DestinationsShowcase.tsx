import React from 'react';
import { ArrowRight, Compass, Mountain, Waves, Trees, Sun } from 'lucide-react';

interface DestinationsShowcaseProps {
  onSelectRegion: (region: string) => void;
}

export const DestinationsShowcase: React.FC<DestinationsShowcaseProps> = ({
  onSelectRegion,
}) => {
  return (
    <section id="destinations" className="py-20 bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Global Operating Terrains
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              Four Continents, One Guiding Standard
            </h2>
            <p className="text-sm sm:text-base text-stone-400">
              We focus solely on wilderness corridors where mass commercial tourism cannot reach.
            </p>
          </div>
        </div>

        {/* Asymmetric Bento Grid (Section 2.C of skill) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Patagonia - Large Span (col-span-7) */}
          <div
            onClick={() => onSelectRegion('South America')}
            className="md:col-span-7 relative group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer min-h-[340px] flex flex-col justify-end p-8 transition-all hover:border-stone-700"
          >
            <img
              src="/src/assets/images/hero_patagonia_expedition_1792906260978.jpg"
              alt="Southern Patagonian Icefield and Torres del Paine"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Mountain className="w-4 h-4" />
                <span>Patagonia & The Southern Andes</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Glacial Lagoons & Granite Spires
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed">
                Trek Los Glaciares and Torres del Paine across remote ice tongues and stay in sustainable backcountry geodesic domes.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>View Expeditions in South America</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Norway Fjords - Medium Span (col-span-5) */}
          <div
            onClick={() => onSelectRegion('Northern Europe')}
            className="md:col-span-5 relative group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer min-h-[340px] flex flex-col justify-end p-8 transition-all hover:border-stone-700"
          >
            <img
              src="/src/assets/images/tour_nordic_fjords_1792906261860.jpg"
              alt="Norwegian fjords expedition ship navigating deep emerald waters"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Waves className="w-4 h-4" />
                <span>Norway & Arctic Sounds</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Vertical Glacial Waterways
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Cruise UNESCO fjords aboard an ice-strengthened vessel with sea-kayak landings under thundering falls.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                <span>View Norway Departures</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Japanese Alps (col-span-4) */}
          <div
            onClick={() => onSelectRegion('East Asia')}
            className="md:col-span-4 relative group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer min-h-[300px] flex flex-col justify-end p-6 transition-all hover:border-stone-700"
          >
            <img
              src="/src/assets/images/tour_japan_alps_1792906261977.jpg"
              alt="Japanese Alps forest moss trails"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Trees className="w-4 h-4" />
                <span>Japanese Alps</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Nakasendo & Sacred Trails
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                Hike feudal post towns, sleep in century-old ryokans, and soak in secluded mineral onsen.
              </p>
            </div>
          </div>

          {/* Card 4: Serengeti (col-span-4) */}
          <div
            onClick={() => onSelectRegion('East Africa')}
            className="md:col-span-4 relative group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer min-h-[300px] flex flex-col justify-end p-6 transition-all hover:border-stone-700"
          >
            <img
              src="/src/assets/images/tour_serengeti_safari_1792906263631.jpg"
              alt="Serengeti migration safari with elephants"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>East Africa</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Serengeti & Ngorongoro
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                Intimate 6-guest mobile tented safari camps following predator prides and migration herds.
              </p>
            </div>
          </div>

          {/* Card 5: Amalfi & Capri (col-span-4) */}
          <div
            onClick={() => onSelectRegion('Southern Europe')}
            className="md:col-span-4 relative group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer min-h-[300px] flex flex-col justify-end p-6 transition-all hover:border-stone-700"
          >
            <img
              src="/src/assets/images/tour_amalfi_coastal_1792906263365.jpg"
              alt="Mediterranean Amalfi wooden boat charter"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Sun className="w-4 h-4" />
                <span>Mediterranean Sanctuary</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Amalfi & Capri Charters
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2">
                Handmade mahogany wooden boat navigation along sea grottoes and clifftop lemon groves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
