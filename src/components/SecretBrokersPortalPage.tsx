import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  Phone,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Home
} from 'lucide-react';
import {
  SUPER_ADMIN_DISPLAY_PHONE,
  SUPER_ADMIN_NAME,
  SUPER_ADMIN_PHONE,
  SECRET_PORTAL_PIN
} from '../data/pakistanRiceBrokersData';
import { AdminRiceBrokersNetwork } from './admin/AdminRiceBrokersNetwork';

interface SecretBrokersPortalPageProps {
  onNavigateHome: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const SecretBrokersPortalPage: React.FC<SecretBrokersPortalPageProps> = ({
  onNavigateHome,
  onSuccessToast
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hashir_secret_portal_authenticated') === 'true';
  });

  const [enteredCredential, setEnteredCredential] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep page strictly noindex
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      // Revert if leaving
      metaRobots?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = enteredCredential.replace(/[\s\-\+\(\)]/g, '');

    // Allow Super Admin phone or PIN
    const isPhoneMatch =
      cleanInput === '923338990883' ||
      cleanInput === '03338990883' ||
      cleanInput === '3338990883' ||
      cleanInput === '+923338990883';

    const isPinMatch =
      enteredCredential.trim() === SECRET_PORTAL_PIN ||
      enteredCredential.trim() === 'HashirMandi@2026' ||
      enteredCredential.trim() === '8990883';

    if (isPhoneMatch || isPinMatch) {
      sessionStorage.setItem('hashir_secret_portal_authenticated', 'true');
      setIsAuthenticated(true);
      setErrorMessage('');
      if (onSuccessToast) {
        onSuccessToast(`Authenticated as Super Admin: ${SUPER_ADMIN_NAME} (${SUPER_ADMIN_DISPLAY_PHONE})`);
      }
    } else {
      setErrorMessage(
        'Access Denied: Invalid credentials. This secret page is strictly restricted to Super Admin (+92 333 8990883).'
      );
    }
  };

  const handleLockPortal = () => {
    sessionStorage.removeItem('hashir_secret_portal_authenticated');
    setIsAuthenticated(false);
    setEnteredCredential('');
    if (onSuccessToast) {
      onSuccessToast('Secret Portal Locked.');
    }
  };

  // IF NOT AUTHENTICATED: Display Security Passcode Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center p-4 text-white relative">
        <div className="w-full max-w-md space-y-6">
          {/* Lock Icon Emblem */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Restricted Trade Network
            </h1>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Confidential Pakistan Rice Brokers & 1-Way WhatsApp Broadcast Portal. Not indexed or linked publicly.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/30 p-3 text-xs text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorized Administrator Only:</span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                Enter your Super Admin mobile number (<strong>+92 333 8990883</strong>) or your security PIN (<strong>8990883</strong>) to access the 560 brokers and broadcast console.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-red-950/70 border border-red-500/40 p-3 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Super Admin Phone or PIN:
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={enteredCredential}
                    onChange={(e) => setEnteredCredential(e.target.value)}
                    placeholder="Enter +92 333 8990883 or 8990883"
                    className="w-full bg-neutral-900/80 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Unlock Secret Broker Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={onNavigateHome}
                className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Public Homepage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED: Display Full Broadcast Engine & Broker CRM
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top bar with quick exit/lock */}
        <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-neutral-900 dark:text-white text-base">
                Secret Broker Portal (Private Link)
              </h2>
              <p className="text-xs text-neutral-500">
                Logged in as Super Admin: <span className="font-semibold text-emerald-600">{SUPER_ADMIN_DISPLAY_PHONE}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLockPortal}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border border-red-200 dark:border-red-900/60 px-3.5 py-2 rounded-xl transition"
            >
              🔒 Lock Portal
            </button>
            <button
              onClick={onNavigateHome}
              className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
          </div>
        </div>

        {/* Full Admin Network Component */}
        <AdminRiceBrokersNetwork
          onSuccessToast={onSuccessToast}
          isSecretStandalonePage={true}
        />
      </div>
    </div>
  );
};
