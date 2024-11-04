// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực người dùng
const auth = async (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'User not found, authorization denied' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware kiểm tra quyền admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Admins only' });
    }
};

module.exports = { auth, admin };
