import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { industriesData as defaultIndustriesData } from '../data/industriesData';
import { 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  GraduationCap, 
  Factory, 
  Hammer, 
  Truck, 
  Landmark, 
  Compass, 
  Zap,
  CheckCircle2,
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
  badge: 'Sector Engineering',
  title: 'Vertical Industry Platforms & Compliance',
  subtitle: 'Custom-architected technology suites tailored to the unique regulatory mandates, throughput demands, and operational realities of global industries.',
  bgImage: '/industries.png',
  primaryCtaText: 'Discuss Industry Solutions',
  primaryCtaLink: '/request-project',
  secondaryCtaText: 'Government & Sovereign Tech',
  secondaryCtaLink: '/government'
};

export default function IndustriesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [industriesList, setIndustriesList] = useState(defaultIndustriesData);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const iconMap = {
    'government': ShieldCheck,
    'healthcare': HeartPulse,
    'education': GraduationCap,
    'manufacturing': Factory,
    'construction': Hammer,
    'logistics': Truck,
    'banking-finance': Landmark,
    'real-estate': Compass,
    'energy-utilities': Zap
  };

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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=industries');
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
        const local = localStorage.getItem('a8_live_industries_content');
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
    if (Array.isArray(data.industriesList) && data.industriesList.length > 0) setIndustriesList(data.industriesList);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  // Save to Backend and LocalStorage
  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      industriesList,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_industries_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'industries',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Industries catalog specifications saved and synchronized with MySQL!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Industries catalog data back to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setIndustriesList(defaultIndustriesData);
      localStorage.removeItem('a8_live_industries_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/industries', { replace: true });
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
    } else if (modalType === 'industry_edit') {
      const updated = [...industriesList];
      const challengesArray = typeof modalData.challenges === 'string'
        ? modalData.challenges.split('\n').filter(c => c.trim())
        : (modalData.challenges || []);
      updated[editingIndex] = {
        ...modalData,
        challenges: challengesArray
      };
      setIndustriesList(updated);
    } else if (modalType === 'industry_add') {
      const challengesArray = typeof modalData.challenges === 'string'
        ? modalData.challenges.split('\n').filter(c => c.trim())
        : (modalData.challenges || ['Legacy System Silos', 'Regulatory Compliance Overheads']);
      const generatedSlug = modalData.slug || modalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newIndustry = {
        id: generatedSlug || `industry-${Date.now()}`,
        slug: generatedSlug,
        title: modalData.title || 'New Industry Sector',
        tagline: modalData.tagline || 'Specialized software platforms tailored for sector demands.',
        overview: modalData.overview || 'Industry-specific technology architecture, data sovereignty compliance, and high-concurrency workflows.',
        image: modalData.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        challenges: challengesArray
      };
      setIndustriesList([...industriesList, newIndustry]);
    }

    closeModal();
  };

  const handleDeleteIndustry = (idx) => {
    if (window.confirm(`Delete industry sector "${industriesList[idx].title}"?`)) {
      const updated = industriesList.filter((_, i) => i !== idx);
      setIndustriesList(updated);
      markDirty();
    }
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Industries Catalog (/industries)"
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
            { label: 'Industries' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Industries Directory */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                Vertical Sectors · {industriesList.length} Supported Domains
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                Enterprise Industry Solutions
              </h2>
            </div>
            {isLive && (
              <button
                type="button"
                onClick={() => openModal('industry_add', { challenges: '' })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Industry Sector</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industriesList.map((ind, i) => {
              const Icon = iconMap[ind.id] || Building2;
              const link = ind.id === 'government' ? '/government' : `/industries/${ind.slug}`;
              return (
                <div
                  key={ind.id || i}
                  className="relative bg-white rounded-2xl border border-slate-200 card-hover-industry-catalog flex flex-col justify-between group overflow-hidden transition-all"
                >
                  {/* Live Card Actions */}
                  {isLive && (
                    <CardActionOverlay
                      title={ind.title}
                      detailUrl={ind.id === 'government' ? '/government?live_edit=true' : `/industries/${ind.slug}?live_edit=true`}
                      onEdit={() => openModal('industry_edit', {
                        ...ind,
                        challenges: Array.isArray(ind.challenges) ? ind.challenges.join('\n') : (ind.challenges || '')
                      }, i)}
                      onDelete={() => handleDeleteIndustry(i)}
                    />
                  )}

                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={ind.image}
                        alt={`A8Fusion ${ind.title} Digital Transformation & Software Architecture`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-xs text-indigo-700 flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">
                          Sector 0{i + 1}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white drop-shadow-sm">
                          {ind.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {ind.tagline && (
                        <p className="text-xs font-serif italic text-slate-500">
                          "{ind.tagline}"
                        </p>
                      )}

                      <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                        {ind.overview}
                      </p>

                      {ind.challenges && ind.challenges.length > 0 && (
                        <div className="pt-2 space-y-1.5 border-t border-slate-100">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                            Domain Challenges Mitigated:
                          </span>
                          {ind.challenges.slice(0, 2).map((ch, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{ch}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                    <div className="pt-4">
                      <Link
                        to={link}
                        className="text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between"
                      >
                        <span>Explore Sector Suite</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* In Live Edit Mode: Add Card Placeholder */}
            {isLive && (
              <AddCardButton
                onClick={() => openModal('industry_add', { challenges: '' })}
                label="Add Vertical Industry Sector"
                subtitle="Add another specialized vertical domain to this catalog"
              />
            )}
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
          modalType === 'industry_edit' ? `Edit Sector: ${modalData.title || ''}` :
          modalType === 'industry_add' ? 'Add Vertical Industry Sector' : 'Edit Section'
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

        {/* Industry Add / Edit Modal */}
        {(modalType === 'industry_edit' || modalType === 'industry_add') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sector Title</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  placeholder="e.g. Banking & Financial Services"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={modalData.slug || ''}
                  onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                  placeholder="e.g. banking-finance"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={modalData.tagline || ''}
                onChange={(e) => setModalData({ ...modalData, tagline: e.target.value })}
                placeholder="Mission-critical regulatory compliance and high-throughput transaction processing."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sector Overview</label>
              <textarea
                rows={4}
                required
                value={modalData.overview || ''}
                onChange={(e) => setModalData({ ...modalData, overview: e.target.value })}
                placeholder="Comprehensive industry overview, regulatory requirements, and technical capabilities..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Domain Challenges Mitigated (one per line)
              </label>
              <textarea
                rows={4}
                value={modalData.challenges || ''}
                onChange={(e) => setModalData({ ...modalData, challenges: e.target.value })}
                placeholder="Strict Statutory Data Localization Mandates&#10;Sub-Millisecond Transaction Latencies&#10;Zero-Tolerance Security Compliance"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
