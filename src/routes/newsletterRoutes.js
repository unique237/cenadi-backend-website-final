const express = require('express');
const router = express.Router();
const {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  searchNewsletters,
} = require('../controllers/newsletterController');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /newsletters:
 *   get:
 *     summary: Lister les newsletters
 *     description: Retourne la liste des newsletters avec pagination
 *     tags: [Newsletters]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des newsletters
 */
router.get('/newsletters', getAllNewsletters);

/**
 * @swagger
 * /newsletters/search:
 *   get:
 *     summary: Rechercher des newsletters
 *     tags: [Newsletters]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/newsletters/search', searchNewsletters);

/**
 * @swagger
 * /newsletters/{newsletterId}:
 *   get:
 *     summary: Obtenir une newsletter par ID
 *     tags: [Newsletters]
 *     parameters:
 *       - in: path
 *         name: newsletterId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de la newsletter
 *       404:
 *         description: Newsletter non trouvée
 */
router.get('/newsletters/:newsletterId', getNewsletterById);

/**
 * @swagger
 * /newsletters:
 *   post:
 *     summary: Créer une newsletter
 *     description: Crée une nouvelle newsletter (Admin requis)
 *     tags: [Newsletters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subject_en, subject_fr, content_en, content_fr]
 *             properties:
 *               subject_en: { type: string }
 *               subject_fr: { type: string }
 *               content_en: { type: string }
 *               content_fr: { type: string }
 *               published_at: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Newsletter créée
 *       400:
 *         description: Données invalides
 */
router.post('/newsletters', verifyToken, adminOnly, createNewsletter);

/**
 * @swagger
 * /newsletters/{newsletterId}:
 *   put:
 *     summary: Mettre à jour une newsletter
 *     tags: [Newsletters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsletterId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_en: { type: string }
 *               subject_fr: { type: string }
 *               content_en: { type: string }
 *               content_fr: { type: string }
 *     responses:
 *       200:
 *         description: Newsletter mise à jour
 *       404:
 *         description: Newsletter non trouvée
 */
router.put('/newsletters/:newsletterId', verifyToken, adminOnly, updateNewsletter);

/**
 * @swagger
 * /newsletters/{newsletterId}:
 *   delete:
 *     summary: Supprimer une newsletter
 *     tags: [Newsletters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsletterId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Newsletter supprimée
 *       404:
 *         description: Newsletter non trouvée
 */
router.delete('/newsletters/:newsletterId', verifyToken, adminOnly, deleteNewsletter);

module.exports = router;
