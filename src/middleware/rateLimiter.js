const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.TIME_PERIOD_SECONDS || 900) * 1000, // 15 minutes par défaut
    max: parseInt(process.env.MAX_REQUESTS || 100), // Limite de requêtes par fenêtre
    message: {
        success: false,
        message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.'
    },
    standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    skip: (req) => {
        // Skip rate limiting pour les IPs exemptées (si configurées)
        const exemptIps = process.env.RATE_LIMIT_EXEMPT_IPS?.split(',') || [];
        return exemptIps.includes(req.ip);
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Strict rate limiter pour les routes d'authentification
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 tentatives
    skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies
    message: {
        success: false,
        message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Trop de tentatives de connexion échouées. Compte temporairement bloqué pour 15 minutes.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Rate limiter pour les formulaires de contact/newsletter
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // Maximum 3 soumissions par heure
    message: {
        success: false,
        message: 'Vous avez atteint la limite de soumissions. Veuillez réessayer plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Limite de soumissions atteinte. Veuillez patienter avant de soumettre à nouveau.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    contactLimiter
};
