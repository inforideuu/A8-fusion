import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { solutionsData as defaultSolutionsData } from '../data/solutionsData';
import { 
  ArrowRight, 
  ShieldCheck, 
  Boxes, 
  Server, 
  Cpu, 
  FileCheck2, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ChevronRight,
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
  badge: 'Enterprise Platforms',
  title: 'Modular Enterprise Software Platforms',
  subtitle: 'Proprietary software suites designed to govern finances, global supply chains, institutional talent, and sovereign data repositories without third-party vendor lock-in.',
  bgImage: '/solutions.png',
  primaryCtaText: 'Request Platform Demonstration',
  primaryCtaLink: '/request-project',
  secondaryCtaText: 'Public Sector Solutions',
  secondaryCtaLink: '/government'
};

const DEFAULT_CATALOG_HEADER = {
  tag: 'Platform Catalog',
  title: 'Specialized Enterprise Software Platforms',
  desc: 'Each platform can be deployed independently or unified through our distributed event broker to form a comprehensive corporate operating system.'
};

const DEFAULT_INTEGRITY = {
  title: 'Transparent Capability & Deployment Disclosures',
  desc: 'In accordance with our strict corporate governance principles, all software modules and platforms are disclosed accurately as verified enterprise capabilities or planned components tailored during contractual architectural discovery. We never misrepresent static mockups as already-commissioned production deployments.'
};

