import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  Briefcase, Users, Plus, Edit2, FileDown, CheckCircle2,
  Clock, X, RefreshCw, Eye, ExternalLink, Mail, Phone, Trash2,
  Download, FileText, Paperclip
} from 'lucide-react';

export default function CareersModule() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'vacancies'
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vacancyModal, setVacancyModal] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const [vacancyForm, setVacancyForm] = useState({
    title: '',
    slug: '',
    department: 'Architecture & Engineering',
    location: 'Bangalore, India / Hybrid',
    job_type: 'Full-Time',
    experience: '5+ Years',
    openings: 1,
    overview: '',
    requirements: '',
    responsibilities: '',
    status: 'Published'
  });

  const appStatuses = ['New', 'Screening', 'Interview', 'Offer', 'Rejected'];

  const loadData = async () => {
    setLoading(true);
    try {
      const v = await adminApi.getResource('careers/vacancies');
      const a = await adminApi.getResource('careers/applications');
      setVacancies(Array.isArray(v) ? v : []);
      setApplications(Array.isArray(a) ? a : []);
    } catch (e) {
      console.error(e);
      setVacancies([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await adminApi.patchResource('careers/applications', appId, { status: newStatus });
    } catch (e) {
      console.warn('Updated locally', e);
    }
    setApplications(applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleExportApplications = () => {
    window.open('http://127.0.0.1:8000/api/careers/applications/export_csv/', '_blank');
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

  const generateDossierHtml = (app) => {
    const candidateName = app?.candidate_name || 'Candidate';
    const vacancyTitle = app?.vacancy_title || 'General Engineering Position';
    const email = app?.email || 'N/A';
    const phone = app?.phone || 'N/A';
    const exp = app?.experience_years || 'N/A';
    const company = app?.current_company || 'N/A';
    const status = app?.status || 'Active Application';
    const appliedAt = app?.applied_at ? new Date(app.applied_at).toLocaleString() : 'N/A';
    const notes = app?.internal_notes || 'No screening notes recorded.';
    const linkedin = app?.linkedin_url || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${candidateName} - Candidate Dossier</title>
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
    .candidate-name {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .vacancy-title {
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
      <div class="brand">A8Fusion &bull; Human Capital Management</div>
      <div class="badge">Candidate Dossier</div>
    </div>
    <div class="content">
      <div class="header">
        <h1 class="candidate-name">${candidateName}</h1>
        <p class="vacancy-title">${vacancyTitle}</p>
      </div>
      <div class="grid">
        <div class="card">
          <div class="label">Candidate Name</div>
          <div class="val">${candidateName}</div>
        </div>
        <div class="card">
          <div class="label">Applied Position</div>
          <div class="val">${vacancyTitle}</div>
        </div>
        <div class="card">
          <div class="label">Email Address</div>
          <div class="val">${email}</div>
        </div>
        <div class="card">
          <div class="label">Phone Number</div>
          <div class="val">${phone}</div>
        </div>
        <div class="card">
          <div class="label">Experience Level</div>
          <div class="val">${exp}</div>
        </div>
        <div class="card">
          <div class="label">Current / Former Organization</div>
          <div class="val">${company}</div>
        </div>
        <div class="card">
          <div class="label">Current Status</div>
          <div class="val">${status}</div>
        </div>
        <div class="card">
          <div class="label">Submission Timestamp</div>
          <div class="val">${appliedAt}</div>
        </div>
      </div>
      ${linkedin ? `
      <div class="full-card">
        <div class="label">LinkedIn Verified Profile</div>
        <div class="val"><a href="${linkedin}" target="_blank" style="color: #4f46e5; text-decoration: underline;">${linkedin}</a></div>
      </div>` : ''}
      <div class="full-card">
        <div class="label">Internal Interview & Screening Notes</div>
        <div class="notes-box">${notes}</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="window.print()">Print / Export PDF</button>
        <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
      </div>
      <div class="footer">
        A8Fusion Enterprise Architecture &bull; Official Human Resources Dossier
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadFile = (fileData, fileName) => {
    if (!fileData) {
      const fallbackBlob = new Blob([
        `A8Fusion Candidate Dossier\n\nCandidate Name: ${selectedApp?.candidate_name}\nPosition: ${selectedApp?.vacancy_title}\nEmail: ${selectedApp?.email}\nPhone: ${selectedApp?.phone}\nExperience: ${selectedApp?.experience_years}\nCurrent Company: ${selectedApp?.current_company}\nLinkedIn: ${selectedApp?.linkedin_url}\nApplied At: ${selectedApp?.applied_at}\n\nInternal Notes:\n${selectedApp?.internal_notes || 'N/A'}`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(fallbackBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(selectedApp?.candidate_name || 'Candidate').replace(/\s+/g, '_')}_Dossier.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (fileData.startsWith('data:')) {
      const blob = dataURLtoBlob(fileData);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `${(selectedApp?.candidate_name || 'Candidate').replace(/\s+/g, '_')}_CV.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    }

    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName || `${(selectedApp?.candidate_name || 'Candidate').replace(/\s+/g, '_')}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (fileData, fileName) => {
    if (!fileData) {
      const dossierHtml = generateDossierHtml(selectedApp);
      const blob = new Blob([dossierHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      return;
    }

    if (fileData.startsWith('data:')) {
      const blob = dataURLtoBlob(fileData);
      if (blob) {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        return;
      }
    }

    if (fileData.startsWith('http://') || fileData.startsWith('https://') || fileData.startsWith('/')) {
      window.open(fileData, '_blank');
      return;
    }

    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const openCreateVacancyModal = () => {
    setEditingVacancyId(null);
    setVacancyForm({
      title: '',
      slug: '',
      department: 'Architecture & Engineering',
      location: 'Singapore / Hybrid',
      job_type: 'Full-Time',
      experience: '5+ Years',
      openings: 1,
      overview: '',
      requirements: '',
      responsibilities: '',
      status: 'Published'
    });
    setVacancyModal(true);
  };

  const openEditVacancyModal = (v) => {
    setEditingVacancyId(v.id);
    setVacancyForm({
      title: v.title || '',
      slug: v.slug || '',
      department: v.department || 'Architecture & Engineering',
      location: v.location || 'Bangalore, India / Hybrid',
      job_type: v.job_type || 'Full-Time',
      experience: v.experience || '5+ Years',
      openings: v.openings || 1,
      overview: v.overview || '',
      requirements: Array.isArray(v.requirements) ? v.requirements.join('\n') : (v.requirements || ''),
      responsibilities: Array.isArray(v.responsibilities) ? v.responsibilities.join('\n') : (v.responsibilities || ''),
      status: v.status || 'Published'
    });
    setVacancyModal(true);
  };

  const handleSaveVacancy = async (e) => {
    e.preventDefault();
    try {
      const reqsArray = typeof vacancyForm.requirements === 'string'
        ? vacancyForm.requirements.split('\n').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(vacancyForm.requirements) ? vacancyForm.requirements : []);

      const respArray = typeof vacancyForm.responsibilities === 'string'
        ? vacancyForm.responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(vacancyForm.responsibilities) ? vacancyForm.responsibilities : []);

      const payload = {
        ...vacancyForm,
        openings: parseInt(vacancyForm.openings, 10) || 1,
        requirements: reqsArray,
        responsibilities: respArray
      };

      if (!payload.slug && payload.title) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (editingVacancyId) {
        await adminApi.patchResource('careers/vacancies', editingVacancyId, payload);
        alert('Vacancy updated successfully.');
      } else {
        await adminApi.postResource('careers/vacancies', payload);
        alert('Vacancy published successfully.');
      }
      setVacancyModal(false);
      setEditingVacancyId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving vacancy. Please check inputs and try again.');
    }
  };

  const handleDeleteVacancy = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete vacancy "${title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteResource('careers/vacancies', id);
      setVacancies(prev => prev.filter(v => v.id !== id));
      alert(`Vacancy "${title}" has been deleted.`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete vacancy.');
    }
  };

  const handleDeleteApplication = async (id, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete application for "${candidateName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteResource('careers/applications', id);
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
      alert(`Application for "${candidateName}" has been deleted.`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete application.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-indigo-600 block mb-1">
             HUMAN CAPITAL &amp; TALENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
            Careers &amp; Institutional Recruitment
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Publish engineering roles, review global applicants, download dossiers, and manage recruiter pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportApplications}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-sans font-bold uppercase text-slate-700 shadow-xs"
          >
            <FileDown className="w-4 h-4 text-indigo-600" />
            <span>Export Applications</span>
          </button>
          <button
            onClick={openCreateVacancyModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-sans font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Post Vacancy</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'applications'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'vacancies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Open Vacancies ({vacancies.length})
        </button>
      </div>

      {/* Tab 1: Applications Table */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3.5 px-4 font-semibold">Candidate</th>
                  <th className="py-3.5 px-4 font-semibold">Target Position</th>
                  <th className="py-3.5 px-4 font-semibold">Experience</th>
                  <th className="py-3.5 px-4 font-semibold">Current Employer</th>
                  <th className="py-3.5 px-4 font-semibold">Hiring Stage</th>
                  <th className="py-3.5 px-4 font-semibold">Recruiter</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-bold text-slate-900 text-sm">{app.candidate_name}</div>
                      <div className="text-[11px] text-indigo-600 font-sans">{app.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {app.vacancy_title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {app.experience_years}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-sans">
                      {app.current_company || 'Independent'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {app.recruiter_name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] font-bold border border-indigo-200"
                        >
                          View Dossier
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteApplication(app.id, app.candidate_name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Vacancies List */}
      {activeTab === 'vacancies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vacancies.map((v) => (
            <div
              key={v.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-bold">
                    {v.department}
                  </span>
                  <span className="text-xs font-sans text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {v.openings} Openings
                  </span>
                </div>

                <h3 className="text-lg font-sans font-bold text-slate-900">
                  {v.title}
                </h3>

                <div className="text-xs font-sans text-slate-600 space-y-1">
                  <div>Location: {v.location}</div>
                  <div>Experience: {v.experience}</div>
                  <div>Type: {v.job_type}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans border ${
                  v.status === 'Published'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : v.status === 'Draft'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {v.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href="/careers"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    title="View on Careers Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => openEditVacancyModal(v)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                    title="Edit Vacancy"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVacancy(v.id, v.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Vacancy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CANDIDATE DOSSIER MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-xs font-sans text-slate-900">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-sans font-bold text-slate-900 mb-1">
              Applicant Dossier: {selectedApp.candidate_name}
            </h3>
            <p className="text-xs text-indigo-600 font-semibold mb-5">
              Role: {selectedApp.vacancy_title}
            </p>

            <div className="space-y-4">
              {/* Stage selector */}
              <div>
                <span className="text-[10px] uppercase text-slate-600 block mb-1.5 font-bold">
                  RECRUITMENT PIPELINE STATUS
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {appStatuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedApp.id, st)}
                      className={`py-2 px-2 rounded-lg text-center text-[10px] font-bold transition-colors ${
                        selectedApp.status === st
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">EMAIL</span>
                  <span className="text-slate-900">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">PHONE</span>
                  <span className="text-slate-900">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">CURRENT EMPLOYER</span>
                  <span className="text-slate-900 font-sans">{selectedApp.current_company}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-semibold">EXPERIENCE</span>
                  <span className="text-slate-900">{selectedApp.experience_years}</span>
                </div>
              </div>

              {/* Curriculum Vitae / Resume Dossier Section */}
              <div>
                <span className="text-[10px] uppercase text-slate-600 block mb-1.5 font-bold">
                  CANDIDATE CURRICULUM VITAE &amp; RESUME DOCUMENT
                </span>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {selectedApp.resume_name || `${(selectedApp.candidate_name || 'Candidate').replace(/\s+/g, '_')}_CV.pdf`}
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans flex items-center gap-2 mt-0.5">
                        <span>{selectedApp.resume_size || 'Application Dossier'}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                          {selectedApp.resume_url ? 'Document Verified' : 'Dossier Available'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewFile(selectedApp.resume_url, selectedApp.resume_name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold font-sans transition-colors cursor-pointer shadow-2xs"
                      title={selectedApp.resume_url ? "View resume document in new tab" : "View candidate dossier in new tab"}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadFile(selectedApp.resume_url, selectedApp.resume_name)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold font-sans transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
                      title="Download candidate resume/dossier"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CV</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-[10px] uppercase text-slate-600 block mb-1 font-bold">
                  INTERNAL INTERVIEW &amp; SCREENING NOTES
                </span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans">
                  {selectedApp.internal_notes || 'No evaluation notes recorded yet.'}
                </div>
              </div>

              {selectedApp.linkedin_url && (
                <div>
                  <a
                    href={selectedApp.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline"
                  >
                    <span>View LinkedIn Verified Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDeleteApplication(selectedApp.id, selectedApp.candidate_name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold font-sans transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Application</span>
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST VACANCY MODAL */}
      {vacancyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-slate-900 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setVacancyModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-sans font-bold text-slate-900 mb-1">
              {editingVacancyId ? 'Edit Engineering Vacancy' : 'Publish Engineering Vacancy'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              {editingVacancyId ? 'Update requisition details, competencies, and publication status.' : 'Instantly published to Current Technical Opportunities on /careers.'}
            </p>

            <form onSubmit={handleSaveVacancy} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">ROLE / POSITION TITLE *</label>
                <input
                  type="text"
                  required
                  value={vacancyForm.title}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                  placeholder="e.g. Lead Enterprise Systems Architect"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">PRACTICE / DEPARTMENT *</label>
                  <input
                    type="text"
                    required
                    value={vacancyForm.department}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, department: e.target.value })}
                    placeholder="e.g. Architecture & Engineering"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">GEOGRAPHIC LOCATION *</label>
                  <input
                    type="text"
                    required
                    value={vacancyForm.location}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, location: e.target.value })}
                    placeholder="e.g. Singapore / Hybrid"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">JOB TYPE</label>
                  <select
                    value={vacancyForm.job_type}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, job_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Full-Time Executive">Full-Time Executive</option>
                    <option value="Contract / Advisor">Contract / Advisor</option>
                    <option value="Fellowship / Research">Fellowship / Research</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">MIN. EXPERIENCE</label>
                  <input
                    type="text"
                    value={vacancyForm.experience}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, experience: e.target.value })}
                    placeholder="e.g. 8+ Years"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">OPEN HEADCOUNT</label>
                  <input
                    type="number"
                    min="1"
                    value={vacancyForm.openings}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, openings: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">PUBLICATION STATUS</label>
                <div className="flex items-center gap-4 py-1">
                  {['Published', 'Draft', 'Closed'].map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer text-xs font-sans">
                      <input
                        type="radio"
                        name="vac_status"
                        value={st}
                        checked={vacancyForm.status === st}
                        onChange={(e) => setVacancyForm({ ...vacancyForm, status: e.target.value })}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`font-semibold ${st === 'Published' ? 'text-emerald-700' : st === 'Draft' ? 'text-amber-700' : 'text-slate-500'}`}>
                        {st}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">ROLE OVERVIEW &amp; MANDATE</label>
                <textarea
                  rows="3"
                  value={vacancyForm.overview}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, overview: e.target.value })}
                  placeholder="Seeking an exceptional systems architect to oversee..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  CORE REQUIREMENTS / COMPETENCY MATRIX (One per line)
                </label>
                <textarea
                  rows="3"
                  value={vacancyForm.requirements}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, requirements: e.target.value })}
                  placeholder="Demonstrated track record designing large-scale distributed systems&#10;Deep mastery of Kubernetes and Kafka&#10;Previous experience in sovereign banking or defense"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  CORE RESPONSIBILITIES (One per line)
                </label>
                <textarea
                  rows="3"
                  value={vacancyForm.responsibilities}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, responsibilities: e.target.value })}
                  placeholder="Design fault-tolerant microservice architectures&#10;Author formal Architecture Decision Records (ADRs)&#10;Guide cross-functional engineering squads"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVacancyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase shadow-sm shadow-indigo-600/30 transition-colors cursor-pointer"
                >
                  {editingVacancyId ? 'Save Changes' : 'Publish Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

