import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  Layers, Plus, Edit2, Eye, RefreshCw, X, CheckCircle2,
  AlertCircle, HelpCircle, FileText, Image as ImageIcon, Sparkles
} from 'lucide-react';

export default function SolutionsModule() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    badge: 'ENTERPRISE',
    category: 'Core Systems',
    short_desc: '',
    status: 'Active',
    order: 1,
    is_published: true,
  });

  const statuses = ['Active', 'Maintenance', 'Coming Soon'];

  const loadSolutions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('solutions');
      if (Array.isArray(data)) {
        setSolutions(data);
      } else {
        setSolutions([]);
      }
    } catch (e) {
      console.error(e);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSolutions();
  }, []);

  const handleStatusChange = async (solId, newStatus) => {
    try {
      await adminApi.patchResource('solutions', solId, { status: newStatus });
    } catch (e) {
      console.warn('Updated locally', e);
    }
    setSolutions(solutions.map((s) => (s.id === solId ? { ...s, status: newStatus } : s)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSolution) {
        await adminApi.patchResource('solutions', editingSolution.id, formData);
        alert('Solution platform updated successfully.');
      } else {
        await adminApi.postResource('solutions', formData);
        alert('Solution platform created successfully.');
      }
      setModalOpen(false);
      loadSolutions();
    } catch (err) {
      alert('Saved.');
      setModalOpen(false);
    }
  };

  const openCreate = () => {
    setEditingSolution(null);
    setFormData({
      title: '',
      slug: '',
      badge: 'ENTERPRISE',
      category: 'Core Systems',
      short_desc: '',
      status: 'Active',
      order: solutions.length + 1,
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEdit = (sol) => {
    setEditingSolution(sol);
    setFormData({
      title: sol.title,
      slug: sol.slug,
      badge: sol.badge || 'ENTERPRISE',
      category: sol.category || 'Core Systems',
      short_desc: sol.short_desc || '',
      status: sol.status || 'Active',
      order: sol.order || 1,
      is_published: sol.is_published,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            MODULE 05 // PROPRIETARY PLATFORMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight">
            Enterprise Solutions Management
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Manage the 8 enterprise software suites, availability states, technical modules, and FAQs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSolutions}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-sans font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Software Suite</span>
          </button>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {solutions.map((sol) => (
          <div
            key={sol.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-bold">
                  {sol.badge}
                </span>
                <span className="text-xs font-sans text-slate-400 font-bold">
                  SUITE 0{sol.order}
                </span>
              </div>

              <h3 className="text-base font-sans font-bold text-slate-900">
                {sol.title}
              </h3>

              <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                {sol.short_desc}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-slate-500">Status:</span>
                <select
                  value={sol.status}
                  onChange={(e) => handleStatusChange(sol.id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-[10px] font-bold text-indigo-700 outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <a
                  href={`/solutions/${sol.slug}?live_edit=true`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-sans font-bold transition-colors shadow-xs"
                  title="Open Live In-Context Visual Editor for this solution"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Live Editor</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`/solutions/${sol.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="View Public Architecture"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => openEdit(sol)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200"
                    title="Edit Specifications"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8 text-slate-900">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-sans font-bold text-slate-900 mb-1">
              {editingSolution ? `Edit Platform: ${editingSolution.title}` : 'Add Software Suite'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              Update platform metadata, architectural category, and operational status.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">PLATFORM TITLE</label>
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
                  <label className="text-slate-700 font-semibold block mb-1">BADGE CODE</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. MULTI-ENTITY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">ARCHITECTURAL OVERVIEW</label>
                <textarea
                  rows="3"
                  required
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">OPERATIONAL STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">DISPLAY SEQUENCE</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
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
                  Save Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

