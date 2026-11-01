'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-[#0b0e17]/95 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-white/[0.12] backdrop-blur-2xl animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top neon glow line */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
