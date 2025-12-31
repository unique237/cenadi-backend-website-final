// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, signupSchema, signinSchema, updateUserSchema } = require('../middleware/validation');

// Public Routes with validation and strict rate limiting
router.post('/auth/signup', authLimiter, validate(signupSchema), signup);
router.post('/auth/signin', authLimiter, validate(signinSchema), signin);

// Protected Routes (Requires Authentication)
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:userId', verifyToken, getUserById);

// Admin Only Routes
router.put('/users/:userId', verifyToken, adminOnly, validate(updateUserSchema), updateUser);
router.delete('/users/:userId', verifyToken, adminOnly, deleteUser);

module.exports = router;