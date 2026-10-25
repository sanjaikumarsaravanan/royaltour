import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  Cloud,
  Check,
  AlertCircle,
  LogOut,
  Upload,
  Download,
  RefreshCw,
  Smartphone,
  Laptop,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  signInWithGoogleDrive,
  signOutGoogleDrive,
  syncDatabaseToGoogleDrive,
  fetchDatabaseFromGoogleDrive,
  getOrCreateDriveDatabaseFileId,
  getCachedAccessToken,
  StudioDatabasePayload,
} from '../services/googleDriveStorage';
import { Consultant, DayKeywordPreset, Itinerary } from '../types/itinerary';
import { PlacePackage, Quotation, AppSettings } from '../types/placePackage';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  itineraries: Itinerary[];
  consultants: Consultant[];
  keywordPresets: DayKeywordPreset[];
  quotations: Quotation[];
  placePackages: PlacePackage[];
  settings: AppSettings;
  onImportDatabase: (data: Partial<StudioDatabasePayload>) => void;
  googleUser: User | null;
  onGoogleAuthSuccess: (user: User, token: string) => void;
  onGoogleSignedOut: () => void;
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  isAutoSyncing?: boolean;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  itineraries,
  consultants,
  keywordPresets,
  quotations,
  placePackages,
  settings,
  onImportDatabase,
  googleUser,
  onGoogleAuthSuccess,
  onGoogleSignedOut,
  autoSyncEnabled,
  onToggleAutoSync,
  isAutoSyncing = false,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem('royaltours_last_drive_sync') || null;
    } catch {
      return null;
    }
  });
  const [driveFileId, setDriveFileId] = useState<string | null>(null);

  useEffect(() => {
    const token = getCachedAccessToken();
    if (googleUser && token && !driveFileId) {
      getOrCreateDriveDatabaseFileId(token)
        .then((id) => setDriveFileId(id))
        .catch((err) => console.warn('Could not retrieve file id:', err));
    }
  }, [googleUser, driveFileId]);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    setStatusMessage(null);
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        onGoogleAuthSuccess(res.user, res.token);
        setStatusMessage({
          type: 'success',
          text: `Connected to Google Drive as ${res.user.email}. Multi-device cloud sync is ready.`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Google Drive connection was cancelled.',
      });
    }
  };

  const handleDisconnectGoogle = async () => {
    await signOutGoogleDrive();
    onGoogleSignedOut();
    setDriveFileId(null);
    setStatusMessage({ type: 'success', text: 'Disconnected from Google Drive.' });
  };

  const handleSyncToDrive = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Please sign in with Google Drive first.' });
      return;
    }

    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const payload = {
        quotations,
        placePackages,
        settings,
        itineraries,
        consultants,
        keywords: keywordPresets,
      };

      const result = await syncDatabaseToGoogleDrive(token, payload);
      setDriveFileId(result.fileId);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      try {
        localStorage.setItem('royaltours_last_drive_sync', timeStr);
      } catch {}

      setStatusMessage({
        type: 'success',
        text: `Cloud sync complete! Saved ${quotations.length} quotations, ${placePackages.length} packages & ${consultants.length} consultants. Changes are live for your other devices.`,
      });
    } catch (err: any) {
      console.error('Sync error:', err);
      setStatusMessage({ type: 'error', text: `Sync failed: ${err?.message || 'Network error'}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromDrive = async () => {
    const token = getCachedAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Please sign in with Google Drive first.' });
      return;
    }

    setIsPulling(true);
    setStatusMessage(null);

    try {
      const remoteData = await fetchDatabaseFromGoogleDrive(token);
      if (!remoteData) {
        setStatusMessage({
          type: 'error',
          text: 'No prior database found on Google Drive. Click "Push to Drive" first to upload current state.',
        });
        return;
      }

      onImportDatabase(remoteData);

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      try {
        localStorage.setItem('royaltours_last_drive_sync', timeStr);
      } catch {}

      setStatusMessage({
        type: 'success',
        text: `Restored ${(remoteData.quotations || []).length} quotations and ${(remoteData.placePackages || []).length} packages from Google Drive!`,
      });
    } catch (err: any) {
      console.error('Pull error:', err);
      setStatusMessage({ type: 'error', text: `Pull failed: ${err?.message || 'Network error'}` });
    } finally {
      setIsPulling(false);
    }
  };

  const handleExportLocalJson = () => {
    const data = {
      agency: settings.companyName || 'ROYAL TOURS',
      exportedAt: new Date().toISOString(),
      quotations,
      placePackages,
      settings,
      itineraries,
      consultants,
      keywords: keywordPresets,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `royal_tours_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-950">
                  Google Cloud Console Device Sync
                </h3>
                {googleUser && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Authorized
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Synchronized across all administrator devices for royaltoursofficial@gmail.com
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Status Notification */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in duration-150 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* How Multi-Device Sync Works Visual Explainer */}
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-blue-600" />
                Device A (Laptop / Office)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              <span className="flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-blue-600" />
                Google Drive
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                Device B (Mobile / iPad)
              </span>
            </div>
            <p className="text-[11px] text-blue-800/90 leading-relaxed">
              When connected to Google Drive, any quotation, itinerary, or package created or modified on one device is saved directly into <code>royal_tours_database.json</code> in your Google Drive. When you open the app on another device, it detects the update and syncs automatically.
            </p>
          </div>

          {/* Google Account Status Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Google Account Connection
              </span>
              {googleUser ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Connected</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                  Not Connected
                </span>
              )}
            </div>

            {googleUser ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  {googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt={googleUser.displayName || 'User'}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                      {(googleUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {googleUser.displayName || 'Google Account User'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {googleUser.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDisconnectGoogle}
                  className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-medium flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign in with your Google account to authorize Royal Tours to store and sync your travel database file in your personal Google Drive with your permission.
                </p>

                {/* Official Material Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-3 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Sign in with Google to Connect Drive</span>
                </button>
              </div>
            )}
          </div>

          {/* Automatic Cross-Device Background Sync Toggle */}
          {googleUser && (
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Automatic Cross-Device Sync
                </span>
                <span className="text-[11px] text-slate-500">
                  Automatically sync on changes and check for remote updates when opening the app
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => onToggleAutoSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          )}

          {/* Manual Push / Pull Operations */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Direct Cloud Actions
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Push / Save */}
              <button
                type="button"
                onClick={handleSyncToDrive}
                disabled={isSyncing || !googleUser}
                className="p-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl transition-all shadow-sm text-left flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Upload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Push
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {isSyncing ? 'Pushing to Drive...' : 'Save to Google Drive'}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Uploads {quotations.length} quotations & {placePackages.length} packages
                  </p>
                </div>
              </button>

              {/* Pull / Restore */}
              <button
                type="button"
                onClick={handlePullFromDrive}
                disabled={isPulling || !googleUser}
                className="p-4 bg-white border border-slate-200 hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 rounded-2xl transition-all shadow-2xs text-left flex flex-col justify-between space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Download className={`w-4 h-4 ${isPulling ? 'animate-bounce' : ''}`} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Pull
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {isPulling ? 'Loading from Drive...' : 'Pull from Google Drive'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Restores latest cloud state into this device
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Drive File Details Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Database Storage File:</span>
              <span className="font-mono font-bold text-slate-900">royal_tours_database.json</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Last Synced:</span>
              <span className="font-mono text-slate-900 font-semibold">
                {lastSyncTime || 'Never in this session'}
              </span>
            </div>
            {driveFileId && (
              <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200">
                <span className="text-slate-500">Drive File ID:</span>
                <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]">
                  {driveFileId}
                </span>
              </div>
            )}
          </div>

          {/* Offline / Local Backup Option */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Need a direct offline copy?
            </span>
            <button
              type="button"
              onClick={handleExportLocalJson}
              className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
