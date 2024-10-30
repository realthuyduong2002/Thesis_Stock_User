// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: 'user' 
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    firstName: {
        type: String,
        default: '',
        required: false,
    },
    lastName: {
        type: String,
        default: '',
        required: false,
    },
    preferredName: {
        type: String,
        default: '',
        required: false,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: false,
    },
    phoneNumber: {
        type: String,
        default: '',
        required: false,
    },
    country: {
        type: String,
        default: '',
        required: false,
    },
    resetPasswordToken: { 
        type: String 
    },
    resetPasswordExpires: { 
        type: Date 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    avatar: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('User', UserSchema);