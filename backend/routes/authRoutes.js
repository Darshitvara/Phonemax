const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   PUT /auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
