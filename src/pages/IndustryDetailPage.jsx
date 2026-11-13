import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import IndustryTopologyVisualizer from '../components/common/IndustryTopologyVisualizer';
import { industriesData } from '../data/industriesData';
import { solutionsData } from '../data/solutionsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Cpu, 
  Workflow, 
  BarChart3, 
  Boxes,
  HelpCircle,
  FileCheck2,
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

export default function IndustryDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If user requests /industries/government, redirect to the premier sovereign page
  if (slug === 'government') {
    return <Navigate to="/government" replace />;
  }

  const defaultIndustry = industriesData.find(ind => ind.slug === slug);

  if (!defaultIndustry) {
    return <Navigate to="/industries" replace />;
  }

  // Live Editor State
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState({
    badge: 'Sector Technology Suite',
    title: defaultIndustry.title,
    subtitle: defaultIndustry.tagline,
    bgImage: '/industries.png',
    primaryCtaText: 'Discuss Industry Scope',
    primaryCtaLink: `/request-project?industry=${defaultIndustry.slug}`,
    secondaryCtaText: 'All Industries Catalog',
    secondaryCtaLink: '/industries'
  });

  const [foundations, setFoundations] = useState({
    tag: 'Sector Foundations',
    title: `Architectural Resilience Tailored for ${defaultIndustry.title}`,
    overview: defaultIndustry.overview
  });

  const [useCasesHeader, setUseCasesHeader] = useState({
    title: 'Verified Real-World Deployments & Scenarios'
  });
  const [useCases, setUseCases] = useState([...(defaultIndustry.useCases || [])]);

  const [challengesHeader, setChallengesHeader] = useState({
    title: 'Sector Operational Roadblocks We Resolve'
  });
  const [challenges, setChallenges] = useState([...(defaultIndustry.challenges || [])]);

  const [solutionsHeader, setSolutionsHeader] = useState({
    tag: 'Engineering Blueprints',
    title: 'Technology Solutions & Software Platforms',
    desc: 'Deploy modular applications engineered to integrate directly into active operational environments.'
  });
  const [solutions, setSolutions] = useState([...(defaultIndustry.solutions || [])]);

  const [automation, setAutomation] = useState({
    tag: 'Enterprise Automation',
    title: 'Intelligent Process Automation',
    desc: defaultIndustry.automation,
    bullet1: 'Human-in-the-loop exception handling',
    bullet2: 'Immutable audit trail of every automated execution'
  });

  const [analytics, setAnalytics] = useState({
    tag: 'Executive Telemetry',
    title: 'Data & Predictive Analytics',
    desc: defaultIndustry.analytics,
    bullet1: 'Real-time sub-second query streaming',
    bullet2: 'Fine-grained row and column level authorization'
  });

  const [cta, setCta] = useState({
    title: `Request an Industry Technical Evaluation for ${defaultIndustry.title}`,
    desc: 'Connect with our sector principal architects to analyze compliance readiness, data migration strategies, and platform integration.',
    ctaText: 'Initiate Sector Architecture Review',
    ctaLink: `/request-project?industry=${defaultIndustry.slug}`
  });

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
  const storageKey = `a8_live_industry_${slug}`;
  const backendSlug = `industry-${slug}`;

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/pages/get_live_content/?slug=${backendSlug}`);
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
        const local = localStorage.getItem(storageKey);
        if (local) {
          const parsed = JSON.parse(local);
          applyLoadedData(parsed);
        }
      } catch (err) {
        console.error('Error loading local data', err);
      }
    };

    loadContent();
  }, [slug]);

  const applyLoadedData = (data) => {
    if (data.pageHeader) setPageHeader(data.pageHeader);
    if (data.foundations) setFoundations(data.foundations);
    if (data.useCasesHeader) setUseCasesHeader(data.useCasesHeader);
    if (Array.isArray(data.useCases)) setUseCases(data.useCases);
    if (data.challengesHeader) setChallengesHeader(data.challengesHeader);
    if (Array.isArray(data.challenges)) setChallenges(data.challenges);
    if (data.solutionsHeader) setSolutionsHeader(data.solutionsHeader);
    if (Array.isArray(data.solutions)) setSolutions(data.solutions);
    if (data.automation) setAutomation(data.automation);
    if (data.analytics) setAnalytics(data.analytics);
    if (data.cta) setCta(data.cta);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      foundations,
      useCasesHeader,
      useCases,
      challengesHeader,
      challenges,
      solutionsHeader,
      solutions,
      automation,
      analytics,
      cta,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: backendSlug,
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert(`Sector specifications for "${defaultIndustry.title}" saved and synchronized with MySQL!`);
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this industry sector page back to default specifications?')) {
      setPageHeader({
        badge: 'Sector Technology Suite',
        title: defaultIndustry.title,
        subtitle: defaultIndustry.tagline,
        bgImage: '/industries.png',
        primaryCtaText: 'Discuss Industry Scope',
        primaryCtaLink: `/request-project?industry=${defaultIndustry.slug}`,
        secondaryCtaText: 'All Industries Catalog',
        secondaryCtaLink: '/industries'
      });
      setFoundations({
        tag: 'Sector Foundations',
        title: `Architectural Resilience Tailored for ${defaultIndustry.title}`,
        overview: defaultIndustry.overview
      });
      setUseCasesHeader({
        title: 'Verified Real-World Deployments & Scenarios'
      });
      setUseCases([...(defaultIndustry.useCases || [])]);
      setChallengesHeader({
        title: 'Sector Operational Roadblocks We Resolve'
      });
      setChallenges([...(defaultIndustry.challenges || [])]);
      setSolutionsHeader({
        tag: 'Engineering Blueprints',
        title: 'Technology Solutions & Software Platforms',
        desc: 'Deploy modular applications engineered to integrate directly into active operational environments.'
      });
      setSolutions([...(defaultIndustry.solutions || [])]);
      setAutomation({
        tag: 'Enterprise Automation',
        title: 'Intelligent Process Automation',
        desc: defaultIndustry.automation,
        bullet1: 'Human-in-the-loop exception handling',
        bullet2: 'Immutable audit trail of every automated execution'
      });
      setAnalytics({
        tag: 'Executive Telemetry',
        title: 'Data & Predictive Analytics',
        desc: defaultIndustry.analytics,
        bullet1: 'Real-time sub-second query streaming',
        bullet2: 'Fine-grained row and column level authorization'
      });
      setCta({
        title: `Request an Industry Technical Evaluation for ${defaultIndustry.title}`,
        desc: 'Connect with our sector principal architects to analyze compliance readiness, data migration strategies, and platform integration.',
        ctaText: 'Initiate Sector Architecture Review',
        ctaLink: `/request-project?industry=${defaultIndustry.slug}`
      });
      localStorage.removeItem(storageKey);
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate(`/industries/${slug}`, { replace: true });
  };

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
    } else if (modalType === 'foundations') {
      setFoundations({ ...modalData });
    } else if (modalType === 'usecases_header') {
      setUseCasesHeader({ ...modalData });
    } else if (modalType === 'usecase_edit') {
      const updated = [...useCases];
      updated[editingIndex] = modalData.text;
      setUseCases(updated);
    } else if (modalType === 'usecase_add') {
      if (modalData.text) setUseCases([...useCases, modalData.text]);
    } else if (modalType === 'challenges_header') {
      setChallengesHeader({ ...modalData });
    } else if (modalType === 'challenge_edit') {
      const updated = [...challenges];
      updated[editingIndex] = modalData.text;
      setChallenges(updated);
    } else if (modalType === 'challenge_add') {
      if (modalData.text) setChallenges([...challenges, modalData.text]);
    } else if (modalType === 'solutions_header') {
      setSolutionsHeader({ ...modalData });
    } else if (modalType === 'solution_edit') {
      const updated = [...solutions];
      updated[editingIndex] = modalData.text;
      setSolutions(updated);
    } else if (modalType === 'solution_add') {
      if (modalData.text) setSolutions([...solutions, modalData.text]);
    } else if (modalType === 'automation') {
      setAutomation({ ...modalData });
    } else if (modalType === 'analytics') {
      setAnalytics({ ...modalData });
    } else if (modalType === 'cta') {
      setCta({ ...modalData });
    }

    closeModal();
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName={`Industry: ${defaultIndustry.title} (/industries/${slug})`}
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
              label="Edit Industry Hero"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage}
          breadcrumbs={[
            { label: 'Industries', link: '/industries' },
            { label: pageHeader.title }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* 1. Industry Introduction & Responsive Architecture Flow */}
      <section className="py-20 bg-white border-b border-slate-200 relative group/foundations">
        {isLive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('foundations', { ...foundations })}
              label="Edit Foundations Narrative"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Sector Foundations & Deployments */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  {foundations.tag}
                </span>
                <h2 className="text-3xl font-serif font-normal text-slate-900 leading-tight">
                  {foundations.title}
                </h2>
                <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                
                <p className="text-sm text-slate-600 font-sans leading-relaxed pt-1">
                  {foundations.overview}
                </p>
              </div>

              {/* Verified Real-World Deployments */}
              <div className="space-y-2.5 relative group/deployments">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {useCasesHeader.title}
                  </h4>
                  {isLive && (
                    <SectionHeaderEditButton
                      onClick={() => openModal('usecases_header', { ...useCasesHeader })}
                      label="Edit Deployments Title"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  {useCases.map((uc, i) => (
                    <div key={i} className="relative group/uc p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 card-hover-deployment-row">
                      {isLive && (
                        <CardActionOverlay
                          title={`Scenario ${i + 1}`}
                          onEdit={() => openModal('usecase_edit', { text: uc }, i)}
                          onDelete={() => {
                            if (window.confirm(`Delete deployment scenario "${uc}"?`)) {
                              setUseCases(useCases.filter((_, idx) => idx !== i));
                              markDirty();
                            }
                          }}
                        />
                      )}
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="pr-12">{uc}</span>
                    </div>
                  ))}
                  {isLive && (
                    <button
                      type="button"
                      onClick={() => openModal('usecase_add', { text: '' })}
                      className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/70 hover:bg-white text-xs font-mono font-bold text-indigo-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Deployment Scenario</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Responsive Creative Diagram */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <IndustryTopologyVisualizer industry={defaultIndustry} />
            </div>
          </div>

          {/* Sector Operational Roadblocks We Resolve */}
          <div className="mt-14 pt-10 border-t border-slate-200 relative group/challenges">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider font-mono">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{challengesHeader.title}</span>
              </div>
              {isLive && (
                <SectionHeaderEditButton
                  onClick={() => openModal('challenges_header', { ...challengesHeader })}
                  label="Edit Roadblocks Title"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {challenges.map((ch, i) => (
                <div key={i} className="relative p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-roadblock group">
                  {isLive && (
                    <CardActionOverlay
                      title={`Roadblock ${i + 1}`}
                      onEdit={() => openModal('challenge_edit', { text: ch }, i)}
                      onDelete={() => {
                        if (window.confirm(`Delete roadblock "${ch}"?`)) {
                          setChallenges(challenges.filter((_, idx) => idx !== i));
                          markDirty();
                        }
                      }}
                    />
                  )}
                  <div className="text-[11px] font-mono font-bold text-rose-600">VULNERABILITY 0{i + 1}</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{ch}</p>
                </div>
              ))}
              {isLive && (
                <AddCardButton
                  onClick={() => openModal('challenge_add', { text: '' })}
                  label="Add Roadblock"
                  subtitle="Add an operational vulnerability"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Relevant Technology Solutions & Platforms */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative group/solsheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('solutions_header', { ...solutionsHeader })}
                  label="Edit Solutions Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {solutionsHeader.tag}
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              {solutionsHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {solutionsHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((sol, i) => (
              <div key={i} className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-sector-solution group">
                {isLive && (
                  <CardActionOverlay
                    title={`Solution ${i + 1}`}
                    onEdit={() => openModal('solution_edit', { text: sol }, i)}
                    onDelete={() => {
                      if (window.confirm(`Delete solution "${sol}"?`)) {
                        setSolutions(solutions.filter((_, idx) => idx !== i));
                        markDirty();
                      }
                    }}
                  />
                )}
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold text-xs">
                  0{i + 1}
                </div>
                <h4 className="text-base font-serif font-bold text-slate-900">{sol}</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Tailored integration supporting local regulatory mandates, automated audit logs, and multi-tenant department security boundaries.
                </p>
              </div>
            ))}
            {isLive && (
              <AddCardButton
                onClick={() => openModal('solution_add', { text: '' })}
                label="Add Solution Blueprint"
                subtitle="Add an enterprise software application"
              />
            )}
          </div>
        </div>
      </section>

      {/* 5, 6, 7. Automation, Data Analytics & Integration */}
      <section className="py-20 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Automation Opportunities */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 card-hover-sector-automation relative group/auto">
              {isLive && (
                <div className="absolute top-4 right-4 z-20">
                  <SectionHeaderEditButton
                    onClick={() => openModal('automation', { ...automation })}
                    label="Edit Automation"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono uppercase tracking-wider">
                <Workflow className="w-4 h-4" />
                <span>{automation.tag}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {automation.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {automation.desc}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" /> {automation.bullet1}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" /> {automation.bullet2}</li>
              </ul>
            </div>

            {/* Analytics & Data Telemetry */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 card-hover-sector-analytics relative group/analytics">
              {isLive && (
                <div className="absolute top-4 right-4 z-20">
                  <SectionHeaderEditButton
                    onClick={() => openModal('analytics', { ...analytics })}
                    label="Edit Telemetry"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" />
                <span>{analytics.tag}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white">
                {analytics.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {analytics.desc}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {analytics.bullet1}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {analytics.bullet2}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative group/cta">
        {isLive && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('cta', { ...cta })}
              label="Edit Review CTA"
            />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif font-normal text-slate-900">
            {cta.title}
          </h2>
          <p className="text-sm text-slate-600 font-sans max-w-xl mx-auto leading-relaxed">
            {cta.desc}
          </p>
          <div className="pt-2">
            <Link
              to={cta.ctaLink}
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>{cta.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Industry Hero Header' :
          modalType === 'foundations' ? 'Edit Foundations Narrative' :
          modalType === 'usecases_header' ? 'Edit Deployments Header' :
          modalType === 'usecase_edit' ? 'Edit Deployment Scenario' :
          modalType === 'usecase_add' ? 'Add Deployment Scenario' :
          modalType === 'challenges_header' ? 'Edit Roadblocks Header' :
          modalType === 'challenge_edit' ? 'Edit Operational Roadblock' :
          modalType === 'challenge_add' ? 'Add Operational Roadblock' :
          modalType === 'solutions_header' ? 'Edit Solutions Header' :
          modalType === 'solution_edit' ? 'Edit Solution Blueprint' :
          modalType === 'solution_add' ? 'Add Solution Blueprint' :
          modalType === 'automation' ? 'Edit Automation Section' :
          modalType === 'analytics' ? 'Edit Telemetry Section' :
          modalType === 'cta' ? 'Edit Architecture Review CTA' : 'Edit Section'
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline Subtitle</label>
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

        {modalType === 'foundations' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Overview Description</label>
              <textarea
                rows={4}
                value={modalData.overview || ''}
                onChange={(e) => setModalData({ ...modalData, overview: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'usecases_header' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
            <input
              type="text"
              value={modalData.title || ''}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {(modalType === 'usecase_edit' || modalType === 'usecase_add') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deployment Scenario</label>
            <textarea
              rows={3}
              required
              value={modalData.text || ''}
              onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              placeholder="e.g. Sovereign core banking migration with sub-millisecond settlement"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {modalType === 'challenges_header' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
            <input
              type="text"
              value={modalData.title || ''}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {(modalType === 'challenge_edit' || modalType === 'challenge_add') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Roadblock / Vulnerability</label>
            <textarea
              rows={3}
              required
              value={modalData.text || ''}
              onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              placeholder="e.g. Fragmented legacy compliance silos across sovereign boundaries"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {modalType === 'solutions_header' && (
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

        {(modalType === 'solution_edit' || modalType === 'solution_add') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Solution Blueprint Name</label>
            <input
              type="text"
              required
              value={modalData.text || ''}
              onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              placeholder="e.g. Algorithmic Ledger & Real-Time Settlement Engine"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {modalType === 'automation' && (
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
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bullet Point 1</label>
              <input
                type="text"
                value={modalData.bullet1 || ''}
                onChange={(e) => setModalData({ ...modalData, bullet1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bullet Point 2</label>
              <input
                type="text"
                value={modalData.bullet2 || ''}
                onChange={(e) => setModalData({ ...modalData, bullet2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'analytics' && (
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
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bullet Point 1</label>
              <input
                type="text"
                value={modalData.bullet1 || ''}
                onChange={(e) => setModalData({ ...modalData, bullet1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bullet Point 2</label>
              <input
                type="text"
                value={modalData.bullet2 || ''}
                onChange={(e) => setModalData({ ...modalData, bullet2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'cta' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={modalData.ctaText || ''}
                  onChange={(e) => setModalData({ ...modalData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Button Link</label>
                <input
                  type="text"
                  value={modalData.ctaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
