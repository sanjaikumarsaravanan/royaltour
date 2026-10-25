import React, { useState } from 'react';
import { Compass, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Tier: Brand & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-stone-800/80 pb-12">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg font-display">
              <Compass className="w-5 h-5 text-amber-500" />
              <span>Solstice Expeditions</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              An independent expedition company specializing in small-group wilderness traverses and cultural journeys. Operating under strict leave-no-trace conservation charters since 2008.
            </p>
          </div>

          <div className="md:col-span-7 bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-200 block">
              Annual Expedition Dispatch & Early Booking Access
            </span>
            <p className="text-stone-400 text-xs">
              Receive private notifications when new seasons open before public release. No promotional spam.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You have been subscribed to private expedition releases.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-stone-950 border border-stone-700 text-stone-100 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Join Dispatch
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Tier: Navigation Mirror & Contact */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Expeditions
            </h4>
            <ul className="space-y-2">
              <li><a href="#expeditions" className="hover:text-amber-400 transition-colors">Patagonia Icefields</a></li>
              <li><a href="#expeditions" className="hover:text-amber-400 transition-colors">Norwegian Fjords</a></li>
              <li><a href="#expeditions" className="hover:text-amber-400 transition-colors">Japanese Alps</a></li>
              <li><a href="#expeditions" className="hover:text-amber-400 transition-colors">Serengeti Safari</a></li>
              <li><a href="#expeditions" className="hover:text-amber-400 transition-colors">Amalfi Maritime</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Company & Standards
            </h4>
            <ul className="space-y-2">
              <li><a href="#leaders" className="hover:text-amber-400 transition-colors">Field Directors</a></li>
              <li><a href="#reviews" className="hover:text-amber-400 transition-colors">Alumni Records</a></li>
              <li><a href="#custom-charters" className="hover:text-amber-400 transition-colors">Private Charters</a></li>
              <li><span className="text-stone-500">Conservation Trust</span></li>
              <li><span className="text-stone-500">Safety & Evacuation Protocols</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Field Logistics Office
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Basecamp Harbor 14, Bergen, Norway</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>+47 55 90 22 10 (EU Dispatch)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>expeditions@solstice-travel.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Pledges & Accreditations
            </h4>
            <p className="text-stone-500 leading-relaxed text-[11px]">
              Member of the International Association of Tour Operators (IAATO), Leave No Trace Center for Outdoor Ethics, and 1% for the Planet Global Conservation Partner.
            </p>
          </div>
        </div>

        {/* Bottom Tier: Legal & Copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-4">
          <div>
            © 2026 Solstice Expeditions Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Carriage</span>
            <span className="hover:text-stone-400 cursor-pointer">Environmental Report</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
