// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('-password');

        if (!user) {
            return res.status(401).json({ msg: 'Người dùng không tồn tại' });
        }

        req.user = user; // Đính kèm đối tượng người dùng vào req.user
        next();
    } catch (err) {
        console.error('Lỗi xác thực JWT:', err);
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};

module.exports = auth;
