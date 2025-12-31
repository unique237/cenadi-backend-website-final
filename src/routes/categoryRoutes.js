const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryControllers.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

// Public Routes
router.get('/categories', getAllCategories);
router.get('/categories/:categoryId', getCategoryById);

// Admin Only Routes
router.post('/categories', verifyToken, adminOnly, createCategory);
router.put('/categories/:categoryId', verifyToken, adminOnly, updateCategory);
router.delete('/categories/:categoryId', verifyToken, adminOnly, deleteCategory);

module.exports = router;
