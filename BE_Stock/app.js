require('dotenv').config(); // Load biến môi trường

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// Import các route khác
const stockRoutes = require('./routes/stockRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const newsRoutes = require('./routes/newsRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Middleware để phân tích JSON
app.use(express.json());
app.use(cors()); 

// Mount các routes trước khi kết nối tới DB và khởi động server
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-prices', stockPriceRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analysis', analysisRoutes);

// Kết nối tới MongoDB sử dụng URI từ file .env
mongoose.connect(process.env.MONGODB_URI)
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
// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).send('Something broke!');
});