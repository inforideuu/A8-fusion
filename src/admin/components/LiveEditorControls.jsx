import React, { useState } from 'react';
import {
  Sparkles, Edit2, Trash2, Plus, Save, RotateCcw,
  Eye, EyeOff, ArrowLeft, X, Check, Lock, ChevronRight
} from 'lucide-react';

export function LiveEditorToolbar({
  pageName = 'Home Page (/)',
  isDirty = false,
  saving = false,
  previewMode = false,
  onTogglePreview,
  onReset,
  onSave,
  onExit
}) {
  return (
    <aside aria-label="Live Visual Editor Toolbar" className="fixed top-0 inset-x-0 z-[9999] bg-slate-900/95 backdrop-blur-md text-white border-b border-indigo-500/40 px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider text-white shadow-sm shadow-indigo-600/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Visual Editor</span>
        </div>
        <span className="text-slate-300 font-medium hidden sm:inline">
          Editing: <strong className="text-white">{pageName}</strong>
        </span>
        {isDirty ? (
          <span className="text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
            Unsaved Changes
          </span>
        ) : (
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full hidden md:inline">
            MySQL Synchronized
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-medium ${
            previewMode
              ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title={previewMode ? 'Exit Clean Preview Mode' : 'Hide Editor Badges & Preview'}
        >
          {previewMode ? <Eye className="w-3.5 h-3.5 text-white" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>{previewMode ? 'Exit Preview' : 'Clean Preview'}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer text-xs font-medium"
          title="Restore factory template content"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all shadow-md cursor-pointer text-xs uppercase tracking-wider ${
            isDirty
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 ring-2 ring-indigo-400'
              : 'bg-indigo-600/80 hover:bg-indigo-600 text-white shadow-indigo-600/20'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save to MySQL'}</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Exit</span>
        </button>
      </div>
    </aside>
  );
}

export function CardActionOverlay({ onEdit, onDelete, title = 'Card' }) {
  return (
    <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-md">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        title={`Edit ${title}`}
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }}
        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
        title={`Delete ${title}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function AddCardButton({ onClick, label = 'Add New Item', subtitle = 'Add another card to this grid' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl p-6 sm:p-8 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/70 transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[220px] cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <Plus className="w-6 h-6" />
      </div>
      <div>
        <span className="font-serif font-bold text-slate-900 block text-base group-hover:text-indigo-700">
          + {label}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500 font-sans mt-1 block">
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
}

export function SectionHeaderEditButton({ onClick, label = 'Edit Header' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold font-sans transition-colors cursor-pointer shadow-2xs"
    >
      <Edit2 className="w-3 h-3 text-indigo-600" />
      <span>{label}</span>
    </button>
  );
}

export function LiveEditorModal({ isOpen, onClose, onSave, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative my-8 text-slate-900 font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {children}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm shadow-indigo-600/30 transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

