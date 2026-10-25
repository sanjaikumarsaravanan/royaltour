import React from 'react';
import { Tour } from '../types/tour';
import { X, Check, ArrowRight } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedTours: Tour[];
  onRemoveTour: (id: string) => void;
  onBookTour: (tour: Tour) => void;
  onViewTour: (tour: Tour) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedTours,
  onRemoveTour,
  onBookTour,
  onViewTour,
}) => {
  if (!isOpen || comparedTours.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Side-by-Side Analysis
            </span>
            <h3 className="text-xl font-bold text-white font-display">
              Compare Expeditions ({comparedTours.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close comparison view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto flex-1 p-6">
          <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-6">
            {comparedTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-stone-950/90 border border-stone-800 rounded-xl p-5 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Image & Title */}
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-900">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveTour(tour.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-950/80 text-stone-400 hover:text-white"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                      {tour.region} · {tour.country}
                    </span>
                    <h4 className="text-base font-bold text-white font-display mt-0.5">
                      {tour.title}
                    </h4>
                    <div className="text-lg font-bold text-stone-100 tabular-nums font-display mt-1">
                      ${tour.startingPrice.toLocaleString()}
                      <span className="text-xs font-normal text-stone-400"> / traveler</span>
                    </div>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="space-y-2 text-xs border-t border-stone-800/80 pt-3">
                    <div className="flex justify-between py-1 border-b border-stone-800/40">
                      <span className="text-stone-500">Duration:</span>
                      <span className="text-stone-200 font-medium tabular-nums">{tour.durationDays} Days</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/40">
                      <span className="text-stone-500">Physical Pace:</span>
                      <span className="text-stone-200 font-medium">{tour.difficulty}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/40">
                      <span className="text-stone-500">Group Limit:</span>
                      <span className="text-stone-200 font-medium tabular-nums">Max {tour.groupSizeMax}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/40">
                      <span className="text-stone-500">Next Departure:</span>
                      <span className="text-amber-400 font-medium">{tour.departures[0]?.startDate || 'Inquire'}</span>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                      Key Field Highlights
                    </span>
                    <ul className="space-y-1 text-xs text-stone-300">
                      {tour.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      onBookTour(tour);
                      onClose();
                    }}
                    className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg text-center cursor-pointer transition-colors"
                  >
                    Reserve This Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onViewTour(tour);
                      onClose();
                    }}
                    className="w-full py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-lg text-center cursor-pointer border border-stone-800 transition-colors"
                  >
                    Full Itinerary Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 rounded-lg cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
