import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Calendar,
  Users,
  Compass,
  Phone,
  Mail,
  Instagram,
  Check,
  X,
  Shield,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Crown,
  FileDown,
} from 'lucide-react';
import { Itinerary } from '../types/itinerary';
import { exportQuotationAsPDF } from '../utils/pdfExport';
import { RoyalToursEmailCard } from './RoyalToursLogo';

interface ClientQuotationViewProps {
  itinerary: Itinerary;
  onBack: () => void;
  onEdit: () => void;
  onDownloadPDF?: (itinerary: Itinerary) => void;
  onUpdateStatus?: (status: Itinerary['status']) => void;
}

export const ClientQuotationView: React.FC<ClientQuotationViewProps> = ({
  itinerary,
  onBack,
  onEdit,
  onDownloadPDF,
  onUpdateStatus,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'₹' | '$' | '€'>(
    itinerary.currency || '₹'
  );
  const [isApproved, setIsApproved] = useState(
    itinerary.status === 'Confirmed' || itinerary.status === 'Approved'
  );
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  // Conversion rates relative to base INR
  const currencyMultiplier = {
    '₹': 1,
    '$': 0.012,
    '€': 0.011,
  };

  const formatPrice = (amountInBase: number) => {
    let converted = amountInBase;
    if (itinerary.currency === '₹' && selectedCurrency === '$') {
      converted = Math.round(amountInBase * currencyMultiplier['$']);
    } else if (itinerary.currency === '₹' && selectedCurrency === '€') {
      converted = Math.round(amountInBase * currencyMultiplier['€']);
    } else if (itinerary.currency === '$' && selectedCurrency === '₹') {
      converted = Math.round(amountInBase / currencyMultiplier['$']);
    } else if (itinerary.currency === '€' && selectedCurrency === '₹') {
      converted = Math.round(amountInBase / currencyMultiplier['€']);
    }
    return `${selectedCurrency} ${converted.toLocaleString()}`;
  };

  const totalCalculated = itinerary.pricingSlots.reduce(
    (sum, slot) => sum + slot.price,
    0
  );

  const heroImage =
    itinerary.coverImage ||
    itinerary.days[0]?.imageUrl ||
    '/src/assets/images/hero_patagonia_peaks_1791990454274.jpg';

  const handleApprove = () => {
    setIsApproved(true);
    setShowApprovalDialog(false);
    if (onUpdateStatus) {
      onUpdateStatus('Approved');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans-luxury pb-24 selection:bg-slate-900 selection:text-white">
      
      {/* Top Floating Command Bar (hidden in print) */}
      <nav className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-6 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Management Atelier</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Currency selector */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-xs font-mono">
              {(['₹', '$', '€'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedCurrency === curr
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onDownloadPDF ? onDownloadPDF(itinerary) : exportQuotationAsPDF(itinerary)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-700" />
              <span>Download Quotation (PDF)</span>
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 rounded-xl transition-colors shadow-xs"
            >
              Edit Proposal
            </button>

            {!isApproved ? (
              <button
                type="button"
                onClick={() => setShowApprovalDialog(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-b from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 rounded-xl shadow-md shadow-slate-900/15 border border-slate-700/60 transition-all"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Accept Quotation</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 rounded-xl shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quotation Confirmed</span>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Main Quotation Container */}
      <main className="max-w-5xl mx-auto px-6 pt-6 space-y-12">
        
        {/* Hero Cinematic Cover */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 min-h-[460px] flex flex-col justify-end p-8 md:p-12">
          {/* Background image */}
          <img
            src={heroImage}
            alt={itinerary.destination}
            className="absolute inset-0 w-full h-full object-cover opacity-65 filter contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Hero Content with ROYAL TOURS branding */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-white/90">
              <Crown className="w-5 h-5 text-white" />
              <span className="font-cinzel-royal font-bold tracking-[0.2em] text-sm uppercase">
                ROYAL TOURS
              </span>
              <span className="text-white/40">|</span>
              <span className="text-xs uppercase tracking-widest text-slate-300 font-sans-luxury">
                Travel in Luxury, Explore in Style
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 tracking-widest uppercase font-mono">
              <span className="bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs text-white font-semibold">
                {itinerary.code}
              </span>
              <span aria-hidden="true">·</span>
              <span>Bespoke Expedition Proposal</span>
              <span aria-hidden="true">·</span>
              <span>Valid Until {itinerary.validUntil}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif-luxury font-medium text-white tracking-wide leading-tight">
              {itinerary.destination}
            </h1>

            <p className="text-slate-200 text-sm md:text-base font-light leading-relaxed max-w-2xl">
              An exclusive, tailored natural odyssey curated for <span className="text-white font-semibold">{itinerary.clientName}</span>, emphasizing total seclusion, untamed topography, and private chartered mobility.
            </p>
          </div>
        </section>

        {/* Quick Expedition Metadata Strip in white & grey glass */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-sm text-xs">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans-luxury">
              Duration
            </span>
            <span className="text-base font-bold font-mono text-slate-950 mt-1 block">
              {itinerary.duration}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans-luxury">
              Departure Date
            </span>
            <span className="text-base font-bold font-mono text-slate-950 mt-1 block">
              {itinerary.dateOfTravel}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans-luxury">
              Travelers (Pax)
            </span>
            <span className="text-base font-bold text-slate-950 mt-1 block font-sans-luxury">
              {itinerary.groupSizePax}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-sans-luxury">
              Expedition Architect
            </span>
            <span className="text-base font-bold text-slate-900 mt-1 block">
              {itinerary.consultant.name}
            </span>
          </div>
        </section>

        {/* Editorial Welcome & Curator Note */}
        <section className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Royal Tours Briefing
              </span>
              <h2 className="text-2xl font-serif-luxury text-slate-950 font-medium mt-1">
                Prepared exclusively for {itinerary.clientName}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono">{itinerary.consultant.phone}</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{itinerary.consultant.email}</span>
              </span>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed font-light">
            At ROYAL TOURS, our philosophy is simple: travel in luxury, explore in style. We have curated this journey to take you deep into raw, breathtaking natural sanctuaries without compromising on five-star privacy and security. Every transfer corridor, marine vessel charter, and luxury eco-resort buyout is secured exclusively for your party.
          </p>

          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <RoyalToursEmailCard className="bg-slate-50 border-slate-200" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-700" />
                <span className="font-bold">Phone: 8248886319</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-slate-700" />
                <span className="font-bold">Insta: @royaltoursofficial</span>
              </div>
            </div>
          </div>
        </section>

        {/* Day-by-Day Immersive Timeline */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Curated Schedule
              </span>
              <h2 className="text-2xl font-serif-luxury text-slate-950 font-medium mt-1">
                Expedition Sequence
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {itinerary.days.length + (itinerary.hasDay0 ? 1 : 0)} Total Segments
            </span>
          </div>

          {/* Day 0 if present */}
          {itinerary.hasDay0 && itinerary.day0 && (
            <div className="relative pl-8 md:pl-12 border-l-2 border-slate-300 space-y-3">
              <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center font-mono text-xs text-white font-bold shadow-xs">
                0
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-900 font-bold">
                <span>DAY 0</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{itinerary.day0.date}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500 font-normal uppercase tracking-wider">Arrival & VIP Clearance</span>
              </div>
              <h3 className="text-xl font-serif-luxury font-medium text-slate-950">
                {itinerary.day0.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-light">
                {itinerary.day0.activities}
              </p>
              {itinerary.day0.notes && (
                <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                  <strong className="text-slate-900">Logistics Note: </strong>
                  {itinerary.day0.notes}
                </div>
              )}
            </div>
          )}

          {/* Day 1..N */}
          {itinerary.days.map((day) => (
            <div
              key={day.id}
              className="relative pl-8 md:pl-12 border-l-2 border-slate-200 space-y-4"
            >
              {/* Day Badge */}
              <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center font-mono text-xs text-white font-bold shadow-xs">
                {day.dayNumber}
              </div>

              {/* Day Meta */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span className="text-slate-950 font-bold">DAY {day.dayNumber}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-medium text-slate-700">{day.date}</span>
                {day.highlight && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-900 font-semibold">{day.highlight}</span>
                  </>
                )}
              </div>

              {/* Day Title */}
              <h3 className="text-2xl font-serif-luxury font-medium text-slate-950">
                {day.title}
              </h3>

              {/* Image if present */}
              {day.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 my-3 shadow-sm">
                  <img
                    src={day.imageUrl}
                    alt={day.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Activities */}
              <p className="text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line">
                {day.activities}
              </p>

              {/* Notes if enabled */}
              {day.enableNotes && day.notes && (
                <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-950 font-bold">Bespoke Detail: </span>
                    <span>{day.notes}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Inclusions & Exclusions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Inclusions */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-950 font-bold">
              <Check className="w-5 h-5 stroke-[3]" />
              <h3 className="text-base font-serif-luxury text-slate-950">
                Curated Inclusions
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {itinerary.inclusions.map((inc, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                  <span className="leading-relaxed font-medium">{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 font-bold">
              <X className="w-5 h-5 stroke-[3]" />
              <h3 className="text-base font-serif-luxury text-slate-950">
                Discretionary Exclusions
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {itinerary.exclusions.map((exc, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed font-medium">{exc}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* Costing & Investment Breakdown in grey glassy style */}
        <section className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Quotation Summary
              </span>
              <h3 className="text-2xl font-serif-luxury text-slate-950 font-medium mt-1">
                Expedition Estimate
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block font-sans-luxury font-medium">
                Total Quotation
              </span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-slate-950 tabular-nums">
                {formatPrice(totalCalculated)}
              </span>
            </div>
          </div>

          {/* Pricing Slots Table */}
          <div className="space-y-3">
            {itinerary.pricingSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs"
              >
                <div>
                  <span className="font-bold text-slate-950">{slot.label}</span>
                  <span className="text-[11px] text-slate-500 font-medium block sm:inline sm:ml-2">
                    ({slot.unit})
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-950 tabular-nums">
                  {formatPrice(slot.price)}
                </div>
              </div>
            ))}
          </div>

          {/* Costing Note strictly matching Photo 5 */}
          <div className="text-xs text-slate-600 bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
            <strong className="text-slate-900 font-bold">Costing Note: </strong>
            <span>{itinerary.costingNote}</span>
          </div>

          <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 font-medium">
            <span>Payment currency: {selectedCurrency} (all luxury expedition taxes included)</span>
            <span>Validity: strictly through {itinerary.validUntil}</span>
          </div>
        </section>

        {/* Policies, Safety, and Guarantees */}
        <section className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-6 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2 text-slate-950">
            <Shield className="w-4 h-4 text-slate-800" />
            <h3 className="text-base font-serif-luxury text-slate-950 font-bold">
              Expedition Guarantees & Terms
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono text-[11px]">
                Cancellation Schedule
              </h4>
              <p className="leading-relaxed">{itinerary.cancellationPolicy}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono text-[11px]">
                Payment Terms
              </h4>
              <p className="leading-relaxed">{itinerary.paymentTerms}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono text-[11px]">
                Wilderness Safety Protocol
              </h4>
              <p className="leading-relaxed">{itinerary.expeditionSafetyTerms}</p>
            </div>
          </div>
        </section>

        {/* Client Acceptance CTA Box */}
        <section className="no-print bg-slate-100/70 border border-slate-200/90 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-serif-luxury text-slate-950 font-medium">
              Ready to Lock Your Expedition Dates?
            </h3>
            <p className="text-xs text-slate-600 max-w-lg font-medium">
              Confirm this quotation with ROYAL TOURS to initiate aircraft flight corridors, private villa buyouts, and certified naturalist reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onDownloadPDF ? onDownloadPDF(itinerary) : exportQuotationAsPDF(itinerary)}
              className="px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all flex items-center gap-2"
            >
              <FileDown className="w-4 h-4 text-slate-700" />
              <span>Download PDF Copy</span>
            </button>

            {!isApproved ? (
              <button
                type="button"
                onClick={() => setShowApprovalDialog(true)}
                className="px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-b from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-lg shadow-slate-900/15 border border-slate-700 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Reserve Quotation</span>
              </button>
            ) : (
              <div className="px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-900 bg-white border border-slate-300 shadow-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Quotation Accepted & Reserved</span>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Confirmation Dialog Modal */}
      {showApprovalDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
              <FileCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-slate-950">
                Confirm Quotation {itinerary.code}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                You are approving the bespoke proposal for <strong className="text-slate-950">{itinerary.clientName}</strong> covering <strong className="text-slate-950">{itinerary.destination}</strong> for {formatPrice(totalCalculated)}.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1 font-mono text-slate-700 border border-slate-200">
              <div>Consultant: {itinerary.consultant.name}</div>
              <div>Travel Date: {itinerary.dateOfTravel}</div>
              <div>Group Size: {itinerary.groupSizePax}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApprovalDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition-colors"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
