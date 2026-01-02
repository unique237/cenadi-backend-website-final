const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /staffs:
 *   get:
 *     summary: Lister le personnel
 *     description: Retourne la liste du personnel avec pagination
 *     tags: [Staff]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste du personnel
 */
router.get('/staffs', getAllStaff);

/**
 * @swagger
 * /staffs/{staffId}:
 *   get:
 *     summary: Obtenir un membre du personnel par ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du membre du personnel
 *       404:
 *         description: Membre non trouvé
 */
router.get('/staffs/:staffId', getStaffById);

/**
 * @swagger
 * /staffs:
 *   post:
 *     summary: Créer un membre du personnel
 *     description: Crée un nouveau membre du personnel (Admin requis)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email]
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string, format: email }
 *               position: { type: string }
 *               phone: { type: string }
 *               photo_url: { type: string, format: uri }
 *     responses:
 *       201:
 *         description: Membre créé
 *       400:
 *         description: Données invalides
 */
router.post('/staffs', verifyToken, adminOnly, createStaff);

/**
 * @swagger
 * /staffs/{staffId}:
 *   put:
 *     summary: Mettre à jour un membre du personnel
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname: { type: string }
 *               lastname: { type: string }
 *               email: { type: string, format: email }
 *               position: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: Membre mis à jour
 *       404:
 *         description: Membre non trouvé
 */
router.put('/staffs/:staffId', verifyToken, adminOnly, updateStaff);

/**
 * @swagger
 * /staffs/{staffId}:
 *   delete:
 *     summary: Supprimer un membre du personnel
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Membre supprimé
 *       404:
 *         description: Membre non trouvé
 */
router.delete('/staffs/:staffId', verifyToken, adminOnly, deleteStaff);

module.exports = router;
