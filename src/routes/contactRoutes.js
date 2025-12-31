const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validate, contactSchema } = require('../middleware/validation');

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Envoyer un message de contact
 *     description: Envoie un email de contact à partir du formulaire de contact du site
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name: { type: string, minLength: 3, maxLength: 100 }
 *               email: { type: string, format: email }
 *               phone: { type: string, pattern: '^[+]?[0-9]{7,15}$' }
 *               subject: { type: string, minLength: 5, maxLength: 200 }
 *               message: { type: string, minLength: 10, maxLength: 5000 }
 *               organization: { type: string, maxLength: 100 }
 *     responses:
 *       200:
 *         description: Message envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       400:
 *         description: Données invalides ou champs manquants
 *       429:
 *         description: Trop de messages (rate limiting)
 *       500:
 *         description: Erreur lors de l'envoi de l'email
 */
router.post('/contact', contactLimiter, validate(contactSchema), sendContactEmail);

module.exports = router;