const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  seedDemo,
} = require('../controllers/project.controller');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// GET /api/projects
router.get('/', getProjects);

// GET /api/projects/:id
router.get('/:id', getProject);

// POST /api/projects
router.post('/', createProject);

// POST /api/projects/seed-demo
router.post('/seed-demo', seedDemo);

// PUT /api/projects/:id
router.put('/:id', updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

module.exports = router;
