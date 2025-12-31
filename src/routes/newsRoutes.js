const express = require('express');
const router = express.Router();
const {
    getAllNews,
    getNewsBySlug,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} = require('../controllers/newsController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

// Public Routes
router.get('/news', getAllNews);
router.get('/news/slug/:slug', getNewsBySlug);
router.get('/news/:articleId', getNewsById);

// Protected Routes (Author or Admin)
router.post('/news', verifyToken, createNews);
router.put('/news/:articleId', verifyToken, updateNews);
router.delete('/news/:articleId', verifyToken, deleteNews);

module.exports = router;
