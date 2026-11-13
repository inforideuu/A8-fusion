import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Cpu, 
  Server, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Award,
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
  badge: 'Corporate Identity',
  title: 'Engineering Excellence for Global Enterprises & Sovereign Institutions',
  subtitle: 'A8Fusion was established with a single foundational charter: to design, build, and maintain mission-critical software systems capable of operating under intense regulatory scrutiny, extreme concurrency, and generational scale.',
  bgImage: '/aboutus.png',
  primaryCtaText: 'Discuss an Enterprise Project',
  primaryCtaLink: '/request-project',
  secondaryCtaText: 'Explore Leadership',
  secondaryCtaLink: '/company/leadership'
};

const DEFAULT_INTRO = {
  tag: 'Corporate Foundations',
  title: 'An Independent Enterprise Technology Corporation',
  desc1: 'A8Fusion operates with its own independent corporate identity, engineering leadership, and dedicated product portfolio. We do not provide generic agency services. Instead, we architect sovereign digital infrastructure, private artificial intelligence platforms, and high-concurrency enterprise resource planning systems.',
  desc2: 'Our engineering practices are intentionally designed to counter the common failure modes of large-scale IT projects: opaque codebases, inflated vendor licensing, and fragile architectures that collapse under production workloads.',
  image: '/office_interior.jpg',
  metric1Val: '100%',
  metric1Label: 'Independent Architecture',
  metric2Val: 'Zero',
  metric2Label: 'Proprietary Lock-in',
  metric3Val: 'Multi-Region',
  metric3Label: 'Delivery Governance'
};

const DEFAULT_CHARTERS = {
  headerTag: 'Corporate Direction',
  headerTitle: 'Vision & Strategic Mission',
  headerDesc: 'The foundational charters defining our architectural sovereignty and commitment to mission-critical engineering.',
  visionBadge: 'CHARTER 01',
  visionTag: 'Our Strategic Vision',
  visionTitle: 'To become a globally recognised technology company delivering intelligent, scalable and impactful digital solutions.',
  visionDesc: 'We envision a future where public sector agencies and multinational enterprises possess total sovereignty over their computing infrastructure, free from monopolistic vendor traps and opaque algorithmic black boxes.',
  missionBadge: 'CHARTER 02',
  missionTag: 'Our Engineering Mission',
  missionTitle: 'To engineer advanced technology platforms that solve complex organisational challenges and enable sustainable digital transformation.',
  missionDesc: 'We exist to translate intricate institutional workflows, regulatory constraints, and high-frequency data streams into stable, secure, and intuitive digital backbones.'
};

const DEFAULT_PRINCIPLES = [
  {
    id: 'prin-1',
    num: '01',
    title: 'Uncompromising Architectural Rigor',
    desc: 'Formal schema definitions, typed API contracts, and Architecture Decision Records (ADRs) signed off before any sprint begins.'
  },
  {
    id: 'prin-2',
    num: '02',
    title: 'Sovereign Data & Infrastructure',
    desc: 'Complete customer data residency in-country with zero foreign ingress, air-gapped enclaves, and full cryptographic audit trails.'
  },
  {
    id: 'prin-3',
    num: '03',
    title: 'Deterministic Engineering Delivery',
    desc: 'Continuous automated regression tests, static security gating, peer-reviewed pull requests, and automated deployment pipelines.'
  },
  {
    id: 'prin-4',
    num: '04',
    title: 'Institutional Fiduciary Accountability',
    desc: 'Executive board sponsorship on every major contract with transparent milestone SLAs and 100% intellectual property handover.'
  }
];

