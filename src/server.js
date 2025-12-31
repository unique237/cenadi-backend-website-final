// Load environment variables from .env file
require('dotenv').config();

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const subscribeRoutes = require('./routes/subcribeRoutes');
const userRoutes = require('./routes/userRoutes');

// Import required modules and create an Express app
const express = require('express');
const app = express();

// Define configuration constants
const port = process.env.PORT || 5001;
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Middleware to parse JSON requests
if (isDevelopment) {
    console.log("Running in Development Mode");
    app.use(express.json({ limit: '50mb' }));
}

if (isProduction) {
    console.log("Running in Production Mode");
    app.use(express.json({ limit: '10mb' }));
}

// Base routes
app.use('/api', contactRoutes);
app.use('/api', subscribeRoutes);
app.use('/api', userRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'CENADI Backend is healthy 🚀' });
});

app.listen(port, () => {
    console.log(`CENADI Backend Server is up and running 🚀 on port ${port}`);
    console.log(`Memory usage 📟 = ${process.memoryUsage().rss / 1024 / 1024} MB`);
    console.log(`CPU usage speed 🏻 = ${process.cpuUsage().user / 1000} ms`);
    console.log(`Environment = ${process.env.NODE_ENV}`);
});