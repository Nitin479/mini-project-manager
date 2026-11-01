'use client';

import { useState } from 'react';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/store/api/taskApi';
import { useTheme } from './ThemeContext';

const statusConfig = {
  'todo': {
    label: 'TO DO',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:border-amber-400',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    next: 'in-progress',
    beam: 'from-amber-500/60 via-amber-400/40 to-transparent',
  },
  'in-progress': {
    label: 'IN PROGRESS',
    badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/35 hover:border-indigo-400',
    dot: 'bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.9)] animate-pulse',
    next: 'done',
    beam: 'from-indigo-500/70 via-cyan-400/50 to-transparent',
  },
  'done': {
    label: 'DONE',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:border-emerald-400',
    dot: 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    next: 'todo',
    beam: 'from-emerald-500/70 via-teal-400/50 to-transparent',
  },
};

export default function TaskCard({ task, onEdit }) {
  const { currentPreset } = useTheme();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const normalizedStatus = (task.status || 'todo').toLowerCase().replace(/\s+/g, '-');
  const config = statusConfig[normalizedStatus] || statusConfig['todo'];
  const isDone = normalizedStatus === 'done';

  const handleCycleStatus = async () => {
    try {
      await updateTask({
        id: task._id,
        status: config.next,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || 'Failed to delete task');
    }
    setShowConfirm(false);
  };

  const getDueStatus = (dateStr) => {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    const now = new Date();
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

    const formatted = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (isDone) {
      return { text: formatted, isOverdue: false };
    }
    if (diffDays < 0) {
      return {
        text: `${formatted} (Overdue by ${Math.abs(diffDays)}d)`,
        isOverdue: true,
      };
    }
    if (diffDays === 0) {
      return { text: 'Due today', isOverdue: false, isToday: true };
    }
    if (diffDays === 1) {
      return { text: 'Due tomorrow', isOverdue: false };
    }
    return { text: `Due ${formatted}`, isOverdue: false };
  };

  const dueInfo = getDueStatus(task.dueDate);

  return (
    <div className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl animate-fade-in-up bg-white dark:bg-[#0c101d] ${
      isDone
        ? 'border-slate-200/80 dark:border-white/[0.10]'
        : 'border-slate-200 dark:border-white/[0.14] hover:border-indigo-400 dark:hover:border-indigo-500/50'
    }`}>
      {/* Top subtle ambient status glow beam matching Image 1 cards */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${config.beam} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="p-4 sm:p-5 flex items-start gap-3.5">
        {/* Quick Complete Button with scale animation */}
        <button
          onClick={handleCycleStatus}
          disabled={isUpdating}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 ${
            isDone
              ? 'bg-emerald-500 border-emerald-400 text-white dark:text-black shadow-[0_0_10px_rgba(16,185,129,0.7)]'
              : 'border-slate-300 dark:border-white/20 hover:border-indigo-500 bg-slate-50 dark:bg-white/[0.04] text-transparent hover:text-slate-400 dark:hover:text-white/40'
          }`}
          title={`Click to mark as ${config.next}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className={`text-sm font-semibold truncate tracking-tight transition-colors ${
              isDone ? 'line-through text-slate-400 dark:text-white/40' : 'text-slate-900 dark:text-white'
            }`}>
              {task.title}
            </h4>

            {/* Neon Status Pill (Clickable to cycle!) */}
            <button
              onClick={handleCycleStatus}
              disabled={isUpdating}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-full border transition-all hover:scale-105 active:scale-95 ${config.badge}`}
              title="Click to cycle status"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </button>
          </div>

          {task.description && (
            <p className={`text-xs leading-relaxed mb-3 line-clamp-2 font-light ${
              isDone ? 'text-slate-400 dark:text-white/30' : 'text-slate-600 dark:text-white/60'
            }`}>
              {task.description}
            </p>
          )}

          {dueInfo && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-mono text-[10px] ${
                dueInfo.isOverdue
                  ? 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/30'
                  : dueInfo.isToday
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/[0.08]'
              }`}>
                <svg className="w-3 h-3 text-slate-400 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dueInfo.text}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 dark:text-white/50 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 text-slate-400 dark:text-white/40 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors disabled:opacity-50 shadow-md shadow-red-600/30"
              >
                {isDeleting ? '...' : 'Del'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-xs text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
