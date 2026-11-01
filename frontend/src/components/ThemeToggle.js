'use client';

import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="w-20 h-8 rounded-full bg-slate-200 dark:bg-white/[0.05] animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 border active:scale-95 cursor-pointer ${
        isDark
          ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
          : 'bg-white hover:bg-slate-100 border-slate-300 text-indigo-600 shadow-sm'
      }`}
      title={`Click to switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      <span className="text-sm transition-transform duration-300 transform group-hover:rotate-12">
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="font-semibold">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
