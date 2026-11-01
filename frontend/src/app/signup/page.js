'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterMutation } from '@/store/api/authApi';
import ThemeToggle from '@/components/ThemeToggle';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register({ name, email, password }).unwrap();
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError(err?.data?.message || err?.data?.error || 'Registration failed. Please check inputs.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/70 dark:bg-[#07090e] bg-mesh-radial px-4 py-12 relative overflow-hidden transition-colors duration-300">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-white/40 mt-1.5">
            Mini Project Manager Workspace
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

          {success && (
            <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-mono">
              <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sofia Vance"
                required
                autoFocus
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none font-light"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sofia@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none font-light"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none font-light"
              />
              <p className="mt-1 text-[10px] font-mono text-slate-400 dark:text-white/30">Min. 6 alphanumeric characters</p>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-white/40 mt-6 font-mono tracking-wider uppercase">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-cyan-400 hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
