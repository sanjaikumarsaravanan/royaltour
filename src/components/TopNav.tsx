import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  Tag,
  KeyRound,
  LogOut,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { RoyalToursLogo } from './RoyalToursLogo';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

import { User } from 'firebase/auth';

export type NavTab = 'dashboard' | 'quotations' | 'itineraries' | 'settings' | 'keywords';

interface TopNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onCreateItinerary: () => void;
  onLogout?: () => void;
  onOpenSecretPassword?: () => void;
  onOpenGoogleDrive?: () => void;
  googleUser?: User | null;
  isDriveSyncing?: boolean;
  lastSyncTime?: string | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onCreateItinerary,
  onLogout,
  onOpenSecretPassword,
  onOpenGoogleDrive,
  googleUser,
  isDriveSyncing = false,
  lastSyncTime,
}) => {
  const { settings } = useApp();

  return (
    <>
      {/* ========================================================
          1. STICKY MOBILE APP TOP BAR (MOBILE RESOLUTION FIRST)
         ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-3.5 sm:px-5 py-2.5 shadow-xs transition-colors">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          
          {/* Brand Logo & Mobile Resolution Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <RoyalToursLogo variant="compact" />
          </div>

          {/* Quick Actions & Secret Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Desktop Tabs (for tablet/desktop viewports) */}
            <div className="hidden md:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] text-xs">
              <button
                type="button"
                onClick={() => onSelectTab('dashboard')}
                style={
                  activeTab === 'dashboard'
                    ? { backgroundColor: '#FFFFFF', color: settings.accentColor }
                    : undefined
                }
                className={`px-3 py-1 rounded-lg font-semibold transition-all uppercase tracking-wider text-[11px] ${
                  activeTab === 'dashboard'
                    ? 'shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('quotations')}
                style={
                  activeTab === 'quotations'
                    ? { backgroundColor: '#FFFFFF', color: settings.accentColor }
                    : undefined
                }
                className={`px-3 py-1 rounded-lg font-semibold transition-all uppercase tracking-wider text-[11px] ${
                  activeTab === 'quotations'
                    ? 'shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Quotations
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('settings')}
                style={
                  activeTab === 'settings'
                    ? { backgroundColor: '#FFFFFF', color: settings.accentColor }
                    : undefined
                }
                className={`px-3 py-1 rounded-lg font-semibold transition-all uppercase tracking-wider text-[11px] ${
                  activeTab === 'settings'
                    ? 'shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Packages & Settings
              </button>
            </div>

            {/* Google Cloud Console Multi-Device Sync Button */}
            {onOpenGoogleDrive && (
              <button
                type="button"
                onClick={onOpenGoogleDrive}
                title={
                  isDriveSyncing
                    ? 'Syncing with Google Cloud...'
                    : googleUser
                    ? `Google Cloud Sync Active (${googleUser.email}) — Click to manage`
                    : 'Google Cloud Device Sync'
                }
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 shadow-2xs"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full ${
                      isDriveSyncing
                        ? 'animate-ping opacity-100 bg-amber-400'
                        : googleUser
                        ? 'opacity-75 bg-emerald-400'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isDriveSyncing
                        ? 'bg-amber-500'
                        : googleUser
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </span>
                <span className="hidden sm:inline">
                  {isDriveSyncing ? 'Syncing...' : googleUser ? 'Google Cloud Sync' : 'Cloud Sync'}
                </span>
                <span className="sm:hidden">
                  {isDriveSyncing ? 'Sync...' : 'Sync'}
                </span>
              </button>
            )}

            {/* PWA In-App Install Prompt */}
            <PWAInstallButton />

            {/* Logout Action */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </header>

      {/* ========================================================
          2. FIXED MOBILE APP BOTTOM NAVIGATION BAR
         ======================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-sm px-3 py-1.5 flex items-center justify-around max-w-full print:hidden">
        
        {/* Dashboard (Home) */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          style={activeTab === 'dashboard' ? { color: settings.accentColor } : { color: '#64748B' }}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all"
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Overview</span>
        </button>

        {/* Quotations / Continuous Brochure */}
        <button
          type="button"
          onClick={() => onSelectTab('quotations')}
          style={activeTab === 'quotations' ? { color: settings.accentColor } : { color: '#64748B' }}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all"
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Quotations</span>
        </button>

        {/* Center Floating Create Action Button (Launches Wizard) */}
        <button
          type="button"
          onClick={onCreateItinerary}
          style={{ backgroundColor: settings.accentColor }}
          className="relative -top-3 w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center border-2 border-white transition-transform active:scale-90 hover:opacity-90"
          title="Create New Itinerary & Quotation"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Settings & Place Packages */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          style={activeTab === 'settings' ? { color: settings.accentColor } : { color: '#64748B' }}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all"
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Settings</span>
        </button>

      </nav>
    </>
  );
};
