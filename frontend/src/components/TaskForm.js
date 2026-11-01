'use client';

import { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', color: 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300' },
  { value: 'in-progress', label: 'In Progress', color: 'border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-300' },
  { value: 'done', label: 'Done', color: 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300' },
];

export default function TaskForm({ onSubmit, initialData, isLoading, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      const rawStatus = (initialData.status || 'todo').toLowerCase().replace(/\s+/g, '-');
      setStatus(['todo', 'in-progress', 'done'].includes(rawStatus) ? rawStatus : 'todo');
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      dueDate: dueDate || null,
    });
  };

  const setRelativeDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
          Task Title <span className="text-indigo-500 dark:text-indigo-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Set up auth endpoints, Design database schema"
          required
          autoFocus
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="task-desc" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task requirements, acceptance criteria, notes..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm resize-none outline-none font-light"
        />
      </div>

      {/* Status Selection Chips */}
      <div>
        <label className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`py-2 px-3 text-xs font-mono tracking-wider uppercase rounded-xl border transition-all text-center ${
                status === opt.value
                  ? `${opt.color} ring-2 ring-indigo-500/30 font-bold shadow-sm`
                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date with Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="task-due" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase">
            Due Date
          </label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRelativeDate(0)}
              className="text-[10px] font-mono text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              Today
            </button>
            <span className="text-slate-300 dark:text-white/20">•</span>
            <button
              type="button"
              onClick={() => setRelativeDate(1)}
              className="text-[10px] font-mono text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              Tomorrow
            </button>
            <span className="text-slate-300 dark:text-white/20">•</span>
            <button
              type="button"
              onClick={() => setRelativeDate(7)}
              className="text-[10px] font-mono text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              +1W
            </button>
          </div>
        </div>
        <input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none"
        />
      </div>

      {/* Form Buttons */}
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
          className="inline-flex items-center gap-2 px-5 py-2.2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
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
            <span>{initialData ? 'Update Task' : 'Add Task'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
