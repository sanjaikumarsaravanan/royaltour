import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageItem,
  PlacePackage,
  Quotation,
  QuotationDayPlan,
  JourneyCard,
} from '../../types/placePackage';
import { ContinuousBrochurePreviewDeck } from '../pdf/ContinuousBrochurePreviewDeck';
import {
  Users,
  Calendar,
  Compass,
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Sparkles,
  Info,
  DollarSign,
  FileText,
  Shield,
  Layers,
  Heart,
  Briefcase,
  GraduationCap,
  Save,
  RotateCcw,
  AlertCircle,
  Eye,
  Bus,
  Building,
} from 'lucide-react';

interface CreateItineraryWizardProps {
  initialQuotation?: Quotation | null;
  onClose: () => void;
  onSuccess: (saved: Quotation) => void;
}

export const CreateItineraryWizard: React.FC<CreateItineraryWizardProps> = ({
  initialQuotation,
  onClose,
  onSuccess,
}) => {
  const {
    placePackages,
    settings,
    saveQuotation,
    draftQuotation,
    updateDraft,
    clearDraft,
  } = useApp();

  const accent = settings.accentColor || '#0070C0';
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [packageSearchQuery, setPackageSearchQuery] = useState<string>('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [previewPackage, setPreviewPackage] = useState<PlacePackage | null>(null);

  // -----------------------------------------------------------------
  // STEP 1 STATE: Trip Type, Consultant, Client / Institution Name
  // -----------------------------------------------------------------
  const [tripType, setTripType] = useState<string>(
    initialQuotation?.tripType || draftQuotation?.tripType || settings.tripTypes?.[0]?.name || 'College'
  );
  const [customTripType, setCustomTripType] = useState<string>(
    initialQuotation?.customTripType || draftQuotation?.customTripType || ''
  );
  const [consultantId, setConsultantId] = useState<string>(
    initialQuotation?.consultantId ||
      draftQuotation?.consultantId ||
      settings.consultants[0]?.id ||
      ''
  );
  const [clientName, setClientName] = useState<string>(
    initialQuotation?.clientName ||
      draftQuotation?.clientName ||
      'KPR Institute of Engineering and Technology'
  );

  // -----------------------------------------------------------------
  // STEP 2 STATE: Group, Dates, Transport, Journey Cards & Daily Plan
  // -----------------------------------------------------------------
  const [destination, setDestination] = useState<string>(
    initialQuotation?.destination ||
      draftQuotation?.destination ||
      'Udupi – Gokarna – Dandeli – Murdeshwar'
  );
  const [travelers, setTravelers] = useState<number>(
    initialQuotation?.travelers || draftQuotation?.travelers || 50
  );
  const [staffFocCount, setStaffFocCount] = useState<string>(
    initialQuotation?.staffFocCount || draftQuotation?.staffFocCount || '2 Staffs (FOC)'
  );
  const [vehicle, setVehicle] = useState<string>(
    initialQuotation?.vehicle || draftQuotation?.vehicle || '53 Seater Bus (Non - Ac)'
  );
  const [pickupDropPoint, setPickupDropPoint] = useState<string>(
    initialQuotation?.pickupDropPoint || draftQuotation?.pickupDropPoint || 'College Campus'
  );
  const [days, setDays] = useState<number>(
    initialQuotation?.days || draftQuotation?.days || 3
  );
  const [departureDate, setDepartureDate] = useState<string>(
    initialQuotation?.departureDate || draftQuotation?.departureDate || '01 Oct 2026'
  );
  const [returnDate, setReturnDate] = useState<string>(
    initialQuotation?.returnDate || draftQuotation?.returnDate || '03 Oct 2026'
  );

  // Departure & Return Journey Cards
  const [departureJourney, setDepartureJourney] = useState<JourneyCard>(
    initialQuotation?.departureJourney ||
      draftQuotation?.departureJourney ||
      settings.defaultDepartureJourney || {
        enabled: true,
        badge: '00',
        title: 'DEPARTURE & NIGHT JOURNEY',
        date: '30 Sep 2026',
        timeline: ['Depart from College towards Udupi', 'Night Journey towards Udupi'],
      }
  );

  const [returnJourney, setReturnJourney] = useState<JourneyCard>(
    initialQuotation?.returnJourney ||
      draftQuotation?.returnJourney ||
      settings.defaultReturnJourney || {
        enabled: true,
        badge: '04',
        title: 'RETURN JOURNEY',
        date: '04 Oct 2026',
        timeline: ['Depart to Coimbatore', 'Next Day Drop at Coimbatore Junction by Train'],
      }
  );

  const [dayPackages, setDayPackages] = useState<QuotationDayPlan[]>(() => {
    if (initialQuotation?.dayPackages && initialQuotation.dayPackages.length > 0) {
      return initialQuotation.dayPackages;
    }
    if (draftQuotation?.dayPackages && draftQuotation.dayPackages.length > 0) {
      return draftQuotation.dayPackages;
    }
    // Default initial day plans matching seed packages
    const pkg1 = placePackages.find((p) => p.name.includes('Udupi')) || placePackages[0];
    const pkg2 = placePackages.find((p) => p.name.includes('Dandeli')) || placePackages[1];
    const pkg3 = placePackages.find((p) => p.name.includes('Gokarna')) || placePackages[2];

    return [
      {
        dayNumber: 1,
        packageIds: [pkg1?.id || 'pkg-udupi'],
        customTitle: 'UDUPI SIGHTSEEING',
        date: '01 Oct 2026',
      },
      {
        dayNumber: 2,
        packageIds: [pkg2?.id || 'pkg-dandeli'],
        customTitle: 'DANDELI WATER ACTIVITIES',
        date: '02 Oct 2026',
      },
      {
        dayNumber: 3,
        packageIds: [pkg3?.id || 'pkg-gokarna-murudeshwar'],
        customTitle: 'GOKARNA AND MURUDESHWAR SIGHTSEEING',
        date: '03 Oct 2026',
      },
    ];
  });

  // -----------------------------------------------------------------
  // STEP 3 STATE: Costing & Estimate
  // -----------------------------------------------------------------
  const [pricePerPerson, setPricePerPerson] = useState<number>(
    initialQuotation?.pricePerPerson || draftQuotation?.pricePerPerson || 6200
  );
  const [isTotalManualOverride, setIsTotalManualOverride] = useState<boolean>(
    initialQuotation?.isTotalManualOverride ||
      draftQuotation?.isTotalManualOverride ||
      false
  );
  const [manualTotalAmount, setManualTotalAmount] = useState<number>(
    initialQuotation?.totalAmount || draftQuotation?.totalAmount || 310000
  );
  const [advance, setAdvance] = useState<number>(
    initialQuotation?.advance || draftQuotation?.advance || 50000
  );
  const [priceNote, setPriceNote] = useState<string>(
    initialQuotation?.priceNote ||
      draftQuotation?.priceNote ||
      settings.defaultPriceNote
  );

  // -----------------------------------------------------------------
  // STEP 4 STATE: Inclusions, Exclusions, Notes, Terms, Cancellation
  // -----------------------------------------------------------------
  const [inclusions, setInclusions] = useState<
    { text: string; enabled: boolean }[]
  >(() => {
    if (initialQuotation?.inclusions) return initialQuotation.inclusions;
    if (draftQuotation?.inclusions) return draftQuotation.inclusions;
    return settings.defaultInclusions.map((text) => ({ text, enabled: true }));
  });

  const [exclusions, setExclusions] = useState<
    { text: string; enabled: boolean }[]
  >(() => {
    if (initialQuotation?.exclusions) return initialQuotation.exclusions;
    if (draftQuotation?.exclusions) return draftQuotation.exclusions;
    return settings.defaultExclusions.map((text) => ({ text, enabled: true }));
  });

  const [notes, setNotes] = useState<
    { text: string; enabled: boolean }[]
  >(() => {
    if (initialQuotation?.notes) return initialQuotation.notes;
    if (draftQuotation?.notes) return draftQuotation.notes;
    return settings.defaultNotes.map((text) => ({ text, enabled: true }));
  });

  const [terms, setTerms] = useState<
    { text: string; enabled: boolean }[]
  >(() => {
    if (initialQuotation?.terms) return initialQuotation.terms;
    if (draftQuotation?.terms) return draftQuotation.terms;
    return settings.defaultTerms.map((text) => ({ text, enabled: true }));
  });

  const [cancellationPolicy, setCancellationPolicy] = useState<
    { period: string; charges: string; enabled?: boolean }[]
  >(() => {
    if (initialQuotation?.cancellationPolicy) return initialQuotation.cancellationPolicy;
    if (draftQuotation?.cancellationPolicy) return draftQuotation.cancellationPolicy;
    return settings.defaultCancellationPolicy.map((row) => ({ ...row, enabled: true }));
  });

  const [cancellationNotes, setCancellationNotes] = useState<string[]>(() => {
    if (initialQuotation?.cancellationNotes) return initialQuotation.cancellationNotes;
    if (draftQuotation?.cancellationNotes) return draftQuotation.cancellationNotes;
    return settings.defaultCancellationNotes;
  });

  const [specialInstructions, setSpecialInstructions] = useState<string>(
    initialQuotation?.specialInstructions ||
      draftQuotation?.specialInstructions ||
      ''
  );

  // Auto-calculated total and balance
  const computedTotal = isTotalManualOverride
    ? manualTotalAmount
    : travelers * pricePerPerson;
  const balance = Math.max(0, computedTotal - advance);

  // Auto-save draft on step/value changes
  useEffect(() => {
    if (!initialQuotation) {
      updateDraft({
        tripType,
        customTripType,
        consultantId,
        clientName,
        destination,
        duration: `${days - 1}N / ${days}D`,
        travelers,
        staffFocCount,
        vehicle,
        pickupDropPoint,
        days,
        departureDate,
        returnDate,
        travelDates: `${departureDate} – ${returnDate}`,
        departureJourney,
        returnJourney,
        dayPackages,
        pricePerPerson,
        isTotalManualOverride,
        totalAmount: computedTotal,
        advance,
        balance,
        priceNote,
        inclusions,
        exclusions,
        notes,
        terms,
        cancellationPolicy,
        cancellationNotes,
        specialInstructions,
      });
    }
  }, [
    tripType,
    customTripType,
    consultantId,
    clientName,
    destination,
    days,
    travelers,
    staffFocCount,
    vehicle,
    pickupDropPoint,
    departureDate,
    returnDate,
    departureJourney,
    returnJourney,
    dayPackages,
    pricePerPerson,
    isTotalManualOverride,
    computedTotal,
    advance,
    balance,
    priceNote,
    inclusions,
    exclusions,
    notes,
    terms,
    cancellationPolicy,
    cancellationNotes,
    specialInstructions,
  ]);

  // Adjust dayPackages array when `days` input changes
  useEffect(() => {
    setDayPackages((prev) => {
      if (prev.length === days) return prev;
      if (prev.length < days) {
        const next = [...prev];
        for (let i = prev.length + 1; i <= days; i++) {
          const fallbackPkg = placePackages[(i - 1) % placePackages.length];
          next.push({
            dayNumber: i,
            packageIds: fallbackPkg ? [fallbackPkg.id] : [],
            customTitle: fallbackPkg ? fallbackPkg.name : `Day ${i} Plan`,
          });
        }
        return next;
      }
      return prev.slice(0, days);
    });
  }, [days, placePackages]);

  // Validation
  const validateStep = (step: number): boolean => {
    setValidationError('');
    if (step === 1) {
      if (!consultantId) {
        setValidationError('Please select a consultant.');
        return false;
      }
      if (!clientName.trim()) {
        setValidationError('Please enter client or institution name.');
        return false;
      }
    }
    if (step === 2) {
      if (travelers <= 0) {
        setValidationError('Please enter valid number of travelers.');
        return false;
      }
      if (days <= 0) {
        setValidationError('Please enter at least 1 day for itinerary.');
        return false;
      }
    }
    if (step === 3) {
      if (pricePerPerson < 0) {
        setValidationError('Price per person cannot be negative.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Build complete Quotation object with snapshot of settings
  const activeConsultant = settings.consultants.find((c) => c.id === consultantId);

  const currentQuotationObject: Quotation = {
    id: initialQuotation?.id || `quot-${Date.now()}`,
    code:
      initialQuotation?.code ||
      `RT-${tripType.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
    createdAt: initialQuotation?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tripType,
    customTripType,
    consultantId,
    consultantSnapshot: activeConsultant,
    clientName,
    destination,
    duration: `${days - 1}N / ${days}D`,
    travelers,
    staffFocCount,
    vehicle,
    pickupDropPoint,
    days,
    departureDate,
    returnDate,
    travelDates: `${departureDate} – ${returnDate}`,
    departureJourney,
    returnJourney,
    dayPackages,
    pricePerPerson,
    isTotalManualOverride,
    totalAmount: computedTotal,
    advance,
    balance,
    priceNote,
    inclusions,
    exclusions,
    notes,
    terms,
    cancellationPolicy,
    cancellationNotes,
    specialInstructions,
    status: 'Confirmed',
    settingsSnapshot: initialQuotation?.settingsSnapshot || settings,
  };

  const handleSaveQuotation = () => {
    saveQuotation(currentQuotationObject);
    clearDraft();
    onSuccess(currentQuotationObject);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col font-sans overflow-y-auto">
      {/* Wizard Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: accent }}
          >
            RT
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">
              Create Itinerary & Quotation
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              Step {currentStep} of 5 ·{' '}
              {currentStep === 1
                ? 'Client & Trip Type'
                : currentStep === 2
                ? 'Group & Day Plan'
                : currentStep === 3
                ? 'Costing & Estimate'
                : currentStep === 4
                ? 'Policies & Details'
                : 'Continuous Brochure Preview & PDF'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {draftQuotation && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Draft Auto-saved</span>
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* 5-Step Progress Stepper */}
      <div className="bg-[#f8fafc] border-b border-slate-200 px-4 sm:px-8 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {[
            { step: 1, label: 'Client & Type' },
            { step: 2, label: 'Daily Plan' },
            { step: 3, label: 'Costing' },
            { step: 4, label: 'Policies' },
            { step: 5, label: 'Preview & PDF' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (item.step < currentStep || validateStep(currentStep)) {
                    setCurrentStep(item.step);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                    : isCompleted
                    ? 'text-emerald-700 hover:bg-white/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  style={isCurrent ? { backgroundColor: accent } : undefined}
                >
                  {isCompleted ? '✓' : item.step}
                </span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 pb-28">
        {/* Validation Alert */}
        {validationError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* ========================================================
            STEP 1: TRIP TYPE, CONSULTANT & CLIENT NAME
           ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Client / Institution Name */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Client / Institution Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. KPR Institute of Engineering and Technology"
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Renders prominently in uppercase on the quotation greeting card.
              </p>
            </div>

            {/* Trip Type Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Select Trip Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(settings.tripTypes || []).map((tt) => {
                  const isSelected = tripType === tt.name;
                  return (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() => {
                        setTripType(tt.name);
                        setCustomTripType('');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-[#f8fafc] hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block text-slate-900">{tt.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Quotation category</span>
                    </button>
                  );
                })}
              </div>

              {tripType === 'Other' && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={customTripType}
                    onChange={(e) => setCustomTripType(e.target.value)}
                    placeholder="Enter custom trip classification..."
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                  />
                </div>
              )}
            </div>

            {/* Consultant Dropdown */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Assigned Consultant / Tour Architect *
              </label>
              <select
                value={consultantId}
                onChange={(e) => setConsultantId(e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none"
              >
                {settings.consultants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.email}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                The selected consultant's contact details will be printed on the Journey Overview section.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: GROUP, DATES, TRANSPORT & DAILY PLAN
           ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Group & Transport Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Group & Journey Logistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Udupi – Gokarna – Dandeli"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Number of Travelers *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Staff / FOC Count
                  </label>
                  <input
                    type="text"
                    value={staffFocCount}
                    onChange={(e) => setStaffFocCount(e.target.value)}
                    placeholder="2 Staffs (FOC)"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Transport Vehicle
                  </label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="53 Seater Bus (Non - Ac)"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="text"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    placeholder="01 Oct 2026"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Return Date
                  </label>
                  <input
                    type="text"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    placeholder="03 Oct 2026"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Pickup & Drop Location
                  </label>
                  <input
                    type="text"
                    value={pickupDropPoint}
                    onChange={(e) => setPickupDropPoint(e.target.value)}
                    placeholder="Campus / Designate Point"
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">
                    Duration: {days - 1}N / {days}D
                  </span>
                </div>
              </div>
            </div>

            {/* Departure Journey Card Toggle & Editor */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={departureJourney.enabled}
                    onChange={(e) =>
                      setDepartureJourney({ ...departureJourney, enabled: e.target.checked })
                    }
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Include Departure & Night Journey Card (Badge 00)
                  </span>
                </label>
              </div>

              {departureJourney.enabled && (
                <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={departureJourney.title}
                      onChange={(e) =>
                        setDepartureJourney({ ...departureJourney, title: e.target.value })
                      }
                      placeholder="Title"
                      className="bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={departureJourney.date || ''}
                      onChange={(e) =>
                        setDepartureJourney({ ...departureJourney, date: e.target.value })
                      }
                      placeholder="Date (e.g. 30 Sep 2026)"
                      className="bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Timeline bullet points (comma or line separated):
                    </label>
                    <textarea
                      rows={2}
                      value={departureJourney.timeline.join('\n')}
                      onChange={(e) =>
                        setDepartureJourney({
                          ...departureJourney,
                          timeline: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Day by Day Packages Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Daily Itinerary Plan ({days} Days)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Assign place packages and customize day titles or spot highlights.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {dayPackages.map((day, dIdx) => (
                  <div
                    key={day.dayNumber}
                    className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: accent }}
                        >
                          {String(dIdx + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={day.customTitle || ''}
                          onChange={(e) => {
                            const copy = [...dayPackages];
                            copy[dIdx].customTitle = e.target.value;
                            setDayPackages(copy);
                          }}
                          placeholder={`DAY ${day.dayNumber} Title (e.g. Udupi Sightseeing)`}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 w-64"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={day.date || ''}
                          onChange={(e) => {
                            const copy = [...dayPackages];
                            copy[dIdx].date = e.target.value;
                            setDayPackages(copy);
                          }}
                          placeholder="Date (e.g. 01 Oct 2026)"
                          className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-mono w-32"
                        />
                      </div>
                    </div>

                    {/* Assigned Packages dropdown / multi-selector */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">
                        Choose Destination Package:
                      </label>
                      <select
                        value={day.packageIds[0] || ''}
                        onChange={(e) => {
                          const chosenPkg = placePackages.find((p) => p.id === e.target.value);
                          const copy = [...dayPackages];
                          copy[dIdx].packageIds = [e.target.value];
                          if (chosenPkg) {
                            copy[dIdx].customTitle = `${chosenPkg.name.toUpperCase()} SIGHTSEEING`;
                          }
                          setDayPackages(copy);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-900"
                      >
                        <option value="">-- Select a Place Package --</option>
                        {placePackages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            [{pkg.state}] {pkg.name} ({pkg.items.length} spots/activities)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Package quick preview */}
                    {day.packageIds[0] && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Included Timeline Preview
                          </span>
                        </div>
                        <div className="space-y-1">
                          {placePackages
                            .find((p) => p.id === day.packageIds[0])
                            ?.items.slice(0, 5)
                            .map((it, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                                <span className="text-slate-400">•</span>
                                <span>{(it.text || '').replace(/[{}]/g, '')}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Return Journey Card Toggle & Editor */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={returnJourney.enabled}
                    onChange={(e) =>
                      setReturnJourney({ ...returnJourney, enabled: e.target.checked })
                    }
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Include Return Journey Card (Badge 04)
                  </span>
                </label>
              </div>

              {returnJourney.enabled && (
                <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={returnJourney.title}
                      onChange={(e) =>
                        setReturnJourney({ ...returnJourney, title: e.target.value })
                      }
                      placeholder="Title"
                      className="bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={returnJourney.date || ''}
                      onChange={(e) =>
                        setReturnJourney({ ...returnJourney, date: e.target.value })
                      }
                      placeholder="Date (e.g. 04 Oct 2026)"
                      className="bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Timeline points (line separated):
                    </label>
                    <textarea
                      rows={2}
                      value={returnJourney.timeline.join('\n')}
                      onChange={(e) =>
                        setReturnJourney({
                          ...returnJourney,
                          timeline: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: COSTING & ESTIMATE
           ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Package Costing & Financials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 font-mono uppercase">
                    Price Per Person (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold font-mono text-slate-900 focus:bg-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Travelers: {travelers} Pax · Standard Total: ₹{' '}
                    {(travelers * pricePerPerson).toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700 font-mono uppercase">
                      Total Estimate (₹)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTotalManualOverride}
                        onChange={(e) => {
                          setIsTotalManualOverride(e.target.checked);
                          if (e.target.checked && manualTotalAmount === 0) {
                            setManualTotalAmount(travelers * pricePerPerson);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span>Manual Override</span>
                    </label>
                  </div>

                  <input
                    type="number"
                    disabled={!isTotalManualOverride}
                    value={isTotalManualOverride ? manualTotalAmount : travelers * pricePerPerson}
                    onChange={(e) => setManualTotalAmount(parseFloat(e.target.value) || 0)}
                    className={`w-full border rounded-xl px-4 py-3 text-lg font-mono font-bold ${
                      isTotalManualOverride
                        ? 'bg-amber-50/50 border-amber-300 text-slate-900'
                        : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 font-mono uppercase">
                    Advance Payment (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={advance}
                    onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 font-mono uppercase">
                    Balance Due on Tour Commencement (₹)
                  </label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold font-mono text-slate-700">
                    ₹ {balance.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Price Note */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Costing Note Displayed on Brochure
                </label>
                <textarea
                  rows={2}
                  value={priceNote}
                  onChange={(e) => setPriceNote(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: INSTRUCTIONS, POLICIES & SPECIAL NOTES
           ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Inclusions & Exclusions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Per-Quotation Inclusions & Exclusions (Toggle on/off)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase">
                      Inclusions
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const txt = prompt('Add inclusion item:');
                        if (txt) setInclusions([...inclusions, { text: txt.trim(), enabled: true }]);
                      }}
                      className="text-xs text-blue-700 font-bold hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {inclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${
                          item.enabled
                            ? 'bg-[#f8fafc] border-slate-200'
                            : 'bg-slate-50 border-slate-100 opacity-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) => {
                            const copy = [...inclusions];
                            copy[idx].enabled = e.target.checked;
                            setInclusions(copy);
                          }}
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <span className="flex-1 text-slate-800">{item.text}</span>
                        <button
                          type="button"
                          onClick={() => setInclusions(inclusions.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-800 uppercase">
                      Exclusions
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const txt = prompt('Add exclusion item:');
                        if (txt) setExclusions([...exclusions, { text: txt.trim(), enabled: true }]);
                      }}
                      className="text-xs text-blue-700 font-bold hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {exclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${
                          item.enabled
                            ? 'bg-[#f8fafc] border-slate-200'
                            : 'bg-slate-50 border-slate-100 opacity-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) => {
                            const copy = [...exclusions];
                            copy[idx].enabled = e.target.checked;
                            setExclusions(copy);
                          }}
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <span className="flex-1 text-slate-800">{item.text}</span>
                        <button
                          type="button"
                          onClick={() => setExclusions(exclusions.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Special Instructions / Remarks
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Enter any additional instructions for driver, group coordinator, or luggage policies..."
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: PREVIEW & GENERATE PDF
           ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ContinuousBrochurePreviewDeck
              quotation={currentQuotationObject}
              settings={settings}
              allPackages={placePackages}
              onSaveQuotation={handleSaveQuotation}
            />
          </div>
        )}
      </main>

      {/* Centered Fixed Wizard Footer Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back Button */}
          <div className="w-24 flex justify-start">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Center: Confirm & Save button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handleSaveQuotation}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-all"
              style={{ backgroundColor: accent }}
              title="Confirm itinerary and save quotation to records"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm & Save</span>
            </button>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline-block ml-2">
              (Step {currentStep} of 5)
            </span>
          </div>

          {/* Right: Next / Done Button */}
          <div className="w-24 flex justify-end">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveQuotation}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all shadow-xs active:scale-95"
              >
                <span>Done</span>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
