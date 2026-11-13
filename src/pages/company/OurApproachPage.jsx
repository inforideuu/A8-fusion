import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { 
  CheckCircle2, 
  FileCode, 
  ShieldCheck, 
  Workflow, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Server, 
  Lock, 
  FileText,
  BarChart3,
  RefreshCw,
  Search,
  Layers,
  Palette,
  Code2,
  Bug,
  Rocket,
  LifeBuoy,
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
  badge: 'Engineering Governance',
  title: 'Our Enterprise Engineering Lifecycle',
  subtitle: 'A8Fusion enforces a rigorous 8-stage engineering framework designed to eliminate scope drift, security vulnerabilities, and architectural failures. Every milestone is guarded by auditable exit gates.',
  bgImage: '/aboutus.png',
  primaryCtaText: 'Download Governance Specs',
  primaryCtaLink: '/request-project',
  secondaryCtaText: 'Explore Core Services',
  secondaryCtaLink: '/services'
};

const DEFAULT_PHASES = [
  {
    num: 1,
    title: 'Discovery & Requirement Analysis',
    badge: 'Sprint 00',
    duration: 'Weeks 1 – 3',
    objective: 'Deconstruct complex institutional workflows, regulatory constraints, and domain boundaries before writing code.',
    activities: [
      'Stakeholder elicitation workshops with departmental directors and operational staff.',
      'Data taxonomy mapping, schema discovery, and volume throughput modeling.',
      'Sovereign regulatory compliance audit (GDPR, HIPAA, local data localization mandates).',
      'Drafting formal Functional Specification Document (FSD) and System Requirement Specification (SRS).'
    ],
    gateCriteria: 'Sign-off on SRS and Scope Boundary Matrix by Executive Steering Committee.'
  },
  {
    num: 2,
    title: 'Business & Technical Assessment',
    badge: 'Feasibility',
    duration: 'Weeks 2 – 4',
    objective: 'Quantify existing technical debt, benchmark legacy database latencies, and establish feasibility parameters.',
    activities: [
      'Audit of legacy codebase, third-party dependencies, and proprietary mainframe connectors.',
      'Total Cost of Ownership (TCO) and FinOps cloud capacity projections.',
      'High-concurrency load modeling and network bandwidth baseline testing.',
      'Evaluating vendor lock-in risks and defining migration exit strategies.'
    ],
    gateCriteria: 'Execution of Technical Feasibility Report and Infrastructure CapEx/OpEx Budget.'
  },
  {
    num: 3,
    title: 'Enterprise Architecture & ADRs',
    badge: 'Blueprint',
    duration: 'Weeks 4 – 6',
    objective: 'Codify architectural invariants, distributed message topologies, and zero-trust security perimeters.',
    activities: [
      'Authoring formal Architecture Decision Records (ADRs) for database, cache, broker, and language selections.',
      'Designing micro-segmented VPC networking and geo-redundant disaster recovery failover paths.',
      'Constructing canonical data schemas and OpenAPI 3.1 contract specifications.',
      'Establishing cryptographic key management policies (HSM / KMS) and identity access boundaries.'
    ],
    gateCriteria: 'Architectural Review Board (ARB) formal approval of the Enterprise Architecture Document (EAD).'
  },
  {
    num: 4,
    title: 'UI/UX & Cognitive Workflows',
    badge: 'Design Core',
    duration: 'Weeks 5 – 8',
    objective: 'Create intuitive, accessible, and fast enterprise interfaces that eliminate cognitive fatigue for daily operators.',
    activities: [
      'Interactive Figma design systems using high-contrast, accessible typography and enterprise component libraries.',
      'User journey simulations for high-stress operational scenarios (e.g. rapid patient intake or crisis dispatch).',
      'Accessibility compliance testing (WCAG 2.1 AA) and multi-device workstation responsiveness.',
      'Interactive prototype validation with actual end-user operators.'
    ],
    gateCriteria: 'Design System Freeze and 100% User Acceptance of key workflow interactive prototypes.'
  },
  {
    num: 5,
    title: 'Development & Core Engineering',
    badge: 'Sprint Iterations',
    duration: 'Weeks 8 – 20+',
    objective: 'Test-driven software engineering organized into bi-weekly sprints with strict code governance.',
    activities: [
      'Isolated squad development utilizing GitFlow with mandatory two-peer senior engineer code reviews.',
      'Test-Driven Development (TDD) requiring minimum 85% unit test code coverage.',
      'Automated static code analysis (SonarQube) gating merge requests against security vulnerabilities.',
      'Continuous Integration (CI) producing containerized immutable artifacts tagged with git commit hashes.'
    ],
    gateCriteria: 'Successful bi-weekly sprint demos and clean automated security pipeline passes.'
  },
  {
    num: 6,
    title: 'Quality Assurance & Security Audits',
    badge: 'Verification',
    duration: 'Weeks 18 – 24',
    objective: 'Subjecting the integrated platform to adversarial attack simulations, chaotic failure injection, and load testing.',
    activities: [
      'Automated regression suites covering end-to-end API workflows and UI automation.',
      'Stress and chaos testing (JMeter / k6) simulating 500% expected peak transaction volumes.',
      'Dynamic Application Security Testing (DAST) and independent third-party penetration testing.',
      'User Acceptance Testing (UAT) executed by designated client test squads.'
    ],
    gateCriteria: 'Zero critical or high-severity vulnerabilities and formal UAT sign-off certificates.'
  },
  {
    num: 7,
    title: 'Integration & Canary Deployment',
    badge: 'Go-Live',
    duration: 'Weeks 22 – 26',
    objective: 'Seamless production deployment with zero business downtime and automated rollback safety nets.',
    activities: [
      'Final data migration and automated checksum validation across source and destination databases.',
      'Blue-green or canary release routing 5% of live traffic initially, monitoring latency metrics.',
      'Activation of 24/7 hypercare bridge with senior architects and database administrators on standby.',
      'Comprehensive operational runbook handover to internal client infrastructure teams.'
    ],
    gateCriteria: '100% traffic migration with stable error budgets and successful post-deployment smoke tests.'
  },
  {
    num: 8,
    title: 'Maintenance & SRE Support',
    badge: 'Continuous SLA',
    duration: 'Ongoing SLA',
    objective: 'Uncompromising 24/7/365 Site Reliability Engineering, proactive patching, and periodic architecture reviews.',
    activities: [
      '24/7 telemetry monitoring with automated pager escalation for SLA breaches (<15 min response for Tier 1).',
      'Monthly security patch cycles and third-party dependency vulnerability updates.',
      'Quarterly capacity planning and FinOps cloud spend optimization reviews.',
      'Semi-annual disaster recovery failover drill simulations.'
    ],
    gateCriteria: 'Monthly SLA compliance reports delivered to executive steering committee.'
  }
];

