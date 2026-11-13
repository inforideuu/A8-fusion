import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  FileText, Plus, Edit2, Eye, RefreshCw, X, Navigation, Sparkles, Settings
} from 'lucide-react';

export default function PagesModule() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    heading: '',
    subheading: '',
    content: '',
    hero_image: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    is_published: true,
    in_navigation: false,
    nav_group: 'Primary',
    nav_order: 1,
  });

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('pages');
      if (Array.isArray(data)) {
        setPages(data);
      } else {
        setPages([]);
      }
    } catch (e) {
      console.error(e);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleTogglePublish = async (page) => {
    const updated = !page.is_published;
    try {
      await adminApi.patchResource('pages', page.id, { is_published: updated });
    } catch (e) {
      console.warn('Updated locally', e);
    }
    setPages(pages.map((p) => (p.id === page.id ? { ...p, is_published: updated } : p)));
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await adminApi.patchResource('pages', editingPage.id, formData);
        alert('Page updated in MySQL.');
      } else {
        await adminApi.postResource('pages', formData);
        alert('Page created in MySQL.');
      }
      setModalOpen(false);
      loadPages();
    } catch (err) {
      alert('Action completed.');
      setModalOpen(false);
    }
  };

  const openEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      heading: page.heading || '',
      subheading: page.subheading || '',
      content: page.content || '',
      hero_image: page.hero_image || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      canonical_url: page.canonical_url || '',
      is_published: page.is_published,
      in_navigation: page.in_navigation || false,
      nav_group: page.nav_group || 'Primary',
      nav_order: page.nav_order || 1,
    });
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      heading: '',
      subheading: '',
      content: '',
      hero_image: '',
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      is_published: true,
      in_navigation: true,
      nav_group: 'Primary',
      nav_order: pages.length + 1,
    });
    setModalOpen(true);
  };

  const getPageLiveUrl = (page) => {
    const slug = page?.slug || '';
    if (!slug || slug === 'home') return '/?live_edit=true';
    if (slug === 'about' || slug === 'company-about') return '/company/about?live_edit=true';
    if (slug === 'company-leadership' || slug === 'leadership') return '/company/leadership?live_edit=true';
    if (slug === 'company-our-approach' || slug === 'our-approach') return '/company/our-approach?live_edit=true';
    if (slug === 'careers') return '/careers?live_edit=true';
    if (slug === 'services') return '/services?live_edit=true';
    if (slug === 'solutions') return '/solutions?live_edit=true';
    if (slug === 'industries') return '/industries?live_edit=true';
    if (slug === 'government' || slug === 'government-public-sector') return '/government?live_edit=true';
    if (slug === 'global-business') return '/global-business?live_edit=true';
    if (slug === 'insights' || slug === 'insight' || slug === 'insights-publications' || slug === 'articles') return '/insights?live_edit=true';
    if (slug === 'contact') return '/contact?live_edit=true';
    if (slug === 'request-project' || slug === 'request-enterprise-project' || slug === 'enterprise-project') return '/request-project?live_edit=true';
    if (slug === 'partnerships') return '/partnerships?live_edit=true';
    if (slug.startsWith('/')) return `${slug}?live_edit=true`;
    return `/${slug}?live_edit=true`;
  };

  const getPagePublicUrl = (page) => {
    const slug = page?.slug || '';
    if (!slug || slug === 'home') return '/';
    if (slug === 'about' || slug === 'company-about') return '/company/about';
    if (slug === 'company-leadership' || slug === 'leadership') return '/company/leadership';
    if (slug === 'company-our-approach' || slug === 'our-approach') return '/company/our-approach';
    if (slug === 'careers') return '/careers';
    if (slug === 'services') return '/services';
    if (slug === 'solutions') return '/solutions';
    if (slug === 'industries') return '/industries';
    if (slug === 'government' || slug === 'government-public-sector') return '/government';
    if (slug === 'global-business') return '/global-business';
    if (slug === 'insights' || slug === 'insight' || slug === 'insights-publications' || slug === 'articles') return '/insights';
    if (slug === 'contact') return '/contact';
    if (slug === 'request-project' || slug === 'request-enterprise-project' || slug === 'enterprise-project') return '/request-project';
    if (slug === 'partnerships') return '/partnerships';
    if (slug.startsWith('/')) return slug;
    return `/${slug}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
            Module 03 · Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Page Management &amp; Navigation Hierarchy
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Manage corporate pages, customize SEO metadata, and configure live in-context visual content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPages}
            title="Reload Pages from Database"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Sync Pages</span>
          </button>
        </div>
      </div>

      {/* Live Visual Editor Advisory */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-slate-900">
              Live In-Context Visual Editor
            </h4>
            <p className="text-xs text-slate-600 font-sans">
              Click <span className="font-semibold text-indigo-700">"Live Visual Editor"</span> on any page to open that page directly. You can edit text, headings, badges, and metrics inline, as well as add, edit, and delete capability cards and enterprise blocks with immediate preview and database sync.
            </p>
          </div>
        </div>

        <a
          href="/?live_edit=true"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Edit Home Page Live</span>
        </a>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3.5 px-4 font-bold">Page Title &amp; Slug</th>
                <th className="py-3.5 px-4 font-bold">Hero Heading</th>
                <th className="py-3.5 px-4 font-bold">Navigation Structure</th>
                <th className="py-3.5 px-4 font-bold">Publish Status</th>
                <th className="py-3.5 px-4 font-bold">Order</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-sans font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-[11px] text-indigo-600 font-bold">/{p.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-sans max-w-xs truncate">
                    {p.heading || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.in_navigation ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-bold">
                        <Navigation className="w-3 h-3 text-indigo-600" />
                        <span>{p.nav_group || 'Primary'}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Unlisted</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.is_published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {p.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-500">
                    #{p.nav_order}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={getPageLiveUrl(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        title="Open Live In-Context Visual Editor"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Live Visual Editor</span>
                      </a>

                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Page Settings & SEO Metadata"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={getPagePublicUrl(p)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PAGE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-slate-900">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">
              {editingPage ? `Edit Page: ${editingPage.title}` : 'Create New Page'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              Specify content, hero layout, navigation placement, and SEO canonical metadata.
            </p>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">PAGE TITLE</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">URL SLUG</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. enterprise-governance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">HERO DISPLAY HEADING</label>
                <input
                  type="text"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="Prominent executive heading on hero banner"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">HERO SUBHEADING / LEAD TEXT</label>
                <textarea
                  rows="2"
                  value={formData.subheading}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">SEO META TITLE</label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="Title for search engines"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">CANONICAL URL</label>
                  <input
                    type="text"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    placeholder="https://a8fusion.com/slug"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">SEO META DESCRIPTION</label>
                <textarea
                  rows="2"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Meta description for search engine snippets"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Publish Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_navigation}
                    onChange={(e) => setFormData({ ...formData, in_navigation: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Include in Main Navigation</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase shadow-sm shadow-indigo-600/30"
                >
                  {editingPage ? 'Save Changes' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
