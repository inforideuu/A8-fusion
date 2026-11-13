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
      alert('Services page specifications saved and synchronized with MySQL!');
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

      {/* Services Directory Catalog */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-4 border-b border-slate-200">
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

          <div className="space-y-12">
            {servicesList.map((service, index) => {
              const IconComp = iconMap[service.slug] || Server;
              return (
                <div
                  key={service.id || index}
                  className="relative bg-slate-50 hover:bg-white rounded-2xl p-8 lg:p-10 border border-slate-200 card-hover-service-catalog grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group transition-all"
                >
                  {/* Live Action Overlay */}
                  {isLive && (
                    <CardActionOverlay
                      title={service.title}
                      onEdit={() => openModal('service_edit', {
                        ...service,
                        capabilities: Array.isArray(service.capabilities) ? service.capabilities.join('\n') : (service.capabilities || '')
                      }, index)}
                      onDelete={() => handleDeleteService(index)}
                    />
                  )}

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                          Practice Area 0{index + 1}
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {service.tagline && (
                      <p className="text-sm font-serif italic text-slate-700">
                        "{service.tagline}"
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {service.overview}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B172A] hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        <span>View Dedicated Specification</span>
                        <ArrowRight className="w-4 h-4 text-indigo-300" />
                      </Link>
                    </div>
                  </div>

                  {/* Capabilities Column */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between border-b border-slate-100 pb-2">
                      <span>Core Capabilities &amp; Architecture</span>
                      <span className="text-indigo-600">Enterprise Standard</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.capabilities && service.capabilities.slice(0, 8).map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
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
