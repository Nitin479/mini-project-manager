'use client';

import Link from 'next/link';
import { useDeleteProjectMutation } from '@/store/api/projectApi';
import { useState } from 'react';
import CardTilt3D from './CardTilt3D';
import { useTheme } from './ThemeContext';

export default function ProjectCard({ project, onEdit }) {
  const { currentPreset } = useTheme();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const totalTasks = project.taskCount ?? 0;
  const completedTasks = project.completedCount ?? 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteProject(project._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || 'Failed to delete project');
    }
    setShowConfirm(false);
  };

  return (
    <CardTilt3D maxTilt={8} className="h-full">
      <div className={`relative group rounded-3xl bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.14] ${currentPreset.cardBorderHover} hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-black/40 h-full`}>
        {/* Ambient gradient top beam */}
        <div className={`h-[2px] w-full bg-gradient-to-r ${currentPreset.progressGradient} opacity-70 group-hover:opacity-100 transition-opacity`} />

        <Link href={`/projects/${project._id}`} className="p-6 block flex-1">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1 tracking-tight">
              {project.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-white/70 text-[11px] font-mono rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-white/50 line-clamp-2 leading-relaxed min-h-[2rem] mb-6 font-light">
            {project.description || 'No description provided'}
          </p>

          {/* Progress Bar with Animation */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 dark:text-white/40 tracking-wider uppercase text-[10px]">Progress</span>
              <span className={progressPercent === 100 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-700 dark:text-white/70'}>
                {completedTasks}/{totalTasks} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  progressPercent === 100
                    ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                    : `bg-gradient-to-r ${currentPreset.progressGradient} shadow-[0_0_10px_rgba(99,102,241,0.5)]`
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </Link>

        {/* Card Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50/90 dark:bg-black/40 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between transition-colors">
          <Link
            href={`/projects/${project._id}`}
            className="text-xs font-mono tracking-wider uppercase text-indigo-600 dark:text-indigo-400 hover:text-cyan-600 dark:hover:text-cyan-300 inline-flex items-center gap-1 group/btn transition-colors"
          >
            View Project & Tasks
            <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(project);
              }}
              className="px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-white/50 hover:text-indigo-600 dark:hover:text-white bg-white dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] rounded-lg transition-colors border border-slate-200 dark:border-white/[0.06]"
            >
              Edit
            </button>

            {!showConfirm ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-400 dark:text-white/40 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-white/[0.02] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 shadow-md shadow-red-600/30"
                >
                  {isDeleting ? '...' : 'Confirm'}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(false);
                  }}
                  className="px-2 py-1 text-xs text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardTilt3D>
  );
}
