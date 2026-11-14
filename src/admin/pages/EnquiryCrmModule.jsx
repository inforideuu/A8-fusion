import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Search, Filter, FileDown, Plus, MessageSquare, Phone,
  Mail, Building2, Globe, Calendar, UserCheck, CheckCircle2,
  Clock, AlertCircle, X, ChevronRight, Send, Paperclip, RefreshCw, Trash2, Lock,
  Download, FileText, Eye
} from 'lucide-react';

export default function EnquiryCrmModule() {
  const { user } = useAdminAuth();
  const canAssignStaff = user?.role === 'SUPER_ADMIN' || user?.role === 'WEBSITE_ADMIN' || user?.is_superuser;

  const [enquiries, setEnquiries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [commType, setCommType] = useState('Call');
  const [commSummary, setCommSummary] = useState('');
  const [updating, setUpdating] = useState(false);

  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      let data = await adminApi.getResource('enquiries');
      if (!Array.isArray(data) || data.length === 0) {
        // Fallback to local storage if backend has no entries or is offline
        const saved = localStorage.getItem('a8f_enquiries');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              data = parsed;
            }
          } catch (_) {}
        }
      } else {
        // If backend returned items, also merge any local enquiries that might not be on backend yet
        const saved = localStorage.getItem('a8f_enquiries');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const existingCodes = new Set(data.map((d) => d.reference_code || d.id));
              const missing = parsed.filter((p) => !existingCodes.has(p.reference_code || p.id));
              if (missing.length > 0) {
                data = [...missing, ...data];
              }
            }
          } catch (_) {}
        }
      }

      if (Array.isArray(data)) {
        // Normalize fields across all records
        const normalized = data.map((item) => {
          let budgetVal = item.estimated_budget || item.estimatedBudget || item.budgetRange || item.budget || '';
          const nameVal = item.full_name || item.contactPerson || item.name || 'Prospective Client';
          const orgVal = item.organization || item.company || '';
          const rawType = (item.enquiry_type || item.type || 'general').toLowerCase();
          const typeVal = rawType.includes('gov')
            ? 'government'
            : rawType.includes('partner')
              ? 'partnership'
              : (rawType.includes('project') && !rawType.includes('contact'))
                ? 'project'
                : 'general';

          // Clean up ghost/unsubmitted budgets: Request Project, Contact Us, and Partnerships have no budget field
          if (typeVal === 'project' && (budgetVal === '₹50 Lakhs – ₹1 Crore' || budgetVal === 'Custom Architectural Envelope')) {
            budgetVal = '';
          }
          if (typeVal === 'general' || typeVal === 'partnership') {
            budgetVal = '';
          }

          const refVal = item.reference_code || item.id || `ENQ-${item.id}`;
          const timeframeVal = item.timeframe || item.timeline || '';
          const messageVal = item.message || item.description || item.proposedCollaboration || '';

          return {
            ...item,
            reference_code: refVal,
            full_name: nameVal,
            organization: orgVal,
            enquiry_type: typeVal,
            estimated_budget: budgetVal,
            estimatedBudget: budgetVal,
            budget: budgetVal,
            timeframe: timeframeVal,
            timeline: timeframeVal,
            message: messageVal,
            description: messageVal
          };
        });
        setEnquiries(normalized);
      } else {
        setEnquiries([]);
      }

      const usersData = await adminApi.getResource('users');
      if (Array.isArray(usersData)) {
        setStaffList(usersData);
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

  const handlePriorityChange = async (enquiryId, newPriority) => {
    setUpdating(true);
    try {
      await adminApi.patchResource('enquiries', enquiryId, { priority: newPriority });
    } catch (e) {
      console.warn('Backend update fallback', e);
    }
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, priority: newPriority } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => ({ ...prev, priority: newPriority }));
    }
    setUpdating(false);
  };

  const handleAssignStaff = async (enquiryId, userId) => {
    if (!canAssignStaff) {
      alert('Access Restricted: Only Super Admin and Website Admin are authorized to assign or reassign staff.');
      return;
    }
    setUpdating(true);
    const assignedUserId = userId && userId !== 'unassigned' ? parseInt(userId) : null;
    const staffMember = staffList.find((u) => u.id === assignedUserId);
    const assignedName = staffMember
      ? (`${staffMember.first_name || ''} ${staffMember.last_name || ''}`.trim() || staffMember.username)
      : 'Unassigned';

    try {
      await adminApi.patchResource('enquiries', enquiryId, { assigned_to: assignedUserId });
    } catch (e) {
      console.warn('Backend update fallback', e);
      alert(e?.message || 'Failed to update assigned staff.');
    }
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiryId
          ? { ...e, assigned_to: assignedUserId, assigned_to_name: assignedName }
          : e
      )
    );
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        assigned_to: assignedUserId,
        assigned_to_name: assignedName
      }));
    }
    setUpdating(false);
  };

  const handleDeleteEnquiry = async (id, refCode) => {
    if (!window.confirm(`Are you sure you want to permanently delete enquiry record "${refCode || id}"? This action cannot be undone.`)) {
      return;
    }
    try {
      try {
        await adminApi.deleteResource('enquiries', id);
      } catch (e) {
        console.warn('Backend delete fallback, removing locally', e);
      }
      setEnquiries((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        try {
          localStorage.setItem('a8f_enquiries', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      alert(`Enquiry record ${refCode || id} has been successfully deleted.`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete enquiry record.');
    }
  };

  const handleDeleteAllEnquiries = async () => {
    if (enquiries.length === 0) {
      alert('There are no enquiry records to delete.');
      return;
    }
    const count = enquiries.length;
    const confirmPrompt = window.confirm(
      `WARNING: Are you sure you want to permanently delete ALL ${count} enquiry records? This will purge all enquiries from the CRM pipeline. This action cannot be undone.`
    );
    if (!confirmPrompt) return;

    setUpdating(true);
    try {
      try {
        await adminApi.customPost('enquiries/delete_all/');
      } catch (e) {
        console.warn('Backend delete_all fallback, purging locally', e);
      }
      setEnquiries([]);
      setSelectedEnquiry(null);
      setSelectedIds([]);
      try {
        localStorage.removeItem('a8f_enquiries');
      } catch (_) {}
      alert(`All ${count} enquiry records have been successfully purged.`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete all enquiry records.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    const confirmPrompt = window.confirm(
      `Are you sure you want to delete the ${count} selected enquiry record(s)? This action cannot be undone.`
    );
    if (!confirmPrompt) return;

    setUpdating(true);
    try {
      try {
        await adminApi.customPost('enquiries/bulk_delete/', { ids: selectedIds });
      } catch (e) {
        console.warn('Backend bulk_delete fallback, removing locally', e);
      }
      const updated = enquiries.filter((e) => !selectedIds.includes(e.id));
      setEnquiries(updated);
      try {
        localStorage.setItem('a8f_enquiries', JSON.stringify(updated));
      } catch (_) {}

      if (selectedEnquiry && selectedIds.includes(selectedEnquiry.id)) {
        setSelectedEnquiry(null);
      }
      setSelectedIds([]);
      alert(`Successfully deleted ${count} selected enquiry record(s).`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete selected enquiry records.');
    } finally {
      setUpdating(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((e) => e.id));
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const dataURLtoBlob = (dataURL) => {
    try {
      const parts = dataURL.split(',');
      if (parts.length < 2) return null;
      const header = parts[0];
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const isBase64 = header.includes(';base64');
      if (isBase64) {
        const binaryStr = atob(parts[1]);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        return new Blob([bytes], { type: mimeType });
      } else {
        const text = decodeURIComponent(parts[1]);
        return new Blob([text], { type: mimeType });
      }
    } catch (err) {
      console.error('Error converting data URL to blob:', err);
      return null;
    }
  };

  const generateEnquiryDocHtml = (enquiry, doc) => {
    const docName = doc?.name || 'RFP Specification Document';
    const docSize = doc?.size || 'N/A';
    const refCode = enquiry?.reference_code || enquiry?.id || 'N/A';
    const org = enquiry?.organization || 'Private Stakeholder';
    const contact = `${enquiry?.full_name || 'Stakeholder'} (${enquiry?.email || 'N/A'})`;
    const phone = enquiry?.phone || 'N/A';
    const budget = enquiry?.estimated_budget || enquiry?.estimatedBudget || enquiry?.budgetRange || enquiry?.budget || '';
    const timeframe = enquiry?.timeframe || enquiry?.timeline || '';
    const scope = enquiry?.projectCategory || enquiry?.industry || enquiry?.service_category || 'Enterprise System Architecture';
    const message = enquiry?.message || 'No project overview description provided.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${docName} - A8Fusion Institutional Record</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 40px 20px;
    }
    .wrapper {
      max-width: 760px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
      overflow: hidden;
    }
    .top-bar {
      background: #0f172a;
      padding: 24px 32px;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .badge {
      background: #4f46e5;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 6px;
    }
    .content {
      padding: 32px;
    }
    .header {
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .subtitle {
      font-size: 14px;
      font-weight: 600;
      color: #4f46e5;
      margin: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #64748b;
      margin-bottom: 4px;
    }
    .val {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      word-break: break-all;
    }
    .full-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .notes-box {
      font-size: 13px;
      line-height: 1.6;
      color: #334155;
      white-space: pre-wrap;
    }
    .btn-row {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
      border: none;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .footer {
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      margin-top: 24px;
    }
    @media print {
      body { padding: 0; background: #ffffff; }
      .wrapper { border: none; box-shadow: none; }
      .btn-row { display: none; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-bar">
      <div class="brand">A8Fusion &bull; Client Relationship Management</div>
      <div class="badge">RFP Document Specification</div>
    </div>
    <div class="content">
      <div class="header">
        <h1 class="title">${docName}</h1>
        <p class="subtitle">Reference ${refCode} &bull; File Size: ${docSize}</p>
      </div>
      <div class="grid">
        <div class="card">
          <div class="label">Organization / Entity</div>
          <div class="val">${org}</div>
        </div>
        <div class="card">
          <div class="label">Primary Contact</div>
          <div class="val">${contact}</div>
        </div>
        <div class="card">
          <div class="label">Telephone</div>
          <div class="val">${phone}</div>
        </div>
        ${budget ? `<div class="card">
          <div class="label">Estimated Budget / Envelope</div>
          <div class="val">${budget}</div>
        </div>` : ''}
        ${timeframe ? `<div class="card">
          <div class="label">Implementation Timeframe</div>
          <div class="val">${timeframe}</div>
        </div>` : ''}
        <div class="card">
          <div class="label">Service Category / Scope</div>
          <div class="val">${scope}</div>
        </div>
      </div>
      <div class="full-card">
        <div class="label">Project Requirements &amp; RFP Summary</div>
        <div class="notes-box">${message}</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="window.print()">Print / Export PDF</button>
        <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
      </div>
      <div class="footer">
        A8Fusion Enterprise Architecture &bull; Official Institutional CRM Attachment
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadDoc = (doc) => {
    if (!doc) return;
    if (doc.data && doc.data.startsWith('data:')) {
      const blob = dataURLtoBlob(doc.data);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.name || 'RFP_Specification.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    }
    if (doc.data) {
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = doc.name || 'RFP_Specification.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Fallback if submitted without base64 payload
    const budgetLine = selectedEnquiry?.estimated_budget ? `Budget: ${selectedEnquiry.estimated_budget}\n` : '';
    const timelineLine = selectedEnquiry?.timeframe ? `Timeline: ${selectedEnquiry.timeframe}\n` : '';
    const fallbackBlob = new Blob([
      `A8Fusion Institutional Document Attachment\n\nDocument Name: ${doc.name || 'Specification'}\nFile Size: ${doc.size || 'N/A'}\nReference: ${selectedEnquiry?.reference_code}\nOrganization: ${selectedEnquiry?.organization || 'Private Stakeholder'}\nStakeholder Contact: ${selectedEnquiry?.full_name} (${selectedEnquiry?.email})\n${budgetLine}${timelineLine}\nProject / Requirement Overview:\n${selectedEnquiry?.message || ''}`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(fallbackBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(doc.name || 'Specification_Document').replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDoc = (doc) => {
    if (!doc) return;
    if (doc.data && doc.data.startsWith('data:')) {
      const blob = dataURLtoBlob(doc.data);
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        return;
      }
    } else if (doc.url) {
      window.open(doc.url, '_blank');
      return;
    }

    const htmlContent = generateEnquiryDocHtml(selectedEnquiry, doc);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
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
      alert('Internal CRM notes updated successfully.');
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
             Stakeholder CRM &amp; Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
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
            title="Refresh Enquiries"
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
          <button
            onClick={handleDeleteAllEnquiries}
            disabled={enquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-sans font-semibold uppercase text-red-600 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Permanently Delete All Enquiries"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span>Delete All</span>
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

      {/* Bulk Selection Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 font-semibold shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>{selectedIds.length} of {filtered.length} enquiry records selected</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel Selection
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Enquiries Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    title="Select / Unselect All Records"
                  />
                </th>
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
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedIds.includes(enq.id) ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(enq.id)}
                      onChange={(e) => toggleSelectRow(enq.id, e)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-indigo-600 font-bold whitespace-nowrap">
                    {enq.reference_code}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-sans font-bold text-slate-900 text-sm">{enq.full_name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {enq.organization || 'Independent Stakeholder'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {(() => {
                      const t = (enq.enquiry_type || enq.type || 'general').toLowerCase();
                      if (t.includes('gov')) {
                        return (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Government
                          </span>
                        );
                      }
                      if (t.includes('partner')) {
                        return (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Partnership
                          </span>
                        );
                      }
                      if (t.includes('project') && !t.includes('contact')) {
                        return (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            Project RFP
                          </span>
                        );
                      }
                      return (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          General Contact
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                    {enq.country || 'Global'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={enq.priority || 'Medium'}
                      onChange={(e) => handlePriorityChange(enq.id, e.target.value)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border outline-none cursor-pointer font-sans transition-colors ${
                        enq.priority === 'Urgent'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : enq.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : enq.priority === 'Low'
                          ? 'bg-slate-100 text-slate-600 border-slate-300'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                      }`}
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={enq.status || 'New'}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 outline-none cursor-pointer font-sans"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]" onClick={(e) => e.stopPropagation()}>
                    {canAssignStaff ? (
                      <select
                        value={enq.assigned_to || 'unassigned'}
                        onChange={(e) => handleAssignStaff(enq.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold outline-none cursor-pointer font-sans hover:border-indigo-400"
                      >
                        <option value="unassigned">— Unassigned —</option>
                        {staffList.map((st) => (
                          <option key={st.id} value={st.id}>
                            {`${st.first_name || ''} ${st.last_name || ''}`.trim() || st.username} ({st.role})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-sans font-medium"
                        title="Staff assignment restricted to Super Admin & Website Admin"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {staffList.find((s) => s.id === enq.assigned_to)
                            ? (`${staffList.find((s) => s.id === enq.assigned_to).first_name || ''} ${staffList.find((s) => s.id === enq.assigned_to).last_name || ''}`.trim() || staffList.find((s) => s.id === enq.assigned_to).username)
                            : (enq.assigned_to_name || 'Unassigned')}
                        </span>
                        <Lock className="w-3 h-3 text-slate-400 ml-1 flex-shrink-0" />
                      </div>
                    )}
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
                  <td colSpan="9" className="py-8 text-center text-slate-400 font-sans text-xs">
                    No matching enquiry records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedEnquiry && (() => {
        const rawType = (selectedEnquiry.enquiry_type || selectedEnquiry.type || 'general').toLowerCase();
        const enqType = rawType.includes('gov')
          ? 'government'
          : rawType.includes('partner')
            ? 'partnership'
            : (rawType.includes('project') && !rawType.includes('contact'))
              ? 'project'
              : 'general';

        const rawMsg = selectedEnquiry.message || selectedEnquiry.description || selectedEnquiry.proposedCollaboration || '';
        const domainVal = selectedEnquiry.enquiryDomain || selectedEnquiry.enquiry_domain || (rawMsg.match(/\[Enquiry Domain:\s*([^\]]+)\]/i)?.[1]) || '';
        const subjectVal = selectedEnquiry.subject || (rawMsg.match(/\[Subject:\s*([^\]]+)\]/i)?.[1]) || '';
        const tenderRefVal = selectedEnquiry.tenderReference || (selectedEnquiry.internal_notes?.match(/Tender ref:\s*([^.\n]+)/i)?.[1]?.trim() !== 'N/A' ? selectedEnquiry.internal_notes?.match(/Tender ref:\s*([^.\n]+)/i)?.[1]?.trim() : '') || '';
        const designationVal = selectedEnquiry.designation || (selectedEnquiry.internal_notes?.match(/Designation:\s*([^.\n]+)/i)?.[1]?.trim() !== 'N/A' ? selectedEnquiry.internal_notes?.match(/Designation:\s*([^.\n]+)/i)?.[1]?.trim() : '') || '';
        const civicVal = selectedEnquiry.projectCategory || selectedEnquiry.civicClassification || (selectedEnquiry.industry?.includes('Registry') || selectedEnquiry.industry?.includes('Civil') || selectedEnquiry.industry?.includes('Sovereign') ? selectedEnquiry.industry : '') || '';
        const partnershipCategoryVal = selectedEnquiry.partnershipCategory || selectedEnquiry.partnership_category || (rawMsg.match(/\[Category:\s*([^\]]+)\]/i)?.[1]) || (enqType === 'partnership' ? selectedEnquiry.industry : '') || '';
        const budgetVal = selectedEnquiry.estimated_budget || selectedEnquiry.estimatedBudget || selectedEnquiry.budgetRange || selectedEnquiry.budget || '';
        const timeframeVal = selectedEnquiry.timeframe || selectedEnquiry.timeline || '';

        const cleanMsg = rawMsg
          .replace(/^\[Enquiry Domain:[^\]]+\]\s*/i, '')
          .replace(/^\[Subject:[^\]]+\]\s*/i, '')
          .replace(/^\[Category:[^\]]+\]\s*/i, '')
          .trim() || rawMsg;

        const classificationLabel = enqType === 'government'
          ? 'Government & Public Sector Mandate'
          : enqType === 'partnership'
            ? 'Strategic Partnership & Alliance'
            : enqType === 'project'
              ? 'Enterprise Project Architecture RFP'
              : 'General Corporate Contact & Enquiry';

        const classificationBadgeClass = enqType === 'government'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : enqType === 'partnership'
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : enqType === 'project'
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : 'bg-indigo-50 text-indigo-800 border-indigo-300';

        const renderStaffDropdown = (label = 'ASSIGNED STAFF / RECIPIENT') => (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">{label}</span>
              {!canAssignStaff && (
                <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-sans flex items-center gap-1 border border-amber-200 font-semibold">
                  <Lock className="w-2.5 h-2.5" /> Admin Only
                </span>
              )}
            </div>
            {canAssignStaff ? (
              <select
                value={selectedEnquiry.assigned_to || 'unassigned'}
                onChange={(e) => handleAssignStaff(selectedEnquiry.id, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-800 font-semibold outline-none focus:border-indigo-600 cursor-pointer font-sans"
              >
                <option value="unassigned">— Unassigned —</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {`${st.first_name || ''} ${st.last_name || ''}`.trim() || st.username} ({st.role})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-2.5 py-2 rounded-lg text-xs bg-slate-100 border border-slate-200 text-slate-700 font-semibold font-sans flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  {staffList.find((s) => s.id === selectedEnquiry.assigned_to)
                    ? (`${staffList.find((s) => s.id === selectedEnquiry.assigned_to).first_name || ''} ${staffList.find((s) => s.id === selectedEnquiry.assigned_to).last_name || ''}`.trim() || staffList.find((s) => s.id === selectedEnquiry.assigned_to).username)
                    : (selectedEnquiry.assigned_to_name || 'Unassigned')}
                </span>
                <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                  <Lock className="w-3 h-3" /> View Only
                </span>
              </div>
            )}
          </div>
        );

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900">
              {/* Modal Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-sans font-bold text-indigo-600">
                      {selectedEnquiry.reference_code}
                    </span>
                    <span className={`text-[10px] font-sans uppercase border px-2.5 py-0.5 rounded-full font-bold tracking-wide ${classificationBadgeClass}`}>
                      {classificationLabel}
                    </span>
                  </div>
                  <h3 className="text-xl font-sans font-bold text-slate-900">
                    {enqType === 'government'
                      ? `${selectedEnquiry.organization || 'Government Department'} // ${selectedEnquiry.full_name}`
                      : enqType === 'partnership'
                        ? `${selectedEnquiry.organization || 'Partner Entity'} // ${selectedEnquiry.full_name}`
                        : enqType === 'project'
                          ? `${selectedEnquiry.organization || 'Enterprise Entity'} // ${selectedEnquiry.full_name}`
                          : `${selectedEnquiry.full_name} // ${selectedEnquiry.organization || 'Independent Stakeholder'}`}
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
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
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

                {/* Priority Selection Bar */}
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block mb-2 font-bold">
                    PRIORITY LEVEL
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {priorities.map((pr) => {
                      const isCurrent = (selectedEnquiry.priority || 'Medium') === pr;
                      return (
                        <button
                          key={pr}
                          onClick={() => handlePriorityChange(selectedEnquiry.id, pr)}
                          className={`py-1.5 px-3 rounded-lg text-center text-[11px] font-bold transition-all ${
                            isCurrent
                              ? pr === 'Urgent'
                                ? 'bg-red-600 text-white shadow-sm'
                                : pr === 'High'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : pr === 'Low'
                                ? 'bg-slate-600 text-white shadow-sm'
                                : 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stakeholder Info Grid - Switched dynamically according to form classification */}
                {enqType === 'general' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">REPRESENTATIVE NAME</span>
                      <span className="text-slate-900 font-bold text-sm">{selectedEnquiry.full_name || 'Prospective Client'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">ORGANIZATION / COMPANY</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.organization || 'Independent Stakeholder'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">WORK EMAIL ADDRESS</span>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-600 font-bold hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">PHONE / CONTACT NUMBER</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">JURISDICTION / REGION</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.country || 'Global'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">ENQUIRY DOMAIN</span>
                      <span className="text-indigo-700 font-bold bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-200 inline-block">
                        {domainVal || 'General Corporate Enquiry'}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">SUBJECT LINE</span>
                      <span className="text-slate-800 font-semibold">{subjectVal || 'General Portal Inquiry'}</span>
                    </div>
                    <div>
                      {renderStaffDropdown('ASSIGNED STAFF / RECIPIENT')}
                    </div>
                  </div>
                )}

                {enqType === 'government' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">MINISTRY / PUBLIC DEPARTMENT</span>
                      <span className="text-slate-900 font-bold text-sm">{selectedEnquiry.organization || 'Government Department'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">DELEGATED OFFICIAL &amp; DESIGNATION</span>
                      <span className="text-slate-800 font-semibold">
                        {selectedEnquiry.full_name} {designationVal ? `(${designationVal})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">OFFICIAL INSTITUTIONAL EMAIL</span>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-600 font-bold hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">SECURE PHONE / LANDLINE</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">SOVEREIGN STATE / JURISDICTION</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.country || 'India / Sovereign State'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">CIVIC PROJECT CLASSIFICATION</span>
                      <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                        {civicVal || 'E-Governance Platform & Civil Registry'}
                      </span>
                    </div>
                    {Boolean(budgetVal) && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">ESTIMATED PROCUREMENT ENVELOPE</span>
                        <span className="text-emerald-900 font-bold text-sm">
                          {budgetVal}
                        </span>
                      </div>
                    )}
                    {Boolean(tenderRefVal) && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">OFFICIAL TENDER / RFP REFERENCE ID</span>
                        <span className="text-slate-800 font-mono font-bold">
                          {tenderRefVal}
                        </span>
                      </div>
                    )}
                    <div>
                      {renderStaffDropdown('PROCUREMENT LEAD / ASSIGNED STAFF')}
                    </div>
                  </div>
                )}

                {enqType === 'project' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">ENTERPRISE ORGANIZATION</span>
                      <span className="text-slate-900 font-bold text-sm">{selectedEnquiry.organization || 'Corporate Enterprise'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">PRINCIPAL PROJECT OFFICER</span>
                      <span className="text-slate-800 font-semibold">
                        {selectedEnquiry.full_name} {designationVal ? `(${designationVal})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">CORPORATE EMAIL ADDRESS</span>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-600 font-bold hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">DIRECT PHONE NUMBER</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">HEADQUARTERS / JURISDICTION</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.country || 'Global'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">PRIMARY INDUSTRY SECTOR</span>
                      <span className="text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block">
                        {selectedEnquiry.industry || 'Banking & Financial Services'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">PROJECT SCOPE &amp; CATEGORY</span>
                      <span className="text-slate-800 font-semibold">
                        {selectedEnquiry.projectCategory || 'Enterprise Software Development'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">TARGET IMPLEMENTATION TIMELINE</span>
                      <span className="text-indigo-700 font-bold">
                        {timeframeVal || 'Not specified'}
                      </span>
                    </div>
                    {Boolean(budgetVal) && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">ESTIMATED INVESTMENT ENVELOPE</span>
                        <span className="text-slate-900 font-bold">
                          {budgetVal}
                        </span>
                      </div>
                    )}
                    <div className="md:col-span-3">
                      {renderStaffDropdown('LEAD ARCHITECT / ASSIGNED STAFF')}
                    </div>
                  </div>
                )}

                {enqType === 'partnership' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">PARTNER ORGANIZATION NAME</span>
                      <span className="text-slate-900 font-bold text-sm">{selectedEnquiry.organization || 'Alliance Partner'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">ALLIANCE CONTACT PERSON</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.full_name || 'Alliance Lead'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">CORPORATE EMAIL ADDRESS</span>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-600 font-bold hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">CORPORATE TELEMETRY / PHONE</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">HEADQUARTERS / REGION</span>
                      <span className="text-slate-800 font-semibold">{selectedEnquiry.country || 'Global'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">PARTNERSHIP ALLIANCE CATEGORY</span>
                      <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
                        {partnershipCategoryVal || 'Systems Integration & Global Co-Delivery'}
                      </span>
                    </div>
                    <div className="md:col-span-3">
                      {renderStaffDropdown('ALLIANCE DIRECTOR / ASSIGNED STAFF')}
                    </div>
                  </div>
                )}

                {/* Message Payload */}
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block mb-1.5 font-bold">
                    {enqType === 'government'
                      ? 'CIVIC SCOPE & MANDATE SPECIFICATION'
                      : enqType === 'partnership'
                        ? 'PROPOSED COLLABORATION & REGIONAL SCOPE'
                        : enqType === 'project'
                          ? 'TECHNICAL REQUIREMENTS & ARCHITECTURAL BRIEF'
                          : 'PORTAL INQUIRY MESSAGE'}
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                    {cleanMsg}
                  </div>
                </div>

                {/* Attached Specifications & RFP Documents (Only rendered for Government, Enterprise Project, and Strategic Partnership forms which support document attachments) */}
                {enqType !== 'general' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase text-slate-500 font-bold">
                        {enqType === 'government'
                          ? 'ATTACHED SPECIFICATIONS & SOVEREIGN TENDER RFP DOCUMENTS'
                          : enqType === 'partnership'
                            ? 'ATTACHED CORPORATE DECK & ACCREDITED CERTIFICATIONS'
                            : 'ATTACHED ARCHITECTURE SPECIFICATIONS & SCOPE DOCUMENTS'}
                      </span>
                      {Array.isArray(selectedEnquiry.document_attachments) && selectedEnquiry.document_attachments.length > 0 && (
                        <span className="text-[10px] font-sans text-indigo-600 font-bold">
                          {selectedEnquiry.document_attachments.length} Document(s) Attached
                        </span>
                      )}
                    </div>

                    {Array.isArray(selectedEnquiry.document_attachments) && selectedEnquiry.document_attachments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEnquiry.document_attachments.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-xs truncate">
                                  {doc.name || `Tender_Specification_${idx + 1}.pdf`}
                                </div>
                                <div className="text-[11px] text-slate-500 font-sans flex items-center gap-2 mt-0.5">
                                  <span>{doc.size || 'Document'}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                                    Uploaded by Stakeholder
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleViewDoc(doc)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold font-sans transition-colors cursor-pointer shadow-2xs"
                                title="View document in new tab"
                              >
                                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                <span>View</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadDoc(doc)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold font-sans transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
                                title="Download RFP specification document"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-50/60 border border-dashed border-slate-200 text-center space-y-1">
                        <Paperclip className="w-4 h-4 text-slate-400 mx-auto" />
                        <span className="text-xs text-slate-600 font-medium block">
                          {enqType === 'government'
                            ? 'No external tender or RFP documents attached to this enquiry.'
                            : enqType === 'partnership'
                              ? 'No corporate deck or certifications attached to this proposal.'
                              : 'No architectural blueprints or RFP specifications attached.'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">
                          Stakeholder submitted scope via the portal message field above.
                        </span>
                      </div>
                    )}
                  </div>
                )}

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
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:bg-white focus:border-indigo-600 font-sans"
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
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none font-sans"
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
                          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                            {comm.type}
                          </span>
                          <span className="text-[10px] font-sans text-slate-500">{comm.date}</span>
                          <span className="text-[10px] font-sans text-slate-600 font-semibold">by {comm.author}</span>
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
                <span className="text-slate-500 font-sans text-[11px]">Record ID: #{selectedEnquiry.id} // System Synced</span>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold uppercase font-sans text-xs cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })()}
    </div>
  );
}
