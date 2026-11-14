import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  History, Search, Filter, RefreshCw, Shield,
  CheckCircle2, AlertTriangle, XCircle, FileDown, Trash2
} from 'lucide-react';

export default function AuditLogsModule() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const modules = ['ALL', 'Auth', 'Users', 'CRM', 'Pages', 'Services', 'Solutions', 'Industries', 'Careers', 'Insights', 'Media', 'SEO', 'Settings', 'System'];

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('audit-logs');
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error(e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear and purge all institutional audit logs? This action is permanent and will be logged.')) {
      return;
    }
    try {
      await adminApi.customPost('audit-logs/clear_logs/');
      alert('All audit logs have been successfully cleared.');
      loadLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to clear audit logs.');
    }
  };

  const handleExportCSV = () => {
    window.open('http://127.0.0.1:8000/api/audit-logs/export_csv/', '_blank');
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchSearch =
      !searchTerm ||
      log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMod = moduleFilter === 'ALL' || log.module?.toLowerCase() === moduleFilter.toLowerCase();
    return matchSearch && matchMod;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            STATUTORY COMPLIANCE &amp; FORENSICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
            Institutional Audit Trail &amp; Access Logs
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Tamper-evident record of privileged logins, failed authentication attempts, data exports, and content mutations across the secure system.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={loadLogs}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50 cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold font-sans shadow-sm shadow-indigo-600/30 transition-colors cursor-pointer"
            title="Export Institutional Audit Trail as CSV"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Audit Trail CSV</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold font-sans transition-colors cursor-pointer"
            title="Clear All Institutional Audit Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, username, IP, or details..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 outline-none font-sans"
          />
        </div>

        <div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:border-indigo-600 outline-none font-sans"
          >
            {modules.map((m) => (
              <option key={m} value={m}>Module Filter: {m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Action Trigger</th>
                <th className="py-3.5 px-4 font-semibold">Module</th>
                <th className="py-3.5 px-4 font-semibold">Initiator</th>
                <th className="py-3.5 px-4 font-semibold">IP Address</th>
                <th className="py-3.5 px-4 font-semibold">Audit Event Details</th>
                <th className="py-3.5 px-4 font-semibold text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {log.created_at ? log.created_at.substring(0, 19).replace('T', ' ') : '2026-11-12 11:00'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold whitespace-nowrap font-sans">
                    @{log.username || 'System'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {log.ip_address || '127.0.0.1'}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-700 max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      log.status === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-sans text-xs">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

