require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const newsRoutes = require('./routes/newsRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Middleware for JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle avatar uploads
app.put('/api/users/:id/avatar', upload.single('avatar'), (req, res) => {
    const userId = req.params.id;
    if (req.file) {
        console.log('File uploaded:', req.file); // Debug file
        res.status(200).json({ message: 'Avatar uploaded successfully' });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-prices', stockPriceRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analysis', analysisRoutes);

app.use('/uploads', express.static('uploads'));

// Connect to MongoDB using URI from .env file
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

// General error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).send('Something broke!');
});