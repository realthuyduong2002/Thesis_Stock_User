// middleware/auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Giả sử payload có dạng { user: { id: ... } }
        next();
    } catch (err) {
        console.error('JWT verify error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
