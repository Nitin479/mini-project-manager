const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mini-project-manager';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const User = require('./models/User');
    const Project = require('./models/Project');
    const Task = require('./models/Task');

    // Find the current active user (Tintin or first user found)
    let user = await User.findOne({ email: 'itsi7091@gmail.com' });
    if (!user) {
      user = await User.findOne({});
    }

    if (!user) {
      console.log('No user found! Please sign up first.');
      process.exit(1);
    }

    console.log(`Seeding data for user: ${user.name} (${user.email})`);

    // 1. Update the existing project title if it is "Project"
    let currentProject = await Project.findOne({ user: user._id, _id: '6ae61d44f14b80d545aa820e' });
    if (currentProject) {
      currentProject.title = 'SaaS Web Platform';
      currentProject.description = 'Next.js & Node.js microservice architecture with Redux Toolkit and MongoDB';
      await currentProject.save();
    } else {
      currentProject = await Project.create({
        title: 'SaaS Web Platform',
        description: 'Next.js & Node.js microservice architecture with Redux Toolkit and MongoDB',
        user: user._id,
      });
    }

    // Clear existing tasks for this user so we don't duplicate on repeated runs
    await Task.deleteMany({ user: user._id });

    // Seed tasks for the primary project
    const now = new Date();
    const daysFromNow = (days) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d;
    };

    const primaryTasks = [
      {
        title: 'Setup Authentication & JWT Tokens',
        description: 'Implement user signup, login, password hashing with bcrypt, and protected routes.',
        status: 'done',
        dueDate: daysFromNow(-3),
        project: currentProject._id,
        user: user._id,
      },
      {
        title: 'Design Responsive Dashboard UI',
        description: 'Build Tailwind CSS components, modals, filters, and mobile-friendly navigation.',
        status: 'done',
        dueDate: daysFromNow(-1),
        project: currentProject._id,
        user: user._id,
      },
      {
        title: 'Connect RTK Query Task Endpoints',
        description: 'Wire up create, edit, delete, and real-time status updates with cache invalidation.',
        status: 'in-progress',
        dueDate: daysFromNow(2),
        project: currentProject._id,
        user: user._id,
      },
      {
        title: 'Add Status Badges & Due Date Sorting',
        description: 'Filter tasks by Todo, In Progress, and Done tabs, plus ascending/descending order.',
        status: 'in-progress',
        dueDate: daysFromNow(4),
        project: currentProject._id,
        user: user._id,
      },
      {
        title: 'Implement Dark Mode Theme',
        description: 'Add Tailwind dark mode classes with persistent toggle in user settings.',
        status: 'todo',
        dueDate: daysFromNow(7),
        project: currentProject._id,
        user: user._id,
      },
      {
        title: 'Write Automated Integration Tests',
        description: 'Add Jest and Supertest suites for auth, projects, and task REST endpoints.',
        status: 'todo',
        dueDate: daysFromNow(12),
        project: currentProject._id,
        user: user._id,
      },
    ];

    await Task.insertMany(primaryTasks);
    console.log(`Added ${primaryTasks.length} tasks to primary project: ${currentProject.title}`);

    // 2. Create 2 more diverse projects with their own tasks
    const existingProjects = await Project.find({ user: user._id, _id: { $ne: currentProject._id } });
    if (existingProjects.length === 0) {
      // Mobile app project
      const mobileProject = await Project.create({
        title: 'Mobile Shopping App',
        description: 'Cross-platform mobile application with Stripe checkout and push notifications.',
        user: user._id,
      });

      await Task.insertMany([
        {
          title: 'Design Figma Wireframes & Prototypes',
          description: 'High-fidelity mockups for splash, onboarding, product catalog, and cart.',
          status: 'done',
          dueDate: daysFromNow(-4),
          project: mobileProject._id,
          user: user._id,
        },
        {
          title: 'Integrate Stripe Payment Gateway',
          description: 'Implement Apple Pay, Google Pay, and credit card processing with webhooks.',
          status: 'in-progress',
          dueDate: daysFromNow(3),
          project: mobileProject._id,
          user: user._id,
        },
        {
          title: 'Firebase Push Notification Setup',
          description: 'Configure APNs and FCM credentials for order status updates.',
          status: 'todo',
          dueDate: daysFromNow(8),
          project: mobileProject._id,
          user: user._id,
        },
      ]);

      // Marketing Campaign project
      const marketingProject = await Project.create({
        title: 'Q4 Product Launch Campaign',
        description: 'Multi-channel marketing campaign across social media, email newsletter, and blog.',
        user: user._id,
      });

      await Task.insertMany([
        {
          title: 'Publish Launch Blog Post',
          description: 'Write release notes and feature walkthrough for early beta testers.',
          status: 'done',
          dueDate: daysFromNow(-2),
          project: marketingProject._id,
          user: user._id,
        },
        {
          title: 'Prepare Email Announcement Drip',
          description: 'Set up 3-part nurture sequence for subscribed waitlist members.',
          status: 'in-progress',
          dueDate: daysFromNow(1),
          project: marketingProject._id,
          user: user._id,
        },
        {
          title: 'Product Hunt Launch Day Assets',
          description: 'Thumbnail, animated GIFs, hunter outreach message, and first-comment copy.',
          status: 'todo',
          dueDate: daysFromNow(5),
          project: marketingProject._id,
          user: user._id,
        },
      ]);

      console.log('Added 2 additional sample projects with tasks.');
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