const DEFAULT_STANDARDS = [
  {
    id: 'std-1',
    title: 'Milestone Documentation',
    desc: 'No code is merged into production without accompanying OpenAPI contracts, database migration scripts, and architecture decision logs.'
  },
  {
    id: 'std-2',
    title: 'Continuous Security Testing',
    desc: 'Automated static and dynamic vulnerability analysis prevents secret leaks, SQL injection, and outdated dependency vulnerabilities.'
  },
  {
    id: 'std-3',
    title: 'Transparent Handover',
    desc: 'Our team conducts structured technical training sessions and hands over complete CI/CD configuration scripts, ensuring zero vendor hostage scenarios.'
  }
];

export default function OurApproachPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [phases, setPhases] = useState(DEFAULT_PHASES);
  const [standards, setStandards] = useState(DEFAULT_STANDARDS);
  const [selectedPhase, setSelectedPhase] = useState(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Check URL query param for live edit
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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=company-our-approach');
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
        const local = localStorage.getItem('a8_live_approach_content');
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
    if (Array.isArray(data.phases) && data.phases.length > 0) setPhases(data.phases);
    if (Array.isArray(data.standards) && data.standards.length > 0) setStandards(data.standards);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  // Save to Backend and LocalStorage
  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      phases,
      standards,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_approach_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'company-our-approach',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Our Approach lifecycle specifications saved and synchronized with MySQL!');
    } catch (e) {
      console.warn('Backend save error:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset engineering lifecycle framework to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setPhases(DEFAULT_PHASES);
      setStandards(DEFAULT_STANDARDS);
      localStorage.removeItem('a8_live_approach_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/company/our-approach', { replace: true });
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
    } else if (modalType === 'phase_edit') {
      const updated = [...phases];
      const activitiesArray = typeof modalData.activities === 'string'
        ? modalData.activities.split('\n').filter(a => a.trim())
        : (modalData.activities || []);
      updated[editingIndex] = {
        ...modalData,
        activities: activitiesArray
      };
      setPhases(updated);
    } else if (modalType === 'standard_edit') {
      const updated = [...standards];
      updated[editingIndex] = { ...modalData };
      setStandards(updated);
    }

    closeModal();
  };

  const isLive = editMode && !previewMode;
  const curPhase = phases.find(p => p.num === selectedPhase) || phases[0];
  const curPhaseIndex = phases.findIndex(p => p.num === selectedPhase);

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Engineering Lifecycle (/company/our-approach)"
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
            { label: 'Our Approach' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Deep-Dive Focused Phase Detail */}
      <section className="py-16 bg-white border-b border-slate-200 relative group">
        {isLive && (
          <div className="absolute top-6 right-8 z-30">
            <SectionHeaderEditButton
              onClick={() => openModal('phase_edit', {
                ...curPhase,
                activities: Array.isArray(curPhase.activities) ? curPhase.activities.join('\n') : curPhase.activities
              }, curPhaseIndex)}
              label={`Edit Stage 0${curPhase.num} Specifications`}
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-2xl p-8 lg:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start card-hover-approach-detail">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  0{curPhase.num}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                      Stage 0{curPhase.num} // {curPhase.badge}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500 font-mono">{curPhase.duration}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    {curPhase.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 font-sans leading-relaxed pt-2">
                {curPhase.objective}
              </p>

              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Core Activities &amp; Methodology
                </h4>
                <ul className="space-y-2.5">
                  {curPhase.activities && curPhase.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gate Exit Criteria Card */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 card-hover-gate-criteria">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Mandatory Stage Exit Gate</span>
              </div>

              <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 font-sans leading-relaxed">
                <strong>Quality Gate:</strong> {curPhase.gateCriteria}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Stage progression is blocked until all exit artifacts are certified in the corporate project tracking repository.
              </p>

              <div className="pt-2">
                <Link
                  to="/request-project"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Initiate Stage 01 Discovery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Lifecycle Flow Diagram Bar */}
      <section className="py-12 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              End-to-End Enterprise Process Flow
            </span>
            <h2 className="text-xl font-serif text-white mt-1">
              Deterministic 8-Stage Delivery Pipeline
            </h2>
          </div>

          {/* Interactive Flow Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {phases.map((phase) => {
              const isActive = selectedPhase === phase.num;
              return (
                <button
                  key={phase.num}
                  type="button"
                  onClick={() => setSelectedPhase(phase.num)}
                  className={`p-3 rounded-xl text-center transition-all border relative flex flex-col items-center cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 font-mono font-bold text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    0{phase.num}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                    Stage 0{phase.num}
                  </span>
                  <span className="text-xs font-bold mt-0.5 line-clamp-1">{phase.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive All-Phases Narrative Table */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Full Spectrum Execution
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              The 8 Pillars of Enterprise Delivery
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Review our complete end-to-end framework governing technical specifications, code verification, security, and continuous uptime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phases.map((p, idx) => (
              <div key={p.num} className="relative bg-white rounded-xl p-6 border border-slate-200 space-y-3 card-hover-stage-pillar group">
                {isLive && (
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => openModal('phase_edit', {
                        ...p,
                        activities: Array.isArray(p.activities) ? p.activities.join('\n') : p.activities
                      }, idx)}
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                      title={`Edit Stage 0${p.num}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-mono font-bold text-indigo-600">STAGE 0{p.num}</span>
                  <span className="text-xs font-mono text-slate-500">{p.duration}</span>
                </div>
                <h4 className="text-lg font-serif font-bold text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{p.objective}</p>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  <strong>Exit Deliverable:</strong> {p.gateCriteria}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Documentation & QA Standards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {standards.map((std, idx) => (
              <div key={std.id || idx} className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-qa-spec group">
                {isLive && (
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => openModal('standard_edit', { ...std }, idx)}
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                      title="Edit Standard"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <FileCode className="w-6 h-6 text-indigo-600" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">{std.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {std.desc}
                </p>
              </div>
            ))}
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
          modalType === 'phase_edit' ? `Edit Stage 0${modalData.num}: ${modalData.title || ''}` :
          modalType === 'standard_edit' ? `Edit Standard: ${modalData.title || ''}` : 'Edit Section'
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

        {/* Phase Edit Modal */}
        {modalType === 'phase_edit' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stage Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={modalData.badge || ''}
                  onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Duration</label>
              <input
                type="text"
                value={modalData.duration || ''}
                onChange={(e) => setModalData({ ...modalData, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Objective Summary</label>
              <textarea
                rows={3}
                required
                value={modalData.objective || ''}
                onChange={(e) => setModalData({ ...modalData, objective: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Core Activities (one per line)
              </label>
              <textarea
                rows={4}
                value={modalData.activities || ''}
                onChange={(e) => setModalData({ ...modalData, activities: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mandatory Stage Exit Gate Criteria
              </label>
              <textarea
                rows={2}
                value={modalData.gateCriteria || ''}
                onChange={(e) => setModalData({ ...modalData, gateCriteria: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Standard Edit Modal */}
        {modalType === 'standard_edit' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Standard Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                required
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
