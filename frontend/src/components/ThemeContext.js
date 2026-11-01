'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const STUDIO_THEMES = {
  chrome: {
    id: 'chrome',
    name: 'Obsidian Chrome',
    label: 'Chrome',
    bgDark: 'bg-[#07090e]',
    bgLight: 'bg-slate-50/70',
    bgStyleDark: '#07090e',
    bgStyleLight: '#f8fafc',
    meshGradient: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.18) 0%, transparent 65%)',
    ambientPattern: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
    ambientPatternDark: 'linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
    ambientSize: '36px 36px',
    patternOpacityDark: '0.4',
    patternOpacityLight: '0.2',
    primaryGradient: 'from-violet-600 via-indigo-600 to-cyan-500',
    primaryGradientText: 'from-violet-400 via-indigo-300 to-cyan-300',
    textGradientLight: 'from-violet-700 via-indigo-700 to-cyan-600',
    accentColor: '#6366f1',
    secondaryColor: '#06b6d4',
    lightColors: [0x6366f1, 0x06b6d4, 0xf43f5e],
    cardBorderHover: 'hover:border-indigo-400 dark:hover:border-indigo-500/40',
    cardGlow: 'hover:shadow-indigo-500/20',
    glowShadow: 'shadow-indigo-500/25',
    progressGradient: 'from-violet-500 via-indigo-500 to-cyan-400',
    activeBadge: 'bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border-indigo-500/20',
    buttonGlow: 'shadow-indigo-500/25 hover:shadow-indigo-500/45',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Matrix',
    label: 'Cyber Core',
    bgDark: 'bg-[#020e14]',
    bgLight: 'bg-cyan-50/70',
    bgStyleDark: '#020e14',
    bgStyleLight: '#ecfeff',
    meshGradient: 'radial-gradient(ellipse at 50% 100%, rgba(6, 182, 212, 0.28) 0%, transparent 70%), radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
    ambientPattern: 'repeating-linear-gradient(0deg, rgba(6, 182, 212, 0.04) 0px, rgba(6, 182, 212, 0.04) 1px, transparent 1px, transparent 4px), linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
    ambientPatternDark: 'repeating-linear-gradient(0deg, rgba(6, 182, 212, 0.05) 0px, rgba(6, 182, 212, 0.05) 1px, transparent 1px, transparent 4px), linear-gradient(to right, rgba(6, 182, 212, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.07) 1px, transparent 1px)',
    ambientSize: '100% 4px, 28px 28px, 28px 28px',
    patternOpacityDark: '0.6',
    patternOpacityLight: '0.3',
    primaryGradient: 'from-cyan-500 via-teal-500 to-emerald-400',
    primaryGradientText: 'from-cyan-300 via-teal-200 to-emerald-300',
    textGradientLight: 'from-cyan-700 via-teal-700 to-emerald-600',
    accentColor: '#06b6d4',
    secondaryColor: '#10b981',
    lightColors: [0x06b6d4, 0x10b981, 0x3b82f6],
    cardBorderHover: 'hover:border-cyan-400 dark:hover:border-cyan-500/50',
    cardGlow: 'hover:shadow-cyan-500/20',
    glowShadow: 'shadow-cyan-500/30',
    progressGradient: 'from-cyan-400 via-teal-400 to-emerald-400',
    activeBadge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
    buttonGlow: 'shadow-cyan-500/25 hover:shadow-cyan-500/45',
  },
  crystal: {
    id: 'crystal',
    name: 'Emerald Prism',
    label: 'Quantum Crystal',
    bgDark: 'bg-[#03130e]',
    bgLight: 'bg-emerald-50/70',
    bgStyleDark: '#03130e',
    bgStyleLight: '#f0fdf4',
    meshGradient: 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.25) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.18) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 60%)',
    ambientPattern: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 1.5px, transparent 1.5px), radial-gradient(circle, rgba(20, 184, 166, 0.08) 1px, transparent 1px)',
    ambientPatternDark: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 1.5px, transparent 1.5px), radial-gradient(circle, rgba(20, 184, 166, 0.12) 1px, transparent 1px)',
    ambientSize: '24px 24px, 12px 12px',
    patternOpacityDark: '0.5',
    patternOpacityLight: '0.3',
    primaryGradient: 'from-emerald-500 via-teal-500 to-amber-400',
    primaryGradientText: 'from-emerald-300 via-teal-200 to-amber-300',
    textGradientLight: 'from-emerald-700 via-teal-700 to-amber-600',
    accentColor: '#10b981',
    secondaryColor: '#f59e0b',
    lightColors: [0x10b981, 0x14b8a6, 0xf59e0b],
    cardBorderHover: 'hover:border-emerald-400 dark:hover:border-emerald-500/50',
    cardGlow: 'hover:shadow-emerald-500/20',
    glowShadow: 'shadow-emerald-500/30',
    progressGradient: 'from-emerald-400 via-teal-400 to-amber-400',
    activeBadge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    buttonGlow: 'shadow-emerald-500/25 hover:shadow-emerald-500/45',
  },
  gyro: {
    id: 'gyro',
    name: 'Cosmic Nebula',
    label: 'Gyroscope',
    bgDark: 'bg-[#0f051c]',
    bgLight: 'bg-pink-50/70',
    bgStyleDark: '#0f051c',
    bgStyleLight: '#fdf2f8',
    meshGradient: 'radial-gradient(circle at 75% 20%, rgba(236, 72, 153, 0.28) 0%, transparent 60%), radial-gradient(circle at 20% 75%, rgba(168, 85, 247, 0.25) 0%, transparent 55%), radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.15) 0%, transparent 60%)',
    ambientPattern: 'radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(circle, rgba(236, 72, 153, 0.08) 1px, transparent 1px)',
    ambientPatternDark: 'radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.18) 0%, transparent 50%), radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
    ambientSize: '100% 100%, 40px 40px',
    patternOpacityDark: '0.6',
    patternOpacityLight: '0.3',
    primaryGradient: 'from-pink-500 via-purple-600 to-rose-400',
    primaryGradientText: 'from-pink-300 via-purple-200 to-rose-300',
    textGradientLight: 'from-pink-700 via-purple-700 to-rose-600',
    accentColor: '#ec4899',
    secondaryColor: '#a855f7',
    lightColors: [0xec4899, 0xa855f7, 0xf97316],
    cardBorderHover: 'hover:border-pink-400 dark:hover:border-pink-500/50',
    cardGlow: 'hover:shadow-pink-500/20',
    glowShadow: 'shadow-pink-500/30',
    progressGradient: 'from-pink-500 via-purple-500 to-rose-400',
    activeBadge: 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/30',
    buttonGlow: 'shadow-pink-500/25 hover:shadow-pink-500/45',
  },
};

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  studioTheme: 'chrome',
  setStudioTheme: () => {},
  currentPreset: STUDIO_THEMES.chrome,
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [studioTheme, setStudioThemeState] = useState('chrome');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (targetTheme, targetStudio) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Dark/Light toggle
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    // Studio Theme attribute
    root.setAttribute('data-studio-theme', targetStudio || 'chrome');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

    const savedStudio = localStorage.getItem('studioTheme');
    const initialStudio = STUDIO_THEMES[savedStudio] ? savedStudio : 'chrome';

    setTheme(initialTheme);
    setStudioThemeState(initialStudio);
    applyTheme(initialTheme, initialStudio);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme, studioTheme);
  };

  const setStudioTheme = (newStudioId) => {
    if (!STUDIO_THEMES[newStudioId]) return;
    setStudioThemeState(newStudioId);
    localStorage.setItem('studioTheme', newStudioId);
    applyTheme(theme, newStudioId);
  };

  const currentPreset = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.chrome;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        studioTheme,
        setStudioTheme,
        currentPreset,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
