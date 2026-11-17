import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { servicesData as defaultServicesData } from '../data/servicesData';
import { 
  ArrowRight, 
  ShieldCheck, 
  Server, 
  Cpu, 
  Database, 
  Lock, 
  Workflow, 
  Boxes, 
  Layers, 
  CheckCircle2, 
  Check,
  ExternalLink,
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
  badge: 'Enterprise Services',
  title: 'Mission-Critical Enterprise Technology Services',
  subtitle: 'End-to-end engineering, sovereign infrastructure advisory, and high-concurrency software development designed for international conglomerates and public institutions.',
  bgImage: '/services.png',
  primaryCtaText: 'Discuss an Enterprise Project',
  primaryCtaLink: '/request-project',
  secondaryCtaText: 'Explore Enterprise Solutions',
  secondaryCtaLink: '/solutions'
};

export default function ServicesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [servicesList, setServicesList] = useState(defaultServicesData);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const iconMap = {
    'enterprise-software-development': Server,
    'artificial-intelligence': Cpu,
    'cloud-infrastructure': Database,
    'cybersecurity': Lock,
    'system-integration': Boxes,
    'digital-transformation': Workflow,
    'technology-consulting': Layers
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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=services');
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
        const local = localStorage.getItem('a8_live_services_content');
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
    if (Array.isArray(data.servicesList) && data.servicesList.length > 0) setServicesList(data.servicesList);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  // Save to Backend and LocalStorage
  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      servicesList,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_services_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'services',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Services page specifications saved and synchronized successfully!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Services page content back to default factory settings?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setServicesList(defaultServicesData);
      localStorage.removeItem('a8_live_services_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/services', { replace: true });
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
    } else if (modalType === 'service_edit') {
      const updated = [...servicesList];
      const capsArray = typeof modalData.capabilities === 'string'
        ? modalData.capabilities.split('\n').filter(c => c.trim())
        : (modalData.capabilities || []);
      updated[editingIndex] = {
        ...modalData,
        capabilities: capsArray
      };
      setServicesList(updated);
    } else if (modalType === 'service_add') {
      const capsArray = typeof modalData.capabilities === 'string'
        ? modalData.capabilities.split('\n').filter(c => c.trim())
        : (modalData.capabilities || ['Enterprise Architecture', 'High Availability Design']);
      const generatedSlug = modalData.slug || modalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newService = {
        id: generatedSlug || `service-${Date.now()}`,
        slug: generatedSlug,
        title: modalData.title || 'New Enterprise Service',
        tagline: modalData.tagline || 'Mission-critical enterprise engineering capability.',
        overview: modalData.overview || 'Comprehensive engineering advisory, platform delivery, and systems architecture.',
        capabilities: capsArray
      };
      setServicesList([...servicesList, newService]);
    }

    closeModal();
  };

  const handleDeleteService = (idx) => {
    if (window.confirm(`Delete service "${servicesList[idx].title}" from catalog?`)) {
      const updated = servicesList.filter((_, i) => i !== idx);
      setServicesList(updated);
      markDirty();
    }
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Enterprise Services Catalog (/services)"
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
            { label: 'Services' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Services Directory Catalog (Styled to Match Reference Design) */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF]/40 to-[#F8FAFC] border-b border-slate-200">
        {/* Soft Ambient Background Blur Orbs */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                Practice Areas · {servicesList.length} Active Practices
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                Full-Spectrum Technology Capabilities
              </h2>
            </div>
            {isLive && (
              <button
                type="button"
                onClick={() => openModal('service_add', { capabilities: '' })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Enterprise Service</span>
              </button>
            )}
          </div>

          <div className="space-y-10">
            {servicesList.map((service, index) => {
              const IconComp = iconMap[service.slug] || Server;
              return (
                <div
                  key={service.id || index}
                  className="relative bg-white rounded-[28px] p-8 sm:p-10 border border-slate-100 shadow-[0_15px_45px_-10px_rgba(79,70,229,0.08),0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-12px_rgba(79,70,229,0.14)] transition-all duration-300 hover:-translate-y-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch group"
                >
                  {/* Top-Right Curved Gradient Arc */}
                  <svg className="absolute -top-[1px] -right-[1px] w-28 h-28 pointer-events-none z-10" viewBox="0 0 112 112" fill="none">
                    <path
                      d="M 0 3 H 80 C 96 3 109 16 109 32 V 112"
                      stroke={`url(#srvTopRightArc-${index})`}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id={`srvTopRightArc-${index}`} x1="0" y1="0" x2="112" y2="112" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="50%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Bottom-Left Curved Gradient Arc */}
                  <svg className="absolute -bottom-[1px] -left-[1px] w-28 h-28 pointer-events-none z-10" viewBox="0 0 112 112" fill="none">
                    <path
                      d="M 3 0 V 80 C 3 96 16 109 32 109 H 112"
                      stroke={`url(#srvBottomLeftArc-${index})`}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id={`srvBottomLeftArc-${index}`} x1="0" y1="0" x2="112" y2="112" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="50%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Live Action Overlay */}
                  {isLive && (
                    <CardActionOverlay
                      title={service.title}
                      detailUrl={`/services/${service.slug}?live_edit=true`}
                      onEdit={() => openModal('service_edit', {
                        ...service,
                        capabilities: Array.isArray(service.capabilities) ? service.capabilities.join('\n') : (service.capabilities || '')
                      }, index)}
                      onDelete={() => handleDeleteService(index)}
                    />
                  )}

                  {/* Left Column: Icon + Title + Tagline + Overview + CTA */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-5 relative z-10">
                    <div>
                      {/* Icon + Title Block */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <IconComp className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider block">
                            PRACTICE AREA {index + 1}
                          </span>
                          <h3 className="text-2xl sm:text-[26px] font-serif font-bold text-slate-900 group-hover:text-indigo-950 transition-colors leading-tight mt-0.5">
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      {/* Tagline Italic Quote */}
                      {service.tagline && (
                        <p className="text-sm sm:text-[15px] font-serif italic text-slate-900 font-semibold leading-snug mt-4">
                          “{service.tagline}”
                        </p>
                      )}

                      {/* Overview */}
                      <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed mt-2.5">
                        {service.overview}
                      </p>
                    </div>

                    {/* Dedicated CTA Button */}
                    <div className="pt-2">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B1528] hover:bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <span>VIEW DEDICATED PROPOSITION</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Area: Core Capabilities & Architecture + Enterprise Standards */}
                  <div className="lg:col-span-7 lg:border-l lg:border-slate-200/80 lg:pl-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start relative z-10">
                    {/* Sub-Column 1: Core Capabilities & Architecture */}
                    <div>
                      <div className="pb-3 border-b border-slate-200/80 mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                          Core Capabilities &amp; Architecture
                        </h4>
                      </div>
                      <div className="space-y-3.5">
                        {service.capabilities && service.capabilities.slice(0, 4).map((cap, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700">
                            <div className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="leading-snug">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub-Column 2: Enterprise Standards */}
                    <div>
                      <div className="pb-3 border-b border-purple-200/70 mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9333EA] font-sans">
                          Enterprise Standards
                        </h4>
                      </div>
                      <div className="space-y-3.5">
                        {service.capabilities && service.capabilities.slice(4, 8).map((cap, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700">
                            <div className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="leading-snug">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Editor Add Service Button Placeholder */}
            {isLive && (
              <AddCardButton
                onClick={() => openModal('service_add', { capabilities: '' })}
                label="Add Practice Area Service"
                subtitle="Add another core engineering capability or consulting practice"
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
          modalType === 'service_edit' ? `Edit Service: ${modalData.title || ''}` :
          modalType === 'service_add' ? 'Add Enterprise Service' : 'Edit Section'
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
          </>
        )}

        {/* Service Add / Edit Modal */}
        {(modalType === 'service_edit' || modalType === 'service_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Distributed Database Engineering"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug (URL identifier)</label>
              <input
                type="text"
                value={modalData.slug || ''}
                onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                placeholder="e.g. distributed-database-engineering"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={modalData.tagline || ''}
                onChange={(e) => setModalData({ ...modalData, tagline: e.target.value })}
                placeholder="Engineering resilient, scalable core platforms for mission-critical operations."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Executive Overview</label>
              <textarea
                rows={4}
                required
                value={modalData.overview || ''}
                onChange={(e) => setModalData({ ...modalData, overview: e.target.value })}
                placeholder="Detailed summary of the engineering practice and enterprise capabilities..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Core Capabilities &amp; Architecture (one per line)
              </label>
              <textarea
                rows={5}
                value={modalData.capabilities || ''}
                onChange={(e) => setModalData({ ...modalData, capabilities: e.target.value })}
                placeholder="Multi-tenant Cloud Architectures&#10;Granular RBAC Access Control&#10;High-Throughput REST & GraphQL APIs"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
