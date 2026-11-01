const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: normalize status string (handles 'Todo', 'in-progress', 'In Progress', etc.)
const normalizeStatus = (s) => {
  if (!s) return undefined;
  const clean = s.toString().toLowerCase().trim().replace(/\s+/g, '-');
  if (['todo', 'in-progress', 'done'].includes(clean)) return clean;
  return undefined;
};

// Helper: verify project ownership
const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };
  if (project.user.toString() !== userId.toString()) {
    return { error: 'Not authorized to access this project', status: 403 };
  }
  return { project };
};

// @desc    Get all tasks for a project (with optional filter/sort)
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, sortBy, order } = req.query;

    const ownership = await verifyProjectOwnership(projectId, req.user._id);
    if (ownership.error) {
      return res.status(ownership.status).json({ message: ownership.error });
    }

    // Build query filter
    const filter = { project: projectId, user: req.user._id };
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus) {
      filter.status = normalizedStatus;
    }

    // Build sort options
    const sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions.createdAt = -1;
    }

    const tasks = await Task.find(filter).sort(sortOptions);
    res.json(tasks);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create task for a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const ownership = await verifyProjectOwnership(projectId, req.user._id);
    if (ownership.error) {
      return res.status(ownership.status).json({ message: ownership.error });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: normalizeStatus(status) || 'todo',
      dueDate: dueDate || null,
      project: projectId,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify user owns the project this task belongs to
    const ownership = await verifyProjectOwnership(task.project, req.user._id);
    if (ownership.error) {
      return res.status(ownership.status).json({ message: ownership.error });
    }

    const { title, description, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      const norm = normalizeStatus(status);
      if (norm) task.status = norm;
    }
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify user owns the project this task belongs to
    const ownership = await verifyProjectOwnership(task.project, req.user._id);
    if (ownership.error) {
      return res.status(ownership.status).json({ message: ownership.error });
    }

    await Task.findByIdAndDelete(task._id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
