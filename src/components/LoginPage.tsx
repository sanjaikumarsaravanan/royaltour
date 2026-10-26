import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogleDrive } from '../services/googleDriveStorage';
import {
  ShieldCheck,
  AlertCircle,
  Cloud,
  KeyRound,
} from 'lucide-react';
import { RoyalToursLogo } from './RoyalToursLogo';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onEmergencyPasswordSuccess?: () => void;
  currentLoginPassword?: string;
}

export const MASTER_PASSWORD = 'ROYALMASTER2026';
export const MASTER_PASSWORD_ALT = '8248886319';
export const VERCEL_DOMAIN = 'royaltour-mu.vercel.app';

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onEmergencyPasswordSuccess,
  currentLoginPassword = 'royal123',
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showEmergencyPasscode, setShowEmergencyPasscode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsSigningIn(true);
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        onLoginSuccess(res.user, res.token);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User closed or dismissed the Google popup window
        setIsSigningIn(false);
        return;
      }

      if (
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain')
      ) {
        setErrorMsg(
          'Domain not authorized for Google Sign-in. Please ensure this domain is allowlisted in Firebase Console / Google Cloud.'
        );
        setIsSigningIn(false);
        return;
      }

      console.error('Login error:', err);
      setErrorMsg(
        err?.message ||
          'Google authentication was cancelled or failed. Please try again.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmergencyPasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputTrimmed = passwordInput.trim();
    if (
      inputTrimmed === currentLoginPassword.trim() ||
      inputTrimmed === MASTER_PASSWORD ||
      inputTrimmed === MASTER_PASSWORD_ALT
    ) {
      setErrorMsg(null);
      if (onEmergencyPasswordSuccess) {
        onEmergencyPasswordSuccess();
      }
    } else {
      setErrorMsg('Incorrect emergency master passcode.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-slate-900 selection:text-white font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Brand & Portal Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <RoyalToursLogo variant="compact" />
          <div className="space-y-1 pt-1">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-950 font-serif">
              Studio Administrator Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Multi-Device Cloud Synchronization & Client Quotation Atelier
            </p>
          </div>
        </div>

        {/* Discreet Security Badge - Clean and without displaying email addresses */}
        <div className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold text-[11px] tracking-wide uppercase text-slate-700">
            Official Administrator Access
          </span>
        </div>

        {/* Error / Unauthorized Warning Banner */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Authorization Notice</span>
              <p className="text-[11px] leading-relaxed text-red-800">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Primary Action: Official Sign in with Google Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-2xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSigningIn ? (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                <span>Verifying Google Account...</span>
              </div>
            ) : (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.02h3.88c2.27-2.09 3.665-5.17 3.665-9.11z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.12C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.3c-.25-.72-.38-1.49-.38-2.3s.13-1.58.38-2.3V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.12z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.12c.95-2.83 3.6-4.95 6.72-4.95z"
                  />
                </svg>
                <span className="font-semibold text-slate-800">
                  Sign in with Google
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
            <span>Connects to Google Cloud Console for real-time device sync</span>
          </div>
        </div>

        {/* Emergency Passcode */}
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
          {!showEmergencyPasscode ? (
            <button
              type="button"
              onClick={() => setShowEmergencyPasscode(true)}
              className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Offline emergency passcode</span>
            </button>
          ) : (
            <form onSubmit={handleEmergencyPasscodeSubmit} className="w-full space-y-2 text-left">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Emergency Offline Passcode</span>
                <button
                  type="button"
                  onClick={() => setShowEmergencyPasscode(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter passcode"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-slate-900"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Enter
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
