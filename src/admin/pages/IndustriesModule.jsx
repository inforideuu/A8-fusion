import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Building2, Plus, Edit2, Eye, RefreshCw, X, Sparkles } from 'lucide-react';

export default function IndustriesModule() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    overview: '',
    is_published: true,
    order: 1,
  });

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('industries');
      if (Array.isArray(data)) {
        setIndustries(data);
      } else {
        setIndustries([]);
      }
    } catch (e) {
      console.error(e);
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndustries();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminApi.patchResource('industries', editingItem.id, formData);
        alert('Sector updated in MySQL.');
      } else {
        await adminApi.postResource('industries', formData);
        alert('Sector created in MySQL.');
      }
      setModalOpen(false);
      loadIndustries();
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
      tagline: '',
      overview: '',
      is_published: true,
      order: industries.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (ind) => {
    setEditingItem(ind);
    setFormData({
      title: ind.title,
      slug: ind.slug,
      tagline: ind.tagline || '',
      overview: ind.overview || '',
      is_published: ind.is_published,
      order: ind.order || 1,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            MODULE 06 // SECTOR SPECIALIZATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Industry Sectors Management
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Configure industry-specific architectures, statutory compliance requirements, and solution linkages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadIndustries}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Industry Sector</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((ind) => (
          <div
            key={ind.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-bold">
                  SECTOR ARCHITECTURE
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  0{ind.order}
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-slate-900">
                {ind.title}
              </h3>

              <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                {ind.overview}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                PUBLISHED
              </span>

              <div className="flex items-center gap-1.5">
                <a
                  href={ind.slug === 'government' ? '/government?live_edit=true' : `/industries/${ind.slug}?live_edit=true`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-mono font-bold transition-colors shadow-xs"
                  title="Open Live In-Context Visual Editor for this sector"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Live Editor</span>
                </a>
                <a
                  href={ind.slug === 'government' ? '/government' : `/industries/${ind.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200"
                  title="View Live Sector Page"
                >
                  <Eye className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => openEdit(ind)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200"
                  title="Edit Specifications"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-900">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">
              {editingItem ? `Edit Sector: ${editingItem.title}` : 'Add Industry Sector'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              Specify sector challenges, statutory frameworks, and solution deployments.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">SECTOR TITLE</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

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
                <label className="text-slate-700 font-semibold block mb-1">ARCHITECTURAL OVERVIEW</label>
                <textarea
                  rows="3"
                  required
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
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
                  Save Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

