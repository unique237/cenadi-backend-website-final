const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe } = require('../controllers/subscribeController.v2');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validate, subscribeSchema } = require('../middleware/validation');

/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: S'abonner à la newsletter
 *     description: Inscrit un email à la liste de diffusion CENADI
 *     tags: [Abonnement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *               language: { type: string, enum: [en, fr], default: en }
 *     responses:
 *       201:
 *         description: Abonnement réussi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       400:
 *         description: Email invalide ou déjà abonné
 *       429:
 *         description: Trop de requêtes (rate limiting)
 */
router.post('/subscribe', contactLimiter, validate(subscribeSchema), subscribe);

/**
 * @swagger
 * /unsubscribe:
 *   post:
 *     summary: Se désabonner de la newsletter
 *     description: Supprime un email de la liste de diffusion
 *     tags: [Abonnement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Désabonnement réussi
 *       404:
 *         description: Email non trouvé dans les abonnés
 *       429:
 *         description: Trop de requêtes (rate limiting)
 */
router.post('/unsubscribe', contactLimiter, unsubscribe);

module.exports = router;