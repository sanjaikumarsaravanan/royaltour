import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppSettings,
  PlacePackage,
  Quotation,
  PackageItem,
} from '../types/placePackage';
import { SEED_PLACE_PACKAGES, SEED_SETTINGS, SEED_DEMO_QUOTATION } from '../data/seedPackages';

interface AppContextType {
  placePackages: PlacePackage[];
  quotations: Quotation[];
  settings: AppSettings;
  draftQuotation: Partial<Quotation> | null;
  // Place package actions
  addPlacePackage: (pkg: Omit<PlacePackage, 'id'>) => PlacePackage;
  updatePlacePackage: (id: string, updates: Partial<PlacePackage>) => void;
  duplicatePlacePackage: (id: string) => PlacePackage | null;
  deletePlacePackage: (id: string) => void;
  // Quotation actions
  saveQuotation: (quotation: Quotation) => void;
  deleteQuotation: (id: string) => void;
  duplicateQuotation: (id: string) => Quotation | null;
  getQuotationById: (id: string) => Quotation | undefined;
  // Draft actions
  updateDraft: (updates: Partial<Quotation>) => void;
  clearDraft: () => void;
  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettingsToDefault: () => void;
  // JSON Backup & Restore
  exportAllDataAsJSON: () => void;
  importAllDataFromJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PACKAGES: 'royaltours_place_packages_v1',
  QUOTATIONS: 'royaltours_quotations_v1',
  SETTINGS: 'royaltours_settings_v1',
  DRAFT: 'royaltours_wizard_draft_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Place Packages
  const [placePackages, setPlacePackages] = useState<PlacePackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse place packages from localStorage:', e);
    }
    return SEED_PLACE_PACKAGES;
  });

  // Quotations History
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse quotations from localStorage:', e);
    }
    return [SEED_DEMO_QUOTATION];
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...SEED_SETTINGS,
            ...parsed,
            logoUrl:
              parsed.logoUrl && parsed.logoUrl.trim() !== ''
                ? parsed.logoUrl.includes('WhatsApp_Image_2026-10-23')
                  ? '/assets/aistudio/royal_tours_logo_trimmed.png'
                  : parsed.logoUrl
                : SEED_SETTINGS.logoUrl,
            sectionLayout: parsed.sectionLayout && parsed.sectionLayout.length > 0 ? parsed.sectionLayout : SEED_SETTINGS.sectionLayout,
            tripTypes: parsed.tripTypes && parsed.tripTypes.length > 0 ? parsed.tripTypes : SEED_SETTINGS.tripTypes,
            stats: parsed.stats && parsed.stats.length > 0 ? parsed.stats : SEED_SETTINGS.stats,
            aboutPhotos: parsed.aboutPhotos && parsed.aboutPhotos.length > 0 ? parsed.aboutPhotos : SEED_SETTINGS.aboutPhotos,
            defaultDepartureJourney: parsed.defaultDepartureJourney || SEED_SETTINGS.defaultDepartureJourney,
            locationAddress: parsed.locationAddress || parsed.officeAddress || SEED_SETTINGS.locationAddress,
            pdfTheme: {
              ...SEED_SETTINGS.pdfTheme,
              ...(parsed.pdfTheme || {}),
              backgroundImageUrl:
                !parsed.pdfTheme?.backgroundImageUrl ||
                parsed.pdfTheme.backgroundImageUrl.includes('download_22b91a26.png') ||
                parsed.pdfTheme.backgroundImageUrl.includes('iVBORw0KGgoAAAANSUhEUgAABIAAAAgACAYAAABeuEj2')
                  ? SEED_SETTINGS.pdfTheme.backgroundImageUrl
                  : parsed.pdfTheme.backgroundImageUrl,
            },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse settings from localStorage:', e);
    }
    return SEED_SETTINGS;
  });

  // Draft Wizard State
  const [draftQuotation, setDraftQuotation] = useState<Partial<Quotation> | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAFT);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse draft from localStorage:', e);
    }
    return null;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(placePackages));
    } catch (e) {
      console.warn('Failed to save place packages:', e);
    }
  }, [placePackages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
    } catch (e) {
      console.warn('Failed to save quotations:', e);
    }
  }, [quotations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      if (draftQuotation) {
        localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draftQuotation));
      } else {
        localStorage.removeItem(STORAGE_KEYS.DRAFT);
      }
    } catch (e) {
      console.warn('Failed to save draft:', e);
    }
  }, [draftQuotation]);

  // Package Actions
  const addPlacePackage = (pkgData: Omit<PlacePackage, 'id'>): PlacePackage => {
    const newPkg: PlacePackage = {
      ...pkgData,
      id: `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setPlacePackages((prev) => [newPkg, ...prev]);
    return newPkg;
  };

  const updatePlacePackage = (id: string, updates: Partial<PlacePackage>) => {
    setPlacePackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    );
  };

  const duplicatePlacePackage = (id: string): PlacePackage | null => {
    const target = placePackages.find((p) => p.id === id);
    if (!target) return null;
    const duplicated: PlacePackage = {
      ...target,
      id: `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${target.name} (Copy)`,
      items: target.items.map((item) => ({
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      })),
    };
    setPlacePackages((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const deletePlacePackage = (id: string) => {
    setPlacePackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Quotation Actions
  const saveQuotation = (quotation: Quotation) => {
    setQuotations((prev) => {
      const idx = prev.findIndex((q) => q.id === quotation.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...quotation, updatedAt: new Date().toISOString() };
        return next;
      }
      return [
        {
          ...quotation,
          createdAt: quotation.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
    // Clear draft once saved
    clearDraft();
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
  };

  const duplicateQuotation = (id: string): Quotation | null => {
    const target = quotations.find((q) => q.id === id);
    if (!target) return null;
    const duplicated: Quotation = {
      ...target,
      id: `quot-${Date.now()}`,
      code: `${target.code || 'RT'}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Draft',
    };
    setQuotations((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const getQuotationById = (id: string) => {
    return quotations.find((q) => q.id === id);
  };

  // Draft Actions
  const updateDraft = (updates: Partial<Quotation>) => {
    setDraftQuotation((prev) => ({ ...(prev || {}), ...updates }));
  };

  const clearDraft = () => {
    setDraftQuotation(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
    } catch {}
  };

  // Settings Actions
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettingsToDefault = () => {
    setSettings(SEED_SETTINGS);
  };

  // JSON Export & Import
  const exportAllDataAsJSON = () => {
    const payload = {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      company: settings.companyName,
      placePackages,
      quotations,
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RoyalTours_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importAllDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.placePackages)) {
          setPlacePackages(parsed.placePackages);
        }
        if (Array.isArray(parsed.quotations)) {
          setQuotations(parsed.quotations);
        }
        if (parsed.settings && typeof parsed.settings === 'object') {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import data from JSON:', e);
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        placePackages,
        quotations,
        settings,
        draftQuotation,
        addPlacePackage,
        updatePlacePackage,
        duplicatePlacePackage,
        deletePlacePackage,
        saveQuotation,
        deleteQuotation,
        duplicateQuotation,
        getQuotationById,
        updateDraft,
        clearDraft,
        updateSettings,
        resetSettingsToDefault,
        exportAllDataAsJSON,
        importAllDataFromJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
