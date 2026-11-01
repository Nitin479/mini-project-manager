'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import Modal from '@/components/Modal';
import CardTilt3D from '@/components/CardTilt3D';
import ThreeCanvas from '@/components/ThreeCanvas';
import Lusion3DHero from '@/components/Lusion3DHero';
import { useTheme } from '@/components/ThemeContext';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useSeedDemoMutation,
} from '@/store/api/projectApi';

export default function DashboardContent() {
  const { theme, currentPreset } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useSelector((state) => state.auth);
  const { data: projects, isLoading, error } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [seedDemo, { isLoading: isSeedingDemo }] = useSeedDemoMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSeedDemo = async () => {
    try {
      await seedDemo().unwrap();
      showToast('Sample demo projects loaded!');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to load demo projects', 'error');
    }
  };

  const handleCreate = async (data) => {
    try {
      await createProject(data).unwrap();
      setShowCreateModal(false);
      showToast('Project created successfully!');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to create project', 'error');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateProject({ id: editProject._id, ...data }).unwrap();
      setEditProject(null);
      showToast('Project updated successfully!');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update project', 'error');
    }
  };

  // Metrics
  const stats = useMemo(() => {
    if (!projects) return { totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 };
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((acc, p) => acc + (p.taskCount || 0), 0);
    const completedTasks = projects.reduce((acc, p) => acc + (p.completedCount || 0), 0);
    const pendingTasks = Math.max(0, totalTasks - completedTasks);
    return { totalProjects, totalTasks, completedTasks, pendingTasks };
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  return (
    <ProtectedRoute>
      <div
        className={`min-h-screen relative transition-all duration-700 overflow-x-hidden ${
          isDark ? currentPreset.bgDark : currentPreset.bgLight
        }`}
        style={{
          backgroundImage: currentPreset.meshGradient,
        }}
      >
        {/* Real 3D Interactive WebGL Three.js Particle Mesh Canvas */}
        <ThreeCanvas />

        {/* Ambient Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
          style={{
            backgroundImage: isDark ? currentPreset.ambientPatternDark : currentPreset.ambientPattern,
            backgroundSize: currentPreset.ambientSize,
            opacity: isDark ? currentPreset.patternOpacityDark : currentPreset.patternOpacityLight,
          }}
        />

        <div className="relative z-10">
          <Navbar />

          {/* Floating Toast Notification */}
          {toast && (
            <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                toast.type === 'error'
                  ? 'bg-red-50/90 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300'
                  : 'bg-emerald-50/90 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              }`}>
                {toast.type === 'error' ? (
                  <svg className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <p className="text-xs font-mono font-medium tracking-wide">{toast.message}</p>
              </div>
            </div>
          )}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            {/* Welcome Project Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200/80 dark:border-white/[0.06] transition-colors">
              <div className="animate-fade-in-up">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase mb-3 backdrop-blur-md transition-all duration-500 ${currentPreset.activeBadge}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  THEME: {currentPreset.name.toUpperCase()} • PROJECT WORKSPACE
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  Project <span className={`bg-gradient-to-r ${isDark ? currentPreset.primaryGradientText : currentPreset.textGradientLight} bg-clip-text text-transparent transition-all duration-500`}>Dashboard</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 mt-2 font-light max-w-xl">
                  Manage your projects, track milestone tasks from to-do to completion, and monitor deadlines for <span className="text-slate-800 dark:text-white/80 font-medium">{user?.name || 'User'}</span>.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold font-mono tracking-wider uppercase text-white bg-gradient-to-r ${currentPreset.primaryGradient} rounded-2xl shadow-xl ${currentPreset.buttonGlow} transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shrink-0`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            </div>

            {/* Interactive 3D WebGL Hero Showcase with User's Avatar Initial Monogram */}
            <Lusion3DHero
              initialLetter={user?.name ? user.name.charAt(0) : 'T'}
              userName={user?.name || 'User'}
            />

            {/* Quick Metrics Bar with 3D Tilt Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <CardTilt3D maxTilt={10}>
                <div className="relative overflow-hidden bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.14] shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-white/40 uppercase">Projects</span>
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{stats.totalProjects}</p>
                </div>
              </CardTilt3D>

              <CardTilt3D maxTilt={10}>
                <div className="relative overflow-hidden bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.14] shadow-md hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-white/40 uppercase">Total Tasks</span>
                    <span className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-100 dark:border-cyan-500/20">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{stats.totalTasks}</p>
                </div>
              </CardTilt3D>

              <CardTilt3D maxTilt={10}>
                <div className="relative overflow-hidden bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.14] shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-white/40 uppercase">Completed</span>
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">{stats.completedTasks}</p>
                </div>
              </CardTilt3D>

              <CardTilt3D maxTilt={10}>
                <div className="relative overflow-hidden bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.14] shadow-md hover:border-amber-400 dark:hover:border-amber-500/40 transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-white/40 uppercase">Pending</span>
                    <span className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 tracking-tight">{stats.pendingTasks}</p>
                </div>
              </CardTilt3D>
            </div>

            {/* Search bar + count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
              <div className="relative flex-1 max-w-md">
                <svg className="w-4 h-4 text-slate-400 dark:text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter projects by title or description..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.14] rounded-2xl text-xs shadow-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:bg-white dark:focus:bg-white/[0.06] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white text-xs font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-white/40 self-center tracking-wider uppercase">
                INDEX: {filteredProjects.length} OF {projects?.length || 0} PROJECTS
              </p>
            </div>

            {/* Projects Content Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                <p className="text-xs font-mono text-slate-400 dark:text-white/40 tracking-wider uppercase mt-4">Loading project data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-3xl p-8 text-center max-w-md mx-auto my-12 backdrop-blur-xl">
                <svg className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Connection Error</h3>
                <p className="text-xs text-slate-600 dark:text-white/50 mt-1 font-light">Unable to connect to the backend server. Please verify the API is running.</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white/95 dark:bg-[#0c101d]/90 rounded-3xl border border-dashed border-slate-300 dark:border-white/[0.15] p-12 text-center max-w-lg mx-auto my-8 backdrop-blur-2xl shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-500/20">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                  {searchQuery ? 'No matching projects found' : 'No projects active'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/40 mb-6 max-w-sm mx-auto font-light">
                  {searchQuery
                    ? `No projects match "${searchQuery}". Reset filters to view all.`
                    : 'Create your first project to start tracking tasks and deadlines.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      if (searchQuery) setSearchQuery('');
                      else setShowCreateModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
                  >
                    {searchQuery ? 'Reset Filter' : 'Create First Project'}
                  </button>

                  {!searchQuery && (
                    <button
                      onClick={handleSeedDemo}
                      disabled={isSeedingDemo}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-100/80 dark:bg-cyan-500/10 hover:bg-cyan-200 dark:hover:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30 rounded-xl transition-all shadow-sm disabled:opacity-50"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      {isSeedingDemo ? 'Populating...' : '⚡ Load Demo Data'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={setEditProject}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Create Modal */}
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Project"
            subtitle="Define project title and description to organize tasks"
          >
            <ProjectForm
              onSubmit={handleCreate}
              isLoading={isCreating}
              onCancel={() => setShowCreateModal(false)}
            />
          </Modal>

          {/* Edit Modal */}
          <Modal
            isOpen={!!editProject}
            onClose={() => setEditProject(null)}
            title="Edit Project"
            subtitle="Update project title and description"
          >
            <ProjectForm
              initialData={editProject}
              onSubmit={handleUpdate}
              isLoading={isUpdating}
              onCancel={() => setEditProject(null)}
            />
          </Modal>
        </div>
      </div>
    </ProtectedRoute>
  );
}
