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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lister toutes les catégories
 *     description: Retourne la liste de toutes les catégories (Public)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 categories:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 */
router.get('/categories', getAllCategories);

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Obtenir une catégorie
 *     description: Retourne les détails d'une catégorie avec ses articles associés
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/categories/:categoryId', getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Créer une catégorie
 *     description: Crée une nouvelle catégorie (Admin requis)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name_en, name_fr]
 *             properties:
 *               name_en: { type: string, example: News }
 *               name_fr: { type: string, example: Actualités }
 *     responses:
 *       201:
 *         description: Catégorie créée
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Catégorie déjà existante
 */
router.post('/categories', verifyToken, adminOnly, createCategory);

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Mettre à jour une catégorie
 *     description: Met à jour une catégorie existante (Admin requis)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_en: { type: string }
 *               name_fr: { type: string }
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *       404:
 *         description: Catégorie non trouvée
 */
router.put('/categories/:categoryId', verifyToken, adminOnly, updateCategory);

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     description: Supprime une catégorie (Admin requis, impossible si articles associés)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Catégorie supprimée
 *       400:
 *         description: Catégorie contient des articles
 *       404:
 *         description: Catégorie non trouvée
 */
router.delete('/categories/:categoryId', verifyToken, adminOnly, deleteCategory);

module.exports = router;
