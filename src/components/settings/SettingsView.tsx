import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageItem,
  PlacePackage,
  Consultant,
  CancellationPolicyRow,
  StatsItem,
  SectionId,
  SectionLayoutItem,
  TripTypeItem,
  AppSettings,
} from '../../types/placePackage';
import { SEED_SETTINGS } from '../../data/seedPackages';
import { DEFAULT_QUOTATION_BACKGROUND } from '../../data/defaultBackgroundTexture';
import { SecretPasswordModal } from '../SecretPasswordModal';
import { PWAInstallButton } from '../PWAInstallButton';
import {
  Search,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Eye,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Building,
  CreditCard,
  UserCheck,
  FileCheck,
  AlertCircle,
  FolderOpen,
  KeyRound,
  Layout,
  Star,
  Phone,
  Mail,
  Shield,
  Palette,
  Layers,
  HelpCircle,
  Camera,
  Cloud,
} from 'lucide-react';

export interface SettingsViewProps {
  currentLoginPassword?: string;
  onUpdateLoginPassword?: (newPass: string) => void;
  onOpenSecretPassword?: () => void;
  onOpenGoogleDrive?: () => void;
}

type SettingsTab =
  | 'branding'
  | 'contact'
  | 'consultants'
  | 'packages'
  | 'content'
  | 'trust'
  | 'layout'
  | 'trip_types'
  | 'theme'
  | 'backup';

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLoginPassword = 'royal123',
  onUpdateLoginPassword,
  onOpenSecretPassword,
  onOpenGoogleDrive,
}) => {
  const {
    placePackages,
    addPlacePackage,
    updatePlacePackage,
    duplicatePlacePackage,
    deletePlacePackage,
    settings,
    updateSettings,
    resetSettingsToDefault,
    exportAllDataAsJSON,
    importAllDataFromJSON,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [confirmResetTab, setConfirmResetTab] = useState<SettingsTab | null>(null);

  // Hidden password modal state
  const [isInternalPasswordModalOpen, setIsInternalPasswordModalOpen] = useState(false);
  const handleTriggerResetPassword = () => {
    if (onOpenSecretPassword) {
      onOpenSecretPassword();
    } else {
      setIsInternalPasswordModalOpen(true);
    }
  };

  // 5-Tap Password Reset Protection (Silent / Discreet)
  const [tapCount, setTapCount] = useState<number>(0);
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePasswordResetTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (tapTimer) {
      clearTimeout(tapTimer);
    }

    if (nextCount >= 5) {
      setTapCount(0);
      handleTriggerResetPassword();
    } else {
      const timer = setTimeout(() => {
        setTapCount(0);
      }, 3500);
      setTapTimer(timer);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  // -------------------------------------------------------------
  // PLACE PACKAGES TAB STATE
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<'ALL' | string>('ALL');
  const [editingPackage, setEditingPackage] = useState<PlacePackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<PlacePackage | null>(null);

  const filteredPackages = placePackages.filter((p) => {
    if (stateFilter !== 'ALL' && p.state !== stateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchItem = p.items.some((i) => i.text.toLowerCase().includes(q));
      if (!matchName && !matchItem) return false;
    }
    return true;
  });

  const availableStates = Array.from(
    new Set(placePackages.map((p) => p.state).filter(Boolean))
  );

  const handleOpenEditPackage = (pkg: PlacePackage) => {
    setEditingPackage(JSON.parse(JSON.stringify(pkg)));
    setIsNewPackage(false);
  };

  const handleOpenCreatePackage = () => {
    const newPkg: PlacePackage = {
      id: `pkg-${Date.now()}`,
      name: '',
      state: 'Kerala',
      backgroundImage: '/assets/kerala_bg.jpg',
      items: [
        { id: `it-1`, text: 'Arrival and transfer to hotel', highlight: false },
        { id: `it-2`, text: 'Breakfast at Hotel', highlight: false },
        { id: `it-3`, text: 'Proceed to Sightseeing {Spot 1, Spot 2}', highlight: true },
        { id: `it-4`, text: 'Dinner', highlight: false },
        { id: `it-5`, text: 'Stay at Hotel', highlight: false },
      ],
    };
    setEditingPackage(newPkg);
    setIsNewPackage(true);
  };

  const handleSavePackageModal = () => {
    if (!editingPackage || !editingPackage.name.trim()) return;
    if (isNewPackage) {
      addPlacePackage({
        name: editingPackage.name.trim(),
        state: editingPackage.state,
        backgroundImage: editingPackage.backgroundImage,
        items: editingPackage.items,
      });
    } else {
      updatePlacePackage(editingPackage.id, editingPackage);
    }
    setEditingPackage(null);
    showNotification('Package saved successfully!');
  };

  const movePackageItem = (index: number, direction: 'up' | 'down') => {
    if (!editingPackage) return;
    const copy = [...editingPackage.items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= copy.length) return;
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setEditingPackage({ ...editingPackage, items: copy });
  };

  // -------------------------------------------------------------
  // CONSULTANTS TAB STATE
  // -------------------------------------------------------------
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(null);
  const [isNewConsultant, setIsNewConsultant] = useState(false);

  // -------------------------------------------------------------
  // BACKUP TAB STATE
  // -------------------------------------------------------------
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);

  // -------------------------------------------------------------
  // PER-TAB RESET TO DEFAULTS
  // -------------------------------------------------------------
  const handleResetCurrentTab = () => {
    if (!confirmResetTab) return;

    switch (confirmResetTab) {
      case 'branding':
        updateSettings({
          companyName: SEED_SETTINGS.companyName,
          tagline: SEED_SETTINGS.tagline,
          logoUrl: SEED_SETTINGS.logoUrl,
          accentColor: SEED_SETTINGS.accentColor,
          footerText: SEED_SETTINGS.footerText,
          website: SEED_SETTINGS.website,
        });
        break;
      case 'contact':
        updateSettings({
          phone: SEED_SETTINGS.phone,
          phoneSecondary: SEED_SETTINGS.phoneSecondary,
          email: SEED_SETTINGS.email,
          officeAddress: SEED_SETTINGS.officeAddress,
          locationAddress: SEED_SETTINGS.locationAddress || SEED_SETTINGS.officeAddress,
          socialInstagram: SEED_SETTINGS.socialInstagram,
          socialFacebook: SEED_SETTINGS.socialFacebook,
        });
        break;
      case 'consultants':
        updateSettings({
          consultants: SEED_SETTINGS.consultants,
        });
        break;
      case 'content':
        updateSettings({
          greetingHeading: SEED_SETTINGS.greetingHeading,
          greetingIntro: SEED_SETTINGS.greetingIntro,
          greetingSuffix: SEED_SETTINGS.greetingSuffix,
          journeyOverviewTitle: SEED_SETTINGS.journeyOverviewTitle,
          experienceTitle: SEED_SETTINGS.experienceTitle,
          costingTitle: SEED_SETTINGS.costingTitle,
          totalPackageLabel: SEED_SETTINGS.totalPackageLabel,
          defaultPriceNote: SEED_SETTINGS.defaultPriceNote,
          inclusionsTitle: SEED_SETTINGS.inclusionsTitle,
          exclusionsTitle: SEED_SETTINGS.exclusionsTitle,
          notesTitle: SEED_SETTINGS.notesTitle,
          termsTitle: SEED_SETTINGS.termsTitle,
          cancellationTitle: SEED_SETTINGS.cancellationTitle,
          reachUsTitle: SEED_SETTINGS.reachUsTitle,
          reachUsSubtitle: SEED_SETTINGS.reachUsSubtitle,
          defaultInclusions: SEED_SETTINGS.defaultInclusions,
          defaultExclusions: SEED_SETTINGS.defaultExclusions,
          defaultNotes: SEED_SETTINGS.defaultNotes,
          defaultTerms: SEED_SETTINGS.defaultTerms,
          defaultCancellationPolicy: SEED_SETTINGS.defaultCancellationPolicy,
          defaultCancellationNotes: SEED_SETTINGS.defaultCancellationNotes,
          defaultDepartureJourney: SEED_SETTINGS.defaultDepartureJourney,
          defaultReturnJourney: SEED_SETTINGS.defaultReturnJourney,
        });
        break;
      case 'trust':
        updateSettings({
          ratingValue: SEED_SETTINGS.ratingValue,
          ratingCaption: SEED_SETTINGS.ratingCaption,
          aboutText: SEED_SETTINGS.aboutText,
          aboutPhotos: SEED_SETTINGS.aboutPhotos,
          stats: SEED_SETTINGS.stats,
        });
        break;
      case 'layout':
        updateSettings({
          sectionLayout: SEED_SETTINGS.sectionLayout,
        });
        break;
      case 'trip_types':
        updateSettings({
          tripTypes: SEED_SETTINGS.tripTypes,
        });
        break;
      case 'theme':
        updateSettings({
          pdfTheme: SEED_SETTINGS.pdfTheme,
          accentColor: SEED_SETTINGS.accentColor,
        });
        break;
      case 'backup':
        resetSettingsToDefault();
        break;
      default:
        break;
    }

    setConfirmResetTab(null);
    showNotification('Tab reset to defaults successfully!');
  };

  // Reorder layout sections
  const moveSectionOrder = (index: number, direction: 'up' | 'down') => {
    const layout = [...(settings.sectionLayout || SEED_SETTINGS.sectionLayout)];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= layout.length) return;
    const temp = layout[index];
    layout[index] = layout[targetIdx];
    layout[targetIdx] = temp;
    // update order numbers
    const updated = layout.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateSettings({ sectionLayout: updated });
  };

  const toggleSectionEnabled = (secId: SectionId) => {
    const layout = [...(settings.sectionLayout || SEED_SETTINGS.sectionLayout)];
    const updated = layout.map((item) =>
      item.id === secId ? { ...item, enabled: !item.enabled } : item
    );
    updateSettings({ sectionLayout: updated });
  };

  // Color swatches for accent color
  const COLOR_SWATCHES = [
    '#0070C0', // Royal Tours Blue
    '#0284C7', // Sky Blue
    '#0D9488', // Emerald Teal
    '#4F46E5', // Indigo
    '#7C3AED', // Royal Violet
    '#D97706', // Amber Gold
    '#DC2626', // Crimson Red
    '#0F172A', // Slate Black
  ];

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-900 bg-white min-h-screen">
      {/* Top Header */}
      <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: settings.accentColor || '#0070C0' }}
              />
              <h2 className="text-xl font-bold uppercase tracking-wide text-slate-950 font-sans">
                Settings & Customization
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configure every word, layout, branding color, policy, and package on your continuous brochure.
            </p>
          </div>

          {/* Password Reset Action Button (Requires 5 Taps) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePasswordResetTap}
              title="Reset Portal Password"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Password</span>
            </button>
          </div>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 text-xs shadow-xs">
          {[
            { id: 'branding', label: 'Company & Branding', icon: Palette },
            { id: 'contact', label: 'Contact Info', icon: Phone },
            { id: 'consultants', label: 'Consultants', icon: UserCheck },
            { id: 'packages', label: 'Place Packages', icon: FolderOpen },
            { id: 'content', label: 'Quotation Content', icon: FileCheck },
            { id: 'trust', label: 'Trust & About', icon: Star },
            { id: 'layout', label: 'Layout & Order', icon: Layout },
            { id: 'trip_types', label: 'Trip Types', icon: Layers },
            { id: 'theme', label: 'Theme (PDF)', icon: Palette },
            { id: 'backup', label: 'Backup / JSON', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
                style={
                  isActive
                    ? { backgroundColor: settings.accentColor || '#0070C0' }
                    : undefined
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Success Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-18 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================
          TAB 1: COMPANY & BRANDING
         ======================================================== */}
      {activeTab === 'branding' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          {/* PWA In-App Install Banner */}
          <PWAInstallButton variant="banner" />

          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Company & Brand Identity</h3>
            <p className="text-xs text-slate-500">Logo, brand name, tagline, and signature accent color.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Company Logo
              </label>
              <div className="flex items-center gap-4 p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl">
                {settings.logoUrl ? (
                  <div className="bg-black p-2 rounded-xl border border-slate-700 flex items-center justify-center">
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="h-10 w-auto max-w-[200px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                    RT
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              updateSettings({ logoUrl: reader.result });
                              showNotification('Logo updated!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {settings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => updateSettings({ logoUrl: '' })}
                      className="block text-[11px] text-red-600 hover:underline"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Signature Accent Colour
              </label>
              <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accentColor || '#0070C0'}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.accentColor || '#0070C0'}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="w-28 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 uppercase"
                  />
                  <span className="text-xs text-slate-500 font-mono">Used for buttons, highlights, badges</span>
                </div>

                {/* Swatches */}
                <div className="flex items-center gap-2 pt-1">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => updateSettings({ accentColor: swatch })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        settings.accentColor === swatch
                          ? 'scale-115 border-slate-900'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch }}
                      title={swatch}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => updateSettings({ companyName: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ tagline: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Website URL
              </label>
              <input
                type="text"
                value={settings.website}
                onChange={(e) => updateSettings({ website: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800 font-mono"
              />
            </div>

            {/* Footer Copyright Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => updateSettings({ footerText: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: CONTACT & WAYS TO REACH
         ======================================================== */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Contact & Ways to Reach Us</h3>
            <p className="text-xs text-slate-500">Official agency telephone numbers, email, physical office, and social links.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Primary Phone Number *
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => updateSettings({ phone: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Secondary Phone Number (Optional)
              </label>
              <input
                type="text"
                value={settings.phoneSecondary || ''}
                onChange={(e) => updateSettings({ phoneSecondary: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Email Address *
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSettings({ email: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                value={settings.socialInstagram || ''}
                onChange={(e) => updateSettings({ socialInstagram: e.target.value })}
                placeholder="@royaltours_official"
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location Address (Printed under "Ways to Reach Us" in PDF) *
              </label>
              <textarea
                rows={2}
                value={settings.locationAddress || settings.officeAddress}
                onChange={(e) =>
                  updateSettings({
                    locationAddress: e.target.value,
                    officeAddress: e.target.value,
                  })
                }
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: CONSULTANTS
         ======================================================== */}
      {activeTab === 'consultants' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tour Consultants & Architects</h3>
              <p className="text-xs text-slate-500">Contact details shown in Journey Overview are picked from this list.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingConsultant({
                    id: `cons-${Date.now()}`,
                    name: '',
                    phone: '',
                    email: settings.email,
                  });
                  setIsNewConsultant(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Add Consultant</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.consultants.map((c) => (
              <div
                key={c.id}
                className="p-5 bg-[#f8fafc] border border-slate-200 rounded-2xl flex flex-col justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{c.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      Advisor
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-600">{c.phone}</p>
                  <p className="text-xs text-slate-500 truncate">{c.email}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingConsultant(JSON.parse(JSON.stringify(c)));
                      setIsNewConsultant(false);
                    }}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (settings.consultants.length <= 1) {
                        alert('You must have at least one consultant.');
                        return;
                      }
                      updateSettings({
                        consultants: settings.consultants.filter((item) => item.id !== c.id),
                      });
                      showNotification('Consultant deleted.');
                    }}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: PLACE PACKAGES
         ======================================================== */}
      {activeTab === 'packages' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search packages by name or spot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#f8fafc] rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setStateFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-semibold ${
                    stateFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  All ({placePackages.length})
                </button>
                {availableStates.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStateFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${
                      stateFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleOpenCreatePackage}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Package</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-[#f8fafc] flex flex-col justify-between"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {pkg.state}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {pkg.items.length} items
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-slate-950">{pkg.name}</h4>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {pkg.items.slice(0, 4).map((it, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span
                          className={`line-clamp-1 ${
                            it.highlight ? 'font-bold text-[#0070C0]' : 'text-slate-600'
                          }`}
                        >
                          {it.text}
                        </span>
                      </div>
                    ))}
                    {pkg.items.length > 4 && (
                      <p className="text-[10px] text-slate-400 italic">
                        +{pkg.items.length - 4} more activities
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPackage(pkg)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-blue-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Package</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        duplicatePlacePackage(pkg.id);
                        showNotification('Package duplicated!');
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageToDelete(pkg)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-slate-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: QUOTATION CONTENT (LABELS & POLICIES)
         ======================================================== */}
      {activeTab === 'content' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-8">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Quotation Titles, Texts & Default Policies</h3>
            <p className="text-xs text-slate-500">Every heading, disclaimer, inclusion and cancellation clause is customizable here.</p>
          </div>

          {/* Section Titles */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Section Headings & Greeting Texts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Greeting Main Heading
                </label>
                <input
                  type="text"
                  value={settings.greetingHeading}
                  onChange={(e) => updateSettings({ greetingHeading: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Greeting Intro Text
                </label>
                <input
                  type="text"
                  value={settings.greetingIntro}
                  onChange={(e) => updateSettings({ greetingIntro: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Greeting Suffix Paragraph
                </label>
                <textarea
                  rows={2}
                  value={settings.greetingSuffix}
                  onChange={(e) => updateSettings({ greetingSuffix: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Journey Overview Title
                </label>
                <input
                  type="text"
                  value={settings.journeyOverviewTitle}
                  onChange={(e) => updateSettings({ journeyOverviewTitle: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  The Experience Title
                </label>
                <input
                  type="text"
                  value={settings.experienceTitle}
                  onChange={(e) => updateSettings({ experienceTitle: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Costing Title
                </label>
                <input
                  type="text"
                  value={settings.costingTitle}
                  onChange={(e) => updateSettings({ costingTitle: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Total Package Price Label
                </label>
                <input
                  type="text"
                  value={settings.totalPackageLabel}
                  onChange={(e) => updateSettings({ totalPackageLabel: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Default Price Note */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Default Costing Note
            </label>
            <textarea
              rows={2}
              value={settings.defaultPriceNote}
              onChange={(e) => updateSettings({ defaultPriceNote: e.target.value })}
              className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-xs"
            />
          </div>

          {/* Inclusions & Exclusions Defaults */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Inclusions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Default Inclusions ({settings.defaultInclusions.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const text = prompt('Enter new inclusion item:');
                    if (text?.trim()) {
                      updateSettings({
                        defaultInclusions: [...settings.defaultInclusions, text.trim()],
                      });
                    }
                  }}
                  className="text-xs text-blue-700 font-bold hover:underline"
                >
                  + Add Inclusion
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {settings.defaultInclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs"
                  >
                    <span className="text-slate-800">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          defaultInclusions: settings.defaultInclusions.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Default Exclusions ({settings.defaultExclusions.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const text = prompt('Enter new exclusion item:');
                    if (text?.trim()) {
                      updateSettings({
                        defaultExclusions: [...settings.defaultExclusions, text.trim()],
                      });
                    }
                  }}
                  className="text-xs text-blue-700 font-bold hover:underline"
                >
                  + Add Exclusion
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {settings.defaultExclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs"
                  >
                    <span className="text-slate-800">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          defaultExclusions: settings.defaultExclusions.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cancellation Policy Table */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Cancellation Policy Table Rows
              </label>
              <button
                type="button"
                onClick={() => {
                  const period = prompt('Cancellation Period (e.g. 15 to 30 days before trip):');
                  if (!period) return;
                  const charges = prompt('Charges (e.g. 25% of total package cost):');
                  if (!charges) return;
                  updateSettings({
                    defaultCancellationPolicy: [
                      ...settings.defaultCancellationPolicy,
                      { period: period.trim(), charges: charges.trim() },
                    ],
                  });
                }}
                className="text-xs text-blue-700 font-bold hover:underline"
              >
                + Add Policy Row
              </button>
            </div>

            <div className="space-y-2">
              {settings.defaultCancellationPolicy.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs items-center"
                >
                  <input
                    type="text"
                    value={row.period}
                    onChange={(e) => {
                      const copy = [...settings.defaultCancellationPolicy];
                      copy[idx].period = e.target.value;
                      updateSettings({ defaultCancellationPolicy: copy });
                    }}
                    className="sm:col-span-5 bg-white border border-slate-300 rounded-lg p-1.5 font-semibold"
                  />
                  <input
                    type="text"
                    value={row.charges}
                    onChange={(e) => {
                      const copy = [...settings.defaultCancellationPolicy];
                      copy[idx].charges = e.target.value;
                      updateSettings({ defaultCancellationPolicy: copy });
                    }}
                    className="sm:col-span-6 bg-white border border-slate-300 rounded-lg p-1.5"
                  />
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          defaultCancellationPolicy: settings.defaultCancellationPolicy.filter(
                            (_, i) => i !== idx
                          ),
                        })
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: TRUST & ABOUT
         ======================================================== */}
      {activeTab === 'trust' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Trust Metrics, About Us & Stats</h3>
            <p className="text-xs text-slate-500">Google rating badge, about story, photo gallery strip, and company achievements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Rating Number (e.g. 4.8)
              </label>
              <input
                type="text"
                value={settings.ratingValue}
                onChange={(e) => updateSettings({ ratingValue: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900"
              />
            </div>

            {/* Rating Caption */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Rating Caption
              </label>
              <input
                type="text"
                value={settings.ratingCaption}
                onChange={(e) => updateSettings({ ratingCaption: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900"
              />
            </div>

            {/* About Text */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                About Us Story Paragraph
              </label>
              <textarea
                rows={3}
                value={settings.aboutText}
                onChange={(e) => updateSettings({ aboutText: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-sm text-slate-900"
              />
            </div>

            {/* About Photos (4 items) */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  About Us Photo Strip (Up to 4 images)
                </label>
                <label className="cursor-pointer text-xs font-bold text-blue-700 hover:underline">
                  + Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            updateSettings({
                              aboutPhotos: [...(settings.aboutPhotos || []), reader.result],
                            });
                            showNotification('Photo added!');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(settings.aboutPhotos || []).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100"
                  >
                    <img
                      src={imgUrl}
                      alt="About photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          aboutPhotos: settings.aboutPhotos.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="md:col-span-2 space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Stats & Milestones
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const value = prompt('Stat Value (e.g. 50000+):');
                    if (!value) return;
                    const caption = prompt('Caption (e.g. Happy Travelers):');
                    if (!caption) return;
                    updateSettings({
                      stats: [
                        ...settings.stats,
                        { id: `stat-${Date.now()}`, value, label: caption, caption },
                      ],
                    });
                  }}
                  className="text-xs text-blue-700 font-bold hover:underline"
                >
                  + Add Stat
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.stats.map((st, idx) => (
                  <div
                    key={st.id}
                    className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const copy = [...settings.stats];
                          copy[idx].value = e.target.value;
                          updateSettings({ stats: copy });
                        }}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-sm font-black w-28"
                      />
                      <input
                        type="text"
                        value={st.caption || st.label}
                        onChange={(e) => {
                          const copy = [...settings.stats];
                          copy[idx].caption = e.target.value;
                          copy[idx].label = e.target.value;
                          updateSettings({ stats: copy });
                        }}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-600 w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings({
                          stats: settings.stats.filter((item) => item.id !== st.id),
                        })
                      }
                      className="text-red-500 hover:text-red-700 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 7: LAYOUT & REORDERING
         ======================================================== */}
      {activeTab === 'layout' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">PDF Section Layout & Ordering</h3>
            <p className="text-xs text-slate-500">Toggle sections on or off, and reorder where each section appears on the continuous brochure.</p>
          </div>

          <div className="space-y-2">
            {(settings.sectionLayout || SEED_SETTINGS.sectionLayout).map((sec, idx, arr) => (
              <div
                key={sec.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  sec.enabled
                    ? 'bg-[#f8fafc] border-slate-200 text-slate-900'
                    : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-600">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">{sec.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">ID: {sec.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Enable / Disable toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSectionEnabled(sec.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      sec.enabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sec.enabled ? 'Enabled' : 'Hidden'}
                  </button>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSectionOrder(idx, 'up')}
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-950 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === arr.length - 1}
                      onClick={() => moveSectionOrder(idx, 'down')}
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-950 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 8: TRIP TYPES
         ======================================================== */}
      {activeTab === 'trip_types' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Custom Trip Types</h3>
              <p className="text-xs text-slate-500">Trip category options displayed in Step 1 of the Itinerary Wizard.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const name = prompt('Enter new trip type name:');
                  if (name?.trim()) {
                    updateSettings({
                      tripTypes: [
                        ...(settings.tripTypes || SEED_SETTINGS.tripTypes),
                        { id: `tt-${Date.now()}`, name: name.trim() },
                      ],
                    });
                    showNotification('Trip type added!');
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trip Type</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(settings.tripTypes || SEED_SETTINGS.tripTypes).map((tt) => (
              <div
                key={tt.id}
                className="p-3 bg-[#f8fafc] border border-slate-200 rounded-xl flex items-center justify-between gap-2"
              >
                <span className="text-xs font-bold text-slate-800">{tt.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    const list = (settings.tripTypes || SEED_SETTINGS.tripTypes).filter(
                      (item) => item.id !== tt.id
                    );
                    updateSettings({ tripTypes: list });
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB: THEME (PDF BROCHURE COLORS & FONTS)
         ======================================================== */}
      {activeTab === 'theme' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Quotation & PDF Brochure Theme</h3>
            <p className="text-xs text-slate-500">
              Customize every color, surface, border, and font for your continuous long-page PDF quotation.
            </p>
          </div>

          {/* Theme Color Configuration Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {/* Accent Color */}
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-800">Accent Color (Badges & Highlights)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.pdfTheme?.accentColor || settings.accentColor || '#FACC15'}
                  onChange={(e) => {
                    const c = e.target.value;
                    updateSettings({
                      accentColor: c,
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        accentColor: c,
                      },
                    });
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.pdfTheme?.accentColor || settings.accentColor || '#FACC15'}
                  onChange={(e) => {
                    const c = e.target.value;
                    updateSettings({
                      accentColor: c,
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        accentColor: c,
                      },
                    });
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-800">PDF Page Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.pdfTheme?.backgroundColor || '#080E24'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        backgroundColor: e.target.value,
                      },
                    });
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.pdfTheme?.backgroundColor || '#080E24'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        backgroundColor: e.target.value,
                      },
                    });
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Card Background */}
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-800">Card & Section Surface Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.pdfTheme?.cardBackground || '#0C1433'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        cardBackground: e.target.value,
                      },
                    });
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.pdfTheme?.cardBackground || '#0C1433'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        cardBackground: e.target.value,
                      },
                    });
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-800">Border & Divider Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.pdfTheme?.borderColor || '#1E2958'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        borderColor: e.target.value,
                      },
                    });
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.pdfTheme?.borderColor || '#1E2958'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        borderColor: e.target.value,
                      },
                    });
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Primary Text Color */}
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-800">Headings & Primary Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.pdfTheme?.textColor || '#FFFFFF'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        textColor: e.target.value,
                        headingColor: e.target.value,
                      },
                    });
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.pdfTheme?.textColor || '#FFFFFF'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        textColor: e.target.value,
                        headingColor: e.target.value,
                      },
                    });
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Secondary Text Color */}
            <div className="space-y-1.5 p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl">
              <label className="text-xs font-bold text-slate-800">Secondary & Date Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.pdfTheme?.secondaryTextColor || '#94A3B8'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        secondaryTextColor: e.target.value,
                      },
                    });
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.pdfTheme?.secondaryTextColor || '#94A3B8'}
                  onChange={(e) => {
                    updateSettings({
                      pdfTheme: {
                        ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                        secondaryTextColor: e.target.value,
                      },
                    });
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Typography / Font Choice */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase text-slate-700">PDF Typography / Font Family</label>
            <select
              value={settings.pdfTheme?.fontFamily || "'Poppins', sans-serif"}
              onChange={(e) => {
                updateSettings({
                  pdfTheme: {
                    ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                    fontFamily: e.target.value,
                  },
                });
              }}
              className="w-full sm:w-80 bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
            >
              <option value="'Poppins', sans-serif">
                Poppins (Official Royal Tours Reference Font)
              </option>
              <option value="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif">
                Plus Jakarta Sans (Modern Geometric Luxury)
              </option>
              <option value="'Inter', system-ui, -apple-system, sans-serif">
                Inter (Clean Technical Neutral)
              </option>
              <option value="'Outfit', system-ui, -apple-system, sans-serif">
                Outfit (Friendly Modern Rounded)
              </option>
              <option value="'Cinzel', serif">
                Cinzel (Royal Imperial Roman Serif)
              </option>
              <option value="'Cormorant Garamond', serif">
                Cormorant Garamond (Editorial Luxury Serif)
              </option>
            </select>
          </div>

          {/* ========================================================
              QUOTATION BACKGROUND PANEL
             ======================================================== */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
                  <span>Quotation Background</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Control the page background texture, custom image upload, and overlay darkness for your continuous quotation PDF.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateSettings({
                    pdfTheme: {
                      ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                      useBackgroundImage: true,
                      backgroundImageUrl: DEFAULT_QUOTATION_BACKGROUND,
                      backgroundOverlayOpacity: 0.15,
                    },
                  });
                  showNotification('Reset to default background texture!');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Background Texture</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Toggles & Upload */}
              <div className="space-y-3.5 p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl">
                {/* Use background image toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Use Background Image</div>
                    <div className="text-[11px] text-slate-500">
                      Toggle background image texture vs solid color fallback.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateSettings({
                        pdfTheme: {
                          ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                          useBackgroundImage: !(settings.pdfTheme?.useBackgroundImage ?? true),
                        },
                      });
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      (settings.pdfTheme?.useBackgroundImage ?? true)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {(settings.pdfTheme?.useBackgroundImage ?? true) ? 'Enabled' : 'Off (Solid Color)'}
                  </button>
                </div>

                {/* Upload Image */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <label className="text-xs font-bold text-slate-800 block">
                    Upload Replacement Background Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        const base64 = uploadEvent.target?.result as string;
                        updateSettings({
                          pdfTheme: {
                            ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                            useBackgroundImage: true,
                            backgroundImageUrl: base64,
                          },
                        });
                        showNotification('Custom background image uploaded!');
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Stored as base64 data URL so it never fails to load during PDF export.
                  </span>
                </div>

                {/* Background Overlay Opacity Slider (0 to 60%) */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Background Overlay Darkness</span>
                    <span className="font-mono font-bold text-blue-700">
                      {Math.round((settings.pdfTheme?.backgroundOverlayOpacity ?? 0.15) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.60"
                    step="0.05"
                    value={settings.pdfTheme?.backgroundOverlayOpacity ?? 0.15}
                    onChange={(e) => {
                      updateSettings({
                        pdfTheme: {
                          ...(settings.pdfTheme || SEED_SETTINGS.pdfTheme),
                          backgroundOverlayOpacity: parseFloat(e.target.value),
                        },
                      });
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0% (Light)</span>
                    <span>30%</span>
                    <span>60% (Darker)</span>
                  </div>
                </div>
              </div>

              {/* Right: Background Preview Box */}
              <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl flex flex-col justify-between space-y-2">
                <span className="text-xs font-bold text-slate-800">Quotation Background Preview</span>
                <div
                  className="w-full h-40 rounded-xl border border-slate-300 relative overflow-hidden flex items-center justify-center shadow-inner"
                  style={{
                    backgroundColor: settings.pdfTheme?.backgroundColor || '#080E24',
                    backgroundImage:
                      (settings.pdfTheme?.useBackgroundImage ?? true) &&
                      (settings.pdfTheme?.backgroundImageUrl || DEFAULT_QUOTATION_BACKGROUND)
                        ? `url(${settings.pdfTheme?.backgroundImageUrl || DEFAULT_QUOTATION_BACKGROUND})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay */}
                  {(settings.pdfTheme?.useBackgroundImage ?? true) && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: `rgba(0, 0, 0, ${settings.pdfTheme?.backgroundOverlayOpacity ?? 0.15})`,
                      }}
                    />
                  )}
                  <div className="relative z-10 px-3 py-1.5 rounded-lg bg-black/65 text-white text-[11px] font-bold backdrop-blur-xs border border-white/20 text-center">
                    {(settings.pdfTheme?.useBackgroundImage ?? true)
                      ? 'PDF Quotation Background Photo'
                      : 'Solid Color Fallback'}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 text-center">
                  Tiles vertically on continuous 794px quotations with zero visible seams.
                </div>
              </div>
            </div>
          </div>

          {/* Live Mini Preview Box */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase text-slate-700">Live PDF Theme Preview</label>
            <div
              style={{
                backgroundColor: settings.pdfTheme?.backgroundColor || '#080E24',
                color: settings.pdfTheme?.textColor || '#FFFFFF',
                fontFamily: settings.pdfTheme?.fontFamily || "'Plus Jakarta Sans', system-ui, sans-serif",
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${settings.pdfTheme?.borderColor || '#1E2958'}`,
              }}
              className="shadow-md"
            >
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${settings.pdfTheme?.borderColor || '#1E2958'}` }}>
                <span className="font-extrabold uppercase tracking-widest text-sm" style={{ color: settings.pdfTheme?.textColor || '#FFFFFF' }}>
                  {settings.companyName || 'ROYAL TOURS'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: settings.pdfTheme?.accentColor || '#FACC15' }}>
                  {settings.tagline || 'TRAVEL IN LUXURY'}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: settings.pdfTheme?.cardBackground || '#0C1433',
                  border: `1px solid ${settings.pdfTheme?.borderColor || '#1E2958'}`,
                  borderRadius: '12px',
                  padding: '16px',
                }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: settings.pdfTheme?.accentColor || '#FACC15',
                      color: '#080E24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '11px',
                    }}
                  >
                    01
                  </div>
                  <span className="font-bold text-xs uppercase" style={{ color: settings.pdfTheme?.textColor || '#FFFFFF' }}>
                    Dandeli Water Activities
                  </span>
                </div>
                <div className="text-[11px] pl-8" style={{ color: settings.pdfTheme?.secondaryTextColor || '#94A3B8' }}>
                  • Refreshment & Breakfast · Proceed to <span style={{ color: settings.pdfTheme?.accentColor || '#FACC15', fontWeight: 700 }}>Kayaking, Zorbing, River Rafting</span>
                </div>
                <div
                  style={{
                    borderLeft: `3px solid ${settings.pdfTheme?.accentColor || '#FACC15'}`,
                    padding: '6px 10px',
                    backgroundColor: `${settings.pdfTheme?.accentColor || '#FACC15'}12`,
                    fontSize: '10px',
                    color: settings.pdfTheme?.secondaryTextColor || '#94A3B8',
                    borderRadius: '4px',
                  }}
                >
                  Total Package: <strong style={{ color: settings.pdfTheme?.accentColor || '#FACC15', fontSize: '13px' }}>₹6,200</strong> / Per Pax
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 9: BACKUP & JSON RESTORE
         ======================================================== */}
      {activeTab === 'backup' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Backup, Restore & Security</h3>
              <p className="text-xs text-slate-500">Export all packages, quotations, and settings to a JSON file or restore previous data.</p>
            </div>
          </div>

          {/* MongoDB Atlas & Multi-Device Cloud Sync Card */}
          <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-950">MongoDB Atlas & Multi-Device Backend Sync</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">Atlas Ready</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Persistent database backend supporting MongoDB Atlas cluster syncing across mobile phones, tablets, and computers in real-time.
              </p>
            </div>
            {onOpenGoogleDrive && (
              <button
                type="button"
                onClick={onOpenGoogleDrive}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>MongoDB & Cloud Sync</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Download Full Workspace Backup</div>
                <div className="text-[11px] text-slate-500">Saves all packages, quotations, and studio settings.</div>
              </div>
              <button
                type="button"
                onClick={exportAllDataAsJSON}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Portal Password Section */}
            <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">Portal Security Passcode</div>
                <div className="text-[11px] text-slate-500">Reset or change operator login access.</div>
              </div>
              <button
                type="button"
                onClick={handlePasswordResetTap}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-800 cursor-pointer active:scale-95 transition-all"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Reset Portal Password</span>
              </button>
            </div>
          </div>

          {/* Import JSON Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Restore Workspace from JSON Backup
            </h4>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON backup content here..."
              className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono"
            />

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  importStatus.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {importStatus.success ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>{importStatus.msg}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!importJsonText.trim()) return;
                  const ok = importAllDataFromJSON(importJsonText);
                  if (ok) {
                    setImportStatus({
                      success: true,
                      msg: 'Workspace restored successfully from JSON!',
                    });
                    setImportJsonText('');
                  } else {
                    setImportStatus({
                      success: false,
                      msg: 'Invalid JSON format. Please verify and retry.',
                    });
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import & Restore</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Resetting a Tab */}
      {confirmResetTab && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Reset Tab to Defaults?</h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to revert {confirmResetTab} settings to original defaults?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmResetTab(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetCurrentTab}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Yes, Reset Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discreet Footer with Hidden Buttons for Reset Option & Portal Password */}
      <footer className="pt-8 pb-4 text-center border-t border-slate-200/60 flex items-center justify-center gap-2.5">
        <span className="text-[11px] text-slate-400 font-mono">
          ROYAL TOURS ATELIER · 2026
        </span>
        {/* Hidden Button for Reset Option */}
        <button
          type="button"
          onClick={() => setConfirmResetTab(activeTab)}
          title="Reset Active Tab to Defaults"
          aria-label="Reset Active Tab to Defaults"
          className="w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-800 hover:bg-slate-100 transition-all opacity-20 hover:opacity-100 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
        {/* Hidden Button for Security Atelier */}
        <button
          type="button"
          onClick={handlePasswordResetTap}
          title="Security Atelier"
          aria-label="Reset Portal Password"
          className="w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-800 hover:bg-slate-100 transition-all opacity-20 hover:opacity-100 cursor-pointer"
        >
          <KeyRound className="w-3 h-3" />
        </button>
      </footer>

      {/* Secret Password Reset Modal */}
      <SecretPasswordModal
        isOpen={isInternalPasswordModalOpen}
        onClose={() => setIsInternalPasswordModalOpen(false)}
        currentLoginPassword={currentLoginPassword}
        onUpdatePassword={(newPass) => {
          if (onUpdateLoginPassword) {
            onUpdateLoginPassword(newPass);
          } else {
            try {
              localStorage.setItem('royaltours_login_password', newPass);
            } catch {}
          }
        }}
      />

      {/* Package Editor Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {isNewPackage ? 'Create New Place Package' : `Edit Package: ${editingPackage.name}`}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Kerala & Karnataka sightseeing itineraries
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Package / Place Name *
                  </label>
                  <input
                    type="text"
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    State *
                  </label>
                  <select
                    value={editingPackage.state}
                    onChange={(e) => setEditingPackage({ ...editingPackage, state: e.target.value })}
                    className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Custom">Custom Region</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-700">
                    Sightseeing Activities & Timeline ({editingPackage.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackage({
                        ...editingPackage,
                        items: [
                          ...editingPackage.items,
                          {
                            id: `it-${Date.now()}`,
                            text: 'Proceed to Sightseeing {Spot}',
                            highlight: true,
                          },
                        ],
                      });
                    }}
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    + Add Timeline Item
                  </button>
                </div>

                <div className="space-y-2">
                  {editingPackage.items.map((it, idx) => (
                    <div
                      key={it.id || idx}
                      className="flex items-center gap-2 p-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs"
                    >
                      <input
                        type="text"
                        value={it.text}
                        onChange={(e) => {
                          const copy = [...editingPackage.items];
                          copy[idx].text = e.target.value;
                          setEditingPackage({ ...editingPackage, items: copy });
                        }}
                        className={`flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs ${
                          it.highlight ? 'font-bold text-[#0070C0]' : 'text-slate-800'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...editingPackage.items];
                          copy[idx].highlight = !copy[idx].highlight;
                          setEditingPackage({ ...editingPackage, items: copy });
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          it.highlight
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                        title="Highlight spots in blue"
                      >
                        {it.highlight ? 'Highlighted' : 'Regular'}
                      </button>

                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => movePackageItem(idx, 'up')}
                          className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === editingPackage.items.length - 1}
                          onClick={() => movePackageItem(idx, 'down')}
                          className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = editingPackage.items.filter((_, i) => i !== idx);
                            setEditingPackage({ ...editingPackage, items: copy });
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f8fafc] border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePackageModal}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultant Modal */}
      {editingConsultant && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              {isNewConsultant ? 'Add New Consultant' : 'Edit Consultant'}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editingConsultant.name}
                  onChange={(e) =>
                    setEditingConsultant({ ...editingConsultant, name: e.target.value })
                  }
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone *</label>
                <input
                  type="text"
                  value={editingConsultant.phone}
                  onChange={(e) =>
                    setEditingConsultant({ ...editingConsultant, phone: e.target.value })
                  }
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editingConsultant.email}
                  onChange={(e) =>
                    setEditingConsultant({ ...editingConsultant, email: e.target.value })
                  }
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingConsultant(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingConsultant.name.trim()) return;
                  if (isNewConsultant) {
                    updateSettings({
                      consultants: [...settings.consultants, editingConsultant],
                    });
                  } else {
                    updateSettings({
                      consultants: settings.consultants.map((c) =>
                        c.id === editingConsultant.id ? editingConsultant : c
                      ),
                    });
                  }
                  setEditingConsultant(null);
                  showNotification('Consultant saved!');
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Package Confirmation */}
      {packageToDelete && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Delete Package?</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <span className="font-bold">{packageToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePlacePackage(packageToDelete.id);
                  setPackageToDelete(null);
                  showNotification('Package deleted.');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
