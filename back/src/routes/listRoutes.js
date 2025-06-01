// src/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// Middleware de autenticación (a definir)
const requireAuth = require('../middleware/requireAuth');

// Proteger rutas con autenticación
router.use(requireAuth);

router.post('/lists', listController.createList);
router.get('/lists', listController.getLists);
router.put('/lists/:id', listController.updateList);
router.delete('/lists/:id', listController.deleteList);

module.exports = router;
