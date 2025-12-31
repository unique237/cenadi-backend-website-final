const jwt = require('jsonwebtoken');

// Verify JWT Token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ message: 'No token provided. Authorization denied.' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        return next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Admin Only Middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    return next();
};

// Author Only Middleware (for future use)
const authorOnly = (req, res, next) => {
    if (req.user.role !== 'author') {
        return res.status(403).json({ message: 'Access denied. Authors only.' });
    }
    return next();
};

module.exports = {
    verifyToken,
    adminOnly,
    authorOnly
};