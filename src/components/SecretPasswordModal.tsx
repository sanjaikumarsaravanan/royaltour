import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MASTER_PASSWORD, MASTER_PASSWORD_ALT } from './LoginPage';

interface SecretPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLoginPassword: string;
  onUpdatePassword: (newPassword: string) => void;
}

export const SecretPasswordModal: React.FC<SecretPasswordModalProps> = ({
  isOpen,
  onClose,
  currentLoginPassword,
  onUpdatePassword,
}) => {
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = currentPassInput.trim();
    if (
      trimmed === currentLoginPassword.trim() ||
      trimmed === MASTER_PASSWORD ||
      trimmed === MASTER_PASSWORD_ALT
    ) {
      setIsAuthorized(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Current password does not match. Please verify and retry.');
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassInput.trim()) {
      setErrorMsg('New passcode cannot be empty.');
      return;
    }

    if (newPassInput.length < 4) {
      setErrorMsg('Passcode must be at least 4 characters.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    onUpdatePassword(newPassInput.trim());
    setSuccessMsg('Portal password successfully updated!');

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleResetToDefault = () => {
    onUpdatePassword('royal123');
    setSuccessMsg('Portal password reset to default: royal123');
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setCurrentPassInput('');
    setIsAuthorized(false);
    setNewPassInput('');
    setConfirmPassInput('');
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden text-[#0F172A]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E2E8F0] text-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0070C0]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Reset Portal Password
              </h3>
              <p className="text-[10px] text-[#64748B]">Operator Access Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {!isAuthorized ? (
            /* Step 1: Verify current password */
            <form onSubmit={handleAuthorize} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-mono">
                  Enter Current Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    placeholder="Enter current passcode..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Default passcode is <code className="font-mono text-slate-600 font-semibold">royal123</code>.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline font-mono flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to default</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Set new password */
            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Verified! Enter your desired new login passcode below.</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  New Studio Passcode
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    autoFocus
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="Enter new passcode"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                  Confirm New Passcode
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="Repeat new passcode"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Update Passcode</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
