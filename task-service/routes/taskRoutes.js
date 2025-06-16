// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../../auth-service/middleware/requireAuth');

router.use(auth);

router.get('/list/:listId', taskController.getTasks);
router.post('/list/:listId', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
