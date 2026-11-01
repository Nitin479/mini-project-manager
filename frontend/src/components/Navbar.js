'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import { apiSlice } from '@/store/api/apiSlice';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    window.location.href = '/login';
  };

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-[#07090e]/75 border-b border-slate-200/80 dark:border-white/[0.07] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg className="w-5 h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                Project<span className="text-indigo-500 dark:text-indigo-400 font-light">Manager</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-slate-100 dark:bg-white/[0.04] text-indigo-600 dark:text-indigo-300 rounded-full border border-slate-200 dark:border-white/[0.08]">
                MINI v1.0
              </span>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Animated Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider uppercase text-slate-600 dark:text-white/60 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                >
                  <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Projects
                </Link>

                {/* User avatar badge */}
                <div className="flex items-center gap-2 pl-2.5 border-l border-slate-200 dark:border-white/10">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                      {getInitial(user?.name)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#07090e] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">{user?.name || 'User'}</p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-white/40 leading-tight mt-0.5 truncate max-w-[120px]">{user?.email || ''}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-white/70 hover:text-red-600 dark:hover:text-white bg-slate-100/80 dark:bg-white/[0.03] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-slate-200 dark:border-white/[0.08]"
                  title="Sign out of account"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
