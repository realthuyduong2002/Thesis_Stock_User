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
    },  // phân quyền (user/admin)
    dateOfBirth: {
        type: Date,
        required: true,
    },
    resetPasswordToken: { 
        type: String 
    },  // Token để đặt lại mật khẩu
    resetPasswordExpires: { 
        type: Date 
    },  // Thời gian hết hạn của token
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('User', UserSchema);
