import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useEnquiry } from '../context/EnquiryContext';
import { 
  ShieldCheck, 
  Building2, 
  Landmark, 
  Users, 
  Workflow, 
  Database, 
  Lock, 
  Cpu, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle,
  Scale,
  GitBranch,
  GraduationCap,
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
  badge: 'Sovereign Digital Infrastructure',
  title: 'Government & Public Sector Technology Solutions',
  subtitle: 'Engineering resilient e-governance backbones, sovereign data platforms, and secure digital citizen services designed to withstand state-level threat vectors and adhere strictly to domestic data sovereignty laws.',
  bgImage: '/government.png',
  primaryCtaText: 'Submit Official Tender / RFP Enquiry',
  primaryCtaLink: '#government-tender-form',
  secondaryCtaText: 'Review Governance Philosophy',
  secondaryCtaLink: '/company/our-approach'
};

const DEFAULT_SOVEREIGN_MANDATE = {
  tag: 'Sovereign Mandate',
  title: 'Architectural Independence for Public Sector Institutions',
  p1: 'National digital sovereignty is the prerequisite for civic trust. Modern government departments cannot risk their critical citizen registries or municipal billing cores being held hostage by foreign SaaS terms of service or offshore data centers.',
  p2: 'A8Fusion designs sovereign technology platforms intended for on-premise government cloud enclaves or strictly designated domestic data regions. Every line of application code, database schema, and cryptographic key remains entirely under sovereign control.',
  noticeTitle: 'TRANSPARENT PROCUREMENT COMPLIANCE NOTICE',
  noticeDesc: 'A8Fusion operates strictly as an independent enterprise technology and systems engineering corporation. In accordance with honest disclosure standards, we participate in public tenders on technical merit and do not claim unverified government empanelment or artificial vendor preferences.'
};

const DEFAULT_CORE_POLICIES = [
  { 
    id: 'policy-1', 
    title: 'DOMESTIC DATA RESIDENCY', 
    desc: '100% of citizen Personally Identifiable Information (PII) resides within authorized domestic state borders.' 
  },
  { 
    id: 'policy-2', 
    title: 'HSM KEY GOVERNANCE', 
    desc: 'Master cryptographic keys are owned exclusively by state authorities with hardware multi-custody quorum.' 
  },
  { 
    id: 'policy-3', 
    title: 'CODE ESCROW & AUDIT', 
    desc: 'Full source code escrow access and complete architectural documentation delivered with every system deployment.' 
  }
];

const DEFAULT_CAPABILITIES_HEADER = {
  tag: 'Civic Capability Suite',
  title: 'Government Technology Capabilities',
  desc: 'Integrated solution domains engineered for municipal councils, state departments, and federal ministries.'
};

const DEFAULT_GOV_PILLARS = [
  { id: 'pillar-1', title: 'E-Governance Solutions', desc: 'Single-Sign-On citizen credentials, digital identity verification, and multi-departmental service integration.' },
  { id: 'pillar-2', title: 'Smart City Platforms', desc: 'Municipal telemetry aggregating street lighting, water pressure, smart meters, and traffic dispatch.' },
  { id: 'pillar-3', title: 'Public Administration Systems', desc: 'Secure civil registry databases, land titles, vital statistics, and judicial filing archives.' },
  { id: 'pillar-4', title: 'Digital Citizen Services', desc: 'Intuitive web and mobile portals for business permits, licenses, birth registrations, and tax filing.' },
  { id: 'pillar-5', title: 'Government Workflow Automation', desc: 'Automating multi-tier ministerial approval hierarchies with tamper-evident cryptographic logs.' },
  { id: 'pillar-6', title: 'Public Infrastructure Management', desc: 'Asset lifecycle tracking for public transit networks, bridges, reservoirs, and public hospitals.' },
  { id: 'pillar-7', title: 'Data Analytics & Dashboards', desc: 'Real-time cabinet decision boards tracking public budget expenditures, inflation indices, and health data.' },
  { id: 'pillar-8', title: 'System Integration & Mainframe Bridges', desc: 'Secure middleware connecting legacy departmental mainframes with modern cloud citizen portals.' }
];

const DEFAULT_METHODOLOGY_HEADER = {
  tag: 'Public Procurement Rigor',
  title: 'Civic Project Implementation Methodology',
  desc: 'Government contracts demand transparency, formal milestone certifications, and independent quality oversight.'
};

