// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', auth, getProfile);
router.put('/:id', updateProfile);

// Get user by ID (public)
router.get('/:id', getUserById);

// Route upload avatar
router.post('/:id/upload-avatar', upload.single('avatar'), uploadUserAvatar);

module.exports = router;