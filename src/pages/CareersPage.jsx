import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { careersData as defaultCareersData, cultureValues as defaultCultureValues } from '../data/careersData';
import { useEnquiry } from '../context/EnquiryContext';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  Plus,
  Sparkles
} from 'lucide-react';
import {
  LiveEditorToolbar,
  CardActionOverlay,
  AddCardButton,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../admin/components/LiveEditorControls';

const DEFAULT_PAGE_HEADER = {
  badge: 'Global Talent Acquisition',
  title: 'Engineering Careers at A8Fusion',
  subtitle: 'We recruit exceptional systems architects, distributed backend engineers, and sovereign AI researchers dedicated to uncompromising technical rigor.',
  bgImage: '/career.png',
  primaryCtaText: 'View Current Openings',
  primaryCtaLink: '#openings',
  secondaryCtaText: 'Review Governance Philosophy',
  secondaryCtaLink: '/company/our-approach'
};

const DEFAULT_CULTURE_HEADER = {
  tag: 'Engineering Ethos',
  title: 'Our Culture & Operating Standards',
  desc: 'We cultivate a culture of deep intellectual honesty, architectural autonomy, and absolute dedication to system stability.'
};

export default function CareersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submitApplication } = useEnquiry();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [cultureHeader, setCultureHeader] = useState(DEFAULT_CULTURE_HEADER);
  const [cultureList, setCultureList] = useState(defaultCultureValues);
  const [jobsList, setJobsList] = useState(defaultCareersData);

  // Application Form States
  const [selectedJob, setSelectedJob] = useState(null);
  const [submittedAppId, setSubmittedAppId] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    linkedin: '',
    coverLetter: '',
    consent: false
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const departments = ['All', 'Architecture & Engineering', 'Artificial Intelligence Practice', 'Enterprise Solutions', 'Cybersecurity Practice'];

  const filteredJobs = jobsList.filter(job => 
    departmentFilter === 'All' || job.department === departmentFilter
  );

  // URL query check for live_edit
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('live_edit') === 'true') {
      setEditMode(true);
    }
  }, [location.search]);

  // Load Content from Backend / LocalStorage
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=careers');
        if (res.ok) {
          const json = await res.json();
          if (json.live_data && Object.keys(json.live_data).length > 0) {
            applyLoadedData(json.live_data);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend unavailable, checking localStorage...', e);
      }

      try {
        const local = localStorage.getItem('a8_live_careers_content');
        if (local) {
          const parsed = JSON.parse(local);
          applyLoadedData(parsed);
        }
      } catch (err) {
        console.error('Error loading local data', err);
      }
    };

    loadContent();
  }, []);

  const applyLoadedData = (data) => {
    if (data.pageHeader) setPageHeader(data.pageHeader);
    if (data.cultureHeader) setCultureHeader(data.cultureHeader);
    if (Array.isArray(data.jobsList) && data.jobsList.length > 0) setJobsList(data.jobsList);
    if (Array.isArray(data.cultureList) && data.cultureList.length > 0) setCultureList(data.cultureList);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      cultureHeader,
      jobsList,
      cultureList,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_careers_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'careers',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Careers opportunities and culture standards saved and synchronized with MySQL!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Careers requisitions and values back to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setCultureHeader(DEFAULT_CULTURE_HEADER);
      setJobsList(defaultCareersData);
      setCultureList(defaultCultureValues);
      localStorage.removeItem('a8_live_careers_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/careers', { replace: true });
  };

  // Modal Handlers
  const openModal = (type, data = {}, index = null) => {
    setModalType(type);
    setModalData(data);
    setEditingIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalData({});
    setEditingIndex(null);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    markDirty();

    if (modalType === 'header') {
      setPageHeader({ ...modalData });
    } else if (modalType === 'culture_header') {
      setCultureHeader({ ...modalData });
    } else if (modalType === 'culture_edit') {
      const updated = [...cultureList];
      updated[editingIndex] = { ...modalData };
      setCultureList(updated);
    } else if (modalType === 'culture_add') {
      const newPrinciple = {
        title: modalData.title || 'New Operating Standard',
        desc: modalData.desc || 'Core architectural or cultural principle guiding enterprise engineering.'
      };
      setCultureList([...cultureList, newPrinciple]);
    } else if (modalType === 'job_edit') {
      const updated = [...jobsList];
      const reqsArray = typeof modalData.requirements === 'string'
        ? modalData.requirements.split('\n').filter(r => r.trim())
        : (modalData.requirements || []);
      updated[editingIndex] = {
        ...modalData,
        requirements: reqsArray
      };
      setJobsList(updated);
    } else if (modalType === 'job_add') {
      const reqsArray = typeof modalData.requirements === 'string'
        ? modalData.requirements.split('\n').filter(r => r.trim())
        : (modalData.requirements || ['8+ years distributed systems architecture', 'Advanced degree in Computer Science']);
      const newJob = {
        id: `job-${Date.now()}`,
        title: modalData.title || 'Principal Systems Architect',
        department: modalData.department || 'Architecture & Engineering',
        location: modalData.location || 'Bangalore, India / Hybrid',
        experience: modalData.experience || '8+ Years',
        overview: modalData.overview || 'Lead core transactional backends and distributed architectures.',
        requirements: reqsArray
      };
      setJobsList([...jobsList, newJob]);
    }

    closeModal();
  };

  const handleDeleteCulture = (idx) => {
    if (window.confirm(`Delete culture principle "${cultureList[idx].title}"?`)) {
      const updated = cultureList.filter((_, i) => i !== idx);
      setCultureList(updated);
      markDirty();
    }
  };

  const handleDeleteJob = (idx) => {
    if (window.confirm(`Delete requisition "${jobsList[idx].title}"?`)) {
      const updated = jobsList.filter((_, i) => i !== idx);
      setJobsList(updated);
      markDirty();
    }
  };

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setFormData(prev => ({
      ...prev,
      position: job.title
    }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm the consent checkbox.');
      return;
    }
    const id = submitApplication({
      ...formData,
      jobId: selectedJob?.id || 'open-req',
      jobTitle: formData.position
    });
    setSubmittedAppId(id);
    setSelectedJob(null);
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Careers & Talent (/careers)"
          isDirty={isDirty}
          saving={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onReset={handleReset}
          onSave={handleSaveAll}
          onExit={handleExit}
        />
      )}

      {/* Hero Header with in-context live editing */}
      <div className="relative group">
        {isLive && (
          <div className="absolute top-6 right-6 z-40 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-indigo-200 shadow-lg flex items-center gap-2">
            <SectionHeaderEditButton
              onClick={() => openModal('header', { ...pageHeader })}
              label="Edit Hero Header"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage}
          breadcrumbs={[
            { label: 'Company', link: '/company/about' },
            { label: 'Careers' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Culture & Engineering Values */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative">
            {isLive && (
              <div className="mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('culture_header', { ...cultureHeader })}
                  label="Edit Culture Heading"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {cultureHeader.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {cultureHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {cultureHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureList.map((val, i) => (
              <div key={val.id || i} className="relative bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3 card-hover-culture group transition-all">
                {isLive && (
                  <CardActionOverlay
                    title={val.title}
                    onEdit={() => openModal('culture_edit', { ...val }, i)}
                    onDelete={() => handleDeleteCulture(i)}
                  />
                )}
                <span className="text-xs font-mono font-bold text-indigo-600">PRINCIPLE 0{i+1}</span>
                <h3 className="text-base font-serif font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{val.desc}</p>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('culture_add', {})}
                label="Add Operating Principle"
                subtitle="Add an engineering standard or culture tenet"
              />
            )}
          </div>
        </div>
      </section>

      {/* Current Requisitions / Openings */}
      <section id="openings" className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Open Requisitions · {jobsList.length} Active Positions
              </span>
              <h2 className="text-3xl font-serif font-normal text-slate-900">
                Current Technical Opportunities
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {isLive && (
                <button
                  type="button"
                  onClick={() => openModal('job_add', { requirements: '' })}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Requisition</span>
                </button>
              )}

              {/* Department Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      departmentFilter === dept
                        ? 'bg-[#0B172A] text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {submittedAppId && (
            <div className="mb-8 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-emerald-900 text-lg">Application Submitted Successfully</h4>
              <p className="text-xs text-emerald-700 font-sans">
                Your application has been received by talent acquisitions. Reference ID: <strong className="font-mono">{submittedAppId}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedAppId(null)}
                className="text-xs font-bold text-emerald-800 underline pt-1 cursor-pointer"
              >
                Dismiss notification
              </button>
            </div>
          )}

          <div className="space-y-6">
            {filteredJobs.map((job, idx) => (
              <div
                key={job.id || idx}
                className="relative bg-white rounded-2xl p-7 lg:p-8 border border-slate-200 shadow-sm card-hover-job grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group transition-all"
              >
                {/* Live Action Overlay */}
                {isLive && (
                  <CardActionOverlay
                    title={job.title}
                    onEdit={() => openModal('job_edit', {
                      ...job,
                      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || '')
                    }, idx)}
                    onDelete={() => handleDeleteJob(idx)}
                  />
                )}

                <div className="lg:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{job.experience}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {job.overview}
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                        Core Competency Matrix:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                        {job.requirements.slice(0, 4).map((req, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                            <span className="line-clamp-1">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleOpenApply(job)}
                    className="px-6 py-2.5 rounded-lg bg-[#0B172A] hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Submit Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400 text-center lg:text-right">
                    Ref: {job.id.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('job_add', { requirements: '' })}
                label="Add Job Requisition"
                subtitle="Add an engineering or research career opening"
              />
            )}
          </div>
        </div>
      </section>

      {/* Application Drawer / Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-600">
                Application Intake
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Apply for {selectedJob.title}
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Department: {selectedJob.department} · {selectedJob.location}
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Corporate / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Total Years of Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 10 Years"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  LinkedIn or Technical Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/... or GitHub URL"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Executive Brief / Cover Note
                </label>
                <textarea
                  rows={3}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder="Summarize your systems architecture credentials, high-throughput backend experience, or doctoral research..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Resume / CV Document Upload */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center relative hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        attachedResumeName: file.name,
                        attachedResumeSize: `${Math.round(file.size / 1024)} KB`
                      });
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
                {formData.attachedResumeName ? (
                  <div className="space-y-1">
                    <span className="text-xs text-emerald-600 font-bold block">
                      Attached: {formData.attachedResumeName} ({formData.attachedResumeSize})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Click to replace file</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-slate-700 font-semibold block">
                      Upload Curriculum Vitae / Resume
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Supported: PDF, DOCX (Up to 15MB)
                    </span>
                  </>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I confirm that the credentials provided are accurate and consent to A8Fusion evaluating my technical profile for employment.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Submit Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Hero Header' :
          modalType === 'culture_header' ? 'Edit Culture Section Header' :
          modalType === 'culture_edit' ? `Edit Principle: ${modalData.title || ''}` :
          modalType === 'culture_add' ? 'Add Operating Principle' :
          modalType === 'job_edit' ? `Edit Requisition: ${modalData.title || ''}` :
          modalType === 'job_add' ? 'Post New Requisition' : 'Edit Section'
        }
      >
        {/* Header Modal */}
        {modalType === 'header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge</label>
              <input
                type="text"
                value={modalData.badge || ''}
                onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle</label>
              <textarea
                rows={3}
                value={modalData.subtitle || ''}
                onChange={(e) => setModalData({ ...modalData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Text</label>
                <input
                  type="text"
                  value={modalData.primaryCtaText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Link</label>
                <input
                  type="text"
                  value={modalData.primaryCtaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}

        {/* Culture Header Modal */}
        {modalType === 'culture_header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Title</label>
              <input
                type="text"
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description Paragraph</label>
              <textarea
                rows={3}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Culture Principle Add / Edit Modal */}
        {(modalType === 'culture_edit' || modalType === 'culture_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Principle Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Intellectual Rigor & Formality"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description Paragraph</label>
              <textarea
                rows={3}
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Core architectural standard or operating discipline..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Job Add / Edit Modal */}
        {(modalType === 'job_edit' || modalType === 'job_add') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Position Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  placeholder="e.g. Principal Distributed Systems Architect"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={modalData.department || ''}
                  onChange={(e) => setModalData({ ...modalData, department: e.target.value })}
                  placeholder="e.g. Architecture & Engineering"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={modalData.location || ''}
                  onChange={(e) => setModalData({ ...modalData, location: e.target.value })}
                  placeholder="e.g. Bangalore, India / Hybrid"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Experience</label>
                <input
                  type="text"
                  value={modalData.experience || ''}
                  onChange={(e) => setModalData({ ...modalData, experience: e.target.value })}
                  placeholder="e.g. 10+ Years"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Overview</label>
              <textarea
                rows={3}
                required
                value={modalData.overview || ''}
                onChange={(e) => setModalData({ ...modalData, overview: e.target.value })}
                placeholder="Key expectations, technical responsibilities, and team leadership..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Core Competencies &amp; Requirements (one per line)
              </label>
              <textarea
                rows={4}
                value={modalData.requirements || ''}
                onChange={(e) => setModalData({ ...modalData, requirements: e.target.value })}
                placeholder="High-throughput transactional database systems&#10;Zero-trust cryptographic security models&#10;Track record directing large engineering squads"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
