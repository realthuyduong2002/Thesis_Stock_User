require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const stockRoutes = require('./routes/stockRoutes');
const stockPriceRoutes = require('./routes/stockPriceRoutes');
const newsRoutes = require('./routes/newsRoutes');
const userRoutes = require('./routes/userRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the PORT from the .env file or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api', stockRoutes);
app.use('/api', stockPriceRoutes);
app.use('/api', newsRoutes);
app.use('/api', userRoutes);
app.use('/api', analysisRoutes);