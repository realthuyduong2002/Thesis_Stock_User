// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    updateProfile,
    getProfile,
    getUserById,
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', auth, getProfile);
router.put('/update', auth, updateProfile);

// Get user by ID (public)
router.get('/:id', getUserById);

module.exports = router;