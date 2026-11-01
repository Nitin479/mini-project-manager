'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginMutation } from '@/store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { apiSlice } from '@/store/api/apiSlice';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login({ email, password }).unwrap();
      const user = result.user || { _id: result._id, name: result.name, email: result.email };
      dispatch(apiSlice.util.resetApiState());
      dispatch(setCredentials({ user, token: result.token }));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err?.data?.message || err?.data?.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/70 dark:bg-[#07090e] bg-mesh-radial px-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Top Right Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 shadow-2xl shadow-indigo-500/30 mb-4 p-0.5 animate-pulse-glow">
            <div className="w-full h-full bg-white dark:bg-[#07090e]/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7 text-indigo-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Project<span className="text-indigo-500 dark:text-indigo-400 font-light">Manager</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-white/40 mt-1.5">
            Mini Project Management Workspace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/80 dark:bg-white/[0.02] backdrop-blur-2xl border border-slate-200 dark:border-white/[0.1] shadow-2xl p-8 sm:p-9 relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 opacity-80" />

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300 font-mono">
              <svg className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none font-light"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white text-xs font-mono"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-xs font-mono font-bold tracking-widest uppercase text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo account hint */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.06] text-center">
            <p className="text-[11px] font-mono text-slate-500 dark:text-white/40">
              Demo: <span className="text-slate-800 dark:text-white/80 font-bold">itsi7091@gmail.com</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-white/40 mt-6 font-mono tracking-wider uppercase">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 dark:text-cyan-400 hover:underline font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
