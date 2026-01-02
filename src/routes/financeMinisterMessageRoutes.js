const express = require('express');
const router = express.Router();
const {
  getAllMinisterMessages,
  getActiveMinisterMessage,
  getMinisterMessageById,
  createMinisterMessage,
  updateMinisterMessage,
  deleteMinisterMessage,
} = require('../controllers/ministerWordController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /finance-minister-messages:
 *   get:
 *     summary: Lister les messages du ministre des finances
 *     description: Retourne la liste des messages du ministre avec pagination
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
router.get('/finance-minister-messages', getAllMinisterMessages);

/**
 * @swagger
 * /finance-minister-messages/active:
 *   get:
 *     summary: Obtenir le message actif du ministre des finances
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Message actif
 *       404:
 *         description: Aucun message actif trouvé
 */
router.get('/finance-minister-messages/active', getActiveMinisterMessage);

/**
 * @swagger
 * /finance-minister-messages/{messageId}:
 *   get:
 *     summary: Obtenir un message du ministre par ID
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
router.get('/finance-minister-messages/:messageId', getMinisterMessageById);

/**
 * @swagger
 * /finance-minister-messages:
 *   post:
 *     summary: Créer un message du ministre
 *     description: Crée un nouveau message du ministre des finances (Admin requis)
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
router.post('/finance-minister-messages', verifyToken, adminOnly, createMinisterMessage);

/**
 * @swagger
 * /finance-minister-messages/{messageId}:
 *   put:
 *     summary: Mettre à jour un message du ministre
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
router.put('/finance-minister-messages/:messageId', verifyToken, adminOnly, updateMinisterMessage);

/**
 * @swagger
 * /finance-minister-messages/{messageId}:
 *   delete:
 *     summary: Supprimer un message du ministre
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
router.delete('/finance-minister-messages/:messageId', verifyToken, adminOnly, deleteMinisterMessage);

module.exports = router;