const DEFAULT_COMMITMENTS = {
  tag: 'Engineering Governance',
  title: 'Our Commitment to Enterprise Clients',
  desc: 'When an enterprise or sovereign entity entrusts A8Fusion with its technology platform, we honor that mandate with unwavering fiduciary discipline.',
  points: [
    {
      id: 'cmt-1',
      title: 'Zero Technical Ambiguity',
      desc: 'Formal schema definitions, API contracts, and milestone exit criteria established prior to sprint execution.'
    },
    {
      id: 'cmt-2',
      title: 'Complete IP Ownership',
      desc: '100% of custom application code, build scripts, and configuration repositories belong unconditionally to the client.'
    },
    {
      id: 'cmt-3',
      title: 'Strict Confidentiality',
      desc: 'All engineers operate under comprehensive non-disclosure agreements with isolated VPN enclaves and cleanroom development workstations.'
    }
  ],
  frameworkLinkText: 'Explore Our 8-Stage Project Lifecycle',
  frameworkLinkUrl: '/company/our-approach',
  oversightTitle: 'Leadership Oversight',
  oversightDesc: 'Every enterprise deployment is sponsored by an executive board member, ensuring direct escalation paths and board-level accountability throughout the engagement lifecycle.',
  oversightBadge: 'EXECUTIVE_STEERING_ACTIVE',
  oversightLinkText: 'Meet the Executive Team',
  oversightLinkUrl: '/company/leadership'
};

const DEFAULT_CTA = {
  tag: 'Initiate Contact',
  title: "Let's Discuss Your Institutional Objectives",
  desc: 'Schedule a confidential technical discovery session with our senior systems architects and international delivery leads.',
  primaryText: 'Request Project Proposal',
  primaryLink: '/request-project',
  secondaryText: 'Corporate Contact Office',
  secondaryLink: '/contact'
};

