const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const { uploadUserAvatar } = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    updateProfile,
    getProfile,
    getUserById,
    getAllUsers,
    updateUser,
    updateStatus,
    countUsers,
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', auth, getProfile);
router.put('/:id', auth, updateProfile);

// Admin routes
router.get('/count', countUsers); // Count users
router.get('/', auth, admin, getAllUsers); // Get all users
router.put('/admin/:id', auth, admin, updateUser);
router.put('/:id/status', auth, admin, updateStatus); // User Updates Status by admin

// Get user by ID (public)
router.get('/:id', getUserById);

// Route upload avatar
router.post('/:id/upload-avatar', auth, upload.single('avatar'), uploadUserAvatar);

module.exports = router;