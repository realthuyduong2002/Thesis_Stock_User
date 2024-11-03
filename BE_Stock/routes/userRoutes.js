const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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
    getAllUsers, // Import getAllUsers function
    uploadUserAvatar,
} = require('../controllers/userController');

// Route to get all users (public)
router.get('/', getAllUsers);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', auth, getProfile);
router.put('/:id', auth, updateProfile); // Ensure only authenticated users can update their profile

// Get user by ID (public)
router.get('/:id', getUserById);

// Route to upload avatar (protected)
router.post('/:id/upload-avatar', auth, upload.single('avatar'), uploadUserAvatar);

module.exports = router;