// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.updateProfile = async (req, res) => {
    const {
        firstName,
        lastName,
        preferredName,
        gender,
        phoneNumber,
        country,
        username,
        email,
        password,
        dateOfBirth
    } = req.body;

    try {
        const userId = req.user.id; // Middleware auth đã thêm user vào req.user

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (preferredName) user.preferredName = preferredName;
        if (gender) user.gender = gender;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (country) user.country = country;
        if (username) user.username = username;
        if (email) user.email = email;
        if (dateOfBirth) {
            if (isNaN(Date.parse(dateOfBirth))) {
                return res.status(400).json({ msg: 'Invalid date of birth' });
            }
            user.dateOfBirth = new Date(dateOfBirth);
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            msg: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                preferredName: user.preferredName,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                country: user.country,
                username: user.username,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
            }
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).send('Server Error');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).send('Server Error');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).send('Server Error');
    }
};

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password, dateOfBirth } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            dateOfBirth,
        });

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Tạo JWT Payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Ký JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, userId: user.id }); // Trả về cả token và userId
            }
        );
    } catch (error) {
        console.error('Error in register:', error.message);
        res.status(500).send('Server Error');
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Tạo JWT Payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Ký JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, userId: user.id });
            }
        );
    } catch (error) {
        console.error('Error in login:', error.message);
        res.status(500).send('Server Error');
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    // Forgot password logic here
    res.status(200).json({ msg: 'Password reset link sent' });
};

// Reset password
exports.resetPassword = async (req, res) => {
    // Reset password logic here
    res.status(200).json({ msg: 'Password reset successfully' });
};