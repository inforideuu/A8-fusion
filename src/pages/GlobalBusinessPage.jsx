import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import GlobalGlobe3D from '../components/common/GlobalGlobe3D';
import { 
  Globe2, 
  ShieldCheck, 
  Building2, 
  Users2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  MapPin,
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
  badge: 'International Enterprise Practice',
  title: 'Global Business & Technology Partnerships',
  subtitle: 'Bridging international corporate standards with sovereign regulatory compliance. We architect, deliver, and govern enterprise technology for multinationals and institutional partners across major global hubs.',
  bgImage: '/global.png',
  primaryCtaText: 'Explore Strategic Partnerships',
  primaryCtaLink: '/partnerships',
  secondaryCtaText: 'Enterprise Project Scope',
  secondaryCtaLink: '/request-project'
};

const DEFAULT_POSITIONING = {
  tag: 'International Positioning',
  title: 'Engineering Discipline Without Geographical Boundaries',
  p1: 'As multinational corporations expand across Southeast Asia, the Middle East, and Europe, they face severe architectural fragmentation: divergent statutory reporting rules, varying data residency mandates, and incompatible regional software silos.',
  p2: 'A8Fusion acts as the central engineering backbone. We unify global technology roadmaps while respecting domestic sovereignty laws, providing international enterprises with the architectural predictability required for sustainable global scale.',
  disclosureTitle: 'ETHICAL DISCLOSURE PRINCIPLE:',
  disclosureDesc: 'A8Fusion lists only verified operational presence and authorized delivery hubs in Singapore, the UAE, and the UK. We reject artificial international representations.'
};

const DEFAULT_TOPOLOGY = {
  tag: 'Real-Time Sovereign Topology',
  title: 'Verified International Delivery Mesh',
  desc: 'Interactive 3D representation of our cross-border engineering corridors and synchronized sovereign data centers.'
};

const DEFAULT_CAPS_HEADER = {
  tag: 'Global Operations',
  title: 'International Delivery Capabilities',
  desc: 'Predictable, milestone-gated software engineering orchestrated across distributed international squads.'
};

const DEFAULT_DELIVERY_CAPS = [
  {
    id: 'cap-1',
    title: 'Dedicated Engineering Squads',
    desc: 'Cross-functional engineering pods (Lead Architect, 4 Senior Engineers, DevOps Lead, QA Specialist) assigned exclusively to client portfolios.'
  },
  {
    id: 'cap-2',
    title: 'Cross-Border System Integration',
    desc: 'Synchronizing multi-currency ledgers, disparate regional subsidiaries, and cross-border regulatory reporting pipelines in real-time.'
  },
  {
    id: 'cap-3',
    title: 'Enterprise Software Contracts',
    desc: 'Formal master services agreements (MSAs) featuring transparent milestone definitions, performance SLAs, and source code protection.'
  },
  {
    id: 'cap-4',
    title: 'International Partner Ecosystem',
    desc: 'Structured co-delivery consortiums with accredited local system integrators, compliance auditors, and sovereign cloud infrastructure providers.'
  }
];

const DEFAULT_MARKETS = [
  { 
    id: 'mkt-1',
    country: 'Singapore', 
    region: 'Asia-Pacific HQ Hub', 
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    focus: 'Financial technology, maritime logistics cores, high-concurrency cloud engineering, and ASEAN enterprise integration.' 
  },
  { 
    id: 'mkt-2',
    country: 'United Arab Emirates', 
    region: 'Middle East & GCC', 
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    focus: 'Sovereign cloud infrastructure, smart city municipal platforms, digital citizen portals, and government advisory.' 
  },
  { 
    id: 'mkt-3',
    country: 'United Kingdom', 
    region: 'EMEA & Western Europe', 
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    focus: 'Enterprise ERP modernization, financial compliance, cross-border system integration, and GDPR data governance.' 
  },
  { 
    id: 'mkt-4',
    country: 'Malaysia', 
    region: 'Southeast Asia Delivery', 
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    focus: 'Industrial IoT shop-floor systems, multi-branch supply chain integration, and enterprise software engineering squads.' 
  },
  { 
    id: 'mkt-5',
    country: 'European Union', 
    region: 'Continental Europe', 
    image: 'https://images.unsplash.com/photo-1546726747-421c6d69c929?auto=format&fit=crop&w=800&q=80',
    focus: 'Sovereign AI implementations, private cloud migrations, and institutional healthcare technology frameworks.' 
  },
  { 
    id: 'mkt-6',
    country: 'Selected International Markets', 
    region: 'Global Institutional', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    focus: 'Strategic systems partnerships, global technology outsourcing contracts, and capital infrastructure software.' 
  }
];

