import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  Briefcase, Users, Plus, Edit2, FileDown, CheckCircle2,
  Clock, X, RefreshCw, Eye, ExternalLink, Mail, Phone, Trash2
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
    department: 'Core Architecture',
    location: 'Bangalore, India / Hybrid',
    job_type: 'Full-Time',
    experience: '5+ Years',
    openings: 1,
    overview: '',
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

  const openCreateVacancyModal = () => {
    setEditingVacancyId(null);
    setVacancyForm({
      title: '',
      slug: '',
      department: 'Core Architecture',
      location: 'Bangalore, India / Hybrid',
      job_type: 'Full-Time',
      experience: '5+ Years',
      openings: 1,
      overview: '',
      status: 'Published'
    });
    setVacancyModal(true);
  };

  const openEditVacancyModal = (v) => {
    setEditingVacancyId(v.id);
    setVacancyForm({
      title: v.title || '',
      slug: v.slug || '',
      department: v.department || 'Core Architecture',
      location: v.location || 'Bangalore, India / Hybrid',
      job_type: v.job_type || 'Full-Time',
      experience: v.experience || '5+ Years',
      openings: v.openings || 1,
      overview: v.overview || '',
      status: v.status || 'Published'
    });
    setVacancyModal(true);
  };

  const handleSaveVacancy = async (e) => {
    e.preventDefault();
    try {
      if (editingVacancyId) {
        await adminApi.patchResource('careers/vacancies', editingVacancyId, vacancyForm);
        alert('Vacancy updated successfully.');
      } else {
        await adminApi.postResource('careers/vacancies', vacancyForm);
        alert('Vacancy published in MySQL.');
      }
      setVacancyModal(false);
      setEditingVacancyId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving vacancy. Please try again.');
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
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            MODULE 08 // HUMAN CAPITAL &amp; TALENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-mono font-bold uppercase text-slate-700 shadow-xs"
          >
            <FileDown className="w-4 h-4 text-indigo-600" />
            <span>Export Applications</span>
          </button>
          <button
            onClick={openCreateVacancyModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30"
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
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'applications'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
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
            <table className="w-full text-left text-xs font-mono">
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
                      <div className="text-[11px] text-indigo-600 font-mono">{app.email}</div>
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
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-bold">
                    {v.department}
                  </span>
                  <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {v.openings} Openings
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {v.title}
                </h3>

                <div className="text-xs font-mono text-slate-600 space-y-1">
                  <div>Location: {v.location}</div>
                  <div>Experience: {v.experience}</div>
                  <div>Type: {v.job_type}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono">
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
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-xs font-mono text-slate-900">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-900">
            <button
              onClick={() => setVacancyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">
              {editingVacancyId ? 'Edit Engineering Vacancy' : 'Publish Engineering Vacancy'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              {editingVacancyId ? 'Update vacancy details and requirements.' : 'Listed directly on the corporate Careers portal.'}
            </p>

            <form onSubmit={handleSaveVacancy} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">ROLE / TITLE</label>
                <input
                  type="text"
                  required
                  value={vacancyForm.title}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                  placeholder="e.g. Lead SRE / Cloud Architect"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">DEPARTMENT</label>
                  <input
                    type="text"
                    value={vacancyForm.department}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={vacancyForm.location}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">ROLE OVERVIEW</label>
                <textarea
                  rows="3"
                  value={vacancyForm.overview}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, overview: e.target.value })}
                  placeholder="Mandate and technical focus of this position..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVacancyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase shadow-sm shadow-indigo-600/30 transition-colors"
                >
                  {editingVacancyId ? 'Save Changes' : 'Publish Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

