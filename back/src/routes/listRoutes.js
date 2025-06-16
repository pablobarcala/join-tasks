// src/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const auth = require('../middleware/requireAuth')

// Proteger rutas con autenticación
router.use(auth);

router.get('/', listController.getLists);
router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.delete('/:id', listController.deleteList);
router.post('/:id/share', listController.shareList);

module.exports = router;
