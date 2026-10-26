import React, { useState } from 'react';
import {
  X,
  Eye,
  Check,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  FileText,
  ShieldCheck,
  Send,
  Loader2,
  Crown,
  FileDown,
  UserPlus,
} from 'lucide-react';
import {
  Consultant,
  DayKeywordPreset,
  Itinerary,
  ItineraryDay,
  PricingSlot,
  PricingUnit,
} from '../types/itinerary';
import { generateLuxuryDayPlan } from '../services/geminiCurator';

interface ItineraryEditorProps {
  itinerary: Itinerary;
  consultants: Consultant[];
  keywordPresets: DayKeywordPreset[];
  onSave: (updated: Itinerary) => void;
  onPreview: (itinerary: Itinerary) => void;
  onDownloadPDF?: (itinerary: Itinerary) => void;
  onAddConsultant?: (consultant: Consultant) => void;
  onClose: () => void;
}

export const ItineraryEditor: React.FC<ItineraryEditorProps> = ({
  itinerary: initialData,
  consultants,
  keywordPresets,
  onSave,
  onPreview,
  onDownloadPDF,
  onAddConsultant,
  onClose,
}) => {
  const [data, setData] = useState<Itinerary>({ ...initialData });
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);
  const [showAddConsultantForm, setShowAddConsultantForm] = useState(false);
  const [newConsultantName, setNewConsultantName] = useState('');
  const [newConsultantPhone, setNewConsultantPhone] = useState('+91 ');
  const [newConsultantRole, setNewConsultantRole] = useState('Senior Expedition Specialist');
  const [newConsultantEmail, setNewConsultantEmail] = useState('');
  const [consultantFormError, setConsultantFormError] = useState('');

  // Quick helper to update top-level field
  const updateField = <K extends keyof Itinerary>(field: K, value: Itinerary[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Costing slot manipulation
  const handleAddPricingSlot = () => {
    const newSlot: PricingSlot = {
      id: `slot-${Date.now()}`,
      label: 'Ultra-Luxury Tented Lodge & Guided Expeditions',
      price: 150000,
      unit: 'Per Couple',
    };
    setData((prev) => ({
      ...prev,
      pricingSlots: [...prev.pricingSlots, newSlot],
    }));
  };

  const handleUpdateSlot = (id: string, updates: Partial<PricingSlot>) => {
    setData((prev) => ({
      ...prev,
      pricingSlots: prev.pricingSlots.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  };

  const handleRemoveSlot = (id: string) => {
    setData((prev) => ({
      ...prev,
      pricingSlots: prev.pricingSlots.filter((s) => s.id !== id),
    }));
  };

  // Day 0 manipulation
  const handleToggleDay0 = () => {
    if (data.hasDay0) {
      setData((prev) => ({ ...prev, hasDay0: false }));
    } else {
      setData((prev) => ({
        ...prev,
        hasDay0: true,
        day0: prev.day0 || {
          id: `d0-${Date.now()}`,
          dayNumber: 0,
          title: 'Arrival, VIP Tarmac Escort & Pre-Expedition Briefing',
          date: data.dateOfTravel || '2026-11-10',
          activities: 'Direct airside limousine escort upon arrival. Welcome reception at private airfield lounge with lead expedition guide.',
          enableNotes: true,
          notes: 'All private vessel manifests and permits pre-cleared by ground team.',
        },
      }));
    }
  };

  // Day items manipulation
  const handleAddDay = () => {
    const nextNumber = data.days.length + 1;
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: nextNumber,
      title: `Day ${nextNumber}: Wilderness Exploration`,
      date: data.dateOfTravel,
      activities: 'Morning private expedition with certified master guide. Afternoon alpine tea and sunset fireside tasting.',
      enableNotes: false,
    };
    setData((prev) => ({ ...prev, days: [...prev.days, newDay] }));
  };

  const handleUpdateDay = (id: string, updates: Partial<ItineraryDay>) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const handleRemoveDay = (id: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days
        .filter((d) => d.id !== id)
        .map((d, index) => ({ ...d, dayNumber: index + 1 })),
    }));
  };

  // Fast preset application for a day
  const handleApplyPreset = (dayId: string, preset: DayKeywordPreset) => {
    handleUpdateDay(dayId, {
      title: preset.title,
      activities: preset.defaultActivities,
      notes: preset.defaultNotes,
      enableNotes: Boolean(preset.defaultNotes),
      highlight: preset.suggestedHighlight,
    });
  };

  // AI curation helper
  const handleAiCurateDay = async (day: ItineraryDay) => {
    setIsAiLoading(day.id);
    try {
      const plan = await generateLuxuryDayPlan({
        destination: data.destination,
        dayNumber: day.dayNumber,
        themeOrKeywords: day.title,
        region: data.region,
      });
      handleUpdateDay(day.id, {
        title: plan.title,
        activities: plan.activities,
        notes: plan.notes,
        enableNotes: true,
        highlight: plan.highlight,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(null);
    }
  };

  const handleSaveAndClose = () => {
    onSave(data);
    onClose();
  };

  const handleSaveAndPreview = () => {
    onSave(data);
    onPreview(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc] text-slate-800 overflow-hidden">
      
      {/* Top Header strictly matching Photo 5 in white & grey glassy aesthetic */}
      <header className="shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 py-3.5 shadow-xs z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Code Preview */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-cinzel-royal font-bold text-slate-950 text-base">
              <Crown className="w-4 h-4 text-slate-800" />
              <span>ROYAL TOURS</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-800 font-semibold shadow-xs">
              <span>{data.code}</span>
            </div>
          </div>

          {/* Stepper with grey glassy pills */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 backdrop-blur-sm">
            {[
              { step: 1, label: 'Step 1: summary' },
              { step: 2, label: 'Step 2: itinerary' },
              { step: 3, label: 'Step 3: details' },
              { step: 4, label: 'Step 4: policies' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  currentStep === s.step
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onSave(data);
                if (onDownloadPDF) {
                  onDownloadPDF(data);
                } else {
                  handleSaveAndPreview();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-xl transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-700" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndPreview}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-200/90 rounded-xl transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-700" />
              <span>Preview itinerary</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Scrollable Main Viewport */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[#f8fafc]">
        <main className="max-w-5xl mx-auto px-6 py-8 pb-8">
        
        {/* STEP 1: SUMMARY matching Photo 5 */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Section 1: Consultant Details */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                  Consultant Details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddConsultantForm(!showAddConsultantForm)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200"
                >
                  <UserPlus className="w-3 h-3 text-slate-700" />
                  <span>{showAddConsultantForm ? 'Hide Form' : '+ Add Consultant'}</span>
                </button>
              </div>

              {/* Optional inline add consultant form */}
              {showAddConsultantForm && (
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Add New Consultant
                  </div>

                  {consultantFormError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-medium">{consultantFormError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newConsultantName}
                        onChange={(e) => {
                          setNewConsultantName(e.target.value);
                          setConsultantFormError('');
                        }}
                        placeholder="e.g. Ms. Samantha Roy"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Mobile *</label>
                      <input
                        type="text"
                        value={newConsultantPhone}
                        onChange={(e) => {
                          setNewConsultantPhone(e.target.value);
                          setConsultantFormError('');
                        }}
                        placeholder="+91 98111 22334"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddConsultantForm(false);
                        setConsultantFormError('');
                      }}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConsultantFormError('');
                        if (!newConsultantName.trim() || !newConsultantPhone.trim()) {
                          setConsultantFormError('Please enter both name and contact number.');
                          return;
                        }

                        const cleanName = newConsultantName.trim().toLowerCase();
                        const cleanPhone = newConsultantPhone.replace(/\D/g, '');

                        // Duplicate name check
                        const nameExists = consultants.some(
                          (c) => c.name.trim().toLowerCase() === cleanName
                        );
                        if (nameExists) {
                          setConsultantFormError(`Consultant "${newConsultantName.trim()}" already exists. Please choose a different name.`);
                          return;
                        }

                        // Duplicate phone check
                        const phoneExists = consultants.some(
                          (c) => cleanPhone.length >= 7 && c.phone.replace(/\D/g, '') === cleanPhone
                        );
                        if (phoneExists) {
                          setConsultantFormError('This contact number is already registered to another consultant. Please enter a different number.');
                          return;
                        }

                        const created: Consultant = {
                          id: `c-${Date.now()}`,
                          name: newConsultantName.trim(),
                          phone: newConsultantPhone.trim(),
                          role: newConsultantRole.trim() || 'Senior Expedition Specialist',
                          email: newConsultantEmail.trim() || `${newConsultantName.toLowerCase().replace(/[^a-z0-9]/g, '')}@royaltours.com`,
                          count: 1,
                        };
                        if (onAddConsultant) onAddConsultant(created);
                        updateField('consultant', created);
                        setShowAddConsultantForm(false);
                        setNewConsultantName('');
                        setNewConsultantPhone('+91 ');
                        setConsultantFormError('');
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow"
                    >
                      Save & Assign
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Consultant name
                  </label>
                  <select
                    value={data.consultant?.id || ''}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setShowAddConsultantForm(true);
                      } else {
                        const found = consultants.find((c) => c.id === e.target.value);
                        if (found) updateField('consultant', found);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-medium"
                  >
                    {consultants.length === 0 && (
                      <option value="" disabled>
                        No registered consultants yet
                      </option>
                    )}
                    {consultants.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                    <option value="__add_new__" className="font-bold text-slate-900">
                      + Add new consultant...
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Consultant number
                  </label>
                  <input
                    type="text"
                    value={data.consultant?.phone || ''}
                    readOnly
                    placeholder="Auto-filled from consultant selection"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Quotation Details */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                Quotation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Quotation date
                  </label>
                  <input
                    type="text"
                    value={data.quotationDate}
                    onChange={(e) => updateField('quotationDate', e.target.value)}
                    placeholder="e.g. October 14th, 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Quotation valid until
                  </label>
                  <input
                    type="text"
                    value={data.validUntil}
                    onChange={(e) => updateField('validUntil', e.target.value)}
                    placeholder="e.g. October 28th, 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Trip Details */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={data.destination}
                    onChange={(e) => updateField('destination', e.target.value)}
                    placeholder="e.g. Kerala, Munnar..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={data.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    placeholder="e.g. 2N/3D, 4N5D"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Date of travel
                  </label>
                  <input
                    type="text"
                    value={data.dateOfTravel}
                    onChange={(e) => updateField('dateOfTravel', e.target.value)}
                    placeholder="e.g. 12 Nov 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Transport details
                  </label>
                  <input
                    type="text"
                    value={data.transportDetails}
                    onChange={(e) => updateField('transportDetails', e.target.value)}
                    placeholder="Enter transport details (e.g. Private Helicopter / Luxury Catamaran)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Group size (Pax)
                  </label>
                  <input
                    type="text"
                    value={data.groupSizePax}
                    onChange={(e) => updateField('groupSizePax', e.target.value)}
                    placeholder="e.g. 2 Adults, 10 Adults 2 Infants"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Client Details */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                Client Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Client name
                  </label>
                  <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    placeholder="e.g. Mr. Sukumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Client number
                  </label>
                  <input
                    type="text"
                    value={data.clientNumber}
                    onChange={(e) => updateField('clientNumber', e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Costing matching Photo 5 with grey glassy rows */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                    Costing
                  </h3>
                  {/* Currency selector */}
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs">
                    {(['₹', '$', '€'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => updateField('currency', curr)}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                          data.currency === curr
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-950'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPricingSlot}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-900" />
                  <span>Add pricing slot</span>
                </button>
              </div>

              {/* Slots List */}
              <div className="space-y-3">
                {data.pricingSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50/80 p-3.5 rounded-xl border border-slate-200"
                  >
                    <div className="md:col-span-6">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Slot label
                      </label>
                      <input
                        type="text"
                        value={slot.label}
                        onChange={(e) =>
                          handleUpdateSlot(slot.id, { label: e.target.value })
                        }
                        placeholder="e.g. Inclusive of all meals & luxury charter"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Price ({data.currency})
                      </label>
                      <input
                        type="number"
                        value={slot.price}
                        onChange={(e) =>
                          handleUpdateSlot(slot.id, {
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-950 font-mono font-bold focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Unit
                      </label>
                      <select
                        value={slot.unit}
                        onChange={(e) =>
                          handleUpdateSlot(slot.id, {
                            unit: e.target.value as PricingUnit,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                      >
                        <option value="Per Pax">Per Pax</option>
                        <option value="Per Couple">Per Couple</option>
                        <option value="Total Package">Total Package</option>
                        <option value="Per Suite">Per Suite</option>
                        <option value="Per Villa">Per Villa</option>
                      </select>
                    </div>

                    <div className="md:col-span-1 flex justify-end pt-4 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Costing note textarea matching Photo 5 */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Costing note
                </label>
                <textarea
                  rows={2}
                  value={data.costingNote}
                  onChange={(e) => updateField('costingNote', e.target.value)}
                  placeholder="This price is based on the above travel date and group size..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-slate-400 font-sans-luxury"
                />
              </div>
            </div>


          </div>
        )}

        {/* STEP 2: ITINERARY matching Photo 6 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Day 0 Card matching Photo 6 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="text-sm font-bold text-slate-950">Day 0</h4>
                <p className="text-xs text-slate-500">
                  Add Day 0 for pre-trip briefing, VIP airport welcome, or arrival details
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleDay0}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  data.hasDay0
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {data.hasDay0 ? 'Enabled' : 'Enable'}
              </button>
            </div>

            {/* Day 0 Content if enabled */}
            {data.hasDay0 && data.day0 && (
              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-900 font-bold uppercase tracking-wider">
                    Day 0: Pre-Trip / Arrival Details
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Day title
                    </label>
                    <input
                      type="text"
                      value={data.day0.title}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          day0: prev.day0 ? { ...prev.day0, title: e.target.value } : undefined,
                        }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Specific date
                    </label>
                    <input
                      type="text"
                      value={data.day0.date}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          day0: prev.day0 ? { ...prev.day0, date: e.target.value } : undefined,
                        }))
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Activities & Arrival Protocol
                  </label>
                  <textarea
                    rows={3}
                    value={data.day0.activities}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        day0: prev.day0 ? { ...prev.day0, activities: e.target.value } : undefined,
                      }))
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Day Cards List matching Photo 6 */}
            <div className="space-y-5">
              {data.days.map((day) => (
                <div
                  key={day.id}
                  className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                        {day.dayNumber}
                      </div>
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-900 font-sans-luxury">
                        Day {day.dayNumber} Plan
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* AI curation helper */}
                      <button
                        type="button"
                        onClick={() => handleAiCurateDay(day)}
                        disabled={isAiLoading === day.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200/70 transition-colors"
                      >
                        {isAiLoading === day.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-800" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                        )}
                        <span>Curate with AI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveDay(day.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Keyword Quick Search / Preset selection */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Keyword search / Preset Autocomplete
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        onChange={(e) => {
                          const preset = keywordPresets.find(
                            (k) => k.id === e.target.value
                          );
                          if (preset) handleApplyPreset(day.id, preset);
                        }}
                        defaultValue=""
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans-luxury"
                      >
                        <option value="" disabled>
                          Select luxury template keyword (e.g. Andaman/Bioluminescence, Rishikesh/CliffCamp)...
                        </option>
                        {keywordPresets.map((kp) => (
                          <option key={kp.id} value={kp.id}>
                            {kp.keyword} — {kp.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Day Title & Specific Date inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Day title
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) =>
                          handleUpdateDay(day.id, { title: e.target.value })
                        }
                        placeholder="e.g. Arrival & Welcome to Fjord Eco-Lodge"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Specific date
                      </label>
                      <input
                        type="text"
                        value={day.date}
                        onChange={(e) =>
                          handleUpdateDay(day.id, { date: e.target.value })
                        }
                        placeholder="e.g. 14-10-2026"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Activities Textarea matching Photo 6 */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Activities
                    </label>
                    <textarea
                      rows={3}
                      value={day.activities}
                      onChange={(e) =>
                        handleUpdateDay(day.id, { activities: e.target.value })
                      }
                      placeholder="Check-in&#10;Sightseeing&#10;Dinner"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans-luxury"
                    />
                  </div>

                  {/* Enable Notes Checkbox matching Photo 6 */}
                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        checked={day.enableNotes}
                        onChange={(e) =>
                          handleUpdateDay(day.id, { enableNotes: e.target.checked })
                        }
                        className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0"
                      />
                      <span>Enable Notes</span>
                    </label>

                    {day.enableNotes && (
                      <textarea
                        rows={2}
                        value={day.notes || ''}
                        onChange={(e) =>
                          handleUpdateDay(day.id, { notes: e.target.value })
                        }
                        placeholder="Special expedition logistics, gear provided, private sommelier menu..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-slate-400"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* + Add Day Button matching Photo 6 */}
            <button
              type="button"
              onClick={handleAddDay}
              className="w-full py-3.5 border border-dashed border-slate-300 bg-white/60 hover:bg-white rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-950 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-slate-900" />
              <span>Add day</span>
            </button>


          </div>
        )}

        {/* STEP 3: DETAILS matching Photo 7 */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Notes Section matching Photo 7 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-800" />
                <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                  Notes
                </h3>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={data.enableNotes}
                  onChange={(e) => updateField('enableNotes', e.target.checked)}
                  className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0"
                />
                <span>Enable Notes</span>
              </label>

              {data.enableNotes && (
                <textarea
                  rows={3}
                  value={data.generalNotes || ''}
                  onChange={(e) => updateField('generalNotes', e.target.value)}
                  placeholder="General expedition notes (e.g. luggage weight constraints, mountain rescue insurance, emergency beacons)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              )}
            </div>

            {/* Inclusions and Exclusions side by side matching Photo 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Inclusions Card */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                    Inclusions
                  </h3>
                </div>
                <span className="block text-[11px] text-slate-500 font-medium">
                  One per line
                </span>
                <textarea
                  rows={8}
                  value={data.inclusions.join('\n')}
                  onChange={(e) =>
                    updateField(
                      'inclusions',
                      e.target.value.split('\n').filter((l) => l.trim().length > 0)
                    )
                  }
                  placeholder="Private Vehicle&#10;Driver Allowance&#10;Parking & Toll&#10;Accommodation&#10;Breakfast & Dinner&#10;Sightseeing tickets"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans-luxury leading-relaxed"
                />
              </div>

              {/* Exclusions Card */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                  <X className="w-4 h-4 stroke-[3]" />
                  <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                    Exclusions
                  </h3>
                </div>
                <span className="block text-[11px] text-slate-500 font-medium">
                  One per line
                </span>
                <textarea
                  rows={8}
                  value={data.exclusions.join('\n')}
                  onChange={(e) =>
                    updateField(
                      'exclusions',
                      e.target.value.split('\n').filter((l) => l.trim().length > 0)
                    )
                  }
                  placeholder="GST 5%&#10;Personal Expenses&#10;Airfare / Train fare&#10;Lunch&#10;Monument fees"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans-luxury leading-relaxed"
                />
              </div>

            </div>


          </div>
        )}

        {/* STEP 4: POLICIES */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-800" />
                <h3 className="text-sm font-bold font-sans-luxury text-slate-950">
                  Expedition Terms & Guarantees
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Cancellation Policy
                </label>
                <textarea
                  rows={3}
                  value={data.cancellationPolicy}
                  onChange={(e) => updateField('cancellationPolicy', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Payment Milestones
                </label>
                <textarea
                  rows={2}
                  value={data.paymentTerms}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Remote Wilderness Safety & Aeromedical Protocol
                </label>
                <textarea
                  rows={3}
                  value={data.expeditionSafetyTerms}
                  onChange={(e) => updateField('expeditionSafetyTerms', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Step 4 Secondary Export Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onSave(data);
                  if (onDownloadPDF) {
                    onDownloadPDF(data);
                  } else {
                    handleSaveAndPreview();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-700" />
                <span>Download Quotation (PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndPreview}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-700" />
                <span>Preview Quotation</span>
              </button>
            </div>

          </div>
        )}

        </main>
      </div>

      {/* Permanently Fixed Footer Bar - Stays anchored to the bottom and never moves */}
      <footer className="shrink-0 bg-white border-t border-slate-200 py-3.5 px-6 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Previous Button */}
          <div className="w-28 flex justify-start">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as any) : 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}
          </div>

          {/* Center: Confirm & Save button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3] text-emerald-400" />
              <span>Confirm & Save</span>
            </button>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block ml-1">
              (Step {currentStep} of 4)
            </span>
          </div>

          {/* Right: Next or Done */}
          <div className="w-28 flex justify-end">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as any) : 4))}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndClose}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Done</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
};
