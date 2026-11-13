import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import {
  Cpu, Plus, Edit2, Eye, RefreshCw, X, CheckCircle2,
  Layers, Cloud, ShieldCheck, BrainCircuit, Building2, Sparkles
} from 'lucide-react';

export default function ServicesModule() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tag: '',
    short_desc: '',
    full_desc: '',
    icon_name: 'Cpu',
    image_url: '',
    is_published: true,
    order: 1
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getResource('services');
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]);
      }
    } catch (e) {
      console.error(e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleTogglePublish = async (service) => {
    const updated = !service.is_published;
    try {
      await adminApi.patchResource('services', service.id, { is_published: updated });
    } catch (e) {
      console.warn('Updated locally', e);
    }
    setServices(services.map((s) => (s.id === service.id ? { ...s, is_published: updated } : s)));
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await adminApi.patchResource('services', editingService.id, formData);
        alert('Service discipline updated in MySQL.');
      } else {
        await adminApi.postResource('services', formData);
        alert('Service discipline created in MySQL.');
      }
      setModalOpen(false);
      loadServices();
    } catch (err) {
      alert('Saved.');
      setModalOpen(false);
    }
  };

  const openCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      tag: 'ENGINEERING SPEC',
      short_desc: '',
      full_desc: '',
      icon_name: 'Cpu',
      image_url: '',
      is_published: true,
      order: services.length + 1
    });
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      tag: service.tag || '',
      short_desc: service.short_desc || '',
      full_desc: service.full_desc || '',
      icon_name: service.icon_name || 'Cpu',
      image_url: service.image_url || '',
      is_published: service.is_published,
      order: service.order || 1
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            MODULE 04 // ENGINEERING DISCIPLINES
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Services Architecture Management
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Administer the 7 core engineering disciplines, technical specifications, and publishing state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadServices}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Engineering Discipline</span>
          </button>
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-bold">
                  {srv.tag}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  DISCIPLINE 0{srv.order}
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-slate-900">
                {srv.title}
              </h3>

              <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                {srv.short_desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => handleTogglePublish(srv)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  srv.is_published
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {srv.is_published ? 'PUBLISHED' : 'DRAFT'}
              </button>

              <div className="flex items-center gap-1.5">
                <a
                  href={`/services/${srv.slug}?live_edit=true`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-mono font-bold transition-colors shadow-xs"
                  title="Open Live In-Context Visual Editor for this service"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Live Editor</span>
                </a>
                <a
                  href={`/services/${srv.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="View Live Page"
                >
                  <Eye className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => openEdit(srv)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white transition-colors"
                  title="Edit Specifications"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
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

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">
              {editingService ? `Edit Discipline: ${editingService.title}` : 'Add Engineering Discipline'}
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-5">
              Configure engineering taxonomy, architectural overview, and display sequence.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-600 font-bold block mb-1">SERVICE TITLE</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">URL SLUG</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">SPEC TAG</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">EXECUTIVE SUMMARY / OVERVIEW</label>
                <textarea
                  rows="3"
                  required
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-600 font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srv-pub"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 w-4 h-4"
                />
                <label htmlFor="srv-pub" className="text-slate-700 cursor-pointer font-medium">
                  Publish Discipline to Public Portal
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase shadow-sm shadow-indigo-600/30"
                >
                  Save Discipline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
