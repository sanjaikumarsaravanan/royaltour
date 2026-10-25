import React, { useState, useEffect } from 'react';
import { Tour, DepartureDate, BookingSubmission } from '../types/tour';
import { X, Calendar, Users, CheckCircle2, Shield, CreditCard, Download, ArrowRight, ArrowLeft, Printer } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTour: Tour | null;
  selectedDeparture?: DepartureDate;
  allTours: Tour[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedTour,
  selectedDeparture,
  allTours,
}) => {
  const [currentTour, setCurrentTour] = useState<Tour | null>(selectedTour || allTours[0] || null);
  const [currentDeparture, setCurrentDeparture] = useState<DepartureDate | null>(
    selectedDeparture || currentTour?.departures[0] || null
  );

  const [step, setStep] = useState<'details' | 'travelers' | 'confirmation'>('details');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [singleSupplement, setSingleSupplement] = useState<boolean>(false);
  const [addOnGearRental, setAddOnGearRental] = useState<boolean>(false);
  const [addOnScenicFlight, setAddOnScenicFlight] = useState<boolean>(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('None');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirmation result
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSubmission | null>(null);

  // Sync state if selectedTour or selectedDeparture changes
  useEffect(() => {
    if (selectedTour) {
      setCurrentTour(selectedTour);
      if (selectedDeparture) {
        setCurrentDeparture(selectedDeparture);
      } else if (selectedTour.departures.length > 0) {
        setCurrentDeparture(selectedTour.departures[0]);
      }
    } else if (allTours.length > 0 && !currentTour) {
      setCurrentTour(allTours[0]);
      setCurrentDeparture(allTours[0].departures[0]);
    }
  }, [selectedTour, selectedDeparture, allTours]);

  if (!isOpen || !currentTour) return null;

  // Live price calculations (tabular numbers)
  const basePricePerPerson = currentDeparture ? currentDeparture.pricePerPerson : currentTour.startingPrice;
  const baseTotal = basePricePerPerson * guestsCount;
  const singleSupplementFee = singleSupplement ? 850 * guestsCount : 0;
  const gearRentalFee = addOnGearRental ? 220 * guestsCount : 0;
  const scenicFlightFee = addOnScenicFlight ? 480 * guestsCount : 0;
  const totalAmount = baseTotal + singleSupplementFee + gearRentalFee + scenicFlightFee;
  const depositAmount = Math.round(totalAmount * 0.25);

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!phone.trim()) errs.phone = 'Contact telephone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTourChange = (tourId: string) => {
    const found = allTours.find((t) => t.id === tourId);
    if (found) {
      setCurrentTour(found);
      setCurrentDeparture(found.departures[0] || null);
    }
  };

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (!currentDeparture) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `SOL-2026-${randomSuffix}`;

    const submission: BookingSubmission = {
      bookingId: bookingCode,
      tourId: currentTour.id,
      tourTitle: currentTour.title,
      departureDate: currentDeparture,
      guestsCount,
      guestNames: [fullName],
      primaryContact: {
        fullName,
        email,
        phone,
        dietaryNotes,
        emergencyContact,
      },
      singleSupplement,
      addOnGearRental,
      addOnScenicFlight,
      depositAmount,
      totalAmount,
      timestamp: new Date().toISOString(),
    };

    setConfirmedBooking(submission);
    setStep('confirmation');
  };

  const resetAndClose = () => {
    setStep('details');
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Expedition Reservation
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-400">
              Step {step === 'details' ? '1 of 2' : step === 'travelers' ? '2 of 2' : 'Confirmed'}
            </span>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* STEP 1: Details & Dates */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Select Journey & Departure
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Secure provisional seats with a 25% refundable deposit held until 60 days prior to departure.
                </p>
              </div>

              {/* Expedition Selection */}
              <div className="space-y-2">
                <label htmlFor="expedition-picker" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                  Select Expedition
                </label>
                <select
                  id="expedition-picker"
                  value={currentTour.id}
                  onChange={(e) => handleTourChange(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                >
                  {allTours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.durationDays} Days · {t.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Date Selection */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                  Choose Departure Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentTour.departures.map((dep) => {
                    const isSelected = currentDeparture?.id === dep.id;
                    return (
                      <button
                        key={dep.id}
                        type="button"
                        onClick={() => setCurrentDeparture(dep)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400 text-white'
                            : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="text-xs font-semibold text-stone-200">
                          {dep.startDate}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">to {dep.endDate}</div>
                        <div className="text-sm font-bold text-amber-400 mt-2 tabular-nums">
                          ${dep.pricePerPerson.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {dep.availableSpots} spots left
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travelers Count */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                  Number of Expedition Travelers
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-stone-100 font-bold tabular-nums text-sm">
                      {guestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGuestsCount(
                          Math.min(currentDeparture?.availableSpots || 8, guestsCount + 1)
                        )
                      }
                      className="w-9 h-9 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-400">
                    Maximum {currentTour.groupSizeMax} guests per expedition departure.
                  </span>
                </div>
              </div>

              {/* Optional Upgrades / Supplements */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                  Custom Expedition Options
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 cursor-pointer hover:border-stone-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={singleSupplement}
                      onChange={(e) => setSingleSupplement(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-stone-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-stone-200">
                        Private Stateroom / Eco-Dome Single Supplement (+$850)
                      </div>
                      <div className="text-stone-400">
                        Guarantee your own private single-occupancy stateroom or eco-dome without shared accommodations.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 cursor-pointer hover:border-stone-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={addOnGearRental}
                      onChange={(e) => setAddOnGearRental(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-stone-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-stone-200">
                        Full Technical Field Gear Rental Bundle (+$220 / person)
                      </div>
                      <div className="text-stone-400">
                        Includes premium 70L expedition duffel, Carbon trekking poles, and GORE-TEX storm outer shell.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 cursor-pointer hover:border-stone-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={addOnScenicFlight}
                      onChange={(e) => setAddOnScenicFlight(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-stone-700 text-amber-500 focus:ring-amber-400 accent-amber-500"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-stone-200">
                        Glacier / Wilderness Aerial Flyover Helicopter Add-on (+$480 / person)
                      </div>
                      <div className="text-stone-400">
                        45-minute private helicopter access to unclimbed ridgelines and hanging glaciers with aerial photography permits.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Transparent Price Summary Card */}
              <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Base Trip ({guestsCount} × ${basePricePerPerson.toLocaleString()}):</span>
                  <span className="text-stone-200 tabular-nums">${baseTotal.toLocaleString()}</span>
                </div>
                {singleSupplement && (
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Single Supplement:</span>
                    <span className="text-stone-200 tabular-nums">+${singleSupplementFee.toLocaleString()}</span>
                  </div>
                )}
                {addOnGearRental && (
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Technical Gear Bundle:</span>
                    <span className="text-stone-200 tabular-nums">+${gearRentalFee.toLocaleString()}</span>
                  </div>
                )}
                {addOnScenicFlight && (
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Scenic Helicopter Flight:</span>
                    <span className="text-stone-200 tabular-nums">+${scenicFlightFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-stone-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-stone-400 block">Total Expedition Value</span>
                    <span className="text-xs text-amber-400/80">25% deposit required to confirm: ${depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums font-display">
                    ${totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Proceed Action */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep('travelers')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Continue to Traveler Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Traveler Intake Form */}
          {step === 'travelers' && (
            <form onSubmit={handleSubmitReservation} className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Lead Traveler Contact & Intake
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Our field expedition coordinator will review your profile and reach out within 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="lead-name" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Full Legal Name (as per Passport) *
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Vance"
                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="lead-email" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Email Address *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                  {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="lead-phone" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Mobile Phone (with country code) *
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                  {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="lead-dietary" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Dietary Requirements / Allergies
                  </label>
                  <select
                    id="lead-dietary"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="None">None / No restrictions</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Strict Gluten-Free / Celiac</option>
                    <option value="Dairy-Free">Dairy-Free</option>
                    <option value="Nut-Allergy">Nut Allergy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="lead-emergency" className="block text-xs uppercase tracking-wider font-semibold text-stone-300">
                    Emergency Contact & Relation
                  </label>
                  <input
                    id="lead-emergency"
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Sarah Vance (Spouse) - +1 555 902-1200"
                    className="w-full bg-stone-950 border border-stone-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 space-y-1">
                  <div className="font-semibold text-stone-100">
                    Guaranteed Small-Group Departure Pledge
                  </div>
                  <p className="text-stone-400">
                    Your reservation guarantees departure without minimum guest thresholds. No cancellation or hidden surcharge policy applies.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 rounded-lg cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm Provisional Hold</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmed Voucher / Ticket */}
          {step === 'confirmation' && confirmedBooking && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  Reservation Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-stone-300">
                  Your provisional expedition spot is reserved. A member of our expedition concierge has sent your full dossier to <span className="text-amber-400 font-semibold">{confirmedBooking.primaryContact.email}</span>.
                </p>
              </div>

              {/* Digital Voucher Slip */}
              <div className="p-6 bg-stone-950 border border-stone-700/80 rounded-2xl space-y-5 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Booking Reference</span>
                    <span className="text-lg font-mono font-bold text-amber-400">{confirmedBooking.bookingId}</span>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Status</span>
                    <span className="text-xs font-semibold text-emerald-400">Guaranteed Hold</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 block">Expedition:</span>
                    <span className="text-stone-100 font-medium">{confirmedBooking.tourTitle}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Travel Dates:</span>
                    <span className="text-stone-100 font-medium">
                      {confirmedBooking.departureDate.startDate} — {confirmedBooking.departureDate.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Lead Traveler:</span>
                    <span className="text-stone-100 font-medium">{confirmedBooking.primaryContact.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Travelers Count:</span>
                    <span className="text-stone-100 font-medium tabular-nums">{confirmedBooking.guestsCount} Guest(s)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Dietary Preference:</span>
                    <span className="text-stone-100 font-medium">{confirmedBooking.primaryContact.dietaryNotes}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Provisional Deposit:</span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      ${confirmedBooking.depositAmount.toLocaleString()} (Held)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-400 gap-2">
                  <span>Balance due 60 days before field departure.</span>
                  <span className="text-stone-200 font-semibold tabular-nums">
                    Total: ${confirmedBooking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Return to Expeditions</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
