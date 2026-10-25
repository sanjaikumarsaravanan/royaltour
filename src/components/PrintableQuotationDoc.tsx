import React from 'react';
import {
  Crown,
  Check,
  X,
  Shield,
  Phone,
  Mail,
  Instagram,
  MapPin,
  Calendar,
  Users,
  Compass,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Itinerary } from '../types/itinerary';
import { RoyalToursLogo, RoyalToursEmailCard } from './RoyalToursLogo';

interface PrintableQuotationDocProps {
  itinerary: Itinerary;
  selectedCurrency?: string;
}

export const PrintableQuotationDoc: React.FC<PrintableQuotationDocProps> = ({
  itinerary,
  selectedCurrency = itinerary.currency || '₹',
}) => {
  const currency = selectedCurrency || itinerary.currency || '₹';

  const formatPrice = (amount: number) => {
    return `${currency} ${amount.toLocaleString('en-IN')}`;
  };

  const totalCalculated = (itinerary.pricingSlots || []).reduce(
    (sum, slot) => sum + (Number(slot.price) || 0),
    0
  );

  return (
    <div className="bg-white text-slate-900 font-sans-luxury max-w-[850px] mx-auto p-8 sm:p-12 print:p-0 print:max-w-none text-sm leading-relaxed border border-slate-200 print:border-none shadow-2xl print:shadow-none transition-all">
      
      {/* ========================================================
          1. EXECUTIVE HEADER: LOGO, REFERENCE & OFFICIAL STATUS
         ======================================================== */}
      <div className="border-b-2 border-slate-950 pb-6 mb-7">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          
          {/* Official Brand Identity Block */}
          <div className="flex-1 max-w-[340px]">
            <RoyalToursLogo variant="badge" className="p-3.5 bg-slate-950 rounded-2xl shadow-sm" />
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-2.5 font-sans-luxury">
              Bespoke Expeditions · Private Charters · Luxury Retreats
            </p>
          </div>

          {/* Quotation Dossier Reference Block */}
          <div className="sm:text-right shrink-0 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:min-w-[240px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-950 text-amber-400 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 shadow-2xs">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>OFFICIAL QUOTATION</span>
            </div>
            
            <div className="text-base font-bold font-mono text-slate-950 tracking-wider">
              {itinerary.code}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 text-xs text-slate-600 mt-2 font-mono">
              <div>
                <span className="text-slate-400 text-[11px] uppercase mr-1">Date:</span>
                <span className="font-semibold text-slate-900">{itinerary.quotationDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase mr-1">Valid Until:</span>
                <span className="font-semibold text-slate-900">{itinerary.validUntil || '14 Days'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Verified Contacts Bar */}
        <div className="mt-5 pt-3.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <RoyalToursEmailCard className="py-2.5 px-3.5 bg-slate-50 border-slate-200/90 rounded-xl" />

          <div className="flex flex-col sm:items-end justify-center text-xs font-mono text-slate-700 space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-900" />
              <span className="font-bold text-slate-950">Direct Line: 8248886319</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5 text-slate-900" />
              <span className="font-bold text-slate-950">Instagram: @royaltoursofficial</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. CLIENT DOSSIER & EXPEDITION ARCHITECT
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7 page-break-inside-avoid">
        {/* Client Details */}
        <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5 font-sans-luxury">
            TRAVELER INFORMATION
          </span>
          <div className="text-base font-bold text-slate-950 font-sans-luxury">
            {itinerary.clientName}
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{itinerary.clientNumber || '+91 98400 00000'}</span>
            </div>
            {itinerary.clientEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{itinerary.clientEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lead Consultant */}
        <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 block mb-1.5 font-sans-luxury">
            CURATED BY EXPEDITION LEAD
          </span>
          <div className="text-base font-bold text-slate-950 font-sans-luxury">
            {itinerary.consultant?.name || 'Private Client Lead'}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            {itinerary.consultant?.role || 'Senior Expedition Specialist'}
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{itinerary.consultant?.phone || '8248886319'}</span>
            </div>
            {itinerary.consultant?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{itinerary.consultant?.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. EXPEDITION SPECIFICATIONS BLUEPRINT
         ======================================================== */}
      <div className="mb-7 page-break-inside-avoid">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2 font-sans-luxury">
            <Compass className="w-3.5 h-3.5 text-slate-800" />
            <span>Expedition Blueprint & Logistics</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {itinerary.region === 'INTL' ? 'International' : 'Domestic'} · {itinerary.groupType}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Destination</span>
            </div>
            <span className="text-xs font-bold text-slate-950 block">{itinerary.destination}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Duration</span>
            </div>
            <span className="text-xs font-bold text-slate-950 block font-mono">{itinerary.duration}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Travel Date</span>
            </div>
            <span className="text-xs font-bold text-slate-950 block font-mono">{itinerary.dateOfTravel}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Party Size</span>
            </div>
            <span className="text-xs font-bold text-slate-950 block">{itinerary.groupSizePax}</span>
          </div>
        </div>

        {itinerary.transportDetails && (
          <div className="mt-3 text-xs bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-slate-700 flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              <strong className="text-slate-950">Private Logistics & Charter: </strong>
              {itinerary.transportDetails}
            </span>
          </div>
        )}
      </div>

      {/* ========================================================
          4. DAY-BY-DAY ITINERARY DOSSIER
         ======================================================== */}
      <div className="mb-8">
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2 font-sans-luxury">
            <FileText className="w-3.5 h-3.5 text-slate-800" />
            <span>Day-by-Day Expedition Dossier</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-500">
            {itinerary.days?.length || 0} Scheduled Days
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Day 0 if present */}
          {itinerary.hasDay0 && itinerary.day0 && (
            <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/60 page-break-inside-avoid">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-slate-950 text-amber-400 rounded-md font-mono font-bold text-[10px] uppercase tracking-wider">
                    DAY 0
                  </span>
                  <span className="text-xs font-bold text-slate-950 font-sans-luxury">
                    {itinerary.day0.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {itinerary.day0.date || itinerary.dateOfTravel}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {itinerary.day0.activities}
              </p>
              {itinerary.day0.enableNotes && itinerary.day0.notes && (
                <div className="mt-2.5 text-[11px] bg-white border border-slate-200 rounded-xl p-2.5 text-slate-600">
                  <strong className="text-slate-900">Expedition Note: </strong>
                  {itinerary.day0.notes}
                </div>
              )}
            </div>
          )}

          {/* Regular Days */}
          {(itinerary.days || []).map((day) => (
            <div
              key={day.id}
              className="border border-slate-200 rounded-2xl p-4.5 bg-white page-break-inside-avoid shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-slate-950 text-white rounded-md font-mono font-bold text-[10px] tracking-wider">
                    DAY {day.dayNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-950 font-sans-luxury">
                    {day.title}
                  </span>
                </div>
                {day.date && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {day.date}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {day.activities}
              </p>
              {day.enableNotes && day.notes && (
                <div className="mt-2.5 text-[11px] bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-600">
                  <strong className="text-slate-900">Expedition Note: </strong>
                  {day.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          5. COMMERCIAL PRICING & ESTIMATE BREAKDOWN
         ======================================================== */}
      <div className="mb-8 page-break-inside-avoid">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2 font-sans-luxury">
            <Sparkles className="w-3.5 h-3.5 text-slate-800" />
            <span>Commercial Pricing & Estimate</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-500">
            Currency: {currency} (INR)
          </span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-white font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Tier / Private Specification</th>
                <th className="py-3 px-4 text-center">Pricing Unit</th>
                <th className="py-3 px-4 text-right">Estimate Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans-luxury">
              {(itinerary.pricingSlots || []).map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-medium text-slate-900">{slot.label}</td>
                  <td className="py-3 px-4 text-center text-slate-600 font-mono text-[11px]">{slot.unit}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-950 font-mono">
                    {formatPrice(slot.price)}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-950">
                <td className="py-4 px-4 text-slate-950 uppercase tracking-wider text-xs">
                  Estimated Total
                </td>
                <td className="py-4 px-4 text-center text-slate-500 font-mono text-[11px]">
                  All Tiers Combined
                </td>
                <td className="py-4 px-4 text-right text-base text-slate-950 font-mono">
                  {formatPrice(totalCalculated)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {itinerary.costingNote && (
          <p className="text-[11px] text-slate-500 italic mt-2.5 px-1">
            * {itinerary.costingNote}
          </p>
        )}
      </div>

      {/* ========================================================
          6. INCLUSIONS & EXCLUSIONS
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 page-break-inside-avoid">
        {/* Inclusions */}
        <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 pb-2 mb-3 border-b border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>Package Inclusions</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {(itinerary.inclusions || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5 pb-2 mb-3 border-b border-slate-200">
            <X className="w-4 h-4 text-rose-500 stroke-[3]" />
            <span>Package Exclusions</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {(itinerary.exclusions || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ========================================================
          7. POLICIES & TERMS
         ======================================================== */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/80 mb-8 text-xs text-slate-600 space-y-2.5 page-break-inside-avoid">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-800" />
          <span>Terms, Cancellation Policy & Guarantees</span>
        </h3>
        <p className="leading-relaxed">
          <strong className="text-slate-900">Booking Confirmation: </strong>
          {itinerary.paymentTerms || 'A 50% advance deposit secures all private wilderness permits, chartered transport, and exclusive lodge suites. Balance is payable 15 days prior to departure.'}
        </p>
        <p className="leading-relaxed">
          <strong className="text-slate-900">Cancellation Policy: </strong>
          {itinerary.cancellationPolicy || 'Cancellations made 30+ days prior receive an 80% refund or 100% atelier credit for rescheduled expeditions. Unforeseen weather diversions are guaranteed with luxury substitute itineraries.'}
        </p>
        <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
          <strong className="text-slate-800">Safety & Naturalist Escorts: </strong>
          {itinerary.expeditionSafetyTerms || 'Comprehensive traveler evacuation coverage and personal wilderness naturalist insurance included on all royal journeys.'}
        </p>
      </div>

      {/* ========================================================
          8. OFFICIAL SIGN-OFF & ATELIER STAMP
         ======================================================== */}
      <div className="pt-6 border-t-2 border-slate-950 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 page-break-inside-avoid">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-4 h-4 text-slate-950" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-950 font-sans-luxury">
              ROYAL TOURS ATELIER
            </span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed font-mono">
            Bespoke Luxury Travel & Private Excursion Atelier<br />
            Email: <strong className="text-slate-950">royaltoursofficial@gmail.com</strong> · Phone: <strong className="text-slate-950">8248886319</strong><br />
            Instagram: <strong className="text-slate-950">@royaltoursofficial</strong>
          </p>
        </div>

        <div className="sm:text-right shrink-0">
          <div className="h-10 flex items-end sm:justify-end mb-1">
            <span className="italic text-base text-slate-900 font-serif tracking-wide">
              {itinerary.consultant?.name || 'Authorized Lead'}
            </span>
          </div>
          <div className="border-t border-slate-400 pt-1 min-w-[200px] sm:text-right">
            <p className="text-[11px] font-bold text-slate-950">{itinerary.consultant?.name || 'Lead Architect'}</p>
            <p className="text-[10px] text-slate-500">{itinerary.consultant?.role || 'Principal Expedition Curator'}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
