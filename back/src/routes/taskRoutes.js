// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post('/tasks', taskController.createTask);
router.get('/lists/:listId/tasks', taskController.getTasksByList);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
