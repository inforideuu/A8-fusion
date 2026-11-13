import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Quote, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  Sparkles
} from 'lucide-react';
import { leadershipData as defaultLeadersData } from '../../data/leadershipData';
import {
  LiveEditorToolbar,
  CardActionOverlay,
  AddCardButton,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../../admin/components/LiveEditorControls';

const DEFAULT_PAGE_HEADER = {
  badge: 'Executive Governance',
  title: 'Leadership & Corporate Governance',
  subtitle: 'Our leadership team unites deep academic computer science credentials, decades of sovereign infrastructure advisory, and proven track records directing multi-national enterprise transformations.',
  bgImage: '/aboutus.png',
  primaryCtaText: 'Contact Executive Office',
  primaryCtaLink: '/contact',
  secondaryCtaText: 'Our Engineering Approach',
  secondaryCtaLink: '/company/our-approach'
};

const DEFAULT_STEWARDSHIP = {
  tag: 'Board Stewardship',
  title: 'Steered by Seasoned Systems Architects & Sovereign Advisors',
  desc: 'At A8Fusion, our executive directors remain active engineers and architects. We do not manage from detached ivory towers; our senior leadership personally reviews technical designs, stress-tests security architectures, and engages directly with client steering committees.'
};

const DEFAULT_GOVERNANCE = {
  tag: 'Institutional Accountability',
  title: 'Corporate Governance & Ethics',
  desc: 'Our governance model ensures total auditability, statutory compliance, and transparent fiduciary stewardship for every client engagement.',
  cards: [
    {
      id: 'gov-1',
      title: 'Independent Steering Committees',
      desc: 'For major government infrastructure and enterprise platform deployments, A8Fusion establishes an independent project steering committee composed of client stakeholders, principal architects, and sovereign security leads. Meeting monthly, this committee governs scope, evaluates risk registers, and signs off on formal milestone deliverables.',
      points: [
        'Formal Architecture Decision Records (ADRs) signed off by both parties',
        'Quarterly external third-party vulnerability penetration audits',
        'Uncompromised source code escrow protection options'
      ]
    },
    {
      id: 'gov-2',
      title: 'Anti-Bribery, Sanctions & Sovereign Compliance',
      desc: 'A8Fusion operates under strict zero-tolerance policies regarding bribery, corrupt practices, or illegal software licensing. We comply with all international sanctions, export control mandates, and regional data localization regulations across APAC, the GCC, and Europe.',
      points: [
        'Strict anti-corruption and fair competition policy',
        'Whistleblower protection and anonymous reporting channel',
        'Regular governance reviews managed through institutional oversight committees'
      ]
    }
  ]
};

const DEFAULT_CONTACT_CTA = {
  title: 'Engage Directly With Executive Leadership',
  desc: 'For institutional partnerships, strategic public-sector tenders, or executive technology evaluations, reach our corporate boardroom directly.',
  btnText: 'Schedule Executive Briefing',
  btnLink: '/contact'
};

export default function LeadershipPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [stewardship, setStewardship] = useState(DEFAULT_STEWARDSHIP);
  const [leaders, setLeaders] = useState(defaultLeadersData);
  const [governance, setGovernance] = useState(DEFAULT_GOVERNANCE);
  const [contactCta, setContactCta] = useState(DEFAULT_CONTACT_CTA);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Initialize Edit Mode via URL param
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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=company-leadership');
        if (res.ok) {
          const json = await res.json();
          if (json.live_data && Object.keys(json.live_data).length > 0) {
            applyLoadedData(json.live_data);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend unavailable, trying localStorage...', e);
      }

      try {
        const local = localStorage.getItem('a8_live_leadership_content');
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
    if (data.stewardship) setStewardship(data.stewardship);
    if (Array.isArray(data.leaders) && data.leaders.length > 0) setLeaders(data.leaders);
    if (data.governance) setGovernance(data.governance);
    if (data.contactCta) setContactCta(data.contactCta);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  // Save to Backend and LocalStorage
  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      stewardship,
      leaders,
      governance,
      contactCta,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_leadership_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'company-leadership',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Leadership page changes successfully saved and synchronized with MySQL!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved locally in your browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Leadership page content back to default factory settings?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setStewardship(DEFAULT_STEWARDSHIP);
      setLeaders(defaultLeadersData);
      setGovernance(DEFAULT_GOVERNANCE);
      setContactCta(DEFAULT_CONTACT_CTA);
      localStorage.removeItem('a8_live_leadership_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/company/leadership', { replace: true });
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
    } else if (modalType === 'stewardship') {
      setStewardship({ ...modalData });
    } else if (modalType === 'leader_edit') {
      const updated = [...leaders];
      updated[editingIndex] = { ...modalData };
      setLeaders(updated);
    } else if (modalType === 'leader_add') {
      const newLeader = {
        id: `lead-${Date.now()}`,
        name: modalData.name || 'Executive Name',
        designation: modalData.designation || 'Executive Designation',
        department: modalData.department || 'Corporate Division',
        experience: modalData.experience || '15+ Years Enterprise Experience',
        education: modalData.education || 'Credentials & Academic Degree',
        bio: modalData.bio || 'Executive profile and career background detailing sovereign advisory and engineering leadership.',
        philosophy: modalData.philosophy || 'Core architectural and governance philosophy.',
        focus: modalData.focus || 'Key operational focus areas.',
        linkedin: modalData.linkedin || 'https://linkedin.com/company/a8fusion',
        image: modalData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      };
      setLeaders([...leaders, newLeader]);
    } else if (modalType === 'governance_header') {
      setGovernance({
        ...governance,
        tag: modalData.tag,
        title: modalData.title,
        desc: modalData.desc
      });
    } else if (modalType === 'governance_card_edit') {
      const updatedCards = [...governance.cards];
      const pointsArray = typeof modalData.points === 'string'
        ? modalData.points.split('\n').filter(p => p.trim())
        : (modalData.points || []);
      updatedCards[editingIndex] = {
        ...modalData,
        points: pointsArray
      };
      setGovernance({ ...governance, cards: updatedCards });
    } else if (modalType === 'governance_card_add') {
      const pointsArray = typeof modalData.points === 'string'
        ? modalData.points.split('\n').filter(p => p.trim())
        : (modalData.points || ['Statutory regulatory compliance', 'Independent quarterly audits']);
      const newCard = {
        id: `gov-${Date.now()}`,
        title: modalData.title || 'Governance Charter',
        desc: modalData.desc || 'Policy and institutional framework description.',
        points: pointsArray
      };
      setGovernance({ ...governance, cards: [...governance.cards, newCard] });
    } else if (modalType === 'contact_cta') {
      setContactCta({ ...modalData });
    }

    closeModal();
  };

  const handleDeleteLeader = (idx) => {
    if (window.confirm(`Delete leader "${leaders[idx].name}" from the corporate roster?`)) {
      const updated = leaders.filter((_, i) => i !== idx);
      setLeaders(updated);
      markDirty();
    }
  };

  const handleDeleteGovernanceCard = (idx) => {
    if (window.confirm(`Delete governance card "${governance.cards[idx].title}"?`)) {
      const updated = governance.cards.filter((_, i) => i !== idx);
      setGovernance({ ...governance, cards: updated });
      markDirty();
    }
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Leadership & Corporate Governance (/company/leadership)"
          isDirty={isDirty}
          saving={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onReset={handleReset}
          onSave={handleSaveAll}
          onExit={handleExit}
        />
      )}

      {/* Hero / Page Header with In-Context Live Editing */}
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
            { label: 'Leadership' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* 1. Board Stewardship Intro Section */}
      <section className="py-16 bg-white border-b border-slate-200 relative group">
        {isLive && (
          <div className="absolute top-4 right-6 z-20">
            <SectionHeaderEditButton
              onClick={() => openModal('stewardship', { ...stewardship })}
              label="Edit Board Stewardship"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {stewardship.tag}
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              {stewardship.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              {stewardship.desc}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Executive Roster (Full CRUD: Add, Edit, Delete) */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                Executive Roster · {leaders.length} Active Directors
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                Executive Leadership &amp; Architectural Principals
              </h3>
            </div>
            {isLive && (
              <button
                type="button"
                onClick={() => openModal('leader_add', {})}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Executive Leader</span>
              </button>
            )}
          </div>

          <div className="space-y-12">
            {leaders.map((leader, index) => (
              <div
                key={leader.id || index}
                className="relative bg-white rounded-2xl border border-slate-200 p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-hover-executive group transition-all"
              >
                {/* Live Card Actions */}
                {isLive && (
                  <CardActionOverlay
                    title={leader.name}
                    onEdit={() => openModal('leader_edit', { ...leader }, index)}
                    onDelete={() => handleDeleteLeader(index)}
                  />
                )}

                {/* Profile Photo & Vital Stats */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                  <div className="relative">
                    <img
                      src={leader.image}
                      alt={`${leader.name} - ${leader.designation} at A8Fusion`}
                      className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute -bottom-3 right-2 bg-indigo-600 text-white p-2 rounded-lg shadow">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wide">
                      {leader.designation}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      {leader.department}
                    </span>
                  </div>

                  {leader.linkedin && (
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-[#0077b5] text-white flex items-center justify-center text-[10px] font-bold">in</span>
                      <span>Verified Executive Profile</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>

                {/* Detailed Biography, Experience & Philosophy */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Experience & Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{leader.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{leader.education}</span>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Executive Background
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      {leader.bio}
                    </p>
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Key Responsibilities &amp; Focus
                    </h4>
                    <p className="text-xs text-slate-600 font-sans">
                      {leader.focus}
                    </p>
                  </div>

                  {/* Leadership Philosophy Quote */}
                  {leader.philosophy && (
                    <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-indigo-600 text-slate-700 text-xs italic space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-semibold not-italic font-serif">
                        <Quote className="w-3.5 h-3.5" />
                        <span>Leadership Philosophy</span>
                      </div>
                      <p>"{leader.philosophy}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* In Live Edit Mode: Add Card Placeholder */}
            {isLive && (
              <AddCardButton
                onClick={() => openModal('leader_add', {})}
                label="Add Executive Director"
                subtitle="Add another leader or principal architect to this roster"
              />
            )}
          </div>
        </div>
      </section>

      {/* 3. Corporate Governance & Ethics */}
      <section className="py-20 bg-white border-b border-slate-200 relative group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative">
            {isLive && (
              <div className="mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('governance_header', {
                    tag: governance.tag,
                    title: governance.title,
                    desc: governance.desc
                  })}
                  label="Edit Section Heading"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {governance.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {governance.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {governance.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {governance.cards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="relative p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 card-hover-ethics group"
              >
                {isLive && (
                  <CardActionOverlay
                    title={card.title}
                    onEdit={() => openModal('governance_card_edit', {
                      ...card,
                      points: Array.isArray(card.points) ? card.points.join('\n') : card.points
                    }, idx)}
                    onDelete={() => handleDeleteGovernanceCard(idx)}
                  />
                )}
                <h3 className="font-serif font-bold text-slate-900 text-xl">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {card.desc}
                </p>
                {card.points && card.points.length > 0 && (
                  <ul className="space-y-2 text-xs text-slate-700">
                    {card.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('governance_card_add', { points: '' })}
                label="Add Governance Charter Card"
                subtitle="Add an ethics policy or compliance assurance block"
              />
            )}
          </div>
        </div>
      </section>

      {/* 4. Contact CTA Banner */}
      <section className="py-20 bg-[#0B172A] text-white relative group">
        {isLive && (
          <div className="absolute top-4 right-6 z-20">
            <SectionHeaderEditButton
              onClick={() => openModal('contact_cta', { ...contactCta })}
              label="Edit CTA Banner"
            />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
            {contactCta.title}
          </h2>
          <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            {contactCta.desc}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={contactCta.btnLink || '/contact'}
              className="px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>{contactCta.btnText}</span>
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
          modalType === 'header' ? 'Edit Page Hero Header' :
          modalType === 'stewardship' ? 'Edit Board Stewardship Intro' :
          modalType === 'leader_edit' ? `Edit Leader: ${modalData.name || ''}` :
          modalType === 'leader_add' ? 'Add Executive Leader' :
          modalType === 'governance_header' ? 'Edit Governance Section Heading' :
          modalType === 'governance_card_edit' ? `Edit Governance Card: ${modalData.title || ''}` :
          modalType === 'governance_card_add' ? 'Add Governance Card' :
          modalType === 'contact_cta' ? 'Edit Contact CTA Banner' : 'Edit Section'
        }
      >
        {/* Modal: Header */}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Main Heading</label>
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={modalData.primaryCtaText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={modalData.primaryCtaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  value={modalData.secondaryCtaText || ''}
                  onChange={(e) => setModalData({ ...modalData, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  value={modalData.secondaryCtaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, secondaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}

        {/* Modal: Stewardship */}
        {modalType === 'stewardship' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description Paragraph</label>
              <textarea
                rows={4}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Modal: Leader (Add or Edit) */}
        {(modalType === 'leader_edit' || modalType === 'leader_add') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={modalData.name || ''}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  placeholder="e.g. Marcus Sterling"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  value={modalData.designation || ''}
                  onChange={(e) => setModalData({ ...modalData, designation: e.target.value })}
                  placeholder="e.g. Managing Director & CEO"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department / Board</label>
                <input
                  type="text"
                  value={modalData.department || ''}
                  onChange={(e) => setModalData({ ...modalData, department: e.target.value })}
                  placeholder="e.g. Executive Board"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={modalData.linkedin || ''}
                  onChange={(e) => setModalData({ ...modalData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
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
                placeholder="https://... or /image.png"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Years Experience & Domain</label>
                <input
                  type="text"
                  value={modalData.experience || ''}
                  onChange={(e) => setModalData({ ...modalData, experience: e.target.value })}
                  placeholder="e.g. 22+ Years Enterprise Systems"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Education Credentials</label>
                <input
                  type="text"
                  value={modalData.education || ''}
                  onChange={(e) => setModalData({ ...modalData, education: e.target.value })}
                  placeholder="e.g. Ph.D. MIT / M.Sc. Oxford"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Executive Background (Bio)</label>
              <textarea
                rows={3}
                required
                value={modalData.bio || ''}
                onChange={(e) => setModalData({ ...modalData, bio: e.target.value })}
                placeholder="Comprehensive career trajectory and institutional advisory..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Responsibilities &amp; Focus</label>
              <input
                type="text"
                value={modalData.focus || ''}
                onChange={(e) => setModalData({ ...modalData, focus: e.target.value })}
                placeholder="Global Expansion, Sovereign Governance..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Leadership Philosophy Quote</label>
              <textarea
                rows={2}
                value={modalData.philosophy || ''}
                onChange={(e) => setModalData({ ...modalData, philosophy: e.target.value })}
                placeholder="Architectural integrity over shortcuts..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Modal: Governance Header */}
        {modalType === 'governance_header' && (
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

        {/* Modal: Governance Card Add / Edit */}
        {(modalType === 'governance_card_edit' || modalType === 'governance_card_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Independent Steering Committees"
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
                placeholder="Charter details and operational oversight guidelines..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bullet Points (one per line)
              </label>
              <textarea
                rows={4}
                value={modalData.points || ''}
                onChange={(e) => setModalData({ ...modalData, points: e.target.value })}
                placeholder="Formal ADRs signed off&#10;Quarterly penetration audits&#10;Source code escrow protection"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Modal: Contact CTA */}
        {modalType === 'contact_cta' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Headline</label>
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
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Button Text</label>
                <input
                  type="text"
                  value={modalData.btnText || ''}
                  onChange={(e) => setModalData({ ...modalData, btnText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Button Link</label>
                <input
                  type="text"
                  value={modalData.btnLink || ''}
                  onChange={(e) => setModalData({ ...modalData, btnLink: e.target.value })}
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
