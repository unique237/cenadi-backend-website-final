const express = require('express');
const router = express.Router();
const {
  getAllFacts,
  getFactById,
  createFact,
  updateFact,
  deleteFact,
} = require('../controllers/factController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /facts:
 *   get:
 *     summary: Récupérer tous les faits et statistiques
 *     description: Récupère la liste complète des faits et statistiques du CENADI
 *     tags: [Facts]
 *     responses:
 *       200:
 *         description: Liste des faits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 6 }
 *                 facts: 
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fact'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/facts', getAllFacts);

/**
 * @swagger
 * /facts/{factId}:
 *   get:
 *     summary: Récupérer un fait spécifique
 *     description: Récupère les détails d'un fait par son identifiant
 *     tags: [Facts]
 *     parameters:
 *       - in: path
 *         name: factId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Identifiant du fait
 *     responses:
 *       200:
 *         description: Fait récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 fact:
 *                   $ref: '#/components/schemas/Fact'
 *       404:
 *         description: Fait non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 */
router.get('/facts/:factId', getFactById);

/**
 * @swagger
 * /facts:
 *   post:
 *     summary: Créer un nouveau fait
 *     description: Crée un nouveau fait et statistique (Admin uniquement)
 *     tags: [Facts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content_en, content_fr]
 *             properties:
 *               name_en: { type: string, example: '500+', description: 'Titre/chiffre en anglais' }
 *               name_fr: { type: string, example: '500+', description: 'Titre/chiffre en français' }
 *               content_en: { type: string, example: 'Active Partners Worldwide' }
 *               content_fr: { type: string, example: 'Partenaires Actifs Mondiaux' }
 *               description_en: { type: string, description: 'Description supplémentaire en anglais' }
 *               description_fr: { type: string, description: 'Description supplémentaire en français' }
 *               icon_url: { type: string, format: uri, description: 'URL de licon' }
 *     responses:
 *       201:
 *         description: Fait créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 fact:
 *                   $ref: '#/components/schemas/Fact'
 *       400:
 *         description: Données invalides - contenu en anglais et français obligatoires
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/facts', verifyToken, adminOnly, createFact);

/**
 * @swagger
 * /facts/{factId}:
 *   put:
 *     summary: Mettre à jour un fait
 *     description: Met à jour un fait existant (Admin uniquement)
 *     tags: [Facts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: factId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du fait
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_en: { type: string }
 *               name_fr: { type: string }
 *               content_en: { type: string }
 *               content_fr: { type: string }
 *               description_en: { type: string }
 *               description_fr: { type: string }
 *               icon_url: { type: string, format: uri }
 *     responses:
 *       200:
 *         description: Fait mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 fact:
 *                   $ref: '#/components/schemas/Fact'
 *       404:
 *         description: Fait non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.put('/facts/:factId', verifyToken, adminOnly, updateFact);

/**
 * @swagger
 * /facts/{factId}:
 *   delete:
 *     summary: Supprimer un fait
 *     description: Supprime un fait existant (Admin uniquement)
 *     tags: [Facts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: factId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du fait à supprimer
 *     responses:
 *       200:
 *         description: Fait supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *       404:
 *         description: Fait non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/facts/:factId', verifyToken, adminOnly, deleteFact);

module.exports = router;
