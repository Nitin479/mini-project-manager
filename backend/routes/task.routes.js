const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// GET /api/projects/:projectId/tasks
router.get('/projects/:projectId/tasks', getTasks);

// POST /api/projects/:projectId/tasks
router.post('/projects/:projectId/tasks', createTask);

// PUT /api/tasks/:id
router.put('/tasks/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/tasks/:id', deleteTask);

module.exports = router;
