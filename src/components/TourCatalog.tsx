import React from 'react';
import { Tour, TourCategory } from '../types/tour';
import { Bookmark, Eye, Calendar, ArrowRight, Check, SlidersHorizontal } from 'lucide-react';

interface TourCatalogProps {
  tours: Tour[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  savedTourIds: string[];
  onToggleSave: (id: string) => void;
  comparedTourIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectTour: (tour: Tour) => void;
  onBookTour: (tour: Tour) => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Expeditions', value: 'All' },
  { label: 'Alpine & Glacial', value: 'Alpine & Glacial' },
  { label: 'Marine & Fjords', value: 'Marine & Fjords' },
  { label: 'Cultural Trails', value: 'Cultural Trails' },
  { label: 'Wildlife Safari', value: 'Wildlife Safari' },
];

export const TourCatalog: React.FC<TourCatalogProps> = ({
  tours,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  savedTourIds,
  onToggleSave,
  comparedTourIds,
  onToggleCompare,
  onSelectTour,
  onBookTour,
}) => {
  return (
    <section id="expeditions" className="py-20 bg-stone-950 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Curated Field Journeys
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              2026 – 2027 Expedition Calendar
            </h2>
            <p className="text-sm sm:text-base text-stone-400">
              Handcrafted small-group departures. Each journey is limited to single-vehicle or single-vessel capacities to guarantee authentic immersion.
            </p>
          </div>

          {/* Controls Bar: Sort Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="sort-select" className="text-xs text-stone-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            >
              <option value="recommended">Curated / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-desc">Duration: Longest First</option>
              <option value="duration-asc">Duration: Shortest First</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Segmented Control - Allowed by Section 1.A) */}
        <div className="flex items-center gap-1 p-1 bg-stone-900/90 rounded-xl border border-stone-800 mb-10 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        {tours.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 rounded-2xl border border-stone-800">
            <p className="text-base text-stone-300 font-medium">No expeditions matched your current search filters.</p>
            <p className="text-xs text-stone-500 mt-1">Try resetting the destination query or select "All Expeditions".</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => {
              const isSaved = savedTourIds.includes(tour.id);
              const isCompared = comparedTourIds.includes(tour.id);
              const nextDeparture = tour.departures[0];

              return (
                <div
                  key={tour.id}
                  className="group flex flex-col bg-stone-900/90 rounded-2xl border border-stone-800/90 overflow-hidden hover:border-stone-700 transition-all duration-300 hover:shadow-xl"
                >
                  {/* Visual Asset Container with Fallback */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

                    {/* Bookmark / Save Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(tour.id);
                      }}
                      className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-950/70 text-stone-300 hover:text-white hover:bg-stone-950'
                      }`}
                      title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                      aria-label="Save expedition"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    {/* Compare Quick Toggle */}
                    <div className="absolute bottom-3.5 left-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(tour.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md backdrop-blur-md transition-colors cursor-pointer ${
                          isCompared
                            ? 'bg-amber-400 text-stone-950 font-semibold'
                            : 'bg-stone-950/80 text-stone-300 hover:text-white hover:bg-stone-900'
                        }`}
                      >
                        {isCompared ? <Check className="w-3 h-3" /> : null}
                        <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
                      </button>
                    </div>

                    {/* Status indicator on image */}
                    {nextDeparture && (
                      <div className="absolute top-3.5 left-3.5 text-[11px] font-semibold text-amber-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                        {nextDeparture.status}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                        <span className="text-amber-400 font-medium">{tour.country}</span>
                        <span aria-hidden="true" className="text-stone-600">·</span>
                        <span className="tabular-nums">{tour.durationDays} Days</span>
                        <span aria-hidden="true" className="text-stone-600">·</span>
                        <span>{tour.difficulty}</span>
                        <span aria-hidden="true" className="text-stone-600">·</span>
                        <span className="tabular-nums">Max {tour.groupSizeMax}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug font-display">
                        {tour.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-400 line-clamp-2 leading-relaxed">
                        {tour.tagline}
                      </p>
                    </div>

                    {/* Next Departure & Pricing Area */}
                    <div className="pt-4 border-t border-stone-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          <span>Next: {nextDeparture ? nextDeparture.startDate : 'Contact Concierge'}</span>
                        </div>
                        <div className="text-stone-500 tabular-nums">
                          {nextDeparture ? `${nextDeparture.availableSpots} spots open` : ''}
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-stone-500 block">From</span>
                          <span className="text-xl font-bold text-white tabular-nums font-display">
                            ${tour.startingPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-stone-400 ml-1">/ person</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectTour(tour)}
                            className="p-2.5 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                            title="View Itinerary"
                            aria-label={`View itinerary for ${tour.title}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onBookTour(tour)}
                            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
