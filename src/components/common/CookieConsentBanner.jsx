import React, { useState, useEffect } from 'react';
import { Shield, X, Check } from 'lucide-react';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [bannerText, setBannerText] = useState(
    'We use essential cookies to maintain institutional platform security, analyze systemic traffic, and ensure compliant operation.'
  );

  useEffect(() => {
    const consent = localStorage.getItem('a8_cookie_consent');
    if (consent) return; // User already accepted or declined

    // Fetch live settings from backend API
    fetch('http://127.0.0.1:8000/api/settings/website/')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.cookie_banner_enabled) {
          if (data.cookie_banner_text) setBannerText(data.cookie_banner_text);
          setVisible(true);
        } else if (!data) {
          setVisible(true);
        }
      })
      .catch(() => {
        setVisible(true);
      });
  }, []);

  const handleAccept = () => {
    localStorage.setItem('a8_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('a8_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-5 rounded-2xl bg-[#090F1E]/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-black/60 text-slate-200 text-xs font-sans">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-400 flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div className="space-y-2 flex-grow">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-white tracking-wide">
                Institutional Security &amp; Cookie Consent
              </span>
              <button
                onClick={handleDecline}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              {bannerText}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleAccept}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm shadow-indigo-600/30"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Compliant Cookies</span>
              </button>
              <button
                onClick={handleDecline}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors border border-slate-700"
              >
                Decline Non-Essential
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
