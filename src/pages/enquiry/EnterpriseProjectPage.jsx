import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useEnquiry } from '../../context/EnquiryContext';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Lock,
  Building2,
  Calendar,
  Coins,
  Clock,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Layers,
  Scale,
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
} from '../../admin/components/LiveEditorControls';

const DEFAULT_PAGE_HEADER = {
  badge: 'Enterprise Engagement Portal',
  title: 'Enterprise Project Scope & Architecture Discovery',
  subtitle: 'Submit your organization\'s technical requirements, legacy infrastructure details, and operational milestones to initiate a formal technical discovery with our Principal Systems Architects.',
  bgImage: '/contact.png',
  primaryCtaText: 'Government Tender Portal',
  primaryCtaLink: '/government',
  secondaryCtaText: 'All Solutions Overview',
  secondaryCtaLink: '/solutions'
};

const DEFAULT_BRIEFING = {
  tag: 'ARCHITECTURE GOVERNANCE',
  title: 'Direct Technical Review with Principal Systems Architects',
  desc: 'Every technical proposal submitted through this portal bypasses generic sales intermediaries. Your architectural requirements are routed directly to our Principal Systems Architects and Sovereign Compliance Leads for rigorous feasibility modeling.'
};

const DEFAULT_DISCOVERY_STEPS = [
  {
    num: '01',
    color: 'bg-indigo-100 text-indigo-700',
    title: 'Automated Triage & Conflict Audit',
    desc: 'Under 24 hours. Formal mutual NDA execution and technical stack classification.'
  },
  {
    num: '02',
    color: 'bg-blue-100 text-blue-700',
    title: 'Architecture Discovery Session (45 Min)',
    desc: 'A dedicated video technical briefing with an assigned Principal Architect to evaluate latency targets, API contracts, and concurrency.'
  },
  {
    num: '03',
    color: 'bg-purple-100 text-purple-700',
    title: 'Formal High-Level Design (HLD) Dossier',
    desc: 'Complete architectural blueprint proposal with Architecture Decision Records (ADRs), risk matrices, and milestone-gated pricing.'
  },
  {
    num: '04',
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Guaranteed IP & Source Code Ownership',
    desc: 'Complete intellectual property assignment, unencumbered source code repository handover, and transparent Tier-1 SLAs.'
  }
];

const DEFAULT_COVENANTS = {
  title: 'Institutional Security Covenants',
  badge: 'STRICT PRIVACY',
  covenant1Label: 'Mutual Non-Disclosure',
  covenant1Desc: 'Submissions are strictly bounded by corporate NDA and proprietary data isolation covenants.',
  covenant2Label: 'International Arbitration',
  covenant2Desc: 'Master agreements structured under SIAC (Singapore) and LCIA (London) legal frameworks.',
  covenant3Label: 'Direct Sovereign Portals',
  covenant3Desc: 'For public sector tenders or municipal projects, utilize our specialized Tender Desk.'
};

const DEFAULT_HUBS_NOTICE = {
  title: 'Verified Regional Delivery Hubs:',
  desc: 'Singapore · United Arab Emirates · United Kingdom'
};

