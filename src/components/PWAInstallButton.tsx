import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'standard' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running in standalone mode (already installed as PWA), do not render
  if (isInstalled) {
    return null;
  }

  // Handle browser install prompt
  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Render for Chromium / Android / Desktop with beforeinstallprompt
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-lg flex items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Install Royal Tours App</h4>
              <p className="text-xs text-slate-300">Run as a standalone app on your home screen or desktop with offline access</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Install Royal Tours App on your home screen or desktop"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer bg-amber-500/10 text-amber-900 border-amber-300 hover:bg-amber-500/20 shadow-2xs ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // Render for iOS Safari (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        {variant === 'banner' ? (
          <div className={`p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-lg flex items-center justify-between gap-4 ${className}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Install on iPhone / iPad</h4>
                <p className="text-xs text-slate-300">Add to Home Screen for full-screen luxury experience</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Guide</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            title="Install Royal Tours on iPhone / iPad"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer bg-amber-500/10 text-amber-900 border-amber-300 hover:bg-amber-500/20 shadow-2xs ${className}`}
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold">Install on iPhone / iPad</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      1
                    </div>
                    <div className="text-xs text-slate-700">
                      Tap the <strong className="inline-flex items-center gap-1 text-slate-900 font-semibold"><Share className="w-3.5 h-3.5 text-blue-600 inline" /> Share</strong> icon in the Safari bottom bar.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      2
                    </div>
                    <div className="text-xs text-slate-700">
                      Scroll down and tap <strong className="inline-flex items-center gap-1 text-slate-900 font-semibold"><PlusSquare className="w-3.5 h-3.5 text-amber-600 inline" /> Add to Home Screen</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      3
                    </div>
                    <div className="text-xs text-slate-700">
                      Tap <strong className="text-slate-900 font-semibold">Add</strong> in the top-right corner to launch Royal Tours anytime like a native app.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showGeneralGuide, setShowGeneralGuide] = useState(false);

  // Fallback for browsers that haven't fired beforeinstallprompt yet or standard desktop
  return (
    <>
      <button
        type="button"
        onClick={() => setShowGeneralGuide(true)}
        title="Install Royal Tours App"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-slate-600" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {showGeneralGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Install Royal Tours App</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGeneralGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-0.5">Chrome / Edge / Desktop:</p>
                  <p className="text-slate-600">Click the <strong>Install</strong> icon in the address bar (top right).</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-0.5">Android:</p>
                  <p className="text-slate-600">Tap browser menu <strong>(⋮)</strong> and select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-0.5">iPhone / iPad (Safari):</p>
                  <p className="text-slate-600">Tap <strong>Share</strong> icon and select <strong>Add to Home Screen</strong>.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGeneralGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
