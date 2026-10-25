import React, { useState, useEffect } from 'react';
import { TopNav, NavTab } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { ItineraryTableView } from './components/ItineraryTableView';
import { CreateItineraryModal } from './components/CreateItineraryModal';
import { ItineraryEditor } from './components/ItineraryEditor';
import { ClientQuotationView } from './components/ClientQuotationView';
import { KeywordsManagementModal } from './components/KeywordsManagementModal';
import { QuotationPDFModal } from './components/QuotationPDFModal';
import { PrintableQuotationDoc } from './components/PrintableQuotationDoc';
import { LoginPage } from './components/LoginPage';
import { SecretPasswordModal } from './components/SecretPasswordModal';
import { CreateItineraryWizard } from './components/wizard/CreateItineraryWizard';
import { SettingsView } from './components/settings/SettingsView';
import { QuotationListView } from './components/quotations/QuotationListView';
import { Quotation } from './types/placePackage';
import { useApp } from './context/AppContext';
import { User } from 'firebase/auth';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  initGoogleAuth,
  syncDatabaseToGoogleDrive,
  fetchDatabaseFromGoogleDrive,
  getCachedAccessToken,
  signOutGoogleDrive,
  AUTHORIZED_EMAIL,
  type StudioDatabasePayload,
} from './services/googleDriveStorage';
import {
  X,
  RotateCcw,
  AlertCircle,
  Smartphone,
  Monitor,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  INITIAL_CONSULTANTS,
  INITIAL_ITINERARIES,
  INITIAL_KEYWORD_PRESETS,
} from './data/initialData';
import {
  Consultant,
  DayKeywordPreset,
  GroupType,
  Itinerary,
  TripRegion,
} from './types/itinerary';