export default function EnterpriseProjectPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedService = searchParams.get('service') || '';
  const preselectedSolution = searchParams.get('solution') || '';
  const preselectedIndustry = searchParams.get('industry') || '';

  const { submitEnquiry } = useEnquiry();
  const [submittedRef, setSubmittedRef] = useState(null);

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [briefing, setBriefing] = useState(DEFAULT_BRIEFING);
  const [discoverySteps, setDiscoverySteps] = useState(DEFAULT_DISCOVERY_STEPS);
  const [covenants, setCovenants] = useState(DEFAULT_COVENANTS);
  const [hubsNotice, setHubsNotice] = useState(DEFAULT_HUBS_NOTICE);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    country: '',
    industry: preselectedIndustry || 'Banking & Financial Services',
    projectCategory: preselectedService || preselectedSolution || 'Enterprise Software Development',
    description: '',
    timeline: '3 – 6 Months',
    budgetRange: '$500K – $1M USD',
    consent: false
  });

  const industries = [
    'Banking & Financial Services',
    'Healthcare & Life Sciences',
    'Manufacturing & Industry 4.0',
    'Logistics & Transportation',
    'Government & Public Sector',
    'Construction & Capital Infrastructure',
    'Education & Universities',
    'Real Estate & Asset Portfolios',
    'Energy & Public Utilities',
    'Conglomerate / Other'
  ];

  const categories = [
    'Enterprise Software Development',
    'AI & Machine Learning (Private LLM)',
    'Cloud & Infrastructure Architecture',
    'Cybersecurity & Zero-Trust Defense',
    'System Integration & ESB Orchestration',
    'Digital Transformation Modernization',
    'Enterprise ERP Platform Implementation',
    'Enterprise CRM Platform Implementation',
    'Financial Management Suite',
    'Document Vault (DMS)',
    'Construction Intelligence Suite'
  ];

  const timelines = [
    'Rapid Pilot (< 3 Months)',
    '3 – 6 Months',
    '6 – 12 Months',
    'Multi-Year Phased Transformation'
  ];

  const budgetRanges = [
    'Below $250K USD',
    '$250K – $500K USD',
    '$500K – $1M USD',
    '$1M – $3M USD',
    '$3M – $10M+ USD',
    'Undetermined / Tender Formulation'
  ];

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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=request-project');
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
        const local = localStorage.getItem('a8_live_project_content');
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
    if (data.briefing) setBriefing(data.briefing);
    if (Array.isArray(data.discoverySteps) && data.discoverySteps.length > 0) setDiscoverySteps(data.discoverySteps);
    if (data.covenants) setCovenants(data.covenants);
    if (data.hubsNotice) setHubsNotice(data.hubsNotice);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      briefing,
      discoverySteps,
      covenants,
      hubsNotice,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_project_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'request-project',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Enterprise Project Scope specifications saved and synchronized with MySQL!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Enterprise Project page sections back to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setBriefing(DEFAULT_BRIEFING);
      setDiscoverySteps(DEFAULT_DISCOVERY_STEPS);
      setCovenants(DEFAULT_COVENANTS);
      setHubsNotice(DEFAULT_HUBS_NOTICE);
      localStorage.removeItem('a8_live_project_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/request-project', { replace: true });
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
    } else if (modalType === 'briefing') {
      setBriefing({ ...modalData });
    } else if (modalType === 'step_edit') {
      const updated = [...discoverySteps];
      updated[editingIndex] = { ...modalData };
      setDiscoverySteps(updated);
    } else if (modalType === 'step_add') {
      const newStep = {
        num: modalData.num || `0${discoverySteps.length + 1}`,
        color: modalData.color || 'bg-indigo-100 text-indigo-700',
        title: modalData.title || 'New Discovery Stage',
        desc: modalData.desc || 'Milestone deliverable specification and technical briefing.'
      };
      setDiscoverySteps([...discoverySteps, newStep]);
    } else if (modalType === 'covenants') {
      setCovenants({ ...modalData });
    } else if (modalType === 'hubs') {
      setHubsNotice({ ...modalData });
    }

    closeModal();
  };

  const handleDeleteStep = (idx) => {
    if (window.confirm(`Delete discovery step "${discoverySteps[idx].title}"?`)) {
      const updated = discoverySteps.filter((_, i) => i !== idx);
      setDiscoverySteps(updated);
      markDirty();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm the non-disclosure and project authorization statement.');
      return;
    }
    const ref = submitEnquiry({
      ...formData,
      type: 'Enterprise Project'
    });
    setSubmittedRef(ref);
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Request Enterprise Project (/request-project)"
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
            { label: 'Enquiry Portals' },
            { label: 'Enterprise Project' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN: Executive Briefing, Discovery Timeline & Assurance   */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              {/* Strategic Engagement Introduction */}
              <div className="space-y-4 relative group">
                {isLive && (
                  <div className="absolute -top-3 right-0 z-20">
                    <SectionHeaderEditButton
                      onClick={() => openModal('briefing', { ...briefing })}
                      label="Edit Briefing"
                    />
                  </div>
                )}
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 block">
                  {briefing.tag}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                  {briefing.title}
                </h2>
                <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  {briefing.desc}
                </p>
              </div>

              {/* 4-Step Architecture Discovery Process with In-Context CRUD */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Discovery &amp; Evaluation Lifecycle ({discoverySteps.length} Stages)
                  </div>
                  {isLive && (
                    <button
                      type="button"
                      onClick={() => openModal('step_add', { num: `0${discoverySteps.length + 1}` })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stage</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3.5">
                  {discoverySteps.map((step, idx) => (
                    <div key={idx} className="relative p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 card-hover-discovery-step group transition-all">
                      {isLive && (
                        <CardActionOverlay
                          title={step.title}
                          onEdit={() => openModal('step_edit', { ...step }, idx)}
                          onDelete={() => handleDeleteStep(idx)}
                        />
                      )}
                      <div className={`w-8 h-8 rounded-lg ${step.color || 'bg-indigo-100 text-indigo-700'} flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5`}>
                        {step.num}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wide">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLive && (
                    <AddCardButton
                      onClick={() => openModal('step_add', { num: `0${discoverySteps.length + 1}` })}
                      label="Add Discovery Stage"
                      subtitle="Add another milestone or consultation step"
                    />
                  )}
                </div>
              </div>

              {/* Institutional Assurance & Compliance Box */}
              <div className="p-5 rounded-2xl bg-[#0B1424] text-white border border-slate-800 space-y-4 shadow-xl card-hover-security-covenant relative group">
                {isLive && (
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      type="button"
                      onClick={() => openModal('covenants', { ...covenants })}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Covenants</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-serif font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{covenants.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                    {covenants.badge}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong>{covenants.covenant1Label}:</strong> {covenants.covenant1Desc}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Scale className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong>{covenants.covenant2Label}:</strong> {covenants.covenant2Desc}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span><strong>{covenants.covenant3Label}:</strong> {covenants.covenant3Desc}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <Link
                    to="/government/enquiry"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Switch to Government Tender Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Verified Physical Corridors Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-600 flex items-center justify-between card-hover-corridor-notice relative group">
                {isLive && (
                  <div className="absolute top-2 right-12 z-20">
                    <button
                      type="button"
                      onClick={() => openModal('hubs', { ...hubsNotice })}
                      className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs cursor-pointer"
                      title="Edit Notice"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 font-serif">{hubsNotice.title}</div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">{hubsNotice.desc}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              </div>
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: The Confidential Technical Submission Form          */}
            {/* ================================================================= */}
            <div className="lg:col-span-7">
              {submittedRef ? (
                <div className="p-10 lg:p-12 rounded-2xl bg-[#090F1E] border border-emerald-500/40 text-white text-center space-y-6 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      SUBMISSION RECEIVED &amp; LOGGED
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      Enterprise Project Registered
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
                    Your architecture scope submission has been dispatched directly to our Principal Systems Architecture Board. A technical director will reach out within 24 hours under formal corporate non-disclosure terms.
                  </p>
                  
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      OFFICIAL ENQUIRY TRACKING CODE
                    </div>
                    <div className="font-mono text-xl font-bold text-emerald-400">
                      {submittedRef}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmittedRef(null)}
                      className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Submit Additional Technical Scope
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm">
                  <div className="mb-6 space-y-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                      Scope Form · Direct Dispatch
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">
                      Enterprise Architecture Submission
                    </h3>
                    <p className="text-xs text-slate-600 font-sans">
                      All inputs are processed under strict institutional confidentiality guidelines.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nordic Apex Infrastructure AB"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Contact Officer Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Alexander Vance"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="vance@nordic-apex.se"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+46 8 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Jurisdiction / Country *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sweden"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Primary Industry Sector</label>
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs text-slate-800"
                        >
                          {industries.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Project Category</label>
                        <select
                          value={formData.projectCategory}
                          onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs text-slate-800"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Estimated Timeline</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs text-slate-800"
                        >
                          {timelines.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Project Scope &amp; Technical Requirements *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Detail expected transaction throughput, regulatory data residency mandates, legacy database integrations, and high-level deliverables..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                      />
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <label className="flex items-start gap-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>
                          I confirm that I am authorized to submit this technical inquiry on behalf of the organization and agree to mutual non-disclosure terms.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Submit Enterprise Scope for Architectural Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Hero Header' :
          modalType === 'briefing' ? 'Edit Architecture Governance Briefing' :
          modalType === 'step_edit' ? `Edit Discovery Step: ${modalData.title || ''}` :
          modalType === 'step_add' ? 'Add Discovery Stage' :
          modalType === 'covenants' ? 'Edit Security Covenants' :
          modalType === 'hubs' ? 'Edit Regional Hubs Notice' : 'Edit Section'
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

        {/* Briefing Modal */}
        {modalType === 'briefing' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading</label>
              <input
                type="text"
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={4}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Discovery Step Add / Edit Modal */}
        {(modalType === 'step_edit' || modalType === 'step_add') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Step Number</label>
                <input
                  type="text"
                  value={modalData.num || ''}
                  onChange={(e) => setModalData({ ...modalData, num: e.target.value })}
                  placeholder="e.g. 01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Step Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  placeholder="e.g. Automated Triage & Conflict Audit"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Timeline and deliverable description..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Security Covenants Modal */}
        {modalType === 'covenants' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Box Title</label>
                <input
                  type="text"
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge</label>
                <input
                  type="text"
                  value={modalData.badge || ''}
                  onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Covenant 1 Label &amp; Text</label>
              <input
                type="text"
                value={modalData.covenant1Label || ''}
                onChange={(e) => setModalData({ ...modalData, covenant1Label: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs mb-1"
              />
              <textarea
                rows={2}
                value={modalData.covenant1Desc || ''}
                onChange={(e) => setModalData({ ...modalData, covenant1Desc: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Covenant 2 Label &amp; Text</label>
              <input
                type="text"
                value={modalData.covenant2Label || ''}
                onChange={(e) => setModalData({ ...modalData, covenant2Label: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs mb-1"
              />
              <textarea
                rows={2}
                value={modalData.covenant2Desc || ''}
                onChange={(e) => setModalData({ ...modalData, covenant2Desc: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Covenant 3 Label &amp; Text</label>
              <input
                type="text"
                value={modalData.covenant3Label || ''}
                onChange={(e) => setModalData({ ...modalData, covenant3Label: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs mb-1"
              />
              <textarea
                rows={2}
                value={modalData.covenant3Desc || ''}
                onChange={(e) => setModalData({ ...modalData, covenant3Desc: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </>
        )}

        {/* Hubs Notice Modal */}
        {modalType === 'hubs' && (
          <>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notice Description</label>
              <input
                type="text"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
