import React, { useState } from 'react';
import { Compass, Sparkles, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const BespokeTripBuilder: React.FC = () => {
  const [region, setRegion] = useState('Patagonia');
  const [duration, setDuration] = useState(10);
  const [travelers, setTravelers] = useState(4);
  const [intensity, setIntensity] = useState<'Gentle' | 'Balanced' | 'Demanding'>('Balanced');
  const [helicopterAccess, setHelicopterAccess] = useState(false);
  const [privateChef, setPrivateChef] = useState(true);
  const [wildlifeBiologist, setWildlifeBiologist] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Dynamic estimate calculation
  const baseRatePerDay = region === 'Serengeti' ? 950 : region === 'Patagonia' ? 750 : region === 'Norwegian Fjords' ? 820 : 700;
  let multiplier = intensity === 'Demanding' ? 1.15 : intensity === 'Balanced' ? 1.0 : 0.95;
  let addOnsPerDay = 0;
  if (helicopterAccess) addOnsPerDay += 450;
  if (privateChef) addOnsPerDay += 180;
  if (wildlifeBiologist) addOnsPerDay += 220;

  const estimatedPerPerson = Math.round((baseRatePerDay * multiplier + addOnsPerDay) * duration);
  const estimatedTotal = estimatedPerPerson * travelers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <section id="custom-charters" className="py-20 bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Explanations */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Bespoke Private Journeys
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display [text-wrap:balance]">
              Tailor-Made Private Charters & Family Expeditions
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Prefer an exclusive departure tailored strictly to your private group, family milestone, or research circle? We engineer custom itineraries with private air charters, dedicated field naturalists, and access to private conservancies unavailable to commercial travelers.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Full Vessel & Lodge Buyouts</h3>
                  <p className="text-xs text-stone-400">Exclusive access without strangers or fixed schedules.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Dedicated Expedition Director</h3>
                  <p className="text-xs text-stone-400">Personalized logistics, medical safety officer, and concierge.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Bespoke Calculator & Form */}
          <div className="lg:col-span-7 bg-stone-950 rounded-2xl border border-stone-800 p-6 sm:p-8 space-y-6">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  Bespoke Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                  Thank you, <span className="text-white font-semibold">{name}</span>. Senior Expedition Architect Elena Rostova will review your custom configuration for {region} ({duration} days for {travelers} guests) and respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Configure Another Itinerary
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Interactive Itinerary Estimator</span>
                  </h3>
                  <span className="text-xs text-stone-500">Instant Feasibility Pricing</span>
                </div>

                {/* Region Selection */}
                <div className="space-y-2">
                  <label htmlFor="bespoke-region" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Destination Region
                  </label>
                  <select
                    id="bespoke-region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="Patagonia">Patagonia & Andes (Chile & Argentina)</option>
                    <option value="Norwegian Fjords">Norwegian Fjords & Sunnmøre (Norway)</option>
                    <option value="Japanese Alps">Japanese Alps & Kiso Valley (Japan)</option>
                    <option value="Serengeti">Serengeti & Ngorongoro (Tanzania)</option>
                    <option value="Amalfi Coast">Amalfi Coast & Capri (Italy)</option>
                  </select>
                </div>

                {/* Duration & Travelers Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="uppercase tracking-wider font-semibold text-stone-300">Duration</span>
                      <span className="text-amber-400 font-bold tabular-nums">{duration} Days</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={21}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="uppercase tracking-wider font-semibold text-stone-300">Travel Party</span>
                      <span className="text-amber-400 font-bold tabular-nums">{travelers} Guests</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={16}
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Travel Pace / Intensity */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Expedition Pace & Physical Intensity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Gentle', 'Balanced', 'Demanding'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setIntensity(lvl)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                          intensity === lvl
                            ? 'bg-amber-400 text-stone-950 font-semibold border-amber-400'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bespoke Enhancements */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Curated Bespoke Inclusions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900 border border-stone-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={helicopterAccess}
                        onChange={(e) => setHelicopterAccess(e.target.checked)}
                        className="rounded border-stone-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                      />
                      <span className="text-stone-300">Private Heli Charter</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900 border border-stone-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privateChef}
                        onChange={(e) => setPrivateChef(e.target.checked)}
                        className="rounded border-stone-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                      />
                      <span className="text-stone-300">Dedicated Field Chef</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900 border border-stone-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wildlifeBiologist}
                        onChange={(e) => setWildlifeBiologist(e.target.checked)}
                        className="rounded border-stone-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                      />
                      <span className="text-stone-300">Senior Biologist</span>
                    </label>
                  </div>
                </div>

                {/* Live Estimate Card */}
                <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Estimated Investment
                    </span>
                    <span className="text-lg font-bold text-white tabular-nums font-display">
                      ${estimatedPerPerson.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500 ml-1">/ person</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Total Party Estimate
                    </span>
                    <span className="text-xl font-bold text-amber-400 tabular-nums font-display">
                      ${estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Lead Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email Address *"
                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <div className="sm:col-span-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Special milestones, preferred departure months, or specific dietary/gear needs..."
                      className="w-full bg-stone-900 border border-stone-800 text-stone-100 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bespoke Charter Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
