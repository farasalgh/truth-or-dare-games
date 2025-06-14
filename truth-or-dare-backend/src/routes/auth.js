const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// route untuk update profile
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;