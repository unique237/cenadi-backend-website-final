// Load environment variables from .env file
require('dotenv').config();

// Import logger first
const logger = require('./config/logger');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

// Validate critical environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_MIN_32_CHARS') {
    logger.error('JWT_SECRET not properly configured in .env');
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
const { errorHandler } = require('./middleware/errorHandler');
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

// Morgan HTTP request logging
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Rate Limiting - Apply to all routes if enabled
if (process.env.RATE_LIMIT_ENABLED === 'true') {
    app.use('/api', apiLimiter);
    logger.info('Rate limiting enabled');
}

// Middleware to parse JSON requests
if (isDevelopment) {
    logger.info('Running in Development Mode');
    app.use(express.json({ limit: '50mb' }));
}

if (isProduction) {
    logger.info('Running in Production Mode');
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

// Error Handling Middleware - MUST be after all routes
app.use(errorHandler);

// Test database connection before starting server
testConnection().then(() => {
    app.listen(port, () => {
        logger.info(`CENADI Backend Server started on port ${port}`);
        logger.info(`Memory usage: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
        logger.info(`CPU usage: ${(process.cpuUsage().user / 1000).toFixed(2)} ms`);
        logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
}).catch((error) => {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Unhandled Errors
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});