export default function GlobalBusinessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [positioning, setPositioning] = useState(DEFAULT_POSITIONING);
  const [topology, setTopology] = useState(DEFAULT_TOPOLOGY);
  const [capsHeader, setCapsHeader] = useState(DEFAULT_CAPS_HEADER);
  const [deliveryCaps, setDeliveryCaps] = useState(DEFAULT_DELIVERY_CAPS);
  const [targetMarkets, setTargetMarkets] = useState(DEFAULT_MARKETS);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=global-business');
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
        const local = localStorage.getItem('a8_live_global_content');
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
    if (data.positioning) setPositioning(data.positioning);
    if (data.topology) setTopology(data.topology);
    if (data.capsHeader) setCapsHeader(data.capsHeader);
    if (Array.isArray(data.deliveryCaps) && data.deliveryCaps.length > 0) setDeliveryCaps(data.deliveryCaps);
    if (Array.isArray(data.targetMarkets) && data.targetMarkets.length > 0) setTargetMarkets(data.targetMarkets);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      positioning,
      topology,
      capsHeader,
      deliveryCaps,
      targetMarkets,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_global_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'global-business',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Global Business specifications saved and synchronized successfully!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Global Business sections back to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setPositioning(DEFAULT_POSITIONING);
      setTopology(DEFAULT_TOPOLOGY);
      setCapsHeader(DEFAULT_CAPS_HEADER);
      setDeliveryCaps(DEFAULT_DELIVERY_CAPS);
      setTargetMarkets(DEFAULT_MARKETS);
      localStorage.removeItem('a8_live_global_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/global-business', { replace: true });
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
    } else if (modalType === 'positioning') {
      setPositioning({ ...modalData });
    } else if (modalType === 'topology') {
      setTopology({ ...modalData });
    } else if (modalType === 'caps_header') {
      setCapsHeader({ ...modalData });
    } else if (modalType === 'cap_edit') {
      const updated = [...deliveryCaps];
      updated[editingIndex] = { ...modalData };
      setDeliveryCaps(updated);
    } else if (modalType === 'cap_add') {
      const newCap = {
        id: `cap-${Date.now()}`,
        title: modalData.title || 'New Delivery Capability',
        desc: modalData.desc || 'Delivery methodology and operational framework.'
      };
      setDeliveryCaps([...deliveryCaps, newCap]);
    } else if (modalType === 'market_edit') {
      const updated = [...targetMarkets];
      updated[editingIndex] = { ...modalData };
      setTargetMarkets(updated);
    } else if (modalType === 'market_add') {
      const newMarket = {
        id: `mkt-${Date.now()}`,
        country: modalData.country || 'New Jurisdiction',
        region: modalData.region || 'Regional Hub',
        image: modalData.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        focus: modalData.focus || 'Cross-border enterprise engineering and sovereign systems integration.'
      };
      setTargetMarkets([...targetMarkets, newMarket]);
    }

    closeModal();
  };

  const handleDeleteCap = (idx) => {
    if (window.confirm(`Delete capability "${deliveryCaps[idx].title}"?`)) {
      const updated = deliveryCaps.filter((_, i) => i !== idx);
      setDeliveryCaps(updated);
      markDirty();
    }
  };

  const handleDeleteMarket = (idx) => {
    if (window.confirm(`Delete jurisdiction "${targetMarkets[idx].country}"?`)) {
      const updated = targetMarkets.filter((_, i) => i !== idx);
      setTargetMarkets(updated);
      markDirty();
    }
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Global Business (/global-business)"
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
            { label: 'Global Business' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* 1. Global Business Introduction: Engineering Discipline Without Geographical Boundaries */}
      <section className="py-20 bg-white border-b border-slate-200 relative group">
        {isLive && (
          <div className="absolute top-6 right-8 z-30">
            <SectionHeaderEditButton
              onClick={() => openModal('positioning', { ...positioning })}
              label="Edit Positioning Section"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: International Positioning Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {positioning.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                {positioning.title}
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                {positioning.p1}
              </p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                {positioning.p2}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                <div className="text-indigo-700 font-bold">{positioning.disclosureTitle}</div>
                <p>
                  {positioning.disclosureDesc}
                </p>
              </div>
            </div>

            {/* Right Column: Global Business Image & Stat Badge */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-100 w-full h-[380px] sm:h-[440px] lg:h-[480px] relative group">
                <img
                  src="/global_business.jpg"
                  alt="A8Fusion Global Technology Consulting & International Engineering Architecture"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />
                
                {/* Floating Hub Connectivity Ribbon */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between text-white backdrop-blur-md bg-slate-950/60 p-3.5 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center text-white flex-shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold leading-tight">
                        Multi-Region Network
                      </div>
                      <div className="text-xs font-serif font-bold text-white leading-tight mt-0.5">
                        Coordinated Global Enterprise Delivery
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold hidden sm:inline">
                    SYNCHRONIZED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Model Pillars */}
          <div className="mt-12 pt-10 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-delivery-model">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <Building2 className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
                  <span>SYNCHRONIZED SQUADS</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Distributed sprints coordinated across UTC+0 to UTC+8 time zones, maintaining overlapping deployment windows.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-delivery-model">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
                  <span>REGULATORY ALIGNMENT</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Native compliance with GDPR (Europe), PDPA (Singapore &amp; Malaysia), and national cloud sovereignty statutes (UAE).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-delivery-model">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <Briefcase className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
                  <span>STANDARDIZED MSAs</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Structured under international arbitration frameworks (SIAC / LCIA) with transparent SLAs and total IP protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Global 3D Mesh Infrastructure Section: Verified International Delivery Mesh */}
      <section className="py-20 bg-[#060B18] text-white border-b border-slate-800 relative group">
        {isLive && (
          <div className="absolute top-6 right-8 z-30">
            <SectionHeaderEditButton
              onClick={() => openModal('topology', { ...topology })}
              label="Edit Mesh Section"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
              {topology.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              {topology.title}
            </h2>
            <p className="text-sm text-slate-300 font-sans">
              {topology.desc}
            </p>
          </div>
          <GlobalGlobe3D />
        </div>
      </section>

      {/* 3. Delivery Capabilities: International Delivery Capabilities */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200 relative group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative">
            {isLive && (
              <div className="mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('caps_header', { ...capsHeader })}
                  label="Edit Capabilities Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {capsHeader.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {capsHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {capsHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryCaps.map((cap, i) => (
              <div key={cap.id || i} className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-global-cap group transition-all">
                {isLive && (
                  <CardActionOverlay
                    title={cap.title}
                    onEdit={() => openModal('cap_edit', { ...cap }, i)}
                    onDelete={() => handleDeleteCap(i)}
                  />
                )}
                <span className="text-xs font-mono font-bold text-indigo-600">CAPABILITY 0{i + 1}</span>
                <h3 className="text-base font-serif font-bold text-slate-900">{cap.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{cap.desc}</p>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('cap_add', {})}
                label="Add Delivery Capability"
                subtitle="Add another international operational capability"
              />
            )}
          </div>
        </div>
      </section>

      {/* 4. Regional Market Focus with In-Context CRUD */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Strategic Jurisdictions · {targetMarkets.length} Regional Nodes
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 mt-1">
                Regional Market Focus &amp; Operations
              </h2>
            </div>
            {isLive && (
              <button
                type="button"
                onClick={() => openModal('market_add', {})}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Jurisdiction Node</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetMarkets.map((m, i) => (
              <div key={m.id || i} className="relative bg-white rounded-xl border border-slate-200 overflow-hidden card-hover-jurisdiction group flex flex-col justify-between transition-all">
                {/* Live Card Actions */}
                {isLive && (
                  <CardActionOverlay
                    title={m.country}
                    onEdit={() => openModal('market_edit', { ...m }, i)}
                    onDelete={() => handleDeleteMarket(i)}
                  />
                )}

                <div>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={m.image}
                      alt={`A8Fusion ${m.country} Sovereign Technology Delivery Hub - ${m.region}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-semibold block">
                        {m.region}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white drop-shadow-sm">
                        {m.country}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {m.focus}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-indigo-600 font-bold uppercase">
                  <span>Verified Jurisdiction</span>
                  <span className="text-slate-400">Node 0{i + 1}</span>
                </div>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('market_add', {})}
                label="Add Jurisdiction Node"
                subtitle="Add another sovereign market node to this network"
              />
            )}
          </div>
        </div>
      </section>

      {/* 5. International Enquiry CTA */}
      <section className="py-20 bg-[#0B172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
            Establish a Cross-Border Technology Engagement
          </h2>
          <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            Connect with our international engagement directors to discuss multi-country deployments, dedicated engineering teams, or strategic partnership consortiums.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/request-project"
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Submit International Project Scope</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/partnerships"
              className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Apply as Strategic Partner
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
          modalType === 'header' ? 'Edit Hero Header' :
          modalType === 'positioning' ? 'Edit International Positioning Section' :
          modalType === 'topology' ? 'Edit Verified Delivery Mesh Header' :
          modalType === 'caps_header' ? 'Edit Capabilities Section Header' :
          modalType === 'cap_edit' ? `Edit Capability: ${modalData.title || ''}` :
          modalType === 'cap_add' ? 'Add Delivery Capability' :
          modalType === 'market_edit' ? `Edit Jurisdiction: ${modalData.country || ''}` :
          modalType === 'market_add' ? 'Add Jurisdiction Node' : 'Edit Section'
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

        {/* Positioning Section Modal */}
        {modalType === 'positioning' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Paragraph 1</label>
              <textarea
                rows={3}
                value={modalData.p1 || ''}
                onChange={(e) => setModalData({ ...modalData, p1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Paragraph 2</label>
              <textarea
                rows={3}
                value={modalData.p2 || ''}
                onChange={(e) => setModalData({ ...modalData, p2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Disclosure Title</label>
                <input
                  type="text"
                  value={modalData.disclosureTitle || ''}
                  onChange={(e) => setModalData({ ...modalData, disclosureTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Disclosure Details</label>
                <textarea
                  rows={2}
                  value={modalData.disclosureDesc || ''}
                  onChange={(e) => setModalData({ ...modalData, disclosureDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}

        {/* Topology Mesh Modal */}
        {modalType === 'topology' && (
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

        {/* Capabilities Header Modal */}
        {modalType === 'caps_header' && (
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

        {/* Capability Add / Edit Modal */}
        {(modalType === 'cap_edit' || modalType === 'cap_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capability Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Dedicated Engineering Squads"
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
                placeholder="Operational scope, team constitution, and delivery standards..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Market Add / Edit Modal */}
        {(modalType === 'market_edit' || modalType === 'market_add') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country / Territory</label>
                <input
                  type="text"
                  required
                  value={modalData.country || ''}
                  onChange={(e) => setModalData({ ...modalData, country: e.target.value })}
                  placeholder="e.g. Singapore"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Region Badge</label>
                <input
                  type="text"
                  value={modalData.region || ''}
                  onChange={(e) => setModalData({ ...modalData, region: e.target.value })}
                  placeholder="e.g. Asia-Pacific HQ Hub"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photo Image URL</label>
              <input
                type="text"
                value={modalData.image || ''}
                onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Focus &amp; Capabilities</label>
              <textarea
                rows={3}
                required
                value={modalData.focus || ''}
                onChange={(e) => setModalData({ ...modalData, focus: e.target.value })}
                placeholder="Financial technology, maritime logistics cores, high-concurrency cloud engineering..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
