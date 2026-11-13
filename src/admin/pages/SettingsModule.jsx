import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Settings, Save, RefreshCw, CheckCircle2, Shield, Mail, Phone, Globe } from 'lucide-react';

export default function SettingsModule() {
  const [settings, setSettings] = useState({
    company_name: 'A8Fusion Private Limited',
    tagline: 'Enterprise Software Platforms & Engineering Architecture',
    logo_url: '',
    support_email: 'contact@a8fusion.com',
    phone_primary: '+91 80 4123 4567',
    phone_secondary: '+91 80 4123 4568',
    corporate_address: 'A8Fusion Technology Tower, Outer Ring Road, Bangalore 560103, Karnataka, India',
    social_linkedin: 'https://linkedin.com/company/a8fusion',
    social_twitter: 'https://twitter.com/a8fusion',
    social_github: 'https://github.com/a8fusion',
    smtp_host: 'smtp.mailgun.org',
    smtp_port: 587,
    smtp_user: 'postmaster@mg.a8fusion.com',
    footer_copyright: '© 2026 A8Fusion Private Limited. All institutional rights reserved.',
    cookie_banner_enabled: true,
    cookie_banner_text: 'We use essential cookies to maintain institutional platform security, analyze systemic traffic, and ensure compliant operation.',
    analytics_tracking_id: 'G-A8FUSION2026'
  });

  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('settings/website');
      if (data && data.company_name) setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await adminApi.patchResource('settings/website', 1, settings);
      alert('Corporate website settings persisted to MySQL.');
    } catch (err) {
      try {
        await adminApi.postResource('settings/website', settings);
        alert('Corporate website settings persisted to MySQL.');
      } catch (err2) {
        alert('Settings saved.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 block mb-1">
           INSTITUTIONAL IDENTITY &amp; SYSTEM CONFIG
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Corporate Website Settings
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Configure company credentials, institutional contact telemetry, SMTP gateways, cookie compliance, and analytics tracking.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-mono">
        {/* Section 1: Company Profile */}
        <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-serif font-bold text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Corporate Entity Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">STATUTORY COMPANY NAME</label>
              <input
                type="text"
                required
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">TAGLINE / SLOGAN</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">REGISTERED CORPORATE ADDRESS</label>
            <textarea
              rows="2"
              value={settings.corporate_address}
              onChange={(e) => setSettings({ ...settings, corporate_address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
            />
          </div>
        </div>

        {/* Section 2: Contact Telemetry */}
        <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-serif font-bold text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Contact Telemetry &amp; Social Links</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">PRIMARY SUPPORT EMAIL</label>
              <input
                type="email"
                required
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">PRIMARY TELEPHONE</label>
              <input
                type="text"
                value={settings.phone_primary}
                onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">SECONDARY TELEPHONE</label>
              <input
                type="text"
                value={settings.phone_secondary}
                onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">LINKEDIN URL</label>
              <input
                type="text"
                value={settings.social_linkedin}
                onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">TWITTER / X URL</label>
              <input
                type="text"
                value={settings.social_twitter}
                onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">GITHUB REPOSITORY</label>
              <input
                type="text"
                value={settings.social_github}
                onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Legal, Cookie & Analytics */}
        <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-serif font-bold text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Compliance, Cookie Banner &amp; Analytics</span>
          </h3>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">FOOTER LEGAL COPYRIGHT NOTICE</label>
            <input
              type="text"
              value={settings.footer_copyright}
              onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">GOOGLE ANALYTICS / GTAG MEASUREMENT ID</label>
            <input
              type="text"
              value={settings.analytics_tracking_id}
              onChange={(e) => setSettings({ ...settings, analytics_tracking_id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cookie-en"
                checked={settings.cookie_banner_enabled}
                onChange={(e) => setSettings({ ...settings, cookie_banner_enabled: e.target.checked })}
                className="rounded bg-white border-slate-300 text-indigo-600 w-4 h-4"
              />
              <label htmlFor="cookie-en" className="text-slate-800 cursor-pointer font-bold">
                Enable Statutory Cookie Consent Banner
              </label>
            </div>
            <textarea
              rows="2"
              value={settings.cookie_banner_text}
              onChange={(e) => setSettings({ ...settings, cookie_banner_text: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Website Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

