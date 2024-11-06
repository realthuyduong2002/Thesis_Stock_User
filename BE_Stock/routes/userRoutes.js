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

// Get user by ID (public)
router.get('/:id', getUserById);

// Route upload avatar
router.post('/:id/upload-avatar', auth, upload.single('avatar'), uploadUserAvatar);

// Admin routes
router.get('/', auth, admin, getAllUsers); // Get all users
router.put('/admin/:id', auth, admin, updateUser); // User Updates by admin
router.put('/:id/status', auth, admin, updateStatus);
router.get('/count', countUsers);

module.exports = router;