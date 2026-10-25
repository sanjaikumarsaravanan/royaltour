import React from 'react';
import { Tour } from '../types/tour';
import { X, Trash2, ArrowRight, Eye, Bookmark } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTours: Tour[];
  onRemove: (tourId: string) => void;
  onViewTour: (tour: Tour) => void;
  onBookTour: (tour: Tour) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  savedTours,
  onRemove,
  onViewTour,
  onBookTour,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              Saved Expeditions ({savedTours.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close saved drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedTours.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-800/80 text-stone-500 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm text-stone-300 font-medium">Your expedition wishlist is empty.</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Click the bookmark icon on any expedition card to save it for quick review or comparison.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
              >
                Browse Expeditions
              </button>
            </div>
          ) : (
            savedTours.map((tour) => (
              <div
                key={tour.id}
                className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                      {tour.country} · {tour.durationDays} Days
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 font-display">
                      {tour.title}
                    </h4>
                    <div className="text-xs font-bold text-stone-200 tabular-nums font-display">
                      From ${tour.startingPrice.toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(tour.id)}
                    className="text-stone-500 hover:text-red-400 p-1 self-start"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-800/60">
                  <button
                    type="button"
                    onClick={() => {
                      onViewTour(tour);
                      onClose();
                    }}
                    className="flex-1 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 rounded-md text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Itinerary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onBookTour(tour);
                      onClose();
                    }}
                    className="flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-md text-center cursor-pointer"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedTours.length > 0 && (
          <div className="p-5 border-t border-stone-800 bg-stone-950/80">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg text-center cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
