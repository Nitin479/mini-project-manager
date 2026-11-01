'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import Modal from '@/components/Modal';
import CardTilt3D from '@/components/CardTilt3D';
import ThreeCanvas from '@/components/ThreeCanvas';
import ProjectOrb3D from '@/components/ProjectOrb3D';
import { useTheme } from '@/components/ThemeContext';
import { useGetProjectQuery, useUpdateProjectMutation } from '@/store/api/projectApi';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation } from '@/store/api/taskApi';

const STATUS_FILTERS = [
  { key: 'All', label: 'All Tasks' },
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function ProjectDetailContent() {
  const { theme, currentPreset } = useTheme();
  const isDark = theme === 'dark';
  const { id } = useParams();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [toast, setToast] = useState(null);

  const { data: project, isLoading: projectLoading, error: projectError } = useGetProjectQuery(id);
  const { data: rawTasks, isLoading: tasksLoading } = useGetTasksQuery({
    projectId: id,
    status: activeFilter === 'All' ? undefined : activeFilter,
    sortBy: 'dueDate',
    order: sortOrder,
  });

  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startEditProject = () => {
    setProjectTitle(project?.title || '');
    setProjectDesc(project?.description || '');
    setIsEditingProject(true);
  };

  const handleUpdateProject = async () => {
    if (!projectTitle.trim()) return;
    try {
      await updateProject({ id, title: projectTitle.trim(), description: projectDesc.trim() }).unwrap();
      setIsEditingProject(false);
      showToast('Project updated successfully!');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update project', 'error');
    }
  };

  const handleCreateTask = async (data) => {
    try {
      await createTask({ projectId: id, ...data }).unwrap();
      setShowTaskModal(false);
      showToast('Task added to pipeline!');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      await updateTask({ id: editTask._id, ...data }).unwrap();
      setEditTask(null);
      showToast('Task updated successfully!');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update task', 'error');
    }
  };

  // Filter tasks locally by search query
  const visibleTasks = useMemo(() => {
    if (!rawTasks) return [];
    if (!searchQuery.trim()) return rawTasks;
    const query = searchQuery.toLowerCase();
    return rawTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [rawTasks, searchQuery]);

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
        {/* Interactive 3D Canvas */}
        <ThreeCanvas />

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

          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            {/* Studio Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-white/40 mb-6">
              <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Projects
              </Link>
              <span className="text-slate-300 dark:text-white/20">/</span>
              <span className="text-slate-800 dark:text-white/70 font-bold truncate max-w-xs">{project?.title || 'Project Details'}</span>
            </nav>

            {projectLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                <p className="text-xs font-mono text-slate-400 dark:text-white/40 tracking-wider uppercase mt-4">Loading project...</p>
              </div>
            ) : projectError ? (
              <div className="bg-white/80 dark:bg-white/[0.02] border border-red-200 dark:border-red-500/30 rounded-3xl p-10 text-center max-w-lg mx-auto my-12 backdrop-blur-xl animate-fade-in-up">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-500/20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Project Inaccessible</h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mb-6 font-light leading-relaxed">
                  This project does not belong to your account or has been deleted.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              <>
                {/* Project Header 3D Tilt Banner */}
                <CardTilt3D maxTilt={5}>
                  <div className="rounded-3xl bg-white dark:bg-[#0c101d] border border-slate-200/90 dark:border-white/[0.14] shadow-2xl p-6 sm:p-8 mb-8 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 opacity-80" />

                    {isEditingProject ? (
                      <div className="space-y-4 pt-1 animate-fade-in-up">
                        <div>
                          <label className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="w-full text-lg font-bold px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono tracking-widest text-slate-500 dark:text-white/50 uppercase mb-1.5">
                            Project Description
                          </label>
                          <textarea
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none font-light"
                          />
                        </div>
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => setIsEditingProject(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-xl transition-colors border border-slate-200 dark:border-white/[0.06]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateProject}
                            disabled={isUpdatingProject || !projectTitle.trim()}
                            className="px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/30"
                          >
                            {isUpdatingProject ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-1">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <ProjectOrb3D taskCount={rawTasks?.length || 0} />
                          <div>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {project?.title}
                              </h1>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 dark:bg-white/[0.05] text-cyan-700 dark:text-cyan-300 text-[11px] font-mono rounded-full border border-cyan-100 dark:border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                                {rawTasks?.length || 0} {(rawTasks?.length === 1 ? 'task' : 'tasks')}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/50 leading-relaxed max-w-2xl font-light">
                              {project?.description || 'No description provided for this project.'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={startEditProject}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono tracking-wider uppercase text-slate-600 dark:text-white/70 bg-slate-100 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-white/[0.08] shrink-0 self-start sm:self-center"
                        >
                          <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Project
                        </button>
                      </div>
                    )}
                  </div>
                </CardTilt3D>

                {/* Tasks Toolbar */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Status Filters Segmented Control */}
                    <div className="flex items-center bg-slate-100 dark:bg-[#0c101d] p-1.5 rounded-2xl gap-1.5 border border-slate-200 dark:border-white/[0.14] overflow-x-auto shadow-md transition-colors">
                      {STATUS_FILTERS.map((filter) => (
                        <button
                          key={filter.key}
                          onClick={() => setActiveFilter(filter.key)}
                          className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase rounded-xl transition-all whitespace-nowrap ${
                            activeFilter === filter.key
                              ? `bg-gradient-to-r ${currentPreset.primaryGradient} text-white font-bold shadow-md`
                              : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>

                    {/* Actions: Sort + Add Task */}
                    <div className="flex items-center gap-2.5">
                      {/* Due Date Sort Button */}
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono tracking-wider uppercase text-slate-700 dark:text-white/70 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-white/[0.14] rounded-2xl hover:bg-slate-50 dark:hover:bg-[#151c30] shadow-md hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                        title={`Sort by due date: ${sortOrder === 'asc' ? 'Earliest first' : 'Latest first'}`}
                      >
                        <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Due</span>
                        <span className="text-[9px] uppercase font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-200 dark:border-cyan-500/20">
                          {sortOrder}
                        </span>
                      </button>

                      {/* Add Task Button */}
                      <button
                        onClick={() => setShowTaskModal(true)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase text-white bg-gradient-to-r ${currentPreset.primaryGradient} rounded-2xl shadow-lg ${currentPreset.buttonGlow} transition-all duration-200 hover:-translate-y-0.5 active:scale-95`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                      </button>
                    </div>
                  </div>

                  {/* Search within project */}
                  <div className="relative">
                    <svg className="w-4 h-4 text-slate-400 dark:text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks in this project..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-white/[0.14] rounded-2xl text-xs shadow-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:bg-white dark:focus:bg-white/[0.05] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-light shadow-sm"
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
                </div>

                {/* Task List */}
                {tasksLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                    <p className="text-[11px] font-mono text-slate-400 dark:text-white/40 tracking-wider uppercase mt-3">Loading tasks...</p>
                  </div>
                ) : visibleTasks.length === 0 ? (
                  <div className="rounded-3xl bg-white dark:bg-[#0c101d] border border-dashed border-slate-300 dark:border-white/[0.15] p-12 text-center shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-white/40">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                      {searchQuery
                        ? 'No matching tasks'
                        : activeFilter !== 'All'
                        ? `No ${activeFilter} tasks in pipeline`
                        : 'No tasks created yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/40 mb-5 max-w-xs mx-auto font-light">
                      {searchQuery
                        ? `No tasks match "${searchQuery}". Reset query to view all.`
                        : activeFilter !== 'All'
                        ? `Switch pipeline filter to view other tasks.`
                        : 'Create your first task to track status and due dates.'}
                    </p>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={setEditTask}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

          {/* Create Task Modal */}
          <Modal
            isOpen={showTaskModal}
            onClose={() => setShowTaskModal(false)}
            title="Schedule New Task"
            subtitle={`Adding milestone to ${project?.title || 'Project'}`}
          >
            <TaskForm
              onSubmit={handleCreateTask}
              isLoading={isCreatingTask}
              onCancel={() => setShowTaskModal(false)}
            />
          </Modal>

          {/* Edit Task Modal */}
          <Modal
            isOpen={!!editTask}
            onClose={() => setEditTask(null)}
            title="Update Task Milestone"
            subtitle="Modify task specs, pipeline status, or deadline"
          >
            <TaskForm
              initialData={editTask}
              onSubmit={handleUpdateTask}
              isLoading={isUpdatingTask}
              onCancel={() => setEditTask(null)}
            />
          </Modal>
        </div>
      </div>
    </ProtectedRoute>
  );
}
