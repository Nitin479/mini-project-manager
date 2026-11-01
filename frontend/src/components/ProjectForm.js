'use client';

import { useState, useEffect } from 'react';

export default function ProjectForm({ onSubmit, initialData, isLoading, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="project-title" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
          Project Title <span className="text-indigo-500 dark:text-indigo-400">*</span>
        </label>
        <input
          id="project-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Website Redesign, Mobile Application"
          required
          autoFocus
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="project-desc" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
          Description
        </label>
        <textarea
          id="project-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Summary of project goals, milestone deliverables..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm resize-none outline-none font-light"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-xl transition-colors border border-slate-200 dark:border-white/[0.06]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{initialData ? 'Update Project' : 'Create Project'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