export default function AboutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isLiveEditParam = searchParams.get('live_edit') === 'true';

  // Live Editor State
  const [editMode, setEditMode] = useState(isLiveEditParam);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic Content State
  const [headerData, setHeaderData] = useState(DEFAULT_PAGE_HEADER);
  const [introData, setIntroData] = useState(DEFAULT_INTRO);
  const [chartersData, setChartersData] = useState(DEFAULT_CHARTERS);
  const [principlesList, setPrinciplesList] = useState(DEFAULT_PRINCIPLES);
  const [commitmentsData, setCommitmentsData] = useState(DEFAULT_COMMITMENTS);
  const [ctaData, setCtaData] = useState(DEFAULT_CTA);

  // Modal State for In-Context Editing
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Load Content from Backend / Cache
  useEffect(() => {
    async function loadData() {
      try {
        const cached = localStorage.getItem('a8_live_about_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.headerData) setHeaderData(parsed.headerData);
          if (parsed.introData) setIntroData(parsed.introData);
          if (parsed.chartersData) setChartersData(parsed.chartersData);
          if (parsed.principlesList) setPrinciplesList(parsed.principlesList);
          if (parsed.commitmentsData) setCommitmentsData(parsed.commitmentsData);
          if (parsed.ctaData) setCtaData(parsed.ctaData);
        }

        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=about');
        if (res.ok) {
          const json = await res.json();
          if (json && json.live_data && Object.keys(json.live_data).length > 0) {
            const ld = json.live_data;
            if (ld.headerData) setHeaderData(ld.headerData);
            if (ld.introData) setIntroData(ld.introData);
            if (ld.chartersData) setChartersData(ld.chartersData);
            if (ld.principlesList) setPrinciplesList(ld.principlesList);
            if (ld.commitmentsData) setCommitmentsData(ld.commitmentsData);
            if (ld.ctaData) setCtaData(ld.ctaData);
            localStorage.setItem('a8_live_about_content', JSON.stringify(ld));
          }
        }
      } catch (err) {
        console.warn('Backend live data not reachable, using local state', err);
      }
    }
    loadData();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      headerData,
      introData,
      chartersData,
      principlesList,
      commitmentsData,
      ctaData
    };

    try {
      localStorage.setItem('a8_live_about_content', JSON.stringify(payload));
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('a8_admin_token') ? { 'Authorization': `Token ${localStorage.getItem('a8_admin_token')}` } : {})
        },
        body: JSON.stringify({ slug: 'about', live_data: payload })
      });

      if (res.ok) {
        setIsDirty(false);
        alert('About Us page live changes permanently saved to MySQL and published!');
      } else {
        alert('Changes saved locally.');
      }
    } catch (err) {
      console.error(err);
      alert('Saved to local storage.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Restore About Us page content back to factory defaults?')) return;
    setHeaderData(DEFAULT_PAGE_HEADER);
    setIntroData(DEFAULT_INTRO);
    setChartersData(DEFAULT_CHARTERS);
    setPrinciplesList(DEFAULT_PRINCIPLES);
    setCommitmentsData(DEFAULT_COMMITMENTS);
    setCtaData(DEFAULT_CTA);
    localStorage.removeItem('a8_live_about_content');
    setIsDirty(true);
  };

  const handleExitEditor = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard and return to Admin Dashboard?')) return;
    }
    navigate('/admin');
  };

  // --- Modal Openers ---
  const openEditHeader = () => {
    setModalType('pageHeader');
    setModalTitle('Edit Page Header & Hero Banner');
    setModalData({ ...headerData });
    setModalOpen(true);
  };

  const openEditIntro = () => {
    setModalType('intro');
    setModalTitle('Edit Corporate Introduction & Metrics');
    setModalData({ ...introData });
    setModalOpen(true);
  };

  const openEditChartersHeader = () => {
    setModalType('chartersHeader');
    setModalTitle('Edit Vision & Mission Header');
    setModalData({
      headerTag: chartersData.headerTag,
      headerTitle: chartersData.headerTitle,
      headerDesc: chartersData.headerDesc
    });
    setModalOpen(true);
  };

  const openEditVision = () => {
    setModalType('vision');
    setModalTitle('Edit Strategic Vision Charter');
    setModalData({
      visionBadge: chartersData.visionBadge,
      visionTag: chartersData.visionTag,
      visionTitle: chartersData.visionTitle,
      visionDesc: chartersData.visionDesc
    });
    setModalOpen(true);
  };

  const openEditMission = () => {
    setModalType('mission');
    setModalTitle('Edit Engineering Mission Charter');
    setModalData({
      missionBadge: chartersData.missionBadge,
      missionTag: chartersData.missionTag,
      missionTitle: chartersData.missionTitle,
      missionDesc: chartersData.missionDesc
    });
    setModalOpen(true);
  };

  const openEditPrinciple = (prin, idx) => {
    setModalType('principle');
    setModalTitle(`Edit Core Principle 0${idx + 1}`);
    setModalData({ ...prin });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddPrinciple = () => {
    setModalType('principle');
    setModalTitle('Add New Corporate Principle');
    const num = String(principlesList.length + 1).padStart(2, '0');
    setModalData({
      id: `prin-${Date.now()}`,
      num,
      title: '',
      desc: ''
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeletePrinciple = (id, title) => {
    if (!window.confirm(`Delete principle "${title}"?`)) return;
    setPrinciplesList(prev => prev.filter(p => p.id !== id));
    setIsDirty(true);
  };

  const openEditCommitmentsHeader = () => {
    setModalType('commitmentHeader');
    setModalTitle('Edit Commitment to Clients Header');
    setModalData({
      tag: commitmentsData.tag,
      title: commitmentsData.title,
      desc: commitmentsData.desc,
      frameworkLinkText: commitmentsData.frameworkLinkText,
      frameworkLinkUrl: commitmentsData.frameworkLinkUrl
    });
    setModalOpen(true);
  };

  const openEditCommitmentPoint = (point, idx) => {
    setModalType('commitment');
    setModalTitle(`Edit Commitment Guarantee: ${point.title}`);
    setModalData({ ...point });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddCommitmentPoint = () => {
    setModalType('commitment');
    setModalTitle('Add New Commitment Guarantee');
    setModalData({
      id: `cmt-${Date.now()}`,
      title: '',
      desc: ''
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteCommitmentPoint = (id, title) => {
    if (!window.confirm(`Delete commitment guarantee "${title}"?`)) return;
    setCommitmentsData(prev => ({
      ...prev,
      points: prev.points.filter(p => p.id !== id)
    }));
    setIsDirty(true);
  };

  const openEditOversight = () => {
    setModalType('oversight');
    setModalTitle('Edit Leadership Oversight Panel');
    setModalData({
      oversightTitle: commitmentsData.oversightTitle,
      oversightDesc: commitmentsData.oversightDesc,
      oversightBadge: commitmentsData.oversightBadge,
      oversightLinkText: commitmentsData.oversightLinkText,
      oversightLinkUrl: commitmentsData.oversightLinkUrl
    });
    setModalOpen(true);
  };

  const openEditCta = () => {
    setModalType('cta');
    setModalTitle('Edit Contact CTA Banner');
    setModalData({ ...ctaData });
    setModalOpen(true);
  };

  // Modal Submit Handler
  const handleModalSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'pageHeader') {
      setHeaderData(modalData);
    } else if (modalType === 'intro') {
      setIntroData(modalData);
    } else if (modalType === 'chartersHeader') {
      setChartersData(prev => ({ ...prev, ...modalData }));
    } else if (modalType === 'vision') {
      setChartersData(prev => ({ ...prev, ...modalData }));
    } else if (modalType === 'mission') {
      setChartersData(prev => ({ ...prev, ...modalData }));
    } else if (modalType === 'principle') {
      if (editingIndex !== null) {
        setPrinciplesList(prev => prev.map((p, i) => i === editingIndex ? modalData : p));
      } else {
        setPrinciplesList(prev => [...prev, modalData]);
      }
    } else if (modalType === 'commitmentHeader') {
      setCommitmentsData(prev => ({ ...prev, ...modalData }));
    } else if (modalType === 'commitment') {
      if (editingIndex !== null) {
        setCommitmentsData(prev => ({
          ...prev,
          points: prev.points.map((p, i) => i === editingIndex ? modalData : p)
        }));
      } else {
        setCommitmentsData(prev => ({
          ...prev,
          points: [...prev.points, modalData]
        }));
      }
    } else if (modalType === 'oversight') {
      setCommitmentsData(prev => ({ ...prev, ...modalData }));
    } else if (modalType === 'cta') {
      setCtaData(modalData);
    }

    setIsDirty(true);
    setModalOpen(false);
  };

  const isLiveActive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] text-slate-900 ${editMode ? 'pt-10' : ''}`}>
      {/* FLOATING TOPBAR FOR LIVE IN-CONTEXT VISUAL EDITOR */}
      {editMode && (
        <LiveEditorToolbar
          pageName="About Us (/about)"
          isDirty={isDirty}
          saving={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onReset={handleResetDefaults}
          onSave={handleSaveAll}
          onExit={handleExitEditor}
        />
      )}

      {/* 1. Page Header with Live Edit Button */}
      <div className="relative">
        {isLiveActive && (
          <div className="absolute top-4 right-4 z-40">
            <button
              type="button"
              onClick={openEditHeader}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Page Header</span>
            </button>
          </div>
        )}
        <PageHeader
          badge={headerData.badge}
          title={headerData.title}
          subtitle={headerData.subtitle}
          bgImage={headerData.bgImage}
          breadcrumbs={[
            { label: 'Company', link: '/company/about' },
            { label: 'About Us' }
          ]}
          primaryCtaText={headerData.primaryCtaText}
          primaryCtaLink={headerData.primaryCtaLink}
          secondaryCtaText={headerData.secondaryCtaText}
          secondaryCtaLink={headerData.secondaryCtaLink}
        />
      </div>

      {/* 2. Company Introduction */}
      <section className="py-20 bg-white border-b border-slate-200 relative">
        {isLiveActive && (
          <div className="absolute top-4 right-4 z-30">
            <button
              type="button"
              onClick={openEditIntro}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Intro &amp; Metrics</span>
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {introData.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                {introData.title}
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              <p className="text-sm text-slate-600 font-sans leading-relaxed text-justify">
                {introData.desc1}
              </p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed text-justify">
                {introData.desc2}
              </p>

              <div className="pt-2 flex items-center gap-6">
                <div>
                  <div className="text-2xl font-serif font-bold text-slate-900">{introData.metric1Val}</div>
                  <div className="text-xs text-slate-500 font-mono">{introData.metric1Label}</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-2xl font-serif font-bold text-slate-900">{introData.metric2Val}</div>
                  <div className="text-xs text-slate-500 font-mono">{introData.metric2Label}</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-2xl font-serif font-bold text-slate-900">{introData.metric3Val}</div>
                  <div className="text-xs text-slate-500 font-mono">{introData.metric3Label}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 w-full h-[380px] sm:h-[440px] lg:h-[480px] relative group">
                <img
                  src={introData.image}
                  alt="A8Fusion Corporate Engineering Headquarters"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Vision and Mission (Charters) */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {chartersData.headerTag}
              </span>
              {isLiveActive && (
                <SectionHeaderEditButton onClick={openEditChartersHeader} label="Edit Header" />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {chartersData.headerTitle}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {chartersData.headerDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden group card-hover-vision flex flex-col justify-between">
              {isLiveActive && (
                <div className="absolute top-4 right-4 z-30">
                  <button
                    type="button"
                    onClick={openEditVision}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Vision</span>
                  </button>
                </div>
              )}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:from-indigo-200/40 transition-colors duration-500"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/80 text-indigo-700 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-indigo-400 transition-all duration-300">
                    <Compass className="w-7 h-7 text-indigo-600 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
                    {chartersData.visionBadge}
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold tracking-widest text-indigo-600 block">
                    {chartersData.visionTag}
                  </span>
                  <div className="pl-4 border-l-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug group-hover:text-indigo-950 transition-colors">
                      {chartersData.visionTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-2">
                  {chartersData.visionDesc}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden group card-hover-mission flex flex-col justify-between">
              {isLiveActive && (
                <div className="absolute top-4 right-4 z-30">
                  <button
                    type="button"
                    onClick={openEditMission}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Mission</span>
                  </button>
                </div>
              )}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:from-blue-200/40 transition-colors duration-500"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/80 text-blue-700 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-blue-400 transition-all duration-300">
                    <Target className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs">
                    {chartersData.missionBadge}
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold tracking-widest text-blue-600 block">
                    {chartersData.missionTag}
                  </span>
                  <div className="pl-4 border-l-2 border-blue-500/30 group-hover:border-blue-500 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug group-hover:text-blue-950 transition-colors">
                      {chartersData.missionTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-2">
                  {chartersData.missionDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Values and Technology Philosophy (CRUD-Enabled) */}
      <section className="py-20 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Technology Philosophy &amp; Corporate Values
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Our engineering philosophy dictates that elegance is the byproduct of structural simplicity, rigorous testing, and ethical transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principlesList.map((prin, i) => (
              <div key={prin.id || i} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-philosophy relative">
                {isLiveActive && (
                  <CardActionOverlay
                    title="Principle"
                    onEdit={() => openEditPrinciple(prin, i)}
                    onDelete={() => handleDeletePrinciple(prin.id, prin.title)}
                  />
                )}
                <span className="text-xs font-mono font-bold text-indigo-600">
                  PRINCIPLE 0{i + 1}
                </span>
                <h4 className="text-base font-serif font-bold text-slate-900">{prin.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{prin.desc}</p>
              </div>
            ))}

            {isLiveActive && (
              <AddCardButton
                onClick={openAddPrinciple}
                label="Add Principle"
                subtitle="Insert new institutional value or philosophy"
              />
            )}
          </div>
        </div>
      </section>

      {/* 6. Engineering Approach & Commitment to Clients */}
      <section className="py-20 bg-[#0B172A] text-white border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
                  {commitmentsData.tag}
                </span>
                {isLiveActive && (
                  <SectionHeaderEditButton onClick={openEditCommitmentsHeader} label="Edit Header" />
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
                {commitmentsData.title}
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {commitmentsData.desc}
              </p>
              <div className="space-y-3 text-xs text-slate-300 font-sans">
                {(commitmentsData.points || []).map((point, idx) => (
                  <div key={point.id || idx} className="flex items-start justify-between gap-3 p-2 rounded-lg hover:bg-slate-800/40 group relative">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">{point.title}:</strong> {point.desc}
                      </span>
                    </div>
                    {isLiveActive && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditCommitmentPoint(point, idx)}
                          className="p-1 rounded bg-slate-800 text-indigo-400 hover:text-white"
                          title="Edit Point"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCommitmentPoint(point.id, point.title)}
                          className="p-1 rounded bg-slate-800 text-red-400 hover:text-white"
                          title="Delete Point"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {isLiveActive && (
                  <button
                    type="button"
                    onClick={openAddCommitmentPoint}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-indigo-400 text-indigo-300 hover:text-white text-xs mt-2"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Commitment Guarantee</span>
                  </button>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to={commitmentsData.frameworkLinkUrl || '/company/our-approach'}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
                >
                  <span>{commitmentsData.frameworkLinkText || 'Explore Our 8-Stage Project Lifecycle'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4 card-hover-about-governance relative">
              {isLiveActive && (
                <div className="absolute top-4 right-4 z-30">
                  <button
                    type="button"
                    onClick={openEditOversight}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Oversight</span>
                  </button>
                </div>
              )}
              <h3 className="font-serif font-bold text-white text-lg">
                {commitmentsData.oversightTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {commitmentsData.oversightDesc}
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs font-mono text-indigo-400">
                  {commitmentsData.oversightBadge}
                </span>
                <Link
                  to={commitmentsData.oversightLinkUrl || '/company/leadership'}
                  className="text-xs text-white font-bold hover:text-indigo-400 flex items-center gap-1"
                >
                  <span>{commitmentsData.oversightLinkText || 'Meet the Executive Team'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact CTA Banner */}
      <section className="py-20 bg-white relative">
        {isLiveActive && (
          <div className="absolute top-4 right-4 z-30">
            <button
              type="button"
              onClick={openEditCta}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit CTA Banner</span>
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
            {ctaData.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
            {ctaData.title}
          </h2>
          <p className="text-sm text-slate-600 font-sans max-w-2xl mx-auto">
            {ctaData.desc}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={ctaData.primaryLink || '/request-project'}
              className="px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              {ctaData.primaryText || 'Request Project Proposal'}
            </Link>
            <Link
              to={ctaData.secondaryLink || '/contact'}
              className="px-7 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all"
            >
              {ctaData.secondaryText || 'Corporate Contact Office'}
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE EDITOR MODAL DIALOG */}
      <LiveEditorModal
        isOpen={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSubmit}
      >
        {/* Page Header Form */}
        {modalType === 'pageHeader' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">BADGE</label>
              <input
                type="text"
                value={modalData.badge || ''}
                onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SUBTITLE</label>
              <textarea
                rows="3"
                value={modalData.subtitle || ''}
                onChange={(e) => setModalData({ ...modalData, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY CTA TEXT</label>
                <input
                  type="text"
                  value={modalData.primaryCtaText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY CTA LINK</label>
                <input
                  type="text"
                  value={modalData.primaryCtaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">HERO BACKGROUND IMAGE URL</label>
              <input
                type="text"
                value={modalData.bgImage || ''}
                onChange={(e) => setModalData({ ...modalData, bgImage: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {/* Intro Form */}
        {modalType === 'intro' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">HEADING</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PARAGRAPH 1</label>
              <textarea
                rows="3"
                value={modalData.desc1 || ''}
                onChange={(e) => setModalData({ ...modalData, desc1: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PARAGRAPH 2</label>
              <textarea
                rows="3"
                value={modalData.desc2 || ''}
                onChange={(e) => setModalData({ ...modalData, desc2: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">METRIC 1</label>
                <input
                  type="text"
                  placeholder="100%"
                  value={modalData.metric1Val || ''}
                  onChange={(e) => setModalData({ ...modalData, metric1Val: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={modalData.metric1Label || ''}
                  onChange={(e) => setModalData({ ...modalData, metric1Label: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">METRIC 2</label>
                <input
                  type="text"
                  placeholder="Zero"
                  value={modalData.metric2Val || ''}
                  onChange={(e) => setModalData({ ...modalData, metric2Val: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={modalData.metric2Label || ''}
                  onChange={(e) => setModalData({ ...modalData, metric2Label: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] mt-1"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">METRIC 3</label>
                <input
                  type="text"
                  placeholder="Multi-Region"
                  value={modalData.metric3Val || ''}
                  onChange={(e) => setModalData({ ...modalData, metric3Val: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={modalData.metric3Label || ''}
                  onChange={(e) => setModalData({ ...modalData, metric3Label: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] mt-1"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">IMAGE URL</label>
              <input
                type="text"
                value={modalData.image || ''}
                onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {/* Charters Header Form */}
        {modalType === 'chartersHeader' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">TAG</label>
              <input
                type="text"
                value={modalData.headerTag || ''}
                onChange={(e) => setModalData({ ...modalData, headerTag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TITLE</label>
              <input
                type="text"
                required
                value={modalData.headerTitle || ''}
                onChange={(e) => setModalData({ ...modalData, headerTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
              <textarea
                rows="3"
                value={modalData.headerDesc || ''}
                onChange={(e) => setModalData({ ...modalData, headerDesc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Vision Form */}
        {modalType === 'vision' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CHARTER BADGE</label>
              <input
                type="text"
                value={modalData.visionBadge || ''}
                onChange={(e) => setModalData({ ...modalData, visionBadge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TAG</label>
              <input
                type="text"
                value={modalData.visionTag || ''}
                onChange={(e) => setModalData({ ...modalData, visionTag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">VISION HEADLINE</label>
              <textarea
                rows="3"
                required
                value={modalData.visionTitle || ''}
                onChange={(e) => setModalData({ ...modalData, visionTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">VISION ELABORATION</label>
              <textarea
                rows="3"
                value={modalData.visionDesc || ''}
                onChange={(e) => setModalData({ ...modalData, visionDesc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Mission Form */}
        {modalType === 'mission' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CHARTER BADGE</label>
              <input
                type="text"
                value={modalData.missionBadge || ''}
                onChange={(e) => setModalData({ ...modalData, missionBadge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TAG</label>
              <input
                type="text"
                value={modalData.missionTag || ''}
                onChange={(e) => setModalData({ ...modalData, missionTag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">MISSION HEADLINE</label>
              <textarea
                rows="3"
                required
                value={modalData.missionTitle || ''}
                onChange={(e) => setModalData({ ...modalData, missionTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">MISSION ELABORATION</label>
              <textarea
                rows="3"
                value={modalData.missionDesc || ''}
                onChange={(e) => setModalData({ ...modalData, missionDesc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Core Principle Form */}
        {modalType === 'principle' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PRINCIPLE NUMBER</label>
              <input
                type="text"
                value={modalData.num || ''}
                onChange={(e) => setModalData({ ...modalData, num: e.target.value })}
                placeholder="01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Uncompromising Architectural Rigor"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Explain the foundational principle..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Commitment Header Form */}
        {modalType === 'commitmentHeader' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">HEADING</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
              <textarea
                rows="3"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">LINK TEXT</label>
                <input
                  type="text"
                  value={modalData.frameworkLinkText || ''}
                  onChange={(e) => setModalData({ ...modalData, frameworkLinkText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">LINK URL</label>
                <input
                  type="text"
                  value={modalData.frameworkLinkUrl || ''}
                  onChange={(e) => setModalData({ ...modalData, frameworkLinkUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Commitment Point Form */}
        {modalType === 'commitment' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">GUARANTEE TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Zero Technical Ambiguity"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">GUARANTEE DESCRIPTION</label>
              <textarea
                rows="3"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Formal schema definitions, API contracts..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Leadership Oversight Box Form */}
        {modalType === 'oversight' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">TITLE</label>
              <input
                type="text"
                required
                value={modalData.oversightTitle || ''}
                onChange={(e) => setModalData({ ...modalData, oversightTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
              <textarea
                rows="3"
                value={modalData.oversightDesc || ''}
                onChange={(e) => setModalData({ ...modalData, oversightDesc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">STATUS BADGE</label>
              <input
                type="text"
                value={modalData.oversightBadge || ''}
                onChange={(e) => setModalData({ ...modalData, oversightBadge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">BUTTON TEXT</label>
                <input
                  type="text"
                  value={modalData.oversightLinkText || ''}
                  onChange={(e) => setModalData({ ...modalData, oversightLinkText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">DESTINATION URL</label>
                <input
                  type="text"
                  value={modalData.oversightLinkUrl || ''}
                  onChange={(e) => setModalData({ ...modalData, oversightLinkUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA Form */}
        {modalType === 'cta' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
              <textarea
                rows="3"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY BUTTON TEXT</label>
                <input
                  type="text"
                  value={modalData.primaryText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY BUTTON LINK</label>
                <input
                  type="text"
                  value={modalData.primaryLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SECONDARY BUTTON TEXT</label>
                <input
                  type="text"
                  value={modalData.secondaryText || ''}
                  onChange={(e) => setModalData({ ...modalData, secondaryText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">SECONDARY BUTTON LINK</label>
                <input
                  type="text"
                  value={modalData.secondaryLink || ''}
                  onChange={(e) => setModalData({ ...modalData, secondaryLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </LiveEditorModal>
    </div>
  );
}
