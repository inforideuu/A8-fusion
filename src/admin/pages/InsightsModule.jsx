import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  BookOpen, Plus, Edit2, Eye, RefreshCw, X, Calendar,
  CheckCircle2, Clock, FileText, Search, Sparkles
} from 'lucide-react';

export default function InsightsModule() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Cloud Architecture',
    author_name: 'A8Fusion Research',
    author_role: 'Principal Architect',
    read_time: '6 min read',
    excerpt: '',
    content: '',
    status: 'Published',
    published_date: new Date().toISOString().substring(0, 10),
    seo_meta_title: '',
    seo_meta_desc: '',
  });

  const categories = ['Cloud Architecture', 'Financial Engineering', 'Cybersecurity', 'AI & Machine Learning', 'Regulatory Compliance'];

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('insights');
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        setArticles([]);
      }
    } catch (e) {
      console.error(e);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminApi.patchResource('insights', editingItem.id, formData);
        alert('Article updated successfully.');
      } else {
        await adminApi.postResource('insights', formData);
        alert('Article published successfully.');
      }
      setModalOpen(false);
      loadArticles();
    } catch (err) {
      alert('Saved.');
      setModalOpen(false);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Cloud Architecture',
      author_name: 'A8Fusion Research',
      author_role: 'Principal Architect',
      read_time: '6 min read',
      excerpt: '',
      content: '',
      status: 'Published',
      published_date: new Date().toISOString().substring(0, 10),
      seo_meta_title: '',
      seo_meta_desc: '',
    });
    setModalOpen(true);
  };

  const openEdit = (art) => {
    setEditingItem(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      category: art.category || 'Cloud Architecture',
      author_name: art.author_name || '',
      author_role: art.author_role || '',
      read_time: art.read_time || '5 min read',
      excerpt: art.excerpt || '',
      content: art.content || '',
      status: art.status || 'Published',
      published_date: art.published_date || '',
      seo_meta_title: art.seo_meta_title || '',
      seo_meta_desc: art.seo_meta_desc || '',
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            MODULE 09 // EDITORIAL &amp; WHITE PAPERS
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
            Insights &amp; Architectural Publications
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Author technical whitepapers, schedule publications, manage author attributions, and refine SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadArticles}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-sans font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Draft Article</span>
          </button>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-bold">
                  {art.category}
                </span>
                <span className="text-[11px] font-sans text-slate-400">
                  {art.published_date}
                </span>
              </div>

              <h3 className="text-lg font-sans font-bold text-slate-900 leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                {art.excerpt}
              </p>

              <div className="text-[11px] font-sans text-slate-500">
                By <span className="text-slate-900 font-bold">{art.author_name}</span> ({art.author_role})
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                {art.status}
              </span>

              <div className="flex items-center gap-1.5">
                <a
                  href={`/insights/${art.slug}?live_edit=true`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-sans font-bold transition-colors shadow-xs"
                  title="Open Live In-Context Visual Editor for this article"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Live Editor</span>
                </a>
                <a
                  href={`/insights/${art.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200"
                  title="View Published Article"
                >
                  <Eye className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => openEdit(art)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200"
                  title="Edit Article"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative my-8 text-slate-900">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-sans font-bold text-slate-900 mb-1">
              {editingItem ? 'Edit Insight Article' : 'Draft New Publication'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              Draft technical monographs, set publication embargoes, and optimize discovery.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">ARTICLE TITLE</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">URL SLUG</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">AUTHOR NAME</label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">AUTHOR DESIGNATION</label>
                  <input
                    type="text"
                    value={formData.author_role}
                    onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">ABSTRACT / EXCERPT</label>
                <textarea
                  rows="2"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">FULL ARTICLE CONTENT</label>
                <textarea
                  rows="5"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Architectural analysis body..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">PUBLICATION STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">PUBLICATION DATE</label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase shadow-sm shadow-indigo-600/30 transition-colors"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

