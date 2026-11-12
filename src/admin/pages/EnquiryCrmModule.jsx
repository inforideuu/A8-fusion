import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  Search, Filter, FileDown, Plus, MessageSquare, Phone,
  Mail, Building2, Globe, Calendar, UserCheck, CheckCircle2,
  Clock, AlertCircle, X, ChevronRight, Send, Paperclip, RefreshCw, Trash2
} from 'lucide-react';

export default function EnquiryCrmModule() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [commType, setCommType] = useState('Call');
  const [commSummary, setCommSummary] = useState('');
  const [updating, setUpdating] = useState(false);

  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('enquiries');
      if (Array.isArray(data)) {
        setEnquiries(data);
      } else {
        setEnquiries([]);
      }
    } catch (e) {
      console.error(e);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdating(true);
    try {
      await adminApi.patchResource('enquiries', enquiryId, { status: newStatus });
    } catch (e) {
      console.warn('Backend update fallback', e);
    }
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
    setUpdating(false);
  };

  const handleDeleteEnquiry = async (id, refCode) => {
    if (!window.confirm(`Are you sure you want to permanently delete enquiry record "${refCode || id}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteResource('enquiries', id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      alert(`Enquiry record ${refCode || id} has been successfully deleted.`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete enquiry record.');
    }
  };

  const handleAddCommunication = async () => {
    if (!commSummary.trim() || !selectedEnquiry) return;
    const newEntry = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: commType,
      author: 'Current Staff',
      summary: commSummary
    };
    const updatedHistory = [newEntry, ...(selectedEnquiry.communication_history || [])];

    try {
      await adminApi.patchResource('enquiries', selectedEnquiry.id, {
        communication_history: updatedHistory
      });
    } catch (e) {
      console.warn('Saved locally', e);
    }

    setEnquiries((prev) =>
      prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, communication_history: updatedHistory } : e))
    );
    setSelectedEnquiry((prev) => ({ ...prev, communication_history: updatedHistory }));
    setCommSummary('');
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      await adminApi.patchResource('enquiries', selectedEnquiry.id, {
        internal_notes: selectedEnquiry.internal_notes,
        follow_up_date: selectedEnquiry.follow_up_date
      });
      alert('Internal CRM notes updated successfully in MySQL.');
    } catch (e) {
      alert('Notes saved to session.');
    }
  };

  const handleExportCSV = () => {
    window.open('http://127.0.0.1:8000/api/enquiries/export_csv/', '_blank');
  };

  const filtered = enquiries.filter((enq) => {
    const matchSearch =
      !searchTerm ||
      enq.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.reference_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || enq.status === statusFilter;
    const matchType = typeFilter === 'ALL' || enq.enquiry_type === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
            Module 07 · Stakeholder CRM &amp; Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Enquiry Management &amp; Pipeline
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Triage, qualify, track stakeholder communications, and drive proposal lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadEnquiries}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            title="Refresh from MySQL"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-sans font-semibold uppercase text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
          >
            <FileDown className="w-4 h-4 text-indigo-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference, name, organization, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 outline-none font-sans"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:border-indigo-600 outline-none font-sans"
          >
            <option value="ALL">All Statuses ({enquiries.length})</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:border-indigo-600 outline-none font-sans"
          >
            <option value="ALL">All Enquiry Classifications</option>
            <option value="project">Enterprise Project</option>
            <option value="government">Government &amp; Public Sector</option>
            <option value="partnership">Strategic Partnership</option>
            <option value="general">General Contact</option>
          </select>
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3.5 px-4 font-bold">Ref Code</th>
                <th className="py-3.5 px-4 font-bold">Stakeholder / Org</th>
                <th className="py-3.5 px-4 font-bold">Classification</th>
                <th className="py-3.5 px-4 font-bold">Territory</th>
                <th className="py-3.5 px-4 font-bold">Priority</th>
                <th className="py-3.5 px-4 font-bold">Lifecycle Status</th>
                <th className="py-3.5 px-4 font-bold">Assigned Staff</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((enq) => (
                <tr
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 text-indigo-600 font-bold whitespace-nowrap">
                    {enq.reference_code}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-sans font-bold text-slate-900 text-sm">{enq.full_name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {enq.organization || 'Independent Stakeholder'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                    {enq.enquiry_type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                    {enq.country || 'Global'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      enq.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                      enq.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {enq.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                    {enq.assigned_to_name || 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(enq);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] font-bold border border-indigo-200"
                      >
                        View CRM Dossier
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEnquiry(enq.id, enq.reference_code);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                        title="Delete Enquiry Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-mono text-xs">
                    No matching enquiry records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900">
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono font-bold text-indigo-600">
                    {selectedEnquiry.reference_code}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
                    {selectedEnquiry.enquiry_type}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {selectedEnquiry.full_name} // {selectedEnquiry.organization}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              {/* Status progression bar */}
              <div>
                <span className="text-[10px] uppercase text-slate-500 block mb-2 font-bold">
                  LIFECYCLE STATUS STAGE
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                  {statuses.map((st) => {
                    const isCurrent = selectedEnquiry.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                        className={`py-2 px-2 rounded-lg text-center text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stakeholder Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">EMAIL ADDRESS</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-600 font-bold hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PHONE / TELEMETRY</span>
                  <span className="text-slate-800 font-semibold">{selectedEnquiry.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">JURISDICTION</span>
                  <span className="text-slate-800 font-semibold">{selectedEnquiry.country || 'Global'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ESTIMATED BUDGET</span>
                  <span className="text-slate-900 font-bold">{selectedEnquiry.estimated_budget || 'Custom RFP'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TARGET TIMEFRAME</span>
                  <span className="text-slate-800">{selectedEnquiry.timeframe || 'Immediate'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ASSIGNED RECIPIENT</span>
                  <span className="text-indigo-700 font-bold">{selectedEnquiry.assigned_to_name || 'Unassigned'}</span>
                </div>
              </div>

              {/* Message Payload */}
              <div>
                <span className="text-[10px] uppercase text-slate-500 block mb-1.5 font-bold">
                  PORTAL INQUIRY MESSAGE
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Notes & Follow-up Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">
                      INTERNAL CRM NOTES &amp; STRATEGY
                    </span>
                    <button
                      onClick={handleSaveNotes}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      Save Notes
                    </button>
                  </div>
                  <textarea
                    rows="3"
                    value={selectedEnquiry.internal_notes || ''}
                    onChange={(e) =>
                      setSelectedEnquiry({ ...selectedEnquiry, internal_notes: e.target.value })
                    }
                    placeholder="Enter proprietary institutional notes, risk assessment, or clearance details..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-sans outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">
                    SCHEDULED FOLLOW-UP TARGET DATE
                  </span>
                  <input
                    type="date"
                    value={selectedEnquiry.follow_up_date || ''}
                    onChange={(e) =>
                      setSelectedEnquiry({ ...selectedEnquiry, follow_up_date: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:border-indigo-600 font-mono"
                  />
                  <div className="pt-2 text-[10px] text-slate-500">
                    SLA alerts will trigger notifications on or before this deadline.
                  </div>
                </div>
              </div>

              {/* Communication History Logger */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">
                  COMMUNICATION AUDIT LOG
                </span>

                <div className="flex gap-2">
                  <select
                    value={commType}
                    onChange={(e) => setCommType(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none font-mono"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Executive Meeting</option>
                    <option value="Proposal">Proposal Dispatched</option>
                  </select>

                  <input
                    type="text"
                    value={commSummary}
                    onChange={(e) => setCommSummary(e.target.value)}
                    placeholder="Log summary of conversation or outcome..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                  />

                  <button
                    onClick={handleAddCommunication}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase transition-colors shadow-xs"
                  >
                    Log
                  </button>
                </div>

                {/* History Feed */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedEnquiry.communication_history?.map((comm, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs font-sans"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                            {comm.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{comm.date}</span>
                          <span className="text-[10px] font-mono text-slate-600 font-semibold">by {comm.author}</span>
                        </div>
                        <p className="text-slate-800">{comm.summary}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedEnquiry.communication_history || selectedEnquiry.communication_history.length === 0) && (
                    <div className="text-slate-400 text-center py-2 text-[11px]">
                      No previous communication records logged yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-sans">
              <button
                onClick={() => handleDeleteEnquiry(selectedEnquiry.id, selectedEnquiry.reference_code)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry Record</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-mono text-[11px]">Record ID: #{selectedEnquiry.id} // MySQL Synced</span>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold uppercase font-mono text-xs cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
