const express = require('express');
const router = express.Router();
const {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} = require('../controllers/partnerController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /partners:
 *   get:
 *     summary: Lister les partenaires
 *     description: Retourne la liste des partenaires avec pagination
 *     tags: [Partners]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des partenaires
 */
router.get('/partners', getAllPartners);

/**
 * @swagger
 * /partners/{partnerId}:
 *   get:
 *     summary: Obtenir un partenaire par ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du partenaire
 *       404:
 *         description: Partenaire non trouvé
 */
router.get('/partners/:partnerId', getPartnerById);

/**
 * @swagger
 * /partners:
 *   post:
 *     summary: Créer un partenaire
 *     description: Crée un nouveau partenaire (Admin requis)
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               website: { type: string, format: uri }
 *               logo_url: { type: string, format: uri }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Partenaire créé
 *       400:
 *         description: Données invalides
 */
router.post('/partners', verifyToken, adminOnly, createPartner);

/**
 * @swagger
 * /partners/{partnerId}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               website: { type: string, format: uri }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 *       404:
 *         description: Partenaire non trouvé
 */
router.put('/partners/:partnerId', verifyToken, adminOnly, updatePartner);

/**
 * @swagger
 * /partners/{partnerId}:
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Partenaire supprimé
 *       404:
 *         description: Partenaire non trouvé
 */
router.delete('/partners/:partnerId', verifyToken, adminOnly, deletePartner);

module.exports = router;