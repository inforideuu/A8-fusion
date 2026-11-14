import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { insightsData } from '../data/insightsData';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Check, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Share2,
  Printer,
  ExternalLink,
  CheckCircle2,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  Lock,
  ChevronRight,
  Plus,
  Trash2,
  Building2,
  FileText
} from 'lucide-react';
import {
  LiveEditorToolbar,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../admin/components/LiveEditorControls';

export default function InsightDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

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
    badge: defaultArticle.category || 'Enterprise Technology',
    title: defaultArticle.title || 'Architectural Briefing',
    subtitle: defaultArticle.excerpt || '',
    bgImage: defaultArticle.coverImage || '/insight.png',
    coverImage: defaultArticle.coverImage || '/insight.png',
    primaryCtaText: 'Discuss With Authoring Team',
    primaryCtaLink: '/request-project',
    secondaryCtaText: 'All Insights',
    secondaryCtaLink: '/insights'
  });

  const [metadata, setMetadata] = useState({
    authorName: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.name : defaultArticle.author) || 'Principal Systems Architect',
    authorRole: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.role : '') || 'A8Fusion Global Research',
    authorAvatar: (typeof defaultArticle.author === 'object' ? defaultArticle.author?.avatar : '') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    publishedAt: defaultArticle.publishedAt || defaultArticle.date || '2026-02-14',
    readTime: defaultArticle.readTime || '8 min read'
  });

  const [takeaway, setTakeaway] = useState({
    tag: 'Executive Strategic Mandate',
    quote: defaultArticle.excerpt
  });

  const [contentBody, setContentBody] = useState(defaultArticle.content);
  const [tags, setTags] = useState([...(defaultArticle.tags || [])]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});

  // Check URL query param for live_edit
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('live_edit') === 'true') {
      setEditMode(true);
    }
  }, [location.search]);

  // Reading Progress Bar tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Content from Backend / LocalStorage
  const storageKey = `a8_live_insight_${slug}`;
  const backendSlug = `insight-${slug}`;

  useEffect(() => {
    // 1. Synchronize state with current slug article
    let art = insightsData.find(a => a.slug === slug || a.id === slug);
    if (!art) {
      try {
        const local = localStorage.getItem('a8_live_insights_content');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed.articlesList)) {
            art = parsed.articlesList.find(a => a.slug === slug || a.id === slug);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (art) {
      setPageHeader({
        badge: art.category || 'Enterprise Technology',
        title: art.title || 'Architectural Briefing',
        subtitle: art.excerpt || '',
        bgImage: art.coverImage || '/insight.png',
        coverImage: art.coverImage || '/insight.png',
        primaryCtaText: 'Discuss With Authoring Team',
        primaryCtaLink: '/request-project',
        secondaryCtaText: 'All Insights',
        secondaryCtaLink: '/insights'
      });
      setMetadata({
        authorName: (typeof art.author === 'object' ? art.author?.name : art.author) || 'Principal Systems Architect',
        authorRole: (typeof art.author === 'object' ? art.author?.role : '') || 'A8Fusion Global Research',
        authorAvatar: (typeof art.author === 'object' ? art.author?.avatar : '') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        publishedAt: art.publishedAt || art.date || '2026-02-14',
        readTime: art.readTime || '8 min read'
      });
      setTakeaway({
        tag: 'Executive Strategic Mandate',
        quote: art.excerpt
      });
      setContentBody(art.content);
      setTags([...(art.tags || [])]);
    }

    // 2. Fetch live content from backend or local overrides
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
      alert('Insight article saved & synced with database!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this briefing back to factory original text?')) {
      let orig = insightsData.find(a => a.slug === slug || a.id === slug) || defaultArticle;
      setPageHeader({
        badge: orig.category || 'Enterprise Technology',
        title: orig.title || 'Architectural Briefing',
        subtitle: orig.excerpt || '',
        bgImage: orig.coverImage || '/insight.png',
        coverImage: orig.coverImage || '/insight.png',
        primaryCtaText: 'Discuss With Authoring Team',
        primaryCtaLink: '/request-project',
        secondaryCtaText: 'All Insights',
        secondaryCtaLink: '/insights'
      });
      setMetadata({
        authorName: (typeof orig.author === 'object' ? orig.author?.name : orig.author) || 'Principal Systems Architect',
        authorRole: (typeof orig.author === 'object' ? orig.author?.role : '') || 'A8Fusion Global Research',
        authorAvatar: (typeof orig.author === 'object' ? orig.author?.avatar : '') || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        publishedAt: orig.publishedAt || orig.date || '2026-02-14',
        readTime: orig.readTime || '8 min read'
      });
      setTakeaway({
        tag: 'Executive Strategic Mandate',
        quote: orig.excerpt
      });
      setContentBody(orig.content);
      setTags([...(orig.tags || [])]);
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

  // Modal Handlers
  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalData({});
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    markDirty();

    if (modalType === 'header') {
      setPageHeader({ ...pageHeader, ...modalData });
    } else if (modalType === 'metadata') {
      setMetadata({ ...metadata, ...modalData });
    } else if (modalType === 'takeaway') {
      setTakeaway({ ...takeaway, ...modalData });
    } else if (modalType === 'content') {
      setContentBody(modalData.body || '');
    } else if (modalType === 'tag_add') {
      if (modalData.text && !tags.includes(modalData.text)) {
        setTags([...tags, modalData.text.trim()]);
      }
    }

    closeModal();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const isLive = editMode && !previewMode;
  const relatedArticles = insightsData.filter(a => a.slug !== slug && a.id !== slug && a.id !== defaultArticle.id).slice(0, 3);

  // Table of Contents calculation
  const tocHeadings = useMemo(() => {
    if (!contentBody) return [];
    return contentBody
      .split('\n')
      .filter(l => l.trim().startsWith('### '))
      .map((l, index) => {
        const text = l.replace('### ', '').trim();
        const id = `briefing-section-${index}`;
        return { text, id, index };
      });
  }, [contentBody]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`bg-[#F8FAFC] min-h-screen text-slate-800 ${editMode ? 'pt-14' : ''}`}>
      {/* Luxury Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 via-amber-500 to-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName={`Executive Briefing: ${pageHeader.title} (/insights/${slug})`}
          isDirty={isDirty}
          saving={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onReset={handleReset}
          onSave={handleSaveAll}
          onExit={handleExit}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER PAGEHEADER (Signature Corporate A8Fusion Hero)          */}
      {/* ========================================================================= */}
      <div className="relative group">
        {isLive && (
          <div className="absolute top-6 right-6 z-40 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-indigo-200 shadow-xl flex items-center gap-2">
            <SectionHeaderEditButton
              onClick={() => openModal('header', { ...pageHeader })}
              label="Edit Article Hero"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge || 'Enterprise Technology'}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage || pageHeader.coverImage || '/insight.png'}
          breadcrumbs={[
            { label: 'Insights', link: '/insights' },
            { label: pageHeader.badge || 'Executive Research', link: '/insights' },
            { label: 'Briefing' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText || 'Discuss With Authoring Team'}
          primaryCtaLink={pageHeader.primaryCtaLink || '/request-project'}
          secondaryCtaText={pageHeader.secondaryCtaText || 'All Insights'}
          secondaryCtaLink={pageHeader.secondaryCtaLink || '/insights'}
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: LUXURY EDITORIAL CORE (Author Ribbon + 2-Col Layout)            */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Intelligence Author & Verification Ribbon */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={metadata.authorAvatar}
                  alt={metadata.authorName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 text-white shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-wide">{metadata.authorName}</h3>
                  <span className="text-[10px] font-mono uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                    Authoring Fellow
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{metadata.authorRole}</p>
              </div>
            </div>

            {/* Publication Timestamps & Reading Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>{metadata.publishedAt}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{metadata.readTime}</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PEER-REVIEWED
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs font-sans font-medium"
                  title="Copy direct briefing link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                  title="Share on LinkedIn"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                  title="Print / Save Whitepaper as PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Core Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
            
            {/* --------------------------------------------------------------------- */}
            {/* LEFT / CENTER COLUMN: MAIN RESEARCH PROSE (lg:col-span-8)            */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-10">

              {/* Executive "At A Glance" Intelligence Card */}
              <div className="relative group/takeaway rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 text-slate-900 p-7 sm:p-9 border-2 border-indigo-100 shadow-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-amber-500 to-indigo-500" />
                
                {isLive && (
                  <div className="absolute top-4 right-4 z-20">
                    <SectionHeaderEditButton
                      onClick={() => openModal('takeaway', { ...takeaway })}
                      label="Edit Executive Mandate"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-bold block">
                      EXECUTIVE STRATEGIC MANDATE
                    </span>
                    <h2 className="text-base font-serif font-bold text-slate-900 tracking-wide">
                      {takeaway.tag}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-serif italic text-slate-700 leading-relaxed mb-6 pl-4 border-l-2 border-indigo-600">
                  "{takeaway.quote}"
                </p>

                {/* 3 Strategic Delivery Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
                  <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-indigo-700 font-mono font-bold block">01 // CONTROL</span>
                    <p className="text-slate-600 font-medium">Zero data egress &amp; sovereign weights preservation.</p>
                  </div>
                  <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-amber-700 font-mono font-bold block">02 // DETERMINISM</span>
                    <p className="text-slate-600 font-medium">Mathematical provenance &amp; verifiable RAG citations.</p>
                  </div>
                  <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-emerald-700 font-mono font-bold block">03 // STABILITY</span>
                    <p className="text-slate-600 font-medium">99.999% SLA uptime without single point of failure.</p>
                  </div>
                </div>
              </div>

              {/* Main Prose Article Body */}
              <article className="relative group/prose bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm">
                {isLive && (
                  <div className="flex justify-end mb-6">
                    <SectionHeaderEditButton
                      onClick={() => openModal('content', { body: contentBody })}
                      label="Edit Article Text Body"
                    />
                  </div>
                )}

                <div className="prose prose-slate max-w-none text-slate-800 font-sans text-base sm:text-lg leading-relaxed space-y-8">
                  {contentBody.trim().split('\n\n').map((block, idx) => {
                    // Section Headings (### )
                    if (block.startsWith('### ')) {
                      const headingText = block.replace('### ', '').trim();
                      const headingItem = tocHeadings.find(h => h.text === headingText);
                      const headingId = headingItem ? headingItem.id : `section-${idx}`;
                      const sectionNum = String((tocHeadings.findIndex(h => h.text === headingText) + 1)).padStart(2, '0');

                      return (
                        <div key={idx} id={headingId} className="pt-8 sm:pt-10 scroll-mt-28">
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
                              SECTION {sectionNum}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
                            {headingText}
                          </h2>
                        </div>
                      );
                    }

                    // Bullet / Numbered Lists
                    if (block.startsWith('- ') || block.startsWith('1. ') || block.includes('\n- ') || block.includes('\n1. ')) {
                      const lines = block.split('\n').filter(l => l.trim().length > 0);
                      return (
                        <div key={idx} className="my-6 space-y-3">
                          {lines.map((line, lidx) => {
                            const cleanLine = line.replace(/^-\s+/, '').replace(/^\d+\.\s+/, '');
                            const isBoldTitle = cleanLine.includes('**:');
                            
                            return (
                              <div 
                                key={lidx} 
                                className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-indigo-300 transition-colors"
                              >
                                <div className="mt-0.5 text-indigo-600 shrink-0">
                                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                                  {isBoldTitle ? (
                                    <>
                                      <strong className="text-slate-900 font-semibold">
                                        {cleanLine.split('**:')[0].replace(/\*\*/g, '')}:
                                      </strong>
                                      <span> {cleanLine.split('**:')[1]}</span>
                                    </>
                                  ) : (
                                    cleanLine.replace(/\*\*/g, '')
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // Drop cap on first standard paragraph
                    const isFirstParagraph = idx === 0 || (idx === 1 && contentBody.trim().startsWith('###'));
                    return (
                      <p 
                        key={idx} 
                        className={`text-slate-700 leading-relaxed font-sans text-base sm:text-lg ${
                          isFirstParagraph 
                            ? 'first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-3 first-letter:leading-none' 
                            : ''
                        }`}
                      >
                        {block}
                      </p>
                    );
                  })}
                </div>

                {/* Quantitative System Benchmarks Callout */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-4">
                    VERIFIED ARCHITECTURAL BENCHMARKS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-2xl font-serif font-bold text-indigo-600">99.999%</span>
                      <p className="text-xs font-mono text-slate-600 font-medium">High Availability SLA</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-2xl font-serif font-bold text-amber-600">&lt; 10ms</span>
                      <p className="text-xs font-mono text-slate-600 font-medium">Deterministic Latency</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-2xl font-serif font-bold text-emerald-600">100%</span>
                      <p className="text-xs font-mono text-slate-600 font-medium">Sovereign Data Custody</p>
                    </div>
                  </div>
                </div>

                {/* Topic Taxonomy Tags */}
                <div className="pt-10 mt-10 border-t border-slate-200 relative group/tags">
                  <span className="text-xs font-mono uppercase font-bold text-slate-500 block mb-3">
                    ARCHITECTURAL TAXONOMY &amp; CLASSIFICATION
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
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
                        className="text-xs font-mono px-3 py-1.5 rounded-lg border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Topic Tag</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Author Biographical Sign-Off */}
                <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/30 to-white border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xs">
                  <img
                    src={metadata.authorAvatar}
                    alt={metadata.authorName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-200 shadow-md shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 tracking-wide">{metadata.authorName}</h4>
                        <p className="text-xs text-indigo-600 font-mono font-medium">{metadata.authorRole}</p>
                      </div>
                      <Link
                        to="/request-project"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-mono tracking-wider transition-colors shadow-sm"
                      >
                        <span>Schedule Advisory</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pt-1">
                      Authoring fellow at A8Fusion specializing in mission-critical distributed systems, sovereign cloud architectures, and deterministic machine intelligence for multinational corporations and public sector ministries.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: STICKY LUXURY EXECUTIVE SIDEBAR (lg:col-span-4)         */}
            {/* --------------------------------------------------------------------- */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-20 space-y-6">

                {/* Interactive Table of Contents */}
                {tocHeadings.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                        BRIEFING OUTLINE
                      </h3>
                    </div>
                    <nav className="space-y-2 text-xs">
                      {tocHeadings.map((h, i) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => scrollToSection(h.id)}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors flex items-start gap-2.5 group cursor-pointer text-slate-700 hover:text-indigo-700 font-sans"
                        >
                          <span className="font-mono text-[11px] text-slate-400 group-hover:text-indigo-600 font-bold shrink-0 mt-0.5">
                            {String(i + 1).padStart(2, '0')}.
                          </span>
                          <span className="leading-snug font-medium">{h.text}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Direct Executive Architecture Advisory Widget */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 text-slate-900 p-7 border-2 border-indigo-100 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-mono font-bold tracking-wider uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DIRECT CONSULTATION</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug">
                    Deploy This Architecture In Your Enterprise
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    A8Fusion engineering directors conduct tailored feasibility analyses, security posture audits, and on-premise deployment blueprints for qualified corporations.
                  </p>

                  <div className="pt-2">
                    <Link
                      to="/request-project"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-indigo-500/25"
                    >
                      <span>Request Architectural Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>NDA Protected</span>
                    <span>Direct Senior Partner Access</span>
                  </div>
                </div>

                {/* Institutional Compliance Seal */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-mono uppercase tracking-wider">A8FUSION RESEARCH INSTITUTE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    This publication is engineered according to ISO/IEC 27001 data residency standards and international software architectural best practices.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-medium">ISO 27001</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-medium">SOC-2 TYPE II</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-medium">AIR-GAPPED READY</span>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: RELATED EXECUTIVE BRIEFINGS (Clean Magazine Editorial Grid)    */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">
                RECOMMENDED EXECUTIVE READING
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                Related Architectural Whitepapers
              </h3>
            </div>
            <Link 
              to="/insights" 
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider"
            >
              <span>Explore All Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <article
                key={rel.id}
                className="bg-white rounded-2xl border border-slate-200 card-hover-editorial flex flex-col justify-between group overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
                      <span className="bg-indigo-600 text-white font-bold uppercase px-2.5 py-0.5 rounded text-[10px] shadow-sm">
                        {rel.category}
                      </span>
                      <span className="text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200/80 font-mono shadow-2xs">
                        {rel.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h4 className="text-base font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      <Link to={`/insights/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-2 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rel.author?.avatar}
                      alt={rel.author?.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-[11px] font-semibold text-slate-700">{rel.author?.name}</span>
                  </div>

                  <Link
                    to={`/insights/${rel.slug}`}
                    className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1 font-mono"
                  >
                    <span>Read Briefing</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIVE EDITOR MODAL DIALOG                                                  */}
      {/* ========================================================================= */}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Headline Title</label>
              <input
                type="text"
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Executive Subtitle / Abstract</label>
              <textarea
                rows={3}
                value={modalData.subtitle || ''}
                onChange={(e) => setModalData({ ...modalData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Background Image URL</label>
              <input
                type="text"
                value={modalData.bgImage || modalData.coverImage || ''}
                onChange={(e) => setModalData({ ...modalData, bgImage: e.target.value, coverImage: e.target.value })}
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
              placeholder="e.g. SovereignAI"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}
      </LiveEditorModal>
    </div>
  );
}
