const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    const projectsWithCount = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        const completedCount = await Task.countDocuments({ project: project._id, status: 'done' });
        return { ...project, taskCount, completedCount };
      })
    );
    res.json(projectsWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Validate ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = await Project.create({
      title,
      description: description || '',
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Validate ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;

    const updatedProject = await project.save();
    res.json(updatedProject);
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

// @desc    Delete project and its tasks
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Validate ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete all tasks belonging to this project
    await Task.deleteMany({ project: project._id });

    // Delete the project
    await Project.findByIdAndDelete(project._id);

    res.json({ message: 'Project and its tasks deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper to generate seed projects & tasks for a specific user ID
exports.populateDemoDataForUser = async (userId) => {
  const daysFromNow = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const p1 = await Project.create({
    title: 'SaaS Web Platform',
    description: 'Next.js & Node.js microservice architecture with Redux Toolkit and MongoDB',
    user: userId,
  });

  await Task.insertMany([
    {
      title: 'Setup Authentication & JWT Tokens',
      description: 'Implement user signup, login, password hashing with bcrypt, and protected routes.',
      status: 'done',
      dueDate: daysFromNow(-3),
      project: p1._id,
      user: userId,
    },
    {
      title: 'Design Responsive Dashboard UI',
      description: 'Build Tailwind CSS components, modals, filters, and mobile-friendly navigation.',
      status: 'done',
      dueDate: daysFromNow(-1),
      project: p1._id,
      user: userId,
    },
    {
      title: 'Connect RTK Query Task Endpoints',
      description: 'Wire up create, edit, delete, and real-time status updates with cache invalidation.',
      status: 'in-progress',
      dueDate: daysFromNow(2),
      project: p1._id,
      user: userId,
    },
    {
      title: 'Implement Dark Mode Theme',
      description: 'Add Tailwind dark mode classes with persistent toggle in user settings.',
      status: 'todo',
      dueDate: daysFromNow(7),
      project: p1._id,
      user: userId,
    },
  ]);

  const p2 = await Project.create({
    title: 'Mobile Shopping App',
    description: 'Cross-platform mobile application with Stripe checkout and push notifications.',
    user: userId,
  });

  await Task.insertMany([
    {
      title: 'Design Figma Wireframes & Prototypes',
      description: 'High-fidelity mockups for splash, onboarding, product catalog, and cart.',
      status: 'done',
      dueDate: daysFromNow(-4),
      project: p2._id,
      user: userId,
    },
    {
      title: 'Integrate Stripe Payment Gateway',
      description: 'Implement Apple Pay, Google Pay, and credit card processing with webhooks.',
      status: 'in-progress',
      dueDate: daysFromNow(3),
      project: p2._id,
      user: userId,
    },
    {
      title: 'Firebase Push Notification Setup',
      description: 'Configure APNs and FCM credentials for order status updates.',
      status: 'todo',
      dueDate: daysFromNow(8),
      project: p2._id,
      user: userId,
    },
  ]);

  const p3 = await Project.create({
    title: 'Q4 Product Launch Campaign',
    description: 'Multi-channel marketing campaign across social media, email newsletter, and blog.',
    user: userId,
  });

  await Task.insertMany([
    {
      title: 'Publish Launch Blog Post',
      description: 'Write release notes and feature walkthrough for early beta testers.',
      status: 'done',
      dueDate: daysFromNow(-2),
      project: p3._id,
      user: userId,
    },
    {
      title: 'Prepare Email Announcement Drip',
      description: 'Set up 3-part nurture sequence for subscribed waitlist members.',
      status: 'in-progress',
      dueDate: daysFromNow(1),
      project: p3._id,
      user: userId,
    },
    {
      title: 'Product Hunt Launch Day Assets',
      description: 'Thumbnail, animated GIFs, hunter outreach message, and first-comment copy.',
      status: 'todo',
      dueDate: daysFromNow(5),
      project: p3._id,
      user: userId,
    },
  ]);
};

// @desc    Seed sample data for current logged-in user
// @route   POST /api/projects/seed-demo
// @access  Private
exports.seedDemo = async (req, res) => {
  try {
    await exports.populateDemoDataForUser(req.user._id);
    res.json({ message: 'Sample demo projects initialized successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to populate demo data' });
  }
};
