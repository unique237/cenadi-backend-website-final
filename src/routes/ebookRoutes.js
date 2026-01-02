const express = require('express');
const router = express.Router();
const {
  getAllEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook,
  searchEbooks,
} = require('../controllers/ebookController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /ebooks:
 *   get:
 *     summary: Lister les e-books
 *     description: Retourne la liste des e-books avec pagination
 *     tags: [EBooks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des e-books
 */
router.get('/ebooks', getAllEbooks);

/**
 * @swagger
 * /ebooks/search:
 *   get:
 *     summary: Rechercher des e-books
 *     tags: [EBooks]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/ebooks/search', searchEbooks);

/**
 * @swagger
 * /ebooks/{ebookId}:
 *   get:
 *     summary: Obtenir un e-book par ID
 *     tags: [EBooks]
 *     parameters:
 *       - in: path
 *         name: ebookId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de l'e-book
 *       404:
 *         description: E-book non trouvé
 */
router.get('/ebooks/:ebookId', getEbookById);

/**
 * @swagger
 * /ebooks:
 *   post:
 *     summary: Créer un e-book
 *     description: Crée un nouvel e-book (Admin requis)
 *     tags: [EBooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title_en, title_fr, author, file_url]
 *             properties:
 *               title_en: { type: string }
 *               title_fr: { type: string }
 *               author: { type: string }
 *               description_en: { type: string }
 *               description_fr: { type: string }
 *               file_url: { type: string, format: uri }
 *               cover_url: { type: string, format: uri }
 *               published_at: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: E-book créé
 *       400:
 *         description: Données invalides
 */
router.post('/ebooks', verifyToken, adminOnly, createEbook);

/**
 * @swagger
 * /ebooks/{ebookId}:
 *   put:
 *     summary: Mettre à jour un e-book
 *     tags: [EBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ebookId
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
 *               author: { type: string }
 *               description_en: { type: string }
 *               description_fr: { type: string }
 *     responses:
 *       200:
 *         description: E-book mis à jour
 *       404:
 *         description: E-book non trouvé
 */
router.put('/ebooks/:ebookId', verifyToken, adminOnly, updateEbook);

/**
 * @swagger
 * /ebooks/{ebookId}:
 *   delete:
 *     summary: Supprimer un e-book
 *     tags: [EBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ebookId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: E-book supprimé
 *       404:
 *         description: E-book non trouvé
 */
router.delete('/ebooks/:ebookId', verifyToken, adminOnly, deleteEbook);

module.exports = router;
