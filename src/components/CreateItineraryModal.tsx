import React, { useState, useMemo } from 'react';
import { X, Globe2, Home, ArrowLeft, Phone, UserPlus, Crown, Plus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Consultant, GroupType, TripRegion } from '../types/itinerary';

interface CreateItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultants: Consultant[];
  onAddConsultant?: (consultant: Consultant) => void;
  onConfirm: (initialData: {
    code: string;
    region: TripRegion;
    groupType: GroupType;
    consultant: Consultant;
  }) => void;
}

export const CreateItineraryModal: React.FC<CreateItineraryModalProps> = ({
  isOpen,
  onClose,
  consultants,
  onAddConsultant,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [region, setRegion] = useState<TripRegion>('DOM');
  const [groupType, setGroupType] = useState<GroupType>('CLG');
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>(
    consultants[0]?.id || ''
  );

  // Add new consultant sub-form state
  const [showAddConsultantForm, setShowAddConsultantForm] = useState(false);
  const [newConsultantName, setNewConsultantName] = useState('');
  const [newConsultantPhone, setNewConsultantPhone] = useState('+91 ');
  const [newConsultantRole, setNewConsultantRole] = useState('Private Client Expedition Lead');
  const [newConsultantEmail, setNewConsultantEmail] = useState('');
  const [consultantFormError, setConsultantFormError] = useState('');

  // Generate dynamic sequence code e.g. RT26-DOM-CLG-473 for ROYAL TOURS
  const generatedCode = useMemo(() => {
    const randomSeq = Math.floor(100 + Math.random() * 899);
    return `RT26-${region}-${groupType}-${randomSeq}`;
  }, [region, groupType]);

  const currentConsultant = useMemo(() => {
    return consultants.find((c) => c.id === selectedConsultantId) || consultants[0];
  }, [consultants, selectedConsultantId]);

  if (!isOpen) return null;

  const handleNext = () => {
    setStep(2);
    if (consultants.length === 0) {
      setShowAddConsultantForm(true);
    }
  };

  const handleBack = () => {
    setStep(1);
    setShowAddConsultantForm(false);
    setConsultantFormError('');
  };

  const handleSaveNewConsultant = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultantFormError('');

    if (!newConsultantName.trim() || !newConsultantPhone.trim()) {
      setConsultantFormError('Please enter both name and contact number.');
      return;
    }

    const cleanName = newConsultantName.trim().toLowerCase();
    const cleanPhone = newConsultantPhone.replace(/\D/g, '');

    // Check duplicate consultant name
    const isNameDuplicate = consultants.some(
      (c) => c.name.trim().toLowerCase() === cleanName
    );
    if (isNameDuplicate) {
      setConsultantFormError(
        `A consultant named "${newConsultantName.trim()}" already exists. Please choose a different name.`
      );
      return;
    }

    // Check duplicate contact number
    const isPhoneDuplicate = consultants.some(
      (c) => cleanPhone.length >= 7 && c.phone.replace(/\D/g, '') === cleanPhone
    );
    if (isPhoneDuplicate) {
      setConsultantFormError(
        'This contact number is already registered to another consultant. Please enter a different contact number.'
      );
      return;
    }

    const emailDomain = newConsultantName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const createdConsultant: Consultant = {
      id: `c-${Date.now()}`,
      name: newConsultantName.trim(),
      phone: newConsultantPhone.trim(),
      role: newConsultantRole.trim() || 'Expedition Specialist',
      email: newConsultantEmail.trim() || `${emailDomain}@royaltours.com`,
      count: 1,
    };

    if (onAddConsultant) {
      onAddConsultant(createdConsultant);
    }

    setSelectedConsultantId(createdConsultant.id);
    setShowAddConsultantForm(false);
    setNewConsultantName('');
    setNewConsultantPhone('+91 ');
    setNewConsultantRole('Private Client Expedition Lead');
    setNewConsultantEmail('');
    setConsultantFormError('');
  };

  const handleFinalConfirm = () => {
    if (!currentConsultant) {
      setShowAddConsultantForm(true);
      setConsultantFormError('Please add and select a consultant for this itinerary.');
      return;
    }
    onConfirm({
      code: generatedCode,
      region,
      groupType,
      consultant: currentConsultant,
    });
  };

  const groupOptions: { type: GroupType; label: string }[] = [
    { type: 'FIT', label: 'Friends & Family' },
    { type: 'SCH', label: 'School' },
    { type: 'CLG', label: 'College' },
    { type: 'COR', label: 'Corporate' },
    { type: 'CPL', label: 'Couple' },
    { type: 'GD', label: 'Group Departure' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
        
        {/* Header with ROYAL TOURS touch */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Crown className="w-4 h-4 text-slate-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-sans-luxury text-slate-950">
                Create New Itinerary
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {step === 1
                  ? 'Select the trip type to generate the correct itinerary code.'
                  : 'Almost there! Select the consultant for this itinerary.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {step === 1 ? (
            <>
              {/* 1. Trip Region */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 font-sans-luxury">
                  1. Trip Region
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegion('DOM')}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                      region === 'DOM'
                        ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Domestic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegion('INTL')}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                      region === 'INTL'
                        ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <Globe2 className="w-4 h-4" />
                    <span>International</span>
                  </button>
                </div>
              </div>

              {/* 2. Group Type */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 font-sans-luxury">
                  2. Group Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {groupOptions.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setGroupType(opt.type)}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border text-center ${
                        groupType === opt.type
                          ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Preview strictly matching Photo 3 with grey glassy treatment */}
              <div className="bg-slate-100/80 border border-slate-200/90 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-sans-luxury font-medium">
                  Code preview:
                </span>
                <span className="text-sm font-bold font-mono text-slate-950 tracking-wider">
                  {generatedCode}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Consultant Selection matching Photo 4 + Add Consultant */}
              <div className="bg-slate-100/80 border border-slate-200/90 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-sans-luxury font-medium">
                  Itinerary code:
                </span>
                <span className="text-sm font-bold font-mono text-slate-950 tracking-wider">
                  {generatedCode}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-sans-luxury">
                      3. Select or Add Consultant
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Assign an expedition specialist to manage this itinerary.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddConsultantForm(!showAddConsultantForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-100" />
                    <span>{showAddConsultantForm ? 'Close Form' : '+ Add Consultant'}</span>
                  </button>
                </div>

                {/* Sub-form: Add Consultant */}
                {showAddConsultantForm ? (
                  <form
                    onSubmit={handleSaveNewConsultant}
                    className="bg-slate-50 border border-slate-300/90 rounded-2xl p-4.5 space-y-3.5 shadow-sm animate-in fade-in duration-150"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 font-sans-luxury">
                        <UserPlus className="w-4 h-4 text-slate-800" />
                        <span>Add New Royal Tours Consultant</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const FRESH_PRESETS = [
                            { name: 'Ms. Maya Varma', phone: '+91 98402 11990', role: 'Principal Expedition Architect', email: 'mayavarma@royaltours.com' },
                            { name: 'Mr. Kabir Sen', phone: '+91 98201 45912', role: 'High-Altitude Himalayan Specialist', email: 'kabirsen@royaltours.com' },
                            { name: 'Ms. Tara Al-Mansoor', phone: '+91 99304 78201', role: 'Maritime & Island Cruise Curator', email: 'tara@royaltours.com' },
                            { name: 'Mr. Devendra Rao', phone: '+91 98451 92034', role: 'Royal Heritage & Wildlife Lead', email: 'devendra@royaltours.com' },
                          ];
                          const available = FRESH_PRESETS.find(
                            (p) => !consultants.some((c) => c.name.toLowerCase() === p.name.toLowerCase())
                          ) || FRESH_PRESETS[0];

                          setNewConsultantName(available.name);
                          setNewConsultantPhone(available.phone);
                          setNewConsultantRole(available.role);
                          setNewConsultantEmail(available.email);
                          setConsultantFormError('');
                        }}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-mono px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                        title="Auto-fill with a fresh verified architect"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span>Auto-suggest Verified Lead</span>
                      </button>
                    </div>

                    {consultantFormError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="font-medium">{consultantFormError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newConsultantName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewConsultantName(val);
                            setConsultantFormError('');
                            if (!newConsultantEmail || newConsultantEmail.includes('@royaltours.com')) {
                              const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                              setNewConsultantEmail(clean ? `${clean}@royaltours.com` : '');
                            }
                          }}
                          placeholder="e.g. Ms. Samantha Roy"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                          Mobile Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={newConsultantPhone}
                          onChange={(e) => {
                            setNewConsultantPhone(e.target.value);
                            setConsultantFormError('');
                          }}
                          placeholder="+91 98111 22334"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                        Role / Specialization
                      </label>
                      <input
                        type="text"
                        value={newConsultantRole}
                        onChange={(e) => setNewConsultantRole(e.target.value)}
                        placeholder="e.g. Senior Safari Architect"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-500 mb-1.5"
                      />
                      {/* Role Presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Principal Expedition Architect',
                          'Alpine & Wilderness Lead',
                          'Maritime & Island Curator',
                          'Wildlife Safari Lead',
                          'Private Client Director',
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setNewConsultantRole(role)}
                            className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors ${
                              newConsultantRole === role
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                        Official Email
                      </label>
                      <input
                        type="email"
                        value={newConsultantEmail}
                        onChange={(e) => setNewConsultantEmail(e.target.value)}
                        placeholder="samantha@royaltours.com"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowAddConsultantForm(false)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Save & Select Consultant</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {/* Select Dropdown */}
                    <div className="relative">
                      <select
                        value={selectedConsultantId}
                        onChange={(e) => {
                          if (e.target.value === '__add_new__') {
                            setShowAddConsultantForm(true);
                          } else {
                            setSelectedConsultantId(e.target.value);
                          }
                        }}
                        className="w-full bg-white border border-slate-300/90 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-sans-luxury font-medium shadow-xs"
                      >
                        <option value="__add_new__" className="font-bold text-slate-900 bg-slate-100">
                          ✨ + Add New Consultant...
                        </option>
                        <optgroup label="Registered Consultants">
                          {consultants.length === 0 ? (
                            <option value="" disabled>
                              No registered consultants yet
                            </option>
                          ) : (
                            consultants.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} — {c.role} ({c.phone})
                              </option>
                            ))
                          )}
                        </optgroup>
                      </select>
                    </div>

                    {/* Empty Consultant Prompt */}
                    {!currentConsultant && !showAddConsultantForm && (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2.5">
                        <p className="text-xs text-slate-600 font-medium">
                          No consultants registered in the studio yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddConsultantForm(true)}
                          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                        >
                          + Register First Consultant
                        </button>
                      </div>
                    )}

                    {/* Active Selected Consultant Summary Card */}
                    {currentConsultant && (
                      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {currentConsultant.name
                              .replace('Mr. ', '')
                              .replace('Ms. ', '')
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-950 font-sans-luxury">
                              {currentConsultant.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {currentConsultant.role}
                            </div>
                            <div className="text-[11px] font-mono text-slate-700 mt-0.5 flex items-center gap-2">
                              <span>{currentConsultant.phone}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500">{currentConsultant.email}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddConsultantForm(true)}
                          className="text-[11px] font-bold text-slate-700 hover:text-slate-950 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition-colors"
                        >
                          + New
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          {step === 2 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-b from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 transition-all shadow-md shadow-slate-900/15"
            >
              Next: Select Consultant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalConfirm}
              className="px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-b from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 transition-all shadow-md shadow-slate-900/15"
            >
              Confirm & Continue
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
