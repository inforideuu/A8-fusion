import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Shield, Lock, User, Eye, EyeOff, AlertCircle,
  KeyRound, ArrowRight, ArrowLeft, CheckCircle2,
  HelpCircle, X, ShieldAlert, Check
} from 'lucide-react';
import {
  normalizeIdentifier,
  getRoleByIdentifier,
  hasUserConfiguredRecovery,
  getUserRecoveryProfile,
  verifyDynamicPin,
  verifyDynamicAnswer,
  saveNewPassword,
  SYSTEM_ROLES
} from '../utils/recoveryCredentials';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('a8fusionadmin');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Forgot Password Modal States (Way B: User's Choice - Verification Only)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Identify Account, 2: Choose & Verify Method, 3: Set Password, 4: Success
  const [recoveryUser, setRecoveryUser] = useState('');
  const [verificationChoice, setVerificationChoice] = useState('pin'); // 'pin' or 'question'

  // Verification inputs
  const [enteredPin, setEnteredPin] = useState('');
  const [enteredAnswer, setEnteredAnswer] = useState('');

  // New Password inputs
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [forgotError, setForgotError] = useState('');
  const [resetAccountUser, setResetAccountUser] = useState(null);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessToast('');
    setIsSubmitting(true);

    const res = await login(username, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.error || 'Authentication rejected. Verify your username and password.');
    }
  };

  // Open Forgot Password Modal
  const handleOpenForgot = () => {
    const typed = (username || '').trim();
    // If the user already typed their own username, use it; otherwise start empty so they type their account
    const initialUser = (typed && typed !== 'a8fusionadmin') ? typed : '';
    setRecoveryUser(initialUser);
    setVerificationChoice('pin');
    setForgotStep(1);
    setEnteredPin('');
    setEnteredAnswer('');
    setNewPasswordVal('');
    setConfirmPasswordVal('');
    setForgotError('');
    setShowForgotModal(true);
  };

  // Handle Username Change in Modal
  const handleRecoveryUserChange = (val) => {
    setRecoveryUser(val);
    setForgotError('');
  };

  // Step 1: Proceed from Identification to Verification
  const handleProceedStep1 = (e) => {
    e.preventDefault();
    setForgotError('');

    const target = (recoveryUser || '').trim();
    if (!target) {
      setForgotError('Please enter your account username or institutional email.');
      return;
    }

    const isConfigured = hasUserConfiguredRecovery(target);
    if (!isConfigured) {
      setForgotError(`No recovery credentials have been configured for "${target}". For security reasons, recovery credentials can only be established from within the authenticated Admin Console under Personal Security → Security & Recovery.`);
      return;
    }

    // Found active recovery profile, advance to verification choice step
    setEnteredPin('');
    setEnteredAnswer('');
    setForgotStep(2);
  };

  // Dynamic profiles for Step 2
  const currentProfile = getUserRecoveryProfile(recoveryUser);
  const matchedRole = getRoleByIdentifier(recoveryUser);

  // Step 2: Verify Credentials dynamically
  const handleVerifyCredential = (e) => {
    e.preventDefault();
    setForgotError('');

    if (verificationChoice === 'pin') {
      if (!enteredPin || enteredPin.length !== 6) {
        setForgotError('Please enter your 6-digit numeric security PIN.');
        return;
      }
      const isValid = verifyDynamicPin(recoveryUser, enteredPin);
      if (isValid) {
        setForgotStep(3);
      } else {
        setForgotError('Incorrect 6-digit security PIN for this user. Verify and try again.');
      }
    } else {
      if (!enteredAnswer.trim()) {
        setForgotError('Please enter your secret security answer.');
        return;
      }
      const isValid = verifyDynamicAnswer(recoveryUser, enteredAnswer);
      if (isValid) {
        setForgotStep(3);
      } else {
        setForgotError('Incorrect security answer. Answers are case-insensitive.');
      }
    }
  };

  // Step 3: Save New Password
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!newPasswordVal || newPasswordVal.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }

    const saved = await saveNewPassword(recoveryUser, newPasswordVal);

    if (saved) {
      if (typeof saved === 'object' && saved.user) {
        setResetAccountUser(saved.user);
      }
      setForgotStep(4);
    } else {
      setForgotError('Could not save new password. Please try again.');
    }
  };

  // Step 4: Finish and Return to Login Form
  const handleFinishReset = () => {
    const profile = getUserRecoveryProfile(recoveryUser);
    const roleObj = (profile?.role && SYSTEM_ROLES.find(r => r.code === profile.role)) ||
                    getRoleByIdentifier(recoveryUser) ||
                    (profile?.canonicalUser ? getRoleByIdentifier(profile.canonicalUser) : null);

    // Prefer the real account username (e.g. 'websiteadmin')
    const finalUser = resetAccountUser?.username || roleObj?.defaultUser || profile?.username || normalizeIdentifier(recoveryUser) || recoveryUser;
    setUsername(finalUser);
    setPassword(newPasswordVal);
    setShowForgotModal(false);
    const friendlyName = resetAccountUser?.first_name
      ? `${resetAccountUser.first_name} ${resetAccountUser.last_name || ''}`.trim()
      : (roleObj?.name || finalUser);
    setSuccessToast(`Password updated successfully for ${friendlyName}! Ready to sign in.`);
  };

  return (
    <div className="admin-console h-screen max-h-screen overflow-hidden text-slate-900 flex flex-col justify-between relative font-sans select-none">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/adminpanel.png')`
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-200/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-xs border border-slate-200 group-hover:scale-105 transition-transform">
            <img src="/a8logo.png" alt="A8Fusion Corporate Logo" className="h-6 sm:h-7 w-auto object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] font-sans font-bold text-indigo-700 uppercase tracking-widest leading-tight">
              Enterprise Governance
            </div>
            <div className="text-[11px] font-sans text-slate-700 font-medium leading-tight">
              Security Clearance Terminal
            </div>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-sans font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 bg-white/90 hover:bg-white shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Return to Main Site</span>
          <span className="sm:hidden">Exit</span>
        </Link>
      </header>

      {/* Center Login Box */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-2 sm:py-3 flex-1 flex flex-col justify-center items-center">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-slate-900/10 p-5 sm:p-7 relative overflow-hidden">
          {/* Top accent beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600" />

          {/* Brand Logo in Login Box */}
          <div className="flex justify-center mb-3">
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 shadow-2xs">
              <img src="/a8logo.png" alt="A8Fusion Logo" className="h-8 sm:h-9 w-auto object-contain" />
            </div>
          </div>

          {/* Title row */}
          <div className="text-center space-y-1 mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Institutional Sign In</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-[11px] text-slate-500 font-sans">
              Sign in with your Super Administrator or authorized staff account.
            </p>
          </div>

          {/* Success Toast */}
          {successToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 shadow-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium leading-relaxed">{successToast}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold font-sans block text-xs text-red-700">Authentication Failed</span>
                <p className="mt-0.5 text-red-600 text-[11px]">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  placeholder="e.g. webadmin, a8fusionadmin, or email"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password Action Row */}
            <div className="flex items-center justify-between text-xs font-sans pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span className="text-[11px]">Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleOpenForgot}
                className="text-[11px] font-sans font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Database indicator */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-center">
            <span className="text-[11px] font-sans text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dynamic Security Recovery Active
            </span>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-3 flex items-center justify-center gap-2 text-slate-700 text-[11px] font-sans font-medium">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>Role-Based Access Control · Encrypted Institutional Storage</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-2.5 text-center text-[11px] font-sans text-slate-600 border-t border-slate-200/50 bg-white/75 backdrop-blur-xs">
        © 2026 A8Fusion Private Limited. Authorized Institutional Access Only.
      </footer>

      {/* ========================================================================= */}
      {/* 100% SECURE DYNAMIC FORGOT PASSWORD MODAL (WAY B: VERIFICATION ONLY)       */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Top accent beam */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-sans">
                    Security Credentials Recovery
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {forgotStep === 1 && 'Step 1: Enter Account Identifier'}
                    {forgotStep === 2 && 'Step 2: Choose Verification Method'}
                    {forgotStep === 3 && 'Step 3: Set New Password'}
                    {forgotStep === 4 && 'Recovery Complete'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Error Banner */}
            {forgotError && (
              <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-xs animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed">{forgotError}</p>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6">
              {/* STEP 1: Account Identification */}
              {forgotStep === 1 && (
                <form onSubmit={handleProceedStep1} className="space-y-4">
                  <div>
                    <label className="block text-xs font-sans font-bold text-slate-800 mb-1.5">
                      Account Username or Email:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        autoFocus
                        value={recoveryUser}
                        onChange={(e) => handleRecoveryUserChange(e.target.value)}
                        placeholder="e.g. webadmin, salesmgr, or email"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-xs sm:text-sm text-slate-900 outline-none transition-all font-sans"
                      />
                    </div>
                    {recoveryUser.trim() && hasUserConfiguredRecovery(recoveryUser.trim()) ? (
                      <p className="text-[11px] text-emerald-600 mt-1.5 font-sans font-semibold flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>
                          Account verified: {getRoleByIdentifier(recoveryUser.trim())?.name || recoveryUser.trim()}
                        </span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1.5 font-sans leading-relaxed">
                        Enter the username, role title, or email of the account you configured recovery keys for.
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Choose Verification Method & Verify Challenge */}
              {forgotStep === 2 && currentProfile && (
                <form onSubmit={handleVerifyCredential} className="space-y-4">
                  {/* Target Account Badge */}
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-indigo-500 uppercase font-mono font-bold block">
                        Account Identified
                      </span>
                      <span className="font-bold text-indigo-950 font-sans">
                        {matchedRole ? `${matchedRole.name} (@${matchedRole.defaultUser})` : recoveryUser}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Profile Active</span>
                    </span>
                  </div>

                  {/* Choice Buttons: Option 1 vs Option 2 */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-sans font-bold text-slate-800">
                      Choose How You Want to Verify:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Option 1: 6-Digit PIN */}
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationChoice('pin');
                          setForgotError('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          verificationChoice === 'pin'
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            verificationChoice === 'pin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <KeyRound className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold font-sans text-slate-900">
                            Option 1: 6-Digit PIN
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Verify with your personal 6-digit PIN.
                        </p>
                      </button>

                      {/* Option 2: Custom Security Question */}
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationChoice('question');
                          setForgotError('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          verificationChoice === 'question'
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            verificationChoice === 'question' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <HelpCircle className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold font-sans text-slate-900">
                            Option 2: Security Q&amp;A
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Answer your custom question.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Enter 6-Digit PIN */}
                  {verificationChoice === 'pin' && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-xs font-sans font-bold text-slate-800">
                        Enter Your 6-Digit Security PIN:
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        autoFocus
                        className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-center text-2xl font-mono font-bold tracking-[0.5em] text-slate-900 outline-none transition-all shadow-inner"
                      />
                      <p className="text-[11px] text-slate-500 font-sans text-center">
                        Enter the personal 6-digit numeric security PIN you configured for {matchedRole?.name || recoveryUser}.
                      </p>
                    </div>
                  )}

                  {/* Mode 2: Answer Custom Security Question */}
                  {verificationChoice === 'question' && (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <label className="block text-xs font-sans font-bold text-slate-800 mb-1">
                          Your Custom Security Question:
                        </label>
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 font-serif text-sm font-semibold italic">
                          "{currentProfile.question}"
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-bold text-slate-800 mb-1">
                          Your Secret Answer:
                        </label>
                        <input
                          type="text"
                          required
                          value={enteredAnswer}
                          onChange={(e) => setEnteredAnswer(e.target.value)}
                          placeholder="Type your secret security answer..."
                          autoFocus
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-xs sm:text-sm text-slate-900 outline-none transition-all shadow-xs"
                        />
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          * Answers are verified case-insensitively.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotError('');
                        setForgotStep(1);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-sans transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Verify Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Set New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Identity verified for <strong>{matchedRole?.name || recoveryUser}</strong>. Set your new password below.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                      New Password (Min 6 Characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPasswordVal}
                        onChange={(e) => setNewPasswordVal(e.target.value)}
                        placeholder="••••••••••••"
                        autoFocus
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-xs sm:text-sm text-slate-900 outline-none transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPasswordVal}
                      onChange={(e) => setConfirmPasswordVal(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-xs sm:text-sm text-slate-900 outline-none transition-all shadow-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Update &amp; Activate Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: Success Confirmation */}
              {forgotStep === 4 && (
                <div className="text-center py-4 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-sans">
                      Password Reset Successfully!
                    </h4>
                    <p className="text-xs text-slate-600 font-sans max-w-sm mx-auto mt-1 leading-relaxed">
                      Your new password has been activated for <strong>{matchedRole?.name || recoveryUser}</strong>.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleFinishReset}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Sign In With New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
