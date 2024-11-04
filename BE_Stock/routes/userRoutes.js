// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth'); // Import middleware admin
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
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', auth, getProfile);
router.put('/:id', auth, updateProfile); // Bảo vệ route này nếu cần

// Get user by ID (public)
router.get('/:id', getUserById);

// Route upload avatar
router.post('/:id/upload-avatar', auth, upload.single('avatar'), uploadUserAvatar);

// Admin routes
router.get('/', auth, admin, getAllUsers); // Lấy tất cả người dùng
router.put('/admin/:id', auth, admin, updateUser); // Cập nhật người dùng bởi admin

module.exports = router;
