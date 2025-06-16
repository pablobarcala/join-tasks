const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/requireAuth');

router.use(auth); // Todas las rutas de comentarios requieren autenticación

router.get('/task/:taskId', commentController.getComments);
router.post('/task/:taskId', commentController.createComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;