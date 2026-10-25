import React from 'react';
import { Search, Compass, Calendar, Users, ArrowRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  selectedSeason: string;
  setSelectedSeason: (val: string) => void;
  onExploreClick: () => void;
  onOpenBespoke: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedSeason,
  setSelectedSeason,
  onExploreClick,
  onOpenBespoke,
}) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden border-b border-stone-800">
      {/* Background Photography with Scrim */}
      <div className="absolute inset-0 z-0 bg-stone-950">
        <img
          src="/src/assets/images/hero_patagonia_expedition_1792906260978.jpg"
          alt="Expedition hikers overlooking turquoise glacial lake and granite spires in Patagonia"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000 ease-out"
        />
        {/* Measured scrim overlay for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/40" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Quiet unboxed kicker without pill badges */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-400">
            <span>Boutique Expedition Travel</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Est. 2008</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Strictly 6–12 Guests</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] [text-wrap:balance] font-display">
            Curated Expeditions to the Earth's Untamed Frontiers
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
            We operate small-group, low-impact expeditions led by seasoned field naturalists, glaciologists, and maritime historians across Patagonia, the Arctic fjords, East Africa, and feudal Japanese trails.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-md cursor-pointer"
            >
              <span>Explore 2026 Expeditions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenBespoke}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-medium text-stone-200 bg-stone-900/80 hover:bg-stone-800 rounded-lg border border-stone-700/80 transition-colors whitespace-nowrap backdrop-blur-sm cursor-pointer"
            >
              <span>Plan Custom Private Charter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integrated Discovery & Search Strip at Base */}
      <div className="relative z-10 bg-stone-950/95 border-t border-stone-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
          >
            {/* Search Input */}
            <div className="relative">
              <label htmlFor="search-input" className="block text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-1">
                Keyword or Destination
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Patagonia, Fjord, Safari..."
                  className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Region Selector */}
            <div>
              <label htmlFor="region-select" className="block text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-1">
                Region
              </label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              >
                <option value="All">All Continents & Regions</option>
                <option value="South America">South America (Patagonia)</option>
                <option value="Northern Europe">Northern Europe (Norway)</option>
                <option value="East Asia">East Asia (Japan)</option>
                <option value="East Africa">East Africa (Serengeti)</option>
                <option value="Southern Europe">Southern Europe (Amalfi)</option>
              </select>
            </div>

            {/* Season Selector */}
            <div>
              <label htmlFor="season-select" className="block text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-1">
                Departure Window
              </label>
              <select
                id="season-select"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700/80 text-stone-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              >
                <option value="All">All Departure Windows</option>
                <option value="Spring">Spring Departures (Apr – Jun)</option>
                <option value="Summer">Summer Departures (Jul – Aug)</option>
                <option value="Autumn">Autumn Departures (Sep – Nov)</option>
                <option value="Winter">Winter Departures (Dec – Jan)</option>
              </select>
            </div>

            {/* Submit Action */}
            <div className="sm:col-span-2 lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full h-10 mt-auto flex items-center justify-center gap-2 bg-stone-100 hover:bg-white text-stone-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-stone-900" />
                <span>Search Expeditions</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
