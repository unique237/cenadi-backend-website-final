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
} = require('../controllers/userController');
const { verifyToken, adminOnly } = require('../middleware/auth');

// Public Routes
router.post('/auth/signup', signup);
router.post('/auth/signin', signin);

// Protected Routes (Requires Authentication)
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:userId', verifyToken, getUserById);

// Admin Only Routes
router.put('/users/:userId', verifyToken, adminOnly, updateUser);
router.delete('/users/:userId', verifyToken, adminOnly, deleteUser);

module.exports = router;