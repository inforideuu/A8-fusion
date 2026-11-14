import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Shield, Lock, User, Eye, EyeOff, AlertCircle,
  KeyRound, ArrowRight, ArrowLeft, CheckCircle2
} from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('a8fusionadmin');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const res = await login(username, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.error || 'Authentication rejected. Verify your username and password.');
    }
  };

  return (
    <div className="admin-console h-screen max-h-screen overflow-hidden text-slate-900 flex flex-col justify-between relative font-sans select-none">
      {/* Background Image - Clean, unzoomed, and with no shadow overlays */}
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
                  placeholder="e.g. Username or Passowrd"
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

              <span className="text-[11px] font-sans text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Database: Connected
              </span>
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
    </div>
  );
}