export default function SolutionsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [catalogHeader, setCatalogHeader] = useState(DEFAULT_CATALOG_HEADER);
  const [solutionsList, setSolutionsList] = useState(defaultSolutionsData);
  const [integrity, setIntegrity] = useState(DEFAULT_INTEGRITY);

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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=solutions');
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
        const local = localStorage.getItem('a8_live_solutions_content');
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
    if (data.catalogHeader) setCatalogHeader(data.catalogHeader);
    if (Array.isArray(data.solutionsList) && data.solutionsList.length > 0) setSolutionsList(data.solutionsList);
    if (data.integrity) setIntegrity(data.integrity);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  // Save to Backend and LocalStorage
  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      catalogHeader,
      solutionsList,
      integrity,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_solutions_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'solutions',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Solutions platforms saved and synchronized successfully!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Solutions platform data back to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setCatalogHeader(DEFAULT_CATALOG_HEADER);
      setSolutionsList(defaultSolutionsData);
      setIntegrity(DEFAULT_INTEGRITY);
      localStorage.removeItem('a8_live_solutions_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/solutions', { replace: true });
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
    } else if (modalType === 'catalog_header') {
      setCatalogHeader({ ...modalData });
    } else if (modalType === 'solution_edit') {
      const updated = [...solutionsList];
      const modulesArray = typeof modalData.modules === 'string'
        ? modalData.modules.split('\n').filter(m => m.trim()).map(name => ({ name }))
        : (modalData.modules || []);
      updated[editingIndex] = {
        ...modalData,
        modules: modulesArray
      };
      setSolutionsList(updated);
    } else if (modalType === 'solution_add') {
      const modulesArray = typeof modalData.modules === 'string'
        ? modalData.modules.split('\n').filter(m => m.trim()).map(name => ({ name }))
        : (modalData.modules || [{ name: 'Core Engine' }, { name: 'Analytics' }]);
      const generatedSlug = modalData.slug || modalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newSolution = {
        id: generatedSlug || `solution-${Date.now()}`,
        slug: generatedSlug,
        badge: modalData.badge || 'Enterprise Suite',
        title: modalData.title || 'New Enterprise Solution',
        tagline: modalData.tagline || 'Sovereign modular enterprise software system.',
        shortDesc: modalData.shortDesc || 'Comprehensive enterprise software platform engineered for high-concurrency operations.',
        status: modalData.status || 'Active Production Deployment',
        modules: modulesArray
      };
      setSolutionsList([...solutionsList, newSolution]);
    } else if (modalType === 'integrity') {
      setIntegrity({ ...modalData });
    }

    closeModal();
  };

  const handleDeleteSolution = (idx) => {
    if (window.confirm(`Delete solution platform "${solutionsList[idx].title}"?`)) {
      const updated = solutionsList.filter((_, i) => i !== idx);
      setSolutionsList(updated);
      markDirty();
    }
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Enterprise Solutions Catalog (/solutions)"
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
            { label: 'Solutions' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Solutions Catalog */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative">
            {isLive && (
              <div className="mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('catalog_header', { ...catalogHeader })}
                  label="Edit Section Heading"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {catalogHeader.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {catalogHeader.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {catalogHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionsList.map((sol, index) => (
              <div
                key={sol.id || index}
                className="relative bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-200 card-hover-platform-catalog flex flex-col justify-between group transition-all"
              >
                {/* In-Context Card Actions */}
                {isLive && (
                  <CardActionOverlay
                    title={sol.title}
                    detailUrl={`/solutions/${sol.slug}?live_edit=true`}
                    onEdit={() => openModal('solution_edit', {
                      ...sol,
                      modules: Array.isArray(sol.modules) ? sol.modules.map(m => m.name || m).join('\n') : ''
                    }, index)}
                    onDelete={() => handleDeleteSolution(index)}
                  />
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded uppercase">
                      {sol.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {sol.modules ? sol.modules.length : 0} Core Modules
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {sol.title}
                    </h3>
                    {sol.tagline && (
                      <p className="text-xs font-serif italic text-slate-600 mt-1">
                        "{sol.tagline}"
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {sol.shortDesc}
                  </p>

                  {/* Modules Preview Pills */}
                  {sol.modules && sol.modules.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5">
                        Integrated Modules Include:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sol.modules.slice(0, 4).map((mod, i) => (
                          <span key={i} className="text-[10px] font-sans bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                            {mod.name || mod}
                          </span>
                        ))}
                        {sol.modules.length > 4 && (
                          <span className="text-[10px] font-mono text-indigo-600 font-semibold px-1 py-0.5">
                            +{sol.modules.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-600 font-medium">
                    {sol.status || 'Active Production Deployment'}
                  </span>
                  <Link
                    to={`/solutions/${sol.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>View Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}

            {/* In Live Edit Mode: Add Solution Platform Button */}
            {isLive && (
              <AddCardButton
                onClick={() => openModal('solution_add', { modules: '' })}
                label="Add Enterprise Platform"
                subtitle="Add another modular software platform to this catalog"
              />
            )}
          </div>
        </div>
      </section>

      {/* Platform Deployment Integrity Statement */}
      <section className="py-16 bg-[#0B172A] text-white relative group">
        {isLive && (
          <div className="absolute top-4 right-6 z-20">
            <SectionHeaderEditButton
              onClick={() => openModal('integrity', { ...integrity })}
              label="Edit Statement"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
            <h3 className="text-2xl font-serif font-normal text-white">
              {integrity.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {integrity.desc}
            </p>
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
          modalType === 'catalog_header' ? 'Edit Catalog Section' :
          modalType === 'solution_edit' ? `Edit Platform: ${modalData.title || ''}` :
          modalType === 'solution_add' ? 'Add Enterprise Software Platform' :
          modalType === 'integrity' ? 'Edit Integrity Disclosure' : 'Edit Section'
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

        {/* Catalog Header Modal */}
        {modalType === 'catalog_header' && (
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

        {/* Solution Add / Edit Modal */}
        {(modalType === 'solution_edit' || modalType === 'solution_add') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Platform Name</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  placeholder="e.g. Enterprise ERP Core Suite"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge / Category</label>
                <input
                  type="text"
                  value={modalData.badge || ''}
                  onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                  placeholder="e.g. Enterprise Suite"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={modalData.slug || ''}
                  onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                  placeholder="e.g. erp-core-suite"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deployment Status</label>
                <input
                  type="text"
                  value={modalData.status || ''}
                  onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                  placeholder="e.g. Active Production Deployment"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={modalData.tagline || ''}
                onChange={(e) => setModalData({ ...modalData, tagline: e.target.value })}
                placeholder="Institutional financial accounting and double-entry ledger..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
              <textarea
                rows={3}
                required
                value={modalData.shortDesc || ''}
                onChange={(e) => setModalData({ ...modalData, shortDesc: e.target.value })}
                placeholder="Platform capabilities, compliance mandates, and high-concurrency architecture..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Integrated Core Modules (one per line)
              </label>
              <textarea
                rows={4}
                value={modalData.modules || ''}
                onChange={(e) => setModalData({ ...modalData, modules: e.target.value })}
                placeholder="General Ledger&#10;Accounts Receivable&#10;Multi-Currency Treasury"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Integrity Modal */}
        {modalType === 'integrity' && (
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
                rows={4}
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
