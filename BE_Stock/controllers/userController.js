const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

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
        dateOfBirth
    } = req.body;

    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: 'Invalid user ID' });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update information if available
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

        // Process avatar if file exists
        if (req.file) {
            const avatarUrl = await uploadAvatar(req.file.path);
            user.avatar = avatarUrl;
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
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
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
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
        // Check if user already exists
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

        // Password hashing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Generate JWT Payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, userId: user.id }); // Returns both token and userId
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
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Generate JWT Payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign JWT
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

cloudinary.config({
    cloud_name: 'dq2ucdguz',
    api_key: '622122876857883',
    api_secret: '7qpEjz_9Qj-j03rCEPCi961un7U',
});

async function uploadAvatar(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder: "avatars" });
        return result.secure_url; // URL of image saved on Cloudinary
    } catch (error) {
        console.error("Error uploading avatar:", error);
    }
}

exports.uploadUserAvatar = async (req, res) => {
    const userId = req.params.id; // Use req.params.id instead of req.user.id

    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Upload photos to Cloudinary
        const avatarUrl = await uploadAvatar(req.file.path);

        // Find user and update avatar URL
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.avatar = avatarUrl;
        await user.save();

        // Delete temporary files after successful upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting temp file:", err);
        });

        res.status(200).json({ msg: 'Avatar updated successfully', avatarUrl });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
};