import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ShieldCheck, KeyRound, HelpCircle, Lock, User,
  CheckCircle2, AlertCircle, Save, Eye, EyeOff, Sparkles,
  RefreshCw, ShieldAlert, ArrowRight, Check
} from 'lucide-react';
import {
  SYSTEM_ROLES,
  getUserRecoveryProfile,
  setUserRecoveryProfile,
  hasUserConfiguredRecovery,
  getDynamicRecoveryStore
} from '../utils/recoveryCredentials';

export default function SecurityRecoveryModule() {
  const { user } = useAdminAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.is_superuser;

  // Active view: 'personal' or 'all_roles'
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedRoleCode, setSelectedRoleCode] = useState(user?.role || 'SUPER_ADMIN');

  // Active target identifier with role fallback
  const currentUsername = activeTab === 'personal'
    ? (user?.username || (user?.role && SYSTEM_ROLES.find(r => r.code === user.role)?.defaultUser) || 'webadmin')
    : (SYSTEM_ROLES.find(r => r.code === selectedRoleCode)?.defaultUser || selectedRoleCode);

  // Form states
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [confirmAnswer, setConfirmAnswer] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Status feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [allProfiles, setAllProfiles] = useState({});

  // Load existing profile for the target user
  const loadTargetProfile = () => {
    setSuccessMessage('');
    setErrorMessage('');
    const profile = getUserRecoveryProfile(currentUsername);
    if (profile) {
      setPin(profile.pin || '');
      setConfirmPin(profile.pin || '');
      setQuestion(profile.question || '');
      setAnswer(profile.answer || '');
      setConfirmAnswer(profile.answer || '');
    } else {
      setPin('');
      setConfirmPin('');
      setQuestion('');
      setAnswer('');
      setConfirmAnswer('');
    }
    setAllProfiles(getDynamicRecoveryStore());
  };

  useEffect(() => {
    loadTargetProfile();
  }, [currentUsername, activeTab, selectedRoleCode]);

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!pin || pin.length !== 6) {
      setErrorMessage('The Secret Security PIN must be exactly 6 numeric digits.');
      return;
    }
    if (pin !== confirmPin) {
      setErrorMessage('6-Digit PINs do not match. Please verify.');
      return;
    }
    if (!question.trim()) {
      setErrorMessage('Please specify your customized security question.');
      return;
    }
    if (!answer.trim()) {
      setErrorMessage('Please specify the secret answer to your question.');
      return;
    }
    if (answer.trim() !== confirmAnswer.trim()) {
      setErrorMessage('Secret answers do not match. Please verify.');
      return;
    }

    setIsSaving(true);
    const activeRole = activeTab === 'personal' ? (user?.role || 'WEBSITE_ADMIN') : selectedRoleCode;
    const success = setUserRecoveryProfile(
      currentUsername,
      {
        pin,
        question,
        answer
      },
      {
        role: activeRole,
        email: user?.email,
        username: currentUsername
      }
    );
    setIsSaving(false);

    if (success) {
      setSuccessMessage(`Recovery credentials successfully saved for ${currentUsername}!`);
      setAllProfiles(getDynamicRecoveryStore());
      setTimeout(() => setSuccessMessage(''), 6000);
    } else {
      setErrorMessage('Failed to save credentials. Please try again.');
    }
  };

  const isConfigured = hasUserConfiguredRecovery(currentUsername);
  const targetProfile = getUserRecoveryProfile(currentUsername);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
              Personal Security Governance &amp; Multi-Factor Recovery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Security Clearance &amp; Recovery Keys
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1 max-w-3xl leading-relaxed">
            Configure your personal 6-digit numeric PIN and customized secret question &amp; answer. When anyone requests a password reset on the login portal, these dynamic credentials are required for verification.
          </p>
        </div>

        <button
          onClick={loadTargetProfile}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50 self-start sm:self-auto cursor-pointer"
          title="Reload Security Credentials"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs (If Super Admin) */}
      {isSuperAdmin && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>My Security Clearance ({user?.username || 'Current User'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all_roles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all_roles'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>All Department Roles Directory</span>
          </button>
        </div>
      )}

      {/* SUPER ADMIN ALL ROLES DIRECTORY VIEW */}
      {isSuperAdmin && activeTab === 'all_roles' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Department Roles Security Status
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select any role below to view or configure their dynamic 6-digit PIN and customized security question &amp; answer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SYSTEM_ROLES.map((role) => {
                const isSelected = selectedRoleCode === role.code;
                const roleConfigured = hasUserConfiguredRecovery(role.defaultUser);
                return (
                  <button
                    key={role.code}
                    type="button"
                    onClick={() => setSelectedRoleCode(role.code)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-xs text-slate-900">{role.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        roleConfigured
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {roleConfigured ? 'Active' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
                      <span>User: {role.defaultUser}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK BANNERS */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Security Profile Synchronized</span>
            <p className="mt-0.5 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Validation Error</span>
            <p className="mt-0.5 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* MAIN SECURITY CONFIGURATION CARD */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        {/* Active Target Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-2xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Configuring Security Profile For
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  {currentUsername}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  {activeTab === 'personal' ? (user?.role || 'Current User') : selectedRoleCode}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span>{isConfigured ? 'Recovery Profile Configured' : 'Setup Required'}</span>
            </span>
          </div>
        </div>

        {/* SECTION 1: 6-DIGIT SECRET SECURITY PIN */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xs">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Option 1: 6-Digit Secret Security PIN
            </h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed pl-8">
            A numeric 6-digit passcode. On the login page, entering this PIN allows instant password recovery without needing to answer the security question.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Set 6-Digit PIN <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 749201"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm font-mono tracking-widest text-slate-900 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Must be exactly 6 numeric digits ({pin.length}/6).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Confirm 6-Digit PIN <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm font-mono tracking-widest text-slate-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-200/80 my-4" />

        {/* SECTION 2: CUSTOMIZED QUESTION & SECRET ANSWER */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xs">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Option 2: Customized Security Question &amp; Answer
            </h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed pl-8">
            Write your own personal security question. When someone chooses Option 2 on the login page, this exact question will be displayed, and your secret answer will be verified.
          </p>

          <div className="space-y-4 pl-8">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Write Your Custom Security Question <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What was our first project codename? / What was the founder's first city?"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-900 outline-none transition-all"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Tip: Choose a question only you or authorized role holders would know.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Secret Answer <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showAnswer ? 'text' : 'password'}
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your secret answer..."
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-900 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  * Answers are verified case-insensitively.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Confirm Secret Answer <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showAnswer ? 'text' : 'password'}
                  required
                  value={confirmAnswer}
                  onChange={(e) => setConfirmAnswer(e.target.value)}
                  placeholder="Re-type secret answer..."
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-900 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-slate-500 font-mono">
            {targetProfile?.updatedAt ? `Last synchronized: ${new Date(targetProfile.updatedAt).toLocaleDateString()}` : 'No previous credentials saved.'}
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Credentials...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Recovery Credentials</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
