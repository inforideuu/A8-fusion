import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminApi } from '../services/adminApi';
import {
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Save,
  RotateCcw, Lock, CheckSquare, Square, RefreshCw
} from 'lucide-react';

export default function RbacModule() {
  const { user, permissionsMatrix, setPermissionsMatrix, reloadPermissions } = useAdminAuth();
  const isSuperAdmin = user?.is_superuser || user?.role === 'SUPER_ADMIN';

  const roles = [
    { code: 'SUPER_ADMIN', name: 'Super Admin', level: 'Level 1 - Sovereign', color: 'indigo' },
    { code: 'WEBSITE_ADMIN', name: 'Website Administrator', level: 'Level 2 - Infrastructure', color: 'blue' },
    { code: 'CONTENT_MANAGER', name: 'Content Manager', level: 'Level 3 - Editorial', color: 'emerald' },
    { code: 'SALES_MANAGER', name: 'Sales Manager', level: 'Level 3 - Commercial', color: 'amber' },
    { code: 'HR_MANAGER', name: 'HR Manager', level: 'Level 3 - People & Talent', color: 'purple' },
    { code: 'BD_MANAGER', name: 'Business Development Manager', level: 'Level 3 - Alliances', color: 'rose' },
  ];

  const modules = [
    { id: 'dashboard', name: 'Dashboard Overview', desc: 'KPI summaries, telemetry charts, activity feeds' },
    { id: 'users', name: 'User Management', desc: 'User creation, status toggling, password resets' },
    { id: 'rbac', name: 'Role Governance & RBAC', desc: 'Permission auditing and clearance hierarchy' },
    { id: 'pages', name: 'Page Management & Live Editor', desc: 'CMS page authoring, live visual editing, layout' },
    { id: 'crm', name: 'Enquiry CRM', desc: 'Lead pipeline, communication logs, dossiers' },
    { id: 'careers', name: 'Careers & Hiring', desc: 'Vacancies, applicant dossiers, resume downloads' },
    { id: 'seo', name: 'SEO Management', desc: 'Canonical tags, sitemaps, 301 redirects' },
    { id: 'settings', name: 'Website Settings', desc: 'Corporate identity, SMTP, legal footers' },
    { id: 'reports', name: 'Analytics & Reports', desc: 'Data aggregation, exports, pipeline metrics' },
    { id: 'audit-logs', name: 'Audit Trail Logs', desc: 'Immutable login records, modifications' },
  ];

  const [matrix, setMatrix] = useState(() => permissionsMatrix || {});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permissionsMatrix && Object.keys(permissionsMatrix).length > 0) {
      setMatrix(permissionsMatrix);
    }
  }, [permissionsMatrix]);

  const handleToggle = (roleCode, moduleId) => {
    if (!isSuperAdmin) {
      alert('Security Policy: Clearance modification is strictly restricted to Sovereign Super Admin.');
      return;
    }
    if (roleCode === 'SUPER_ADMIN') {
      alert('Super Admin holds sovereign clearance across all operational modules by security definition.');
      return;
    }

    setMatrix((prev) => {
      const currentList = prev[roleCode] || [];
      const updatedList = currentList.includes(moduleId)
        ? currentList.filter((id) => id !== moduleId)
        : [...currentList, moduleId];
      return {
        ...prev,
        [roleCode]: updatedList,
      };
    });
    setIsDirty(true);
  };

  const handleSelectAllForRole = (roleCode) => {
    if (!isSuperAdmin || roleCode === 'SUPER_ADMIN') return;
    setMatrix((prev) => ({
      ...prev,
      [roleCode]: modules.map((m) => m.id),
    }));
    setIsDirty(true);
  };

  const handleClearAllForRole = (roleCode) => {
    if (!isSuperAdmin || roleCode === 'SUPER_ADMIN') return;
    // Always preserve at least dashboard
    setMatrix((prev) => ({
      ...prev,
      [roleCode]: ['dashboard'],
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminApi.customPost('rbac/permissions/save_matrix/', { matrix });
      if (res && res.matrix) {
        setPermissionsMatrix(res.matrix);
        localStorage.setItem('a8_rbac_matrix', JSON.stringify(res.matrix));
      } else {
        setPermissionsMatrix(matrix);
        localStorage.setItem('a8_rbac_matrix', JSON.stringify(matrix));
      }
      setIsDirty(false);
      alert('RBAC Clearance Matrix successfully saved and enforced system-wide.');
    } catch (err) {
      console.error(err);
      alert('Failed to save permissions to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Are you sure you want to restore the default institutional RBAC clearance matrix?')) {
      return;
    }
    setSaving(true);
    try {
      const res = await adminApi.customPost('rbac/permissions/reset_defaults/');
      if (res && res.matrix) {
        setMatrix(res.matrix);
        setPermissionsMatrix(res.matrix);
        localStorage.setItem('a8_rbac_matrix', JSON.stringify(res.matrix));
      }
      setIsDirty(false);
      alert('RBAC Matrix restored to institutional defaults.');
    } catch (err) {
      console.error(err);
      alert('Failed to reset defaults.');
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    setLoading(true);
    try {
      const m = await reloadPermissions();
      setMatrix(m);
      setIsDirty(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
            Institutional Access &amp; Permissions
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
            Role-Based Access Control (RBAC) Governance
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Configure who can do what: Super Admin grants or revokes operational module access dynamically across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReload}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50 cursor-pointer"
            title="Reload Permissions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isSuperAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                disabled={saving}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Restore default permissions"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !isDirty}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isDirty
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 font-bold animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : isDirty ? 'Save Permission Matrix' : 'Saved in Database'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Read-Only Mode: Super Admin Only</span>
            </div>
          )}
        </div>
      </div>

      {/* Super Admin Control Advisory */}
      {isSuperAdmin ? (
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-indigo-950 font-sans space-y-1">
            <div className="font-bold text-sm text-indigo-900">
              Super Admin Governance Authority Active
            </div>
            <p className="text-slate-600">
              You are authenticated with sovereign administrative clearance. Click any checkbox below to grant or revoke module access for other organizational roles, or use the column quick-actions. Click <span className="font-bold text-indigo-700">"Save Permission Matrix"</span> to commit changes permanently to the platform database.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-200 text-slate-600 flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-700 font-sans space-y-1">
            <div className="font-bold text-sm text-slate-900">
              Institutional Clearance View
            </div>
            <p className="text-slate-500">
              You are viewing the active RBAC governance matrix. Clearance configuration can only be altered by the Sovereign Super Admin.
            </p>
          </div>
        </div>
      )}

      {/* Role Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => {
          const allowedCount = (matrix[r.code] || []).length;
          return (
            <div key={r.code} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-slate-900">{r.name}</span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  {r.code}
                </span>
              </div>
              <div className="text-xs font-sans text-indigo-600 font-semibold">{r.level}</div>
              <div className="text-xs text-slate-500 font-sans pt-1 flex items-center justify-between">
                <span>Access: {allowedCount} of {modules.length} modules</span>
                <span className="font-semibold text-slate-700">{Math.round((allowedCount / modules.length) * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Matrix Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-sans font-bold text-slate-900">
              Interactive Clearance &amp; Module Permission Grid
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Toggles are synced with server-side DRF permissions, frontend protected routes, and sidebar navigation.
            </p>
          </div>

          {isDirty && (
            <span className="text-xs font-sans font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Unsaved Matrix Changes</span>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3.5 px-4 w-72">Operational Module</th>
                {roles.map((r) => (
                  <th key={r.code} className="py-3 px-3 text-center min-w-[130px]">
                    <div className="font-bold text-slate-900 truncate">{r.name}</div>
                    <div className="text-[10px] text-slate-400 font-sans font-normal">{r.code}</div>

                    {/* Column Quick Action Buttons for Super Admin */}
                    {isSuperAdmin && r.code !== 'SUPER_ADMIN' && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllForRole(r.code)}
                          className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                          title="Grant All Modules"
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClearAllForRole(r.code)}
                          className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors"
                          title="Revoke All (except Dashboard)"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {r.code === 'SUPER_ADMIN' && (
                      <div className="mt-2 text-[10px] text-indigo-600 font-sans font-semibold flex items-center justify-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Sovereign</span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-sans font-bold text-slate-900">{m.name}</div>
                    <div className="text-[11px] text-slate-500 font-sans">{m.desc}</div>
                  </td>
                  {roles.map((r) => {
                    const hasAccess = (matrix[r.code] || []).includes(m.id);
                    const isLocked = r.code === 'SUPER_ADMIN';

                    return (
                      <td key={r.code} className="py-3 px-3 text-center">
                        <button
                          type="button"
                          disabled={!isSuperAdmin || isLocked}
                          onClick={() => handleToggle(r.code, m.id)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                            isLocked
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-not-allowed opacity-90'
                              : hasAccess
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-300 hover:bg-emerald-100 shadow-2xs cursor-pointer'
                              : 'bg-slate-100 text-slate-300 border border-slate-200 hover:border-slate-300 hover:text-slate-400 cursor-pointer'
                          }`}
                          title={
                            isLocked
                              ? 'Super Admin clearance is immutable'
                              : isSuperAdmin
                              ? `Click to ${hasAccess ? 'Revoke' : 'Grant'} access for ${r.name}`
                              : 'Read-only view'
                          }
                        >
                          {isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-indigo-600" />
                          ) : hasAccess ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Policy: Zero-Trust Segregation of Duties</span>
          </div>

          {isSuperAdmin && (
            <div className="flex items-center gap-3">
              <span>{isDirty ? 'Changes pending commitment' : 'All permissions committed to database'}</span>
              {isDirty && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Commit Changes'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
