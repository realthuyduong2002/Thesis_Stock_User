// app.js
require('dotenv').config(); // Load biến môi trường

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Import các route
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const newsRoutes = require('./routes/newsRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Import chat routes

// Import middleware
const { auth, admin } = require('./middleware/auth'); // Import middleware xác thực

// Import models
const User = require('./models/User'); // Import User model

const app = express();

// Middleware để phân tích JSON và CORS
app.use(express.json());
app.use(cors());

// Cấu hình multer cho tải lên file với kiểm tra loại file và kích thước
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
    }
});

// Endpoint để xử lý tải lên avatar (đã bảo vệ bằng auth middleware)
app.put('/api/users/:id/avatar', auth, upload.single('avatar'), async (req, res) => { // Apply auth middleware
    const userId = req.params.id;

    // Đảm bảo rằng người dùng xác thực là người đang cập nhật avatar của họ
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ message: 'Bạn chỉ có thể cập nhật avatar của chính mình.' });
    }

    if (req.file) {
        console.log('File uploaded:', req.file); // Debug file

        try {
            // Cập nhật trường avatar của người dùng trong cơ sở dữ liệu
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { avatar: `/uploads/${req.file.filename}` },
                { new: true, runValidators: true }
            ).select('-password'); // Loại bỏ trường password khỏi phản hồi

            res.status(200).json({ message: 'Avatar uploaded successfully', user: updatedUser });
        } catch (err) {
            console.error('Error updating avatar:', err);
            res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật avatar.' });
        }
    } else {
        res.status(400).json({ message: 'Không có file nào được tải lên.' });
    }
});

// Mount các routes
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-prices', stockPriceRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes); // Mount chat routes

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối tới MongoDB sử dụng URI từ file .env
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).send('Something broke!');
});
