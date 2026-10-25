import React, { useState } from 'react';
import { Bookmark, Menu, X, Compass, PhoneCall } from 'lucide-react';

interface NavbarProps {
  savedCount: number;
  onOpenWishlist: () => void;
  onOpenBooking: () => void;
  onOpenBespoke: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenWishlist,
  onOpenBooking,
  onOpenBespoke,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a 
          href="#" 
          className="text-xl sm:text-2xl font-bold tracking-tight text-stone-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 font-display"
        >
          <Compass className="w-6 h-6 text-amber-500" />
          <span>Solstice Expeditions</span>
        </a>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a href="#expeditions" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Expeditions
          </a>
          <a href="#destinations" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Destinations
          </a>
          <a href="#custom-charters" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Bespoke Charters
          </a>
          <a href="#leaders" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Field Leaders
          </a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Alumni Reviews
          </a>
        </nav>

        {/* Zone 3: 1 primary action + saved wishlist trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2.5 text-stone-300 hover:text-amber-400 hover:bg-stone-900 rounded-lg transition-colors"
            title="Saved Expeditions"
            aria-label="View saved expeditions"
          >
            <Bookmark className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center tabular-nums">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Reserve Expedition
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-900 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium text-stone-300">
            <a 
              href="#expeditions" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-400 transition-colors"
            >
              Expeditions
            </a>
            <a 
              href="#destinations" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-400 transition-colors"
            >
              Destinations
            </a>
            <a 
              href="#custom-charters" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-400 transition-colors"
            >
              Bespoke Charters
            </a>
            <a 
              href="#leaders" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-400 transition-colors"
            >
              Field Leaders
            </a>
            <a 
              href="#reviews" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-amber-400 transition-colors"
            >
              Alumni Reviews
            </a>
          </nav>
          <div className="pt-4 border-t border-stone-800 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full text-center py-3 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Reserve Expedition
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBespoke();
              }}
              className="w-full text-center py-2.5 text-xs font-medium text-stone-300 bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors border border-stone-800"
            >
              Plan Custom Private Charter
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
