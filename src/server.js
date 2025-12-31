// Load environment variables from .env file
require('dotenv').config();

// Validate critical environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_MIN_32_CHARS') {
    console.error('❌ ERREUR CRITIQUE: JWT_SECRET doit être défini dans .env avec une valeur sécurisée');
    process.exit(1);
}

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const subscribeRoutes = require('./routes/subcribeRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Import required modules and create an Express app
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');
const app = express();

// Define configuration constants
const port = process.env.PORT || 5001;
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Security: Helmet - Configure HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting - Apply to all routes if enabled
if (process.env.RATE_LIMIT_ENABLED === 'true') {
    app.use('/api', apiLimiter);
    console.log('✅ Rate limiting activé');
}

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
app.use('/api', categoryRoutes);
app.use('/api', newsRoutes);
app.use('/api', projectRoutes);

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