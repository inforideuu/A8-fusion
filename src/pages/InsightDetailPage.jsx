import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { insightsData } from '../data/insightsData';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Bookmark,
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

export default function InsightDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  // Look in static data, or in localStorage saved articles
  let initialArticle = insightsData.find(a => a.slug === slug || a.id === slug);
  if (!initialArticle) {
    try {
      const local = localStorage.getItem('a8_live_insights_content');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed.articlesList)) {
          initialArticle = parsed.articlesList.find(a => a.slug === slug || a.id === slug);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  const defaultArticle = initialArticle || {
    id: slug || 'article',
    slug: slug || 'article',
    title: slug ? slug.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : 'Architectural Briefing',
    category: 'Enterprise Technology',
    featured: false,
    publishedAt: '2026-02-14',
    readTime: '6 min read',
    coverImage: '/insight.png',
    author: {
      name: 'Principal Systems Architect',
      role: 'A8Fusion Research',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    excerpt: 'Executive analysis and technical specifications regarding sovereign technology platforms and enterprise software engineering.',
    content: '### Strategic Architecture & Operational Rigor\n\nDetailed operational analysis and architectural specifications regarding modern enterprise software platforms.\n\n### Implementation Rigor & Governance\n\n- Zero-trust network verification\n- Full audit trail logging\n- Sovereign data compliance guarantee',
    tags: ['Architecture', 'Enterprise', 'Technology']
  };

  // Live Editor State
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState({
    badge: defaultArticle.category || 'Briefing',
    title: defaultArticle.title || 'Architectural Briefing',
    subtitle: defaultArticle.excerpt || '',
    bgImage: '/insight.png',
    primaryCtaText: 'Discuss With Authoring Team',
    primaryCtaLink: '/request-project',
    secondaryCtaText: 'All Insights',
    secondaryCtaLink: '/insights'
  });

  const [metadata, setMetadata] = useState({
    authorName: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.name : defaultArticle.author) || 'Principal Systems Architect',
    authorRole: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.role : '') || 'A8Fusion Research',
    authorAvatar: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.avatar : '') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    publishedAt: defaultArticle.publishedAt || defaultArticle.date || '2026-02-14',
    readTime: defaultArticle.readTime || '6 min read'
  });

  const [takeaway, setTakeaway] = useState({
    tag: 'Executive Takeaway',
    quote: defaultArticle.excerpt
  });

  const [contentBody, setContentBody] = useState(defaultArticle.content);

  const [tags, setTags] = useState([...(defaultArticle.tags || [])]);

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
  const storageKey = `a8_live_insight_${slug}`;
  const backendSlug = `insight-${slug}`;

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
    if (data.metadata) setMetadata(data.metadata);
    if (data.takeaway) setTakeaway(data.takeaway);
    if (data.contentBody) setContentBody(data.contentBody);
    if (Array.isArray(data.tags)) setTags(data.tags);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      metadata,
      takeaway,
      contentBody,
      tags,
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
      alert(`Research briefing "${defaultArticle.title}" saved and synchronized with MySQL!`);
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this insight article back to editorial draft default?')) {
      setPageHeader({
        badge: defaultArticle.category,
        title: defaultArticle.title,
        subtitle: defaultArticle.excerpt,
        bgImage: '/insight.png',
        primaryCtaText: 'Discuss With Authoring Team',
        primaryCtaLink: '/request-project',
        secondaryCtaText: 'All Insights',
        secondaryCtaLink: '/insights'
      });
      setMetadata({
        authorName: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.name : defaultArticle.author) || 'Principal Systems Architect',
        authorRole: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.role : '') || 'A8Fusion Research',
        authorAvatar: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.avatar : '') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        publishedAt: defaultArticle.publishedAt || defaultArticle.date || '2026-02-14',
        readTime: defaultArticle.readTime || '6 min read'
      });
      setTakeaway({
        tag: 'Executive Takeaway',
        quote: defaultArticle.excerpt
      });
      setContentBody(defaultArticle.content);
      setTags([...(defaultArticle.tags || [])]);
      localStorage.removeItem(storageKey);
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate(`/insights/${slug}`, { replace: true });
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
    } else if (modalType === 'metadata') {
      setMetadata({ ...modalData });
    } else if (modalType === 'takeaway') {
      setTakeaway({ ...modalData });
    } else if (modalType === 'content') {
      setContentBody(modalData.body || '');
    } else if (modalType === 'tag_edit') {
      const updated = [...tags];
      updated[editingIndex] = modalData.text;
      setTags(updated);
    } else if (modalType === 'tag_add') {
      if (modalData.text) setTags([...tags, modalData.text]);
    }

    closeModal();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isLive = editMode && !previewMode;
  const relatedArticles = insightsData.filter(a => a.id !== defaultArticle.id).slice(0, 2);

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName={`Insight: ${defaultArticle.title} (/insights/${slug})`}
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
              label="Edit Article Header"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage}
          breadcrumbs={[
            { label: 'Insights', link: '/insights' },
            { label: pageHeader.badge, link: '/insights' },
            { label: 'Briefing' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Article Content Core */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Metadata & Author Bar */}
          <div className="relative group/meta flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-slate-200 gap-4">
            {isLive && (
              <div className="absolute -top-3 right-0 z-20">
                <SectionHeaderEditButton
                  onClick={() => openModal('metadata', { ...metadata })}
                  label="Edit Author & Dates"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <img
                src={metadata.authorAvatar}
                alt={metadata.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{metadata.authorName}</h3>
                <p className="text-xs text-slate-500 font-mono">{metadata.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{metadata.publishedAt}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{metadata.readTime}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                aria-label="Copy article link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Executive Takeaway Box */}
          <div className="relative group/takeaway p-6 rounded-2xl bg-slate-50 border-l-4 border-indigo-600 my-6">
            {isLive && (
              <div className="absolute top-3 right-3 z-20">
                <SectionHeaderEditButton
                  onClick={() => openModal('takeaway', { ...takeaway })}
                  label="Edit Takeaway"
                />
              </div>
            )}
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 block mb-1">
              {takeaway.tag}
            </span>
            <p className="text-sm font-serif italic text-slate-700 pr-12">
              "{takeaway.quote}"
            </p>
          </div>

          {/* Article Prose Body with Live Edit Button */}
          <div className="relative group/prose">
            {isLive && (
              <div className="flex justify-end mb-4">
                <SectionHeaderEditButton
                  onClick={() => openModal('content', { body: contentBody })}
                  label="Edit Article Text Body"
                />
              </div>
            )}
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-sans text-sm sm:text-base space-y-6">
              {contentBody.trim().split('\n\n').map((block, idx) => {
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-2xl font-serif font-bold text-slate-900 pt-6 pb-2">
                      {block.replace('### ', '')}
                    </h3>
                  );
                }
                if (block.startsWith('- ') || block.startsWith('1. ')) {
                  return (
                    <div key={idx} className="pl-4 py-2 border-l border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                      {block.split('\n').map((line, lidx) => (
                        <p key={lidx}>{line}</p>
                      ))}
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {block}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="pt-10 mt-10 border-t border-slate-200 relative group/tags">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-2">
              Topic Taxonomy
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, i) => (
                <div key={i} className="relative group/tag inline-flex items-center gap-1.5 text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  <span>#{tag}</span>
                  {isLive && (
                    <button
                      type="button"
                      onClick={() => {
                        setTags(tags.filter((_, idx) => idx !== i));
                        markDirty();
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {isLive && (
                <button
                  type="button"
                  onClick={() => openModal('tag_add', { text: '' })}
                  className="text-xs font-mono px-3 py-1 rounded-full border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Tag</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Briefings */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Related Executive Briefings
            </h3>
            <Link to="/insights" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All Insights &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <div key={rel.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">{rel.category}</span>
                <h4 className="text-base font-serif font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                  <Link to={`/insights/${rel.slug}`}>{rel.title}</Link>
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">{rel.excerpt}</p>
                <Link to={`/insights/${rel.slug}`} className="text-xs font-bold text-indigo-600 flex items-center gap-1 pt-2">
                  <span>Read Briefing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Article Header' :
          modalType === 'metadata' ? 'Edit Author & Metadata' :
          modalType === 'takeaway' ? 'Edit Executive Takeaway' :
          modalType === 'content' ? 'Edit Article Prose Body' :
          modalType === 'tag_add' ? 'Add Topic Tag' : 'Edit Section'
        }
      >
        {modalType === 'header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category Badge</label>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Excerpt Subtitle</label>
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

        {modalType === 'metadata' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author Name</label>
              <input
                type="text"
                value={modalData.authorName || ''}
                onChange={(e) => setModalData({ ...modalData, authorName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author Role</label>
              <input
                type="text"
                value={modalData.authorRole || ''}
                onChange={(e) => setModalData({ ...modalData, authorRole: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={modalData.authorAvatar || ''}
                onChange={(e) => setModalData({ ...modalData, authorAvatar: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Published Date</label>
                <input
                  type="text"
                  value={modalData.publishedAt || ''}
                  onChange={(e) => setModalData({ ...modalData, publishedAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Read Time</label>
                <input
                  type="text"
                  value={modalData.readTime || ''}
                  onChange={(e) => setModalData({ ...modalData, readTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}

        {modalType === 'takeaway' && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Executive Takeaway Quote</label>
              <textarea
                rows={4}
                value={modalData.quote || ''}
                onChange={(e) => setModalData({ ...modalData, quote: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'content' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Body (Markdown &amp; Headings)</label>
            <p className="text-[11px] text-slate-500 mb-2">Use double line breaks between paragraphs. Use '### Subtitle' for section headings.</p>
            <textarea
              rows={14}
              value={modalData.body || ''}
              onChange={(e) => setModalData({ ...modalData, body: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
            />
          </div>
        )}

        {modalType === 'tag_add' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag Name</label>
            <input
              type="text"
              required
              value={modalData.text || ''}
              onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              placeholder="e.g. SovereignCloud"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}
      </LiveEditorModal>
    </div>
  );
}
