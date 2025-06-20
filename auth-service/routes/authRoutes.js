const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/requireAuth')

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.get('/find-by-email', auth, authController.getUserByEmail);

module.exports = router;