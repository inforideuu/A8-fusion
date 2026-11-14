import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminProtectedRoute({ children, module }) {
  const { isAuthenticated, user, hasPermission } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (module && !hasPermission(module)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-sm m-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-amber-700">
          SECURITY PROTOCOL 403 // RBAC RESTRICTION
        </span>
        <h2 className="text-2xl font-sans font-bold text-slate-900 mt-2 mb-3">
          Restricted Institutional Module
        </h2>
        <p className="text-sm text-slate-600 max-w-md font-sans leading-relaxed mb-6">
          Your assigned role <span className="font-sans text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-semibold uppercase">[{user?.role_display || user?.role}]</span> does not hold administrative clearance to access the <span className="font-sans text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">[{module.toUpperCase()}]</span> module.
        </p>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-sans font-bold uppercase tracking-wider transition-colors border border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Permitted View</span>
        </button>
      </div>
    );
  }

  return children;
}