export default function App() {
  const { quotations, settings, placePackages, importAllDataFromJSON } = useApp();

  // Mobile app resolution viewport toggle ('mobile' | 'expanded')
  const [viewportMode, setViewportMode] = useState<'mobile' | 'expanded'>('expanded');

  // Google Cloud Console Multi-Device Sync State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);
  const [isDriveSyncing, setIsDriveSyncing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('royaltours_drive_autosync') !== 'false';
    } catch {
      return true;
    }
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('royaltours_last_drive_sync') || null;
    } catch {
      return null;
    }
  });

  // Local storage hydrated states with Royal Tours clean slate
  const [itineraries, setItineraries] = useState<Itinerary[]>(() => {
    try {
      const stored = localStorage.getItem('royaltours_v5_itineraries');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load itineraries from localStorage:', e);
    }
    return INITIAL_ITINERARIES;
  });

  const [consultants, setConsultants] = useState<Consultant[]>(() => {
    try {
      const stored = localStorage.getItem('royaltours_v5_consultants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load consultants:', e);
    }
    return INITIAL_CONSULTANTS;
  });

  // Purge obsolete demo keys on mount
  useEffect(() => {
    [
      'royaltours_itineraries',
      'royaltours_itineraries_v1',
      'royaltours_itineraries_v2',
      'royaltours_itineraries_v3',
      'royaltours_itineraries_v4',
      'royaltours_consultants',
      'royaltours_consultants_v1',
      'royaltours_consultants_v2',
      'royaltours_consultants_v3',
      'royaltours_consultants_v4',
    ].forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
  }, []);

  const [keywordPresets, setKeywordPresets] = useState<DayKeywordPreset[]>(() => {
    try {
      const stored = localStorage.getItem('royaltours_keywords_v2');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load keywords from localStorage:', e);
    }
    return INITIAL_KEYWORD_PRESETS;
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('royaltours_auth_session') === 'true';
    } catch {
      return false;
    }
  });

  // Ensure auto-logout when the browser tab/app window is closed
  useEffect(() => {
    const handleAppClosed = () => {
      try {
        sessionStorage.removeItem('royaltours_auth_session');
        localStorage.removeItem('royaltours_auth_session');
      } catch {}
    };

    window.addEventListener('beforeunload', handleAppClosed);
    window.addEventListener('pagehide', handleAppClosed);
    return () => {
      window.removeEventListener('beforeunload', handleAppClosed);
      window.removeEventListener('pagehide', handleAppClosed);
    };
  }, []);

  // Helper to import full studio dataset into local state
  const handleImportDatabasePayload = (data: Partial<StudioDatabasePayload>) => {
    if (Array.isArray(data.itineraries)) setItineraries(data.itineraries);
    if (Array.isArray(data.consultants)) setConsultants(data.consultants);
    if (Array.isArray(data.keywords)) setKeywordPresets(data.keywords);
    importAllDataFromJSON(JSON.stringify(data));
  };

  // Google OAuth Listener on App Load
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        if (!isMounted) return;
        setGoogleUser(user);
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem('royaltours_auth_session', 'true');
        } catch {}

        // Auto-fetch latest remote database from Google Cloud / Google Drive
        fetchDatabaseFromGoogleDrive(token)
          .then((remoteData) => {
            if (remoteData && isMounted) {
              handleImportDatabasePayload(remoteData);
              const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setLastSyncTime(timeStr);
              try {
                localStorage.setItem('royaltours_last_drive_sync', timeStr);
              } catch {}
            }
          })
          .catch((err) => console.warn('[GoogleCloud] Initial fetch note:', err));
      },
      () => {
        if (!isMounted) return;
        setGoogleUser(null);
        setIsAuthenticated(false);
      },
      (unauthorizedEmail) => {
        alert(
          `Access Restricted: Only ${AUTHORIZED_EMAIL} is authorized to access Royal Tours. You signed in as "${unauthorizedEmail}".`
        );
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Auto-sync local modifications to Google Cloud console (debounced 2s)
  useEffect(() => {
    if (!autoSyncEnabled || !googleUser) return;
    const token = getCachedAccessToken();
    if (!token) return;

    const timer = setTimeout(async () => {
      try {
        setIsDriveSyncing(true);
        const payload = {
          quotations,
          placePackages,
          settings,
          itineraries,
          consultants,
          keywords: keywordPresets,
        };
        const res = await syncDatabaseToGoogleDrive(token, payload);
        if (res.success) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          try {
            localStorage.setItem('royaltours_last_drive_sync', timeStr);
          } catch {}
        }
      } catch (e) {
        console.warn('[GoogleCloudSync] Auto-sync notice:', e);
      } finally {
        setIsDriveSyncing(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [quotations, placePackages, settings, itineraries, consultants, keywordPresets, autoSyncEnabled, googleUser]);

  const [loginPassword, setLoginPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('royaltours_login_password') || 'royal123';
    } catch {
      return 'royal123';
    }
  });

  // Hidden Secret Passcode Modal State
  const [isSecretPasswordModalOpen, setIsSecretPasswordModalOpen] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<NavTab>('quotations');

  // Wizard state (5-step Create Itinerary)
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardQuotation, setWizardQuotation] = useState<Quotation | null>(null);

  // Legacy editor modals
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);
  const [pdfModalItinerary, setPdfModalItinerary] = useState<Itinerary | null>(null);
  const [activePrintItinerary, setActivePrintItinerary] = useState<Itinerary | null>(() => itineraries[0] || null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleOpenPDFModal = (it: Itinerary) => {
    setActivePrintItinerary(it);
    setPdfModalItinerary(it);
  };

  const handleGoogleLoginSuccess = (user: User, token: string) => {
    setGoogleUser(user);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('royaltours_auth_session', 'true');
    } catch (e) {
      console.warn('Failed to save session:', e);
    }

    // Pull database from Google Cloud
    fetchDatabaseFromGoogleDrive(token)
      .then((remoteData) => {
        if (remoteData) {
          handleImportDatabasePayload(remoteData);
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
        }
      })
      .catch((err) => console.warn('Fetch note:', err));
  };

  const handleEmergencyPasswordSuccess = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('royaltours_auth_session', 'true');
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  };

  const handleLogout = async () => {
    await signOutGoogleDrive();
    setGoogleUser(null);
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('royaltours_auth_session');
      localStorage.removeItem('royaltours_auth_session');
    } catch (e) {
      console.warn('Failed to clear session:', e);
    }
  };

  const handleUpdateLoginPassword = (newPass: string) => {
    setLoginPassword(newPass);
    try {
      localStorage.setItem('royaltours_login_password', newPass);
    } catch (e) {
      console.warn('Failed to save password:', e);
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royaltours_v5_itineraries', JSON.stringify(itineraries));
    } catch (e) {
      console.warn('Failed to save itineraries:', e);
    }
  }, [itineraries]);

  useEffect(() => {
    try {
      localStorage.setItem('royaltours_v5_consultants', JSON.stringify(consultants));
    } catch (e) {
      console.warn('Failed to save consultants:', e);
    }
  }, [consultants]);

  useEffect(() => {
    try {
      localStorage.setItem('royaltours_keywords_v2', JSON.stringify(keywordPresets));
    } catch (e) {
      console.warn('Failed to save keywords:', e);
    }
  }, [keywordPresets]);

  const handleConfirmResetCleanSlate = () => {
    setItineraries([]);
    setConsultants([]);
    setSelectedItinerary(null);
    setEditingItinerary(null);
    setActivePrintItinerary(null);
    setPdfModalItinerary(null);
    setActiveTab('dashboard');
    try {
      localStorage.removeItem('royaltours_v5_itineraries');
      localStorage.removeItem('royaltours_v5_consultants');
    } catch {}
    setIsResetModalOpen(false);
  };

  const handleImportDatabase = (data: {
    itineraries: Itinerary[];
    consultants: Consultant[];
    keywords?: DayKeywordPreset[];
  }) => {
    if (Array.isArray(data.itineraries)) setItineraries(data.itineraries);
    if (Array.isArray(data.consultants)) setConsultants(data.consultants);
    if (Array.isArray(data.keywords)) setKeywordPresets(data.keywords);
  };

  const handleAddConsultant = (newConsultant: Consultant) => {
    setConsultants((prev) => {
      const cleanName = newConsultant.name.trim().toLowerCase();
      const existingIdx = prev.findIndex((c) => c.name.trim().toLowerCase() === cleanName);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newConsultant;
        return copy;
      }
      return [...prev, newConsultant];
    });
  };

  const handleSaveItinerary = (saved: Itinerary) => {
    setItineraries((prev) => {
      const idx = prev.findIndex((it) => it.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    if (saved.consultant?.name) {
      handleAddConsultant(saved.consultant);
    }

    setEditingItinerary(null);
    setIsCreateModalOpen(false);
  };

  const handleDuplicateItinerary = (it: Itinerary) => {
    const copy: Itinerary = {
      ...it,
      id: `it-${Date.now()}`,
      code: `${it.code}-COPY`,
      destination: `${it.destination} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
    };
    setItineraries((prev) => [copy, ...prev]);
  };

  const handleDeleteItinerary = (id: string) => {
    if (window.confirm('Delete this proposal?')) {
      setItineraries((prev) => prev.filter((it) => it.id !== id));
      if (selectedItinerary?.id === id) setSelectedItinerary(null);
      if (editingItinerary?.id === id) setEditingItinerary(null);
    }
  };

  const handleLaunchWizard = (quotationToEdit: Quotation | null = null) => {
    setWizardQuotation(quotationToEdit);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    setWizardQuotation(null);
  };

  const handleUpdateStatus = (id: string, status: Itinerary['status']) => {
    setItineraries((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status, updatedAt: new Date().toISOString() } : it))
    );
    if (selectedItinerary && selectedItinerary.id === id) {
      setSelectedItinerary((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Protected Login Gate strictly enforced for royaltoursofficial@gmail.com
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleGoogleLoginSuccess}
        onEmergencyPasswordSuccess={handleEmergencyPasswordSuccess}
        currentLoginPassword={loginPassword}
      />
    );
  }

  // If a client presentation is open, render full-screen immersive view
  if (selectedItinerary) {
    return (
      <>
        <ClientQuotationView
          itinerary={selectedItinerary}
          onBack={() => setSelectedItinerary(null)}
          onEdit={() => {
            setEditingItinerary(selectedItinerary);
            setSelectedItinerary(null);
          }}
          onDownloadPDF={handleOpenPDFModal}
          onUpdateStatus={(status) => handleUpdateStatus(selectedItinerary.id, status)}
        />
        <QuotationPDFModal
          isOpen={!!pdfModalItinerary}
          itinerary={pdfModalItinerary}
          onClose={() => setPdfModalItinerary(null)}
          onOpenPresentation={(it) => {
            setPdfModalItinerary(null);
            setSelectedItinerary(it);
          }}
        />
        <div id="royal-tours-pdf-doc" className="hidden print:block bg-white text-slate-900">
          {(activePrintItinerary || selectedItinerary) && (
            <PrintableQuotationDoc itinerary={(activePrintItinerary || selectedItinerary)!} />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start text-[#0F172A] font-sans selection:bg-slate-200 selection:text-slate-900">
      
      {/* Viewport Frame Container */}
      <div
        className={`w-full min-h-screen bg-white shadow-sm relative flex flex-col transition-all duration-300 ${
          viewportMode === 'mobile'
            ? 'max-w-md md:max-w-lg md:border-x md:border-[#E2E8F0] md:my-0'
            : 'max-w-7xl md:border-x md:border-[#E2E8F0]'
        }`}
      >
        
        {/* Top Viewport Mode Switcher (Visible on desktop) */}
        <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-white text-[#64748B] text-[11px] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: settings.accentColor }}
            />
            <span className="font-semibold text-[#0F172A]">{settings.companyName} Studio</span>
            <span className="text-[#94A3B8]">·</span>
            <span className="text-xs text-[#64748B]">{settings.tagline}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#F8FAFC] p-0.5 rounded-lg border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              style={
                viewportMode === 'mobile'
                  ? { backgroundColor: settings.accentColor, color: '#FFFFFF' }
                  : undefined
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all text-xs font-medium ${
                viewportMode === 'mobile'
                  ? 'shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Resolution</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('expanded')}
              style={
                viewportMode === 'expanded'
                  ? { backgroundColor: settings.accentColor, color: '#FFFFFF' }
                  : undefined
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all text-xs font-medium ${
                viewportMode === 'expanded'
                  ? 'shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>
        </div>

        {/* Top App Bar with Google Cloud Sync & Sign Out */}
        <TopNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'keywords') {
              setIsKeywordsModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          onCreateItinerary={() => handleLaunchWizard(null)}
          onLogout={handleLogout}
          onOpenSecretPassword={() => setIsSecretPasswordModalOpen(true)}
          onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
          googleUser={googleUser}
          isDriveSyncing={isDriveSyncing}
          lastSyncTime={lastSyncTime}
        />

        {/* Main Content View with mobile bottom nav spacing */}
        <main className="flex-1 px-3 sm:px-6 py-5 pb-24 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Launch Banner for 5-Step Quotation Studio */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-[#0F172A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${settings.accentColor}15`,
                      color: settings.accentColor,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>5-Step Continuous Brochure Studio</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Create Presentation Quotation
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Single tall continuous brochure PDF export with day-by-day highlights, pricing, and company trust profile.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchWizard(null)}
                  style={{ backgroundColor: settings.accentColor }}
                  className="px-4 py-2.5 hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Itinerary</span>
                </button>
              </div>

              <DashboardView
                itineraries={itineraries}
                consultants={consultants}
                onSelectItinerary={(it) => setSelectedItinerary(it)}
                onDownloadPDF={handleOpenPDFModal}
                onCreateItinerary={() => handleLaunchWizard(null)}
              />
            </div>
          )}

          {activeTab === 'quotations' && (
            <QuotationListView
              onCreateNew={() => handleLaunchWizard(null)}
              onEditQuotation={(q) => handleLaunchWizard(q)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentLoginPassword={loginPassword}
              onUpdateLoginPassword={handleUpdateLoginPassword}
              onOpenSecretPassword={() => setIsSecretPasswordModalOpen(true)}
              onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
            />
          )}

          {activeTab === 'itineraries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    Active Itineraries Database
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Manage, edit, duplicate, or export individual travel schedules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchWizard(null)}
                  style={{ backgroundColor: settings.accentColor }}
                  className="px-3 py-2 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              <ItineraryTableView
                itineraries={itineraries}
                onSelectItinerary={(it) => setSelectedItinerary(it)}
                onEditItinerary={(it) => setEditingItinerary(it)}
                onDuplicateItinerary={handleDuplicateItinerary}
                onDeleteItinerary={handleDeleteItinerary}
                onDownloadPDF={handleOpenPDFModal}
                onCreateItinerary={() => setIsCreateModalOpen(true)}
                onOpenKeywords={() => setIsKeywordsModalOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* 5-Step Continuous Brochure Wizard Modal */}
      {isWizardOpen && (
        <CreateItineraryWizard
          initialQuotation={wizardQuotation}
          onClose={handleCloseWizard}
          onSuccess={() => handleCloseWizard()}
        />
      )}

      {/* Hidden Secret Password Modal */}
      <SecretPasswordModal
        isOpen={isSecretPasswordModalOpen}
        onClose={() => setIsSecretPasswordModalOpen(false)}
        currentLoginPassword={loginPassword}
        onUpdatePassword={handleUpdateLoginPassword}
      />

      {/* Keywords Management Modal */}
      <KeywordsManagementModal
        isOpen={isKeywordsModalOpen}
        onClose={() => setIsKeywordsModalOpen(false)}
        keywords={keywordPresets}
        onAddKeyword={(preset) => setKeywordPresets((prev) => [...prev, preset])}
        onDeleteKeyword={(id) => setKeywordPresets((prev) => prev.filter((k) => k.id !== id))}
      />

      {/* Legacy Create / Edit Modals */}
      {isCreateModalOpen && (
        <CreateItineraryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          consultants={consultants}
          onAddConsultant={handleAddConsultant}
          onConfirm={(initialData) => {
            const newIt: Itinerary = {
              id: `it-${Date.now()}`,
              code: initialData.code,
              region: initialData.region,
              groupType: initialData.groupType,
              consultant: initialData.consultant,
              clientName: '',
              clientNumber: '',
              destination: '',
              duration: '3N4D',
              dateOfTravel: '',
              transportDetails: '',
              groupSizePax: '2 Adults',
              quotationDate: new Date().toISOString().split('T')[0],
              validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              pricingSlots: [],
              costingNote: '',
              currency: '₹',
              hasDay0: false,
              days: [],
              enableNotes: true,
              inclusions: [],
              exclusions: [],
              cancellationPolicy: '',
              paymentTerms: '',
              expeditionSafetyTerms: '',
              status: 'Draft',
              createdAt: new Date().toISOString(),
            };
            setItineraries((prev) => [newIt, ...prev]);
            setIsCreateModalOpen(false);
            setEditingItinerary(newIt);
          }}
        />
      )}

      {editingItinerary && (
        <ItineraryEditor
          itinerary={editingItinerary}
          onClose={() => setEditingItinerary(null)}
          onSave={handleSaveItinerary}
          onPreview={(it) => {
            setEditingItinerary(null);
            setSelectedItinerary(it);
          }}
          consultants={consultants}
          keywordPresets={keywordPresets}
        />
      )}

      {/* PDF Export Modal */}
      <QuotationPDFModal
        isOpen={!!pdfModalItinerary}
        itinerary={pdfModalItinerary}
        onClose={() => setPdfModalItinerary(null)}
        onOpenPresentation={(it) => {
          setPdfModalItinerary(null);
          setSelectedItinerary(it);
        }}
      />

      {/* Hidden DOM element required for html2canvas/jspdf continuous rendering */}
      <div id="royal-tours-pdf-doc" className="hidden print:block bg-white text-slate-900">
        {(activePrintItinerary || selectedItinerary) && (
          <PrintableQuotationDoc itinerary={(activePrintItinerary || selectedItinerary)!} />
        )}
      </div>

      {/* Clean Slate Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider font-sans-luxury">
                  Clean Slate · Start From First
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove all stored proposals and consultant values? This will reset the workspace to a pristine zero-record state.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                All itineraries, assigned consultants, and portfolio metrics will be reset to 0.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetCleanSlate}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Cloud Console Multi-Device Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        itineraries={itineraries}
        consultants={consultants}
        keywordPresets={keywordPresets}
        quotations={quotations}
        placePackages={placePackages}
        settings={settings}
        onImportDatabase={handleImportDatabasePayload}
        googleUser={googleUser}
        onGoogleAuthSuccess={(user, token) => {
          setGoogleUser(user);
        }}
        onGoogleSignedOut={() => {
          setGoogleUser(null);
        }}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={(enabled) => {
          setAutoSyncEnabled(enabled);
          try {
            localStorage.setItem('royaltours_drive_autosync', String(enabled));
          } catch {}
        }}
        isAutoSyncing={isDriveSyncing}
      />

      {/* PWA Network Offline Connectivity Banner */}
      <OfflineIndicator />

    </div>
  );
}
