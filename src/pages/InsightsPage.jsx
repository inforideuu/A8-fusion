import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { insightsData as defaultInsightsData, insightCategories } from '../data/insightsData';
import { 
  Search, 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Tag, 
  ChevronRight,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import {
  LiveEditorToolbar,
  CardActionOverlay,
  AddCardButton,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../admin/components/LiveEditorControls';

const DEFAULT_PAGE_HEADER = {
  badge: 'Executive Knowledge Platform',
  title: 'Insights, Whitepapers & Architectural Briefings',
  subtitle: 'In-depth analysis of sovereign artificial intelligence, legacy public system modernization, zero-trust cybersecurity, and enterprise cloud economics.',
  bgImage: '/insight.png',
  primaryCtaText: 'Discuss An Enterprise Project',
  primaryCtaLink: '/request-project'
};

export default function InsightsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [articlesList, setArticlesList] = useState(defaultInsightsData);
  const [selectedCategory, setSelectedCategory] = useState('All Insights');
  const [searchQuery, setSearchQuery] = useState('');

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
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=insights');
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
        const local = localStorage.getItem('a8_live_insights_content');
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
    if (Array.isArray(data.articlesList) && data.articlesList.length > 0) setArticlesList(data.articlesList);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      articlesList,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_insights_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'insights',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Insights articles saved and synchronized with MySQL!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Insights briefings back to factory defaults?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setArticlesList(defaultInsightsData);
      localStorage.removeItem('a8_live_insights_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/insights', { replace: true });
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
    } else if (modalType === 'article_edit') {
      const updated = [...articlesList];
      updated[editingIndex] = { ...modalData };
      setArticlesList(updated);
    } else if (modalType === 'article_add') {
      const generatedSlug = modalData.slug || modalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newArticle = {
        id: generatedSlug || `article-${Date.now()}`,
        slug: generatedSlug,
        title: modalData.title || 'New Architectural Briefing',
        category: modalData.category || 'Cloud Architecture',
        author: modalData.author || 'Principal Systems Architect',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: modalData.readTime || '6 min read',
        excerpt: modalData.excerpt || 'Executive overview of institutional architectural principles and engineering practices.',
        tags: [modalData.category || 'Architecture', 'Enterprise'],
        featured: false
      };
      setArticlesList([...articlesList, newArticle]);
    }

    closeModal();
  };

  const handleDeleteArticle = (idx) => {
    if (window.confirm(`Delete article "${articlesList[idx].title}"?`)) {
      const updated = articlesList.filter((_, i) => i !== idx);
      setArticlesList(updated);
      markDirty();
    }
  };

  const filteredArticles = articlesList.filter((article) => {
    const matchesCategory = selectedCategory === 'All Insights' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articlesList.find(a => a.featured) || articlesList[0];
  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Insights & Publications (/insights)"
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
            { label: 'Insights' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
        />
      </div>

      {/* Featured Headline Article Banner */}
      {featuredArticle && (
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-2xl text-white border border-slate-800 shadow-xl overflow-hidden group grid grid-cols-1 lg:grid-cols-12 items-center card-hover-insight-featured">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    FEATURED BRIEFING
                  </span>
                  <span className="text-xs text-indigo-300 font-mono">{featuredArticle.category}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono">{featuredArticle.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{featuredArticle.author}</span>
                  </span>
                  <span>{featuredArticle.date}</span>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/insights/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Read Executive Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-slate-950">
                <img
                  src={featuredArticle.image || '/insight.png'}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/insight.png';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalog & Filter Bar */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Knowledge Repository · {articlesList.length} Publications
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                All Briefings &amp; Technical Analysis
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isLive && (
                <button
                  type="button"
                  onClick={() => openModal('article_add', {})}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Article</span>
                </button>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
              <div
                key={article.id || idx}
                className="relative bg-white rounded-2xl border border-slate-200 shadow-sm card-hover-insight-item flex flex-col justify-between group overflow-hidden transition-all"
              >
                {/* Live Action Overlay */}
                {isLive && (
                  <CardActionOverlay
                    title={article.title}
                    onEdit={() => openModal('article_edit', { ...article }, idx)}
                    onDelete={() => handleDeleteArticle(idx)}
                  />
                )}

                <div className="space-y-4">
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={article.image || '/insight.png'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/insight.png';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono font-bold text-indigo-700 shadow-xs uppercase">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">By {article.author}</span>
                    <Link
                      to={`/insights/${article.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Read Briefing</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('article_add', {})}
                label="Publish Article"
                subtitle="Add an engineering whitepaper or technical briefing"
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
          modalType === 'article_edit' ? `Edit Article: ${modalData.title || ''}` :
          modalType === 'article_add' ? 'Publish Architectural Briefing' : 'Edit Section'
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
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Text</label>
              <input
                type="text"
                value={modalData.primaryCtaText || ''}
                onChange={(e) => setModalData({ ...modalData, primaryCtaText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {/* Article Add / Edit Modal */}
        {(modalType === 'article_edit' || modalType === 'article_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Title</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Architectural Rigor in Sovereign Cloud Implementations"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <input
                  type="text"
                  value={modalData.category || ''}
                  onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                  placeholder="e.g. Cloud Architecture"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Read Time</label>
                <input
                  type="text"
                  value={modalData.readTime || ''}
                  onChange={(e) => setModalData({ ...modalData, readTime: e.target.value })}
                  placeholder="e.g. 6 min read"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author</label>
                <input
                  type="text"
                  value={modalData.author || ''}
                  onChange={(e) => setModalData({ ...modalData, author: e.target.value })}
                  placeholder="e.g. Principal Systems Architect"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={modalData.slug || ''}
                  onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                  placeholder="e.g. architectural-rigor-sovereign-cloud"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Executive Excerpt</label>
              <textarea
                rows={3}
                required
                value={modalData.excerpt || ''}
                onChange={(e) => setModalData({ ...modalData, excerpt: e.target.value })}
                placeholder="Evaluating statutory data boundaries, cryptographic enclaves, and multi-region failover..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
