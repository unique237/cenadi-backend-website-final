const express = require('express');
const router = express.Router();
const {
    getAllNews,
    getNewsBySlug,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getFeaturedNews,
    searchNews
} = require('../controllers/newsController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Lister les articles
 *     description: Retourne la liste des articles avec pagination et filtres
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: category_id
 *         schema: { type: integer }
 *       - in: query
 *         name: is_featured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get('/news', getAllNews);

/**
 * @swagger
 * /news/slug/{slug}:
 *   get:
 *     summary: Obtenir un article par slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détails de l'article
 *       404:
 *         description: Article non trouvé
 */
router.get('/news/slug/:slug', getNewsBySlug);

/**
 * @swagger
 * /news/{articleId}:
 *   get:
 *     summary: Obtenir un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de l'article
 *       404:
 *         description: Article non trouvé
 */
router.get('/news/:articleId', getNewsById);

/**
 * @swagger
 * /news/featured:
 *   get:
 *     summary: Obtenir les articles en vedette
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 5 }
 *     responses:
 *       200:
 *         description: Articles en vedette
 */
router.get('/news/featured', getFeaturedNews);

/**
 * @swagger
 * /news/search:
 *   get:
 *     summary: Rechercher des articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: lang
 *         schema: { type: string, enum: [en, fr], default: en }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/news/search', searchNews);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Créer un article
 *     description: Crée un nouvel article (Auth requis)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, title_en, title_fr, content_en, content_fr]
 *             properties:
 *               category_id: { type: integer }
 *               title_en: { type: string }
 *               title_fr: { type: string }
 *               excerpt_en: { type: string }
 *               excerpt_fr: { type: string }
 *               content_en: { type: string }
 *               content_fr: { type: string }
 *               image_url: { type: string, format: uri }
 *               is_featured: { type: boolean }
 *     responses:
 *       201:
 *         description: Article créé
 *       400:
 *         description: Données invalides
 */
router.post('/news', verifyToken, createNews);

/**
 * @swagger
 * /news/{articleId}:
 *   put:
 *     summary: Mettre à jour un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_en: { type: string }
 *               title_fr: { type: string }
 *               content_en: { type: string }
 *               content_fr: { type: string }
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article non trouvé
 */
router.put('/news/:articleId', verifyToken, updateNews);

/**
 * @swagger
 * /news/{articleId}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete('/news/:articleId', verifyToken, deleteNews);

module.exports = router;
