const express = require('express');
const router = express.Router();
const {
  getAllDirectorMessages,
  getActiveDirectorMessage,
  getDirectorMessageById,
  createDirectorMessage,
  updateDirectorMessage,
  deleteDirectorMessage,
} = require('../controllers/directorWordController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /director-messages:
 *   get:
 *     summary: Lister les messages du directeur
 *     description: Retourne la liste des messages du directeur avec pagination
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get('/director-messages', getAllDirectorMessages);

/**
 * @swagger
 * /director-messages/active:
 *   get:
 *     summary: Obtenir le message actif du directeur
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Message actif
 *       404:
 *         description: Aucun message actif trouvé
 */
router.get('/director-messages/active', getActiveDirectorMessage);

/**
 * @swagger
 * /director-messages/{messageId}:
 *   get:
 *     summary: Obtenir un message du directeur par ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du message
 *       404:
 *         description: Message non trouvé
 */
router.get('/director-messages/:messageId', getDirectorMessageById);

/**
 * @swagger
 * /director-messages:
 *   post:
 *     summary: Créer un message du directeur
 *     description: Crée un nouveau message du directeur (Admin requis)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title_en, title_fr, content_en, content_fr]
 *             properties:
 *               title_en: { type: string }
 *               title_fr: { type: string }
 *               content_en: { type: string }
 *               content_fr: { type: string }
 *               author_name: { type: string }
 *               published_at: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Message créé
 *       400:
 *         description: Données invalides
 */
router.post('/director-messages', verifyToken, adminOnly, createDirectorMessage);

/**
 * @swagger
 * /director-messages/{messageId}:
 *   put:
 *     summary: Mettre à jour un message du directeur
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
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
 *               author_name: { type: string }
 *     responses:
 *       200:
 *         description: Message mis à jour
 *       404:
 *         description: Message non trouvé
 */
router.put('/director-messages/:messageId', verifyToken, adminOnly, updateDirectorMessage);

/**
 * @swagger
 * /director-messages/{messageId}:
 *   delete:
 *     summary: Supprimer un message du directeur
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Message supprimé
 *       404:
 *         description: Message non trouvé
 */
router.delete('/director-messages/:messageId', verifyToken, adminOnly, deleteDirectorMessage);

module.exports = router;
