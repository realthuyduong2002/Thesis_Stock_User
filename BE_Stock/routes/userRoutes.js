// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    updateProfile
} = require('../controllers/userController');


// Đăng ký tài khoản (không yêu cầu xác thực)
router.post('/register', register);

// Đăng nhập (không yêu cầu xác thực)
router.post('/login', login);

// Quên mật khẩu (không yêu cầu xác thực)
router.post('/forgot-password', forgotPassword);

// Đặt lại mật khẩu (không yêu cầu xác thực)
router.post('/reset-password', resetPassword);

// Cập nhật thông tin người dùng (yêu cầu xác thực)
router.put('/update', auth, updateProfile);

module.exports = router;