const DEFAULT_METHODOLOGY_PHASES = [
  {
    id: 'phase-1',
    phase: 'PHASE A',
    title: 'Legislative & Privacy Mapping',
    desc: 'Auditing statutory mandates, public records acts, and accessibility standards prior to writing technical specifications.'
  },
  {
    id: 'phase-2',
    phase: 'PHASE B',
    title: 'Incremental Strangler Migration',
    desc: 'Decoupling functions from legacy mainframes without disrupting active citizen operations or causing tax service downtime.'
  },
  {
    id: 'phase-3',
    phase: 'PHASE C',
    title: 'Auditable Knowledge Handover',
    desc: 'Structured technical upskilling of civil service engineering teams, ensuring long-term sovereign autonomy over the deployed platform.'
  }
];

const DEFAULT_TENDER_HEADER = {
  tag: 'OFFICIAL PUBLIC SECTOR PORTAL',
  title: 'Procurement & Tender Enquiries',
  desc: 'Government departments, municipal authorities, and sovereign procurement officers may submit formal Expressions of Interest (EOI), RFP documents, or technical discovery requests directly to our sovereign practice team.'
};

export default function GovernmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submitEnquiry } = useEnquiry();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [sovereignMandate, setSovereignMandate] = useState(DEFAULT_SOVEREIGN_MANDATE);
  const [corePolicies, setCorePolicies] = useState(DEFAULT_CORE_POLICIES);
  const [capabilitiesHeader, setCapabilitiesHeader] = useState(DEFAULT_CAPABILITIES_HEADER);
  const [govPillars, setGovPillars] = useState(DEFAULT_GOV_PILLARS);
  const [methodologyHeader, setMethodologyHeader] = useState(DEFAULT_METHODOLOGY_HEADER);
  const [methodologyPhases, setMethodologyPhases] = useState(DEFAULT_METHODOLOGY_PHASES);
  const [tenderHeader, setTenderHeader] = useState(DEFAULT_TENDER_HEADER);

  // Enquiry Form State
  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    country: '',
    projectCategory: 'E-Governance Platform & Civil Registry',
    estimatedBudget: '₹5 Crores – ₹10 Crores',
    tenderReference: '',
    description: '',
    consent: false,
  });
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [customBudgetValue, setCustomBudgetValue] = useState('');
  const [isCustomCivicClass, setIsCustomCivicClass] = useState(false);
  const [customCivicClassValue, setCustomCivicClassValue] = useState('');
  const [submittedRef, setSubmittedRef] = useState(null);

  const civicClassifications = [
    'E-Governance Platform & Civil Registry',
    'Municipal Smart City Telemetry Network',
    'Judicial & Public Records Data Pipeline',
    'Legacy Mainframe Strangler Modernization',
    'Sovereign Cloud & National Data Residency',
    'Unified Citizen Digital Identity (SSO & Biometrics)',
    'Public Health & Automated Clinical Surveillance',
    'Automated Civil Permitting & Tax Administration',
    'General Public Sector RFP / Sovereign Tender',
    'Custom'
  ];

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Check URL query param for live_edit
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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=government');
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
        const local = localStorage.getItem('a8_live_government_content');
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
    if (data.sovereignMandate) setSovereignMandate(data.sovereignMandate);
    if (Array.isArray(data.corePolicies) && data.corePolicies.length > 0) setCorePolicies(data.corePolicies);
    if (data.capabilitiesHeader) setCapabilitiesHeader(data.capabilitiesHeader);
    if (Array.isArray(data.govPillars) && data.govPillars.length > 0) setGovPillars(data.govPillars);
    if (data.methodologyHeader) setMethodologyHeader(data.methodologyHeader);
    if (Array.isArray(data.methodologyPhases) && data.methodologyPhases.length > 0) setMethodologyPhases(data.methodologyPhases);
    if (data.tenderHeader) setTenderHeader(data.tenderHeader);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      sovereignMandate,
      corePolicies,
      capabilitiesHeader,
      govPillars,
      methodologyHeader,
      methodologyPhases,
      tenderHeader,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_government_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'government',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Government & Public Sector specifications saved and synchronized successfully!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Government page content back to default factory settings?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setSovereignMandate(DEFAULT_SOVEREIGN_MANDATE);
      setCorePolicies(DEFAULT_CORE_POLICIES);
      setCapabilitiesHeader(DEFAULT_CAPABILITIES_HEADER);
      setGovPillars(DEFAULT_GOV_PILLARS);
      setMethodologyHeader(DEFAULT_METHODOLOGY_HEADER);
      setMethodologyPhases(DEFAULT_METHODOLOGY_PHASES);
      setTenderHeader(DEFAULT_TENDER_HEADER);
      localStorage.removeItem('a8_live_government_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/government', { replace: true });
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
    } else if (modalType === 'mandate') {
      setSovereignMandate({ ...modalData });
    } else if (modalType === 'policy_edit') {
      const updated = [...corePolicies];
      updated[editingIndex] = { ...modalData };
      setCorePolicies(updated);
    } else if (modalType === 'policy_add') {
      const newPolicy = {
        id: `policy-${Date.now()}`,
        title: modalData.title || 'New Policy Directive',
        desc: modalData.desc || 'Sovereign security protocol description.'
      };
      setCorePolicies([...corePolicies, newPolicy]);
    } else if (modalType === 'capabilities_header') {
      setCapabilitiesHeader({ ...modalData });
    } else if (modalType === 'pillar_edit') {
      const updated = [...govPillars];
      updated[editingIndex] = { ...modalData };
      setGovPillars(updated);
    } else if (modalType === 'pillar_add') {
      const newPillar = {
        id: `pillar-${Date.now()}`,
        title: modalData.title || 'New Civic Capability',
        desc: modalData.desc || 'Public sector technology platform specification.'
      };
      setGovPillars([...govPillars, newPillar]);
    } else if (modalType === 'methodology_header') {
      setMethodologyHeader({ ...modalData });
    } else if (modalType === 'phase_edit') {
      const updated = [...methodologyPhases];
      updated[editingIndex] = { ...modalData };
      setMethodologyPhases(updated);
    } else if (modalType === 'phase_add') {
      const newPhase = {
        id: `phase-${Date.now()}`,
        phase: modalData.phase || `PHASE ${String.fromCharCode(65 + methodologyPhases.length)}`,
        title: modalData.title || 'New Implementation Phase',
        desc: modalData.desc || 'Methodology phase description and deliverables.'
      };
      setMethodologyPhases([...methodologyPhases, newPhase]);
    } else if (modalType === 'tender_header') {
      setTenderHeader({ ...modalData });
    }

    closeModal();
  };

  const handleDeletePillar = (idx) => {
    if (window.confirm(`Delete civic capability "${govPillars[idx].title}"?`)) {
      const updated = govPillars.filter((_, i) => i !== idx);
      setGovPillars(updated);
      markDirty();
    }
  };

  const handleDeletePolicy = (idx) => {
    if (window.confirm(`Delete policy directive "${corePolicies[idx].title}"?`)) {
      const updated = corePolicies.filter((_, i) => i !== idx);
      setCorePolicies(updated);
      markDirty();
    }
  };

  const handleDeletePhase = (idx) => {
    if (window.confirm(`Delete methodology phase "${methodologyPhases[idx].title}"?`)) {
      const updated = methodologyPhases.filter((_, i) => i !== idx);
      setMethodologyPhases(updated);
      markDirty();
    }
  };

  const isLive = editMode && !previewMode;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm official government authorization and consent.');
      return;
    }
    const finalBudget = isCustomBudget
      ? (customBudgetValue.trim() ? customBudgetValue.trim() : 'Custom Budget Envelope')
      : formData.estimatedBudget;

    const resolvedCivicClass = isCustomCivicClass
      ? (customCivicClassValue.trim() || 'Custom Civic Project Classification')
      : formData.projectCategory;

    const ref = submitEnquiry({
      ...formData,
      projectCategory: resolvedCivicClass,
      industry: resolvedCivicClass,
      estimated_budget: finalBudget,
      estimatedBudget: finalBudget,
      budget: finalBudget,
      type: 'Government'
    });
    setSubmittedRef(ref);
  };

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Government & Public Sector (/government)"
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
            { label: 'Government & Public Sector' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* 1. Sovereign Government Technology Introduction */}
      <section className="py-20 bg-white border-b border-slate-200 relative group/section">
        {isLive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('mandate', { ...sovereignMandate })}
              label="Edit Sovereign Mandate"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Sovereign Mandate Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {sovereignMandate.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                {sovereignMandate.title}
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                {sovereignMandate.p1}
              </p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                {sovereignMandate.p2}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{sovereignMandate.noticeTitle}</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {sovereignMandate.noticeDesc}
                </p>
              </div>
            </div>

            {/* Right Column: Responsive Government Building Frame */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-100 w-full h-[380px] sm:h-[440px] lg:h-[480px] relative group">
                <img
                  src="/government_building.jpg"
                  alt="A8Fusion Sovereign Public Sector Infrastructure & Civic Government Systems"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />
                
                {/* Floating Civic Institution Ribbon */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between text-white backdrop-blur-md bg-slate-950/60 p-3.5 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center text-white flex-shrink-0">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold leading-tight">
                        Sovereign Civic Infrastructure
                      </div>
                      <div className="text-xs font-serif font-bold text-white leading-tight mt-0.5">
                        Civil Administration & Institutional Governance
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold hidden sm:inline">
                    AIR-GAPPED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sovereign Core Policy Framework (Editable 3 Columns / Grid) */}
          <div className="mt-12 pt-10 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {corePolicies.map((policy, idx) => (
                <div 
                  key={policy.id || idx} 
                  className="relative p-5 rounded-xl bg-white border border-slate-200/90 space-y-2 shadow-xs card-premium hover:border-indigo-300 group"
                >
                  {isLive && (
                    <CardActionOverlay
                      title={policy.title}
                      onEdit={() => openModal('policy_edit', { ...policy }, idx)}
                      onDelete={() => handleDeletePolicy(idx)}
                    />
                  )}
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                    {idx === 0 ? <Database className="w-4 h-4 text-indigo-600 flex-shrink-0" /> :
                     idx === 1 ? <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" /> :
                     <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    <span>{policy.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {policy.desc}
                  </p>
                </div>
              ))}

              {isLive && (
                <AddCardButton
                  onClick={() => openModal('policy_add', {})}
                  label="Add Policy Directive"
                  subtitle="Add another sovereign compliance or security covenant"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2 to 9. The Core Government Technology Solutions */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative group/cheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('capabilities_header', { ...capabilitiesHeader })}
                  label="Edit Section Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {capabilitiesHeader.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {capabilitiesHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {capabilitiesHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {govPillars.map((pillar, i) => (
              <div key={pillar.id || i} className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-premium group">
                {isLive && (
                  <CardActionOverlay
                    title={pillar.title}
                    onEdit={() => openModal('pillar_edit', { ...pillar }, i)}
                    onDelete={() => handleDeletePillar(i)}
                  />
                )}
                <span className="text-xs font-mono font-bold text-indigo-600">CAPABILITY 0{i + 1}</span>
                <h3 className="text-base font-serif font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{pillar.desc}</p>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('pillar_add', {})}
                label="Add Capability Domain"
                subtitle="Add another sovereign solution or civic capability"
              />
            )}
          </div>
        </div>
      </section>

      {/* 10. Government Project Implementation Approach */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative group/mheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('methodology_header', { ...methodologyHeader })}
                  label="Edit Section Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {methodologyHeader.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {methodologyHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {methodologyHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodologyPhases.map((phase, idx) => {
              const colors = [
                { grad: 'from-indigo-100/35 via-slate-50/10 to-transparent', iconBg: 'from-indigo-50 to-slate-50 text-indigo-700', badge: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80', icon: Scale },
                { grad: 'from-blue-100/35 via-slate-50/10 to-transparent', iconBg: 'from-blue-50 to-slate-50 text-blue-700', badge: 'bg-blue-50/90 text-blue-700 border-blue-200/80', icon: GitBranch },
                { grad: 'from-emerald-100/35 via-slate-50/10 to-transparent', iconBg: 'from-emerald-50 to-slate-50 text-emerald-700', badge: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80', icon: GraduationCap },
              ];
              const colorScheme = colors[idx % colors.length];
              const IconComponent = colorScheme.icon;

              return (
                <div 
                  key={phase.id || idx} 
                  className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm card-hover-civic-methodology flex flex-col justify-between group relative overflow-hidden"
                >
                  {isLive && (
                    <CardActionOverlay
                      title={phase.title}
                      onEdit={() => openModal('phase_edit', { ...phase }, idx)}
                      onDelete={() => handleDeletePhase(idx)}
                    />
                  )}
                  <div className={`absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br ${colorScheme.grad} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500`} />

                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className={`civic-icon-emblem w-13 h-13 rounded-2xl bg-gradient-to-br ${colorScheme.iconBg} border border-slate-200/80 flex items-center justify-center shadow-xs transition-all duration-300`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`civic-phase-badge px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase ${colorScheme.badge} border shadow-xs transition-all duration-300`}>
                        {phase.phase}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {phase.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed pt-2">
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('phase_add', {})}
                label="Add Implementation Phase"
                subtitle="Add a milestone phase or governance step"
              />
            )}
          </div>
        </div>
      </section>

      {/* 11 & 12. DEDICATED GOVERNMENT ENQUIRY & TENDER FORM */}
      <section id="government-tender-form" className="py-20 bg-[#0B172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3 relative group/theader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('tender_header', { ...tenderHeader })}
                  label="Edit Portal Header"
                />
              </div>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-xs font-mono text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{tenderHeader.tag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              {tenderHeader.title}
            </h2>
            <p className="text-sm text-slate-300 font-sans max-w-2xl mx-auto">
              {tenderHeader.desc}
            </p>
          </div>

          {submittedRef ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/50 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Official Enquiry Registered Successfully
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans">
                Your submission has been cataloged under sovereign protocol. Our senior public sector lead and compliance director have been alerted.
              </p>
              <div className="inline-block p-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono text-sm font-bold">
                Tender Reference ID: {submittedRef}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                An acknowledgment packet has been dispatched to {formData.email}.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setIsCustomBudget(false);
                    setCustomBudgetValue('');
                    setIsCustomCivicClass(false);
                    setCustomCivicClassValue('');
                  }}
                  className="px-6 py-2.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 uppercase tracking-wider"
                >
                  Submit Another Government Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900/90 rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Department or Organisation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ministry of Transport & Civil Registry"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director Hamad Al-Fahim"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director General of Information Systems"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official Government Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="official.name@ministry.gov.xx"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Direct Phone / Secure Extension *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Jurisdiction / Sovereign State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom, Singapore, UAE, India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Civic Project Classification *
                  </label>
                  <select
                    value={isCustomCivicClass ? 'Custom' : formData.projectCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom') {
                        setIsCustomCivicClass(true);
                      } else {
                        setIsCustomCivicClass(false);
                        setFormData({ ...formData, projectCategory: val });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
                  >
                    {civicClassifications.map((c) => (
                      <option key={c} value={c}>
                        {c === 'Custom' ? 'Custom Civic Project Classification (Specify)' : c}
                      </option>
                    ))}
                  </select>

                  {isCustomCivicClass && (
                    <div className="mt-2.5 space-y-1">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sovereign Satellite Telemetry, National Border Grid, Civil Drone Defense..."
                          value={customCivicClassValue}
                          onChange={(e) => setCustomCivicClassValue(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-indigo-500/80 text-white text-xs focus:outline-none focus:border-indigo-400 font-sans placeholder:text-slate-500 shadow-inner"
                          autoFocus
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        Specify your custom government ministry directive or municipal scope.
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Estimated Procurement Envelope
                  </label>
                  <select
                    value={isCustomBudget ? 'Custom' : formData.estimatedBudget}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom') {
                        setIsCustomBudget(true);
                      } else {
                        setIsCustomBudget(false);
                        setFormData({ ...formData, estimatedBudget: val });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
                  >
                    <option value="₹10,000 – ₹15,000">₹10,000 – ₹15,000</option>
                    <option value="₹15,000 – ₹20,000">₹15,000 – ₹20,000</option>
                    <option value="₹20,000 – ₹25,000">₹20,000 – ₹25,000</option>
                    <option value="₹25,000+">₹25,000+</option>
                    <option value="To Be Determined / Formal RFP Stage">To Be Determined / Formal RFP Stage</option>
                    <option value="Custom">Custom Budget Envelope (Specify Amount)</option>
                  </select>

                  {isCustomBudget && (
                    <div className="mt-2.5 space-y-1">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. ₹50,000, ₹10 Crores, $25K USD, or custom grant"
                          value={customBudgetValue}
                          onChange={(e) => setCustomBudgetValue(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-indigo-500/80 text-white text-xs focus:outline-none focus:border-indigo-400 font-sans placeholder:text-slate-500 shadow-inner"
                          autoFocus
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        Specify exact budget allocation, sovereign grant, or custom threshold figure.
                      </span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official RFP / Tender Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RFP-GOV-2026-TRANS-0482"
                    value={formData.tenderReference}
                    onChange={(e) => setFormData({ ...formData, tenderReference: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Mandate Overview & Scope Summary *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detail the civic requirements, desired in-country residency bounds, timeline, and current technical systems..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Tender Document Upload Field */}
                <div className="sm:col-span-2 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center relative hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    id="gov-tender-file"
                    accept=".pdf,.docx,.zip,.doc"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData((prev) => ({
                            ...prev,
                            attachedFileName: file.name,
                            attachedFileSize: `${Math.round(file.size / 1024)} KB`,
                            attachedFileData: event.target.result,
                            attachedFileType: file.type || 'application/pdf',
                            document_attachments: [{
                              name: file.name,
                              size: `${Math.round(file.size / 1024)} KB`,
                              type: file.type || 'application/pdf',
                              data: event.target.result,
                              uploaded_at: new Date().toISOString()
                            }]
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  {formData.attachedFileName ? (
                    <div className="space-y-1">
                      <span className="text-xs text-emerald-400 font-bold block">
                        Attached: {formData.attachedFileName} ({formData.attachedFileSize})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Click to replace file</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-slate-300 font-semibold block">Attach Official RFP or Scope Documentation</span>
                      <span className="text-[10px] text-slate-500 font-mono">Supported formats: PDF, DOCX, ZIP (Up to 25MB)</span>
                    </>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <span>
                      I hereby certify that I am an authorized representative of the designated public authority or government department, and request formal communication regarding this sovereign inquiry under corporate confidentiality standards.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-500 font-mono">
                  All government enquiries are audited and encrypted.
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <span>Submit Sovereign Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Hero Header' :
          modalType === 'mandate' ? 'Edit Sovereign Mandate Narrative' :
          modalType === 'policy_edit' ? `Edit Policy Directive: ${modalData.title || ''}` :
          modalType === 'policy_add' ? 'Add Sovereign Policy Directive' :
          modalType === 'capabilities_header' ? 'Edit Capability Suite Header' :
          modalType === 'pillar_edit' ? `Edit Capability: ${modalData.title || ''}` :
          modalType === 'pillar_add' ? 'Add Civic Capability' :
          modalType === 'methodology_header' ? 'Edit Implementation Methodology Header' :
          modalType === 'phase_edit' ? `Edit Phase: ${modalData.phase || ''}` :
          modalType === 'phase_add' ? 'Add Implementation Phase' :
          modalType === 'tender_header' ? 'Edit Tender Portal Header' : 'Edit Section'
        }
      >
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

        {modalType === 'mandate' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading Title</label>
              <input
                type="text"
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">First Paragraph</label>
              <textarea
                rows={3}
                value={modalData.p1 || ''}
                onChange={(e) => setModalData({ ...modalData, p1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Second Paragraph</label>
              <textarea
                rows={3}
                value={modalData.p2 || ''}
                onChange={(e) => setModalData({ ...modalData, p2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Compliance Notice Label</label>
              <input
                type="text"
                value={modalData.noticeTitle || ''}
                onChange={(e) => setModalData({ ...modalData, noticeTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Compliance Notice Description</label>
              <textarea
                rows={3}
                value={modalData.noticeDesc || ''}
                onChange={(e) => setModalData({ ...modalData, noticeDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {(modalType === 'policy_edit' || modalType === 'policy_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Policy Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. DOMESTIC DATA RESIDENCY"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Policy Description</label>
              <textarea
                rows={4}
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Specification details, hardware requirements, or statutory residency rules..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'capabilities_header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {(modalType === 'pillar_edit' || modalType === 'pillar_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capability Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Sovereign Civil Registry"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Institutional civic capabilities, security parameters, and data architecture..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'methodology_header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {(modalType === 'phase_edit' || modalType === 'phase_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phase Identifier</label>
              <input
                type="text"
                required
                value={modalData.phase || ''}
                onChange={(e) => setModalData({ ...modalData, phase: e.target.value })}
                placeholder="e.g. PHASE A"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phase Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Legislative & Privacy Mapping"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deliverables & Scope</label>
              <textarea
                rows={4}
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Auditing statutory mandates, public records acts, and accessibility standards..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'tender_header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
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
