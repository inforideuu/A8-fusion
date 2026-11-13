import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { servicesData } from '../data/servicesData';
import { solutionsData } from '../data/solutionsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Server, 
  HelpCircle,
  ChevronRight,
  Terminal,
  FileCheck,
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

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const defaultService = servicesData.find(s => s.slug === slug);

  // If service doesn't exist in data, redirect
  if (!defaultService) {
    return <Navigate to="/services" replace />;
  }

  // Live Editor State
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState({
    badge: 'Enterprise Service Practice',
    title: defaultService.title,
    subtitle: defaultService.heroSubtitle || defaultService.overview,
    bgImage: '/services.png',
    primaryCtaText: 'Discuss This Practice Area',
    primaryCtaLink: `/request-project?service=${defaultService.slug}`,
    secondaryCtaText: 'All Services Overview',
    secondaryCtaLink: '/services'
  });

  const [scope, setScope] = useState({
    tag: 'Engineering Scope',
    title: 'Architectural Integrity for Mission-Critical Needs',
    tagline: defaultService.tagline,
    overview: defaultService.overview,
    technologies: [...(defaultService.technologies || [])]
  });

  const [capabilitiesHeader, setCapabilitiesHeader] = useState({
    title: 'Key Technical Capabilities',
    specBadge: 'VERIFIED SPEC'
  });
  const [capabilities, setCapabilities] = useState([...(defaultService.capabilities || [])]);

  const [challengesHeader, setChallengesHeader] = useState({
    tag: 'Problem Domain',
    title: 'Business Challenges We Mitigate',
    desc: 'Addressing systemic bottlenecks, regulatory hurdles, and architectural vulnerabilities.'
  });
  const [challenges, setChallenges] = useState([...(defaultService.challenges || [])]);

  const [roadmapHeader, setRoadmapHeader] = useState({
    tag: 'Engineering Execution',
    title: 'Our Implementation Roadmap',
    desc: 'A structured lifecycle delivering predictable results and zero unexpected downtime.'
  });
  const [approach, setApproach] = useState([...(defaultService.approach || [])]);

  const [industriesHeader, setIndustriesHeader] = useState({
    tag: 'Domain Applicability',
    title: 'Sectors Leveraging This Practice',
    desc: 'Our practice is tuned to vertical statutory guidelines and throughput realities across international markets.'
  });
  const [industries, setIndustries] = useState([...(defaultService.industries || [])]);

  const [faqsHeader, setFaqsHeader] = useState({
    tag: 'Architectural Clarity',
    title: 'Frequently Addressed Technical Questions'
  });
  const [faqs, setFaqs] = useState([...(defaultService.faqs || [])]);

  const [cta, setCta] = useState({
    title: `Initiate Architecture Discovery for ${defaultService.title}`,
    desc: 'Connect with our Principal Systems Architects to evaluate technical requirements, security boundaries, and delivery timelines.',
    ctaText: 'Submit Enterprise Project Scope',
    ctaLink: `/request-project?service=${defaultService.slug}`
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
  const storageKey = `a8_live_service_${slug}`;
  const backendSlug = `service-${slug}`;

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
    if (data.scope) setScope(data.scope);
    if (data.capabilitiesHeader) setCapabilitiesHeader(data.capabilitiesHeader);
    if (Array.isArray(data.capabilities)) setCapabilities(data.capabilities);
    if (data.challengesHeader) setChallengesHeader(data.challengesHeader);
    if (Array.isArray(data.challenges)) setChallenges(data.challenges);
    if (data.roadmapHeader) setRoadmapHeader(data.roadmapHeader);
    if (Array.isArray(data.approach)) setApproach(data.approach);
    if (data.industriesHeader) setIndustriesHeader(data.industriesHeader);
    if (Array.isArray(data.industries)) setIndustries(data.industries);
    if (data.faqsHeader) setFaqsHeader(data.faqsHeader);
    if (Array.isArray(data.faqs)) setFaqs(data.faqs);
    if (data.cta) setCta(data.cta);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      scope,
      capabilitiesHeader,
      capabilities,
      challengesHeader,
      challenges,
      roadmapHeader,
      approach,
      industriesHeader,
      industries,
      faqsHeader,
      faqs,
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
      alert(`Service specification for "${defaultService.title}" saved and synchronized with MySQL!`);
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this service page back to factory specifications?')) {
      setPageHeader({
        badge: 'Enterprise Service Practice',
        title: defaultService.title,
        subtitle: defaultService.heroSubtitle || defaultService.overview,
        bgImage: '/services.png',
        primaryCtaText: 'Discuss This Practice Area',
        primaryCtaLink: `/request-project?service=${defaultService.slug}`,
        secondaryCtaText: 'All Services Overview',
        secondaryCtaLink: '/services'
      });
      setScope({
        tag: 'Engineering Scope',
        title: 'Architectural Integrity for Mission-Critical Needs',
        tagline: defaultService.tagline,
        overview: defaultService.overview,
        technologies: [...(defaultService.technologies || [])]
      });
      setCapabilitiesHeader({
        title: 'Key Technical Capabilities',
        specBadge: 'VERIFIED SPEC'
      });
      setCapabilities([...(defaultService.capabilities || [])]);
      setChallengesHeader({
        tag: 'Problem Domain',
        title: 'Business Challenges We Mitigate',
        desc: 'Addressing systemic bottlenecks, regulatory hurdles, and architectural vulnerabilities.'
      });
      setChallenges([...(defaultService.challenges || [])]);
      setRoadmapHeader({
        tag: 'Engineering Execution',
        title: 'Our Implementation Roadmap',
        desc: 'A structured lifecycle delivering predictable results and zero unexpected downtime.'
      });
      setApproach([...(defaultService.approach || [])]);
      setIndustriesHeader({
        tag: 'Domain Applicability',
        title: 'Sectors Leveraging This Practice',
        desc: 'Our practice is tuned to vertical statutory guidelines and throughput realities across international markets.'
      });
      setIndustries([...(defaultService.industries || [])]);
      setFaqsHeader({
        tag: 'Architectural Clarity',
        title: 'Frequently Addressed Technical Questions'
      });
      setFaqs([...(defaultService.faqs || [])]);
      setCta({
        title: `Initiate Architecture Discovery for ${defaultService.title}`,
        desc: 'Connect with our Principal Systems Architects to evaluate technical requirements, security boundaries, and delivery timelines.',
        ctaText: 'Submit Enterprise Project Scope',
        ctaLink: `/request-project?service=${defaultService.slug}`
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
    navigate(`/services/${slug}`, { replace: true });
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
    } else if (modalType === 'scope') {
      const techs = typeof modalData.technologiesText === 'string'
        ? modalData.technologiesText.split(',').map(s => s.trim()).filter(Boolean)
        : (modalData.technologies || scope.technologies);
      setScope({ ...modalData, technologies: techs });
    } else if (modalType === 'capabilities_header') {
      setCapabilitiesHeader({ ...modalData });
    } else if (modalType === 'capability_edit') {
      const updated = [...capabilities];
      updated[editingIndex] = modalData.text;
      setCapabilities(updated);
    } else if (modalType === 'capability_add') {
      if (modalData.text) setCapabilities([...capabilities, modalData.text]);
    } else if (modalType === 'challenges_header') {
      setChallengesHeader({ ...modalData });
    } else if (modalType === 'challenge_edit') {
      const updated = [...challenges];
      updated[editingIndex] = { ...modalData };
      setChallenges(updated);
    } else if (modalType === 'challenge_add') {
      setChallenges([...challenges, {
        title: modalData.title || 'New Challenge',
        description: modalData.description || 'Description of operational roadblock.'
      }]);
    } else if (modalType === 'roadmap_header') {
      setRoadmapHeader({ ...modalData });
    } else if (modalType === 'step_edit') {
      const updated = [...approach];
      updated[editingIndex] = { ...modalData };
      setApproach(updated);
    } else if (modalType === 'step_add') {
      setApproach([...approach, {
        step: modalData.step || `0${approach.length + 1}`,
        title: modalData.title || 'Implementation Phase',
        desc: modalData.desc || 'Phase deliverables and verification checkpoints.'
      }]);
    } else if (modalType === 'industries_header') {
      setIndustriesHeader({ ...modalData });
    } else if (modalType === 'industry_edit') {
      const updated = [...industries];
      updated[editingIndex] = modalData.name;
      setIndustries(updated);
    } else if (modalType === 'industry_add') {
      if (modalData.name) setIndustries([...industries, modalData.name]);
    } else if (modalType === 'faqs_header') {
      setFaqsHeader({ ...modalData });
    } else if (modalType === 'faq_edit') {
      const updated = [...faqs];
      updated[editingIndex] = { ...modalData };
      setFaqs(updated);
    } else if (modalType === 'faq_add') {
      setFaqs([...faqs, {
        q: modalData.q || 'Technical Question?',
        a: modalData.a || 'Detailed architectural explanation and compliance guarantee.'
      }]);
    } else if (modalType === 'cta') {
      setCta({ ...modalData });
    }

    closeModal();
  };

  const isLive = editMode && !previewMode;
  const relatedSolutions = solutionsData.slice(0, 3);

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName={`Service: ${defaultService.title} (/services/${slug})`}
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
              label="Edit Service Hero"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage}
          breadcrumbs={[
            { label: 'Services', link: '/services' },
            { label: pageHeader.title }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Overview & Key Capabilities */}
      <section className="py-20 bg-white border-b border-slate-200 relative group/section">
        {isLive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('scope', {
                ...scope,
                technologiesText: scope.technologies.join(', ')
              })}
              label="Edit Scope & Ecosystem"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {scope.tag}
              </span>
              <h2 className="text-3xl font-serif font-normal text-slate-900 leading-tight">
                {scope.title}
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              
              <p className="text-sm font-serif italic text-slate-700">
                "{scope.tagline}"
              </p>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                {scope.overview}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-tech-ecosystem">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                  Primary Technology Ecosystem
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scope.technologies.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono bg-white text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Capabilities Grid */}
            <div className="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-6 relative group/caps">
              {isLive && (
                <div className="flex justify-end gap-2">
                  <SectionHeaderEditButton
                    onClick={() => openModal('capabilities_header', { ...capabilitiesHeader })}
                    label="Edit Capabilities Header"
                  />
                </div>
              )}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {capabilitiesHeader.title}
                </h3>
                <span className="text-xs font-mono text-indigo-600">{capabilitiesHeader.specBadge}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((cap, i) => (
                  <div key={i} className="relative group/pill flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 card-hover-capability-pill">
                    {isLive && (
                      <CardActionOverlay
                        title={`Capability ${i + 1}`}
                        onEdit={() => openModal('capability_edit', { text: cap }, i)}
                        onDelete={() => {
                          if (window.confirm(`Delete capability "${cap}"?`)) {
                            setCapabilities(capabilities.filter((_, idx) => idx !== i));
                            markDirty();
                          }
                        }}
                      />
                    )}
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium pr-10">{cap}</span>
                  </div>
                ))}

                {isLive && (
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => openModal('capability_add', { text: '' })}
                      className="w-full py-2.5 px-4 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/70 hover:bg-white text-xs font-mono font-bold text-indigo-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Technical Capability</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Challenges We Solve */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative group/cheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('challenges_header', { ...challengesHeader })}
                  label="Edit Challenges Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {challengesHeader.tag}
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              {challengesHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {challengesHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((c, i) => (
              <div key={i} className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-challenge group">
                {isLive && (
                  <CardActionOverlay
                    title={c.title}
                    onEdit={() => openModal('challenge_edit', { ...c }, i)}
                    onDelete={() => {
                      if (window.confirm(`Delete challenge "${c.title}"?`)) {
                        setChallenges(challenges.filter((_, idx) => idx !== i));
                        markDirty();
                      }
                    }}
                  />
                )}
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{c.description}</p>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('challenge_add', {})}
                label="Add Challenge"
                subtitle="Add an operational roadblock or vulnerability"
              />
            )}
          </div>
        </div>
      </section>

      {/* Our Engineering Approach for this Service */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative group/rheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('roadmap_header', { ...roadmapHeader })}
                  label="Edit Roadmap Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {roadmapHeader.tag}
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              {roadmapHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {roadmapHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((st, i) => (
              <div key={st.step || i} className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-roadmap-step group">
                {isLive && (
                  <CardActionOverlay
                    title={st.title}
                    onEdit={() => openModal('step_edit', { ...st }, i)}
                    onDelete={() => {
                      if (window.confirm(`Delete phase "${st.title}"?`)) {
                        setApproach(approach.filter((_, idx) => idx !== i));
                        markDirty();
                      }
                    }}
                  />
                )}
                <span className="text-2xl font-serif font-bold text-indigo-600 block">{st.step}</span>
                <h4 className="text-base font-serif font-bold text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{st.desc}</p>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('step_add', {})}
                label="Add Roadmap Phase"
                subtitle="Add an engineering execution milestone"
              />
            )}
          </div>
        </div>
      </section>

      {/* Industries Served & Related Platforms */}
      <section className="py-20 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4 relative group/iheader">
              {isLive && (
                <div className="flex justify-start mb-2">
                  <SectionHeaderEditButton
                    onClick={() => openModal('industries_header', { ...industriesHeader })}
                    label="Edit Sectors Header"
                  />
                </div>
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
                {industriesHeader.tag}
              </span>
              <h2 className="text-3xl font-serif font-normal text-white">
                {industriesHeader.title}
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {industriesHeader.desc}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {industries.map((ind, i) => (
                  <div key={i} className="relative group/ind p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-between gap-2 card-hover-sector-pill">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>{ind}</span>
                    </div>
                    {isLive && (
                      <div className="flex items-center gap-1 opacity-0 group-hover/ind:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openModal('industry_edit', { name: ind }, i)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIndustries(industries.filter((_, idx) => idx !== i));
                            markDirty();
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isLive && (
                  <button
                    type="button"
                    onClick={() => openModal('industry_add', { name: '' })}
                    className="p-3 rounded-lg border border-dashed border-indigo-400/50 hover:border-indigo-400 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sector</span>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/90 p-8 rounded-2xl border border-slate-800 space-y-5">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                Related Enterprise Software Suites
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Pre-Built Platform Modules Available
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Accelerate implementation by pairing custom development with our audited platform modules.
              </p>
              <div className="space-y-3">
                {relatedSolutions.map(sol => (
                  <Link
                    key={sol.id}
                    to={`/solutions/${sol.slug}`}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 card-hover-suite-link flex items-center justify-between text-xs text-slate-200 group transition-all"
                  >
                    <div>
                      <span className="font-serif font-bold text-white group-hover:text-indigo-400">{sol.title}</span>
                      <span className="text-[10px] text-slate-500 block">{sol.tagline}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 relative group/faqheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('faqs_header', { ...faqsHeader })}
                  label="Edit FAQs Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {faqsHeader.tag}
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              {faqsHeader.title}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="relative p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-faq group">
                {isLive && (
                  <CardActionOverlay
                    title={faq.q}
                    onEdit={() => openModal('faq_edit', { ...faq }, i)}
                    onDelete={() => {
                      if (window.confirm(`Delete question "${faq.q}"?`)) {
                        setFaqs(faqs.filter((_, idx) => idx !== i));
                        markDirty();
                      }
                    }}
                  />
                )}
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <h4 className="text-base font-serif font-bold text-slate-900 pr-12">{faq.q}</h4>
                </div>
                <p className="text-xs text-slate-600 pl-8 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}

            {isLive && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openModal('faq_add', {})}
                  className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/50 text-xs font-mono font-bold text-indigo-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ Item</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final Project Enquiry CTA */}
      <section className="py-16 bg-[#F8FAFC] relative group/cta">
        {isLive && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('cta', { ...cta })}
              label="Edit CTA Box"
            />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {cta.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto leading-relaxed">
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
          modalType === 'header' ? 'Edit Service Hero Header' :
          modalType === 'scope' ? 'Edit Scope & Ecosystem' :
          modalType === 'capabilities_header' ? 'Edit Capabilities Header' :
          modalType === 'capability_edit' ? 'Edit Capability' :
          modalType === 'capability_add' ? 'Add Capability' :
          modalType === 'challenges_header' ? 'Edit Challenges Header' :
          modalType === 'challenge_edit' ? `Edit Challenge: ${modalData.title || ''}` :
          modalType === 'challenge_add' ? 'Add Business Challenge' :
          modalType === 'roadmap_header' ? 'Edit Roadmap Header' :
          modalType === 'step_edit' ? `Edit Phase: ${modalData.title || ''}` :
          modalType === 'step_add' ? 'Add Roadmap Phase' :
          modalType === 'industries_header' ? 'Edit Sectors Header' :
          modalType === 'industry_edit' ? 'Edit Sector' :
          modalType === 'industry_add' ? 'Add Sector' :
          modalType === 'faqs_header' ? 'Edit FAQs Header' :
          modalType === 'faq_edit' ? 'Edit Technical Question' :
          modalType === 'faq_add' ? 'Add Technical Question' :
          modalType === 'cta' ? 'Edit CTA Box' : 'Edit Section'
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

        {modalType === 'scope' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline Quote</label>
              <input
                type="text"
                value={modalData.tagline || ''}
                onChange={(e) => setModalData({ ...modalData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Overview Paragraph</label>
              <textarea
                rows={4}
                value={modalData.overview || ''}
                onChange={(e) => setModalData({ ...modalData, overview: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technologies (Comma-separated)</label>
              <input
                type="text"
                value={modalData.technologiesText || ''}
                onChange={(e) => setModalData({ ...modalData, technologiesText: e.target.value })}
                placeholder="e.g. Go, Rust, Kafka, Kubernetes, Distributed PostgreSQL"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'capabilities_header' && (
          <>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Spec Badge</label>
              <input
                type="text"
                value={modalData.specBadge || ''}
                onChange={(e) => setModalData({ ...modalData, specBadge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {(modalType === 'capability_edit' || modalType === 'capability_add') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capability Description</label>
            <textarea
              rows={3}
              required
              value={modalData.text || ''}
              onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              placeholder="e.g. Sub-millisecond distributed message queueing with Apache Kafka"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {modalType === 'challenges_header' && (
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

        {(modalType === 'challenge_edit' || modalType === 'challenge_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Challenge Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Uncontrolled Data Inconsistency Across Hubs"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={modalData.description || ''}
                onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                placeholder="Explain the architectural bottleneck and business impact..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'roadmap_header' && (
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

        {(modalType === 'step_edit' || modalType === 'step_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Step Number / Label</label>
              <input
                type="text"
                required
                value={modalData.step || ''}
                onChange={(e) => setModalData({ ...modalData, step: e.target.value })}
                placeholder="e.g. 01"
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
                placeholder="e.g. Architectural Blueprint & Concurrency Modeling"
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
                placeholder="Scope specifications, SLA benchmarks, and checkpoint signoffs..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'industries_header' && (
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

        {(modalType === 'industry_edit' || modalType === 'industry_add') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Industry Sector Name</label>
            <input
              type="text"
              required
              value={modalData.name || ''}
              onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              placeholder="e.g. Banking & Financial Institutions"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {modalType === 'faqs_header' && (
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
          </>
        )}

        {(modalType === 'faq_edit' || modalType === 'faq_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technical Question</label>
              <input
                type="text"
                required
                value={modalData.q || ''}
                onChange={(e) => setModalData({ ...modalData, q: e.target.value })}
                placeholder="e.g. How does this practice adhere to in-country data residency?"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Answer</label>
              <textarea
                rows={4}
                required
                value={modalData.a || ''}
                onChange={(e) => setModalData({ ...modalData, a: e.target.value })}
                placeholder="Explain the architectural mechanism, compliance standard, and security controls..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'cta' && (
          <>
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
