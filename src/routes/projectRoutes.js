const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lister les projets
 *     description: Retourne la liste des projets avec pagination
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, completed, pending] }
 *     responses:
 *       200:
 *         description: Liste des projets
 */
router.get('/projects', getAllProjects);

/**
 * @swagger
 * /projects/{projectId}:
 *   get:
 *     summary: Obtenir un projet par ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du projet
 *       404:
 *         description: Projet non trouvé
 */
router.get('/projects/:projectId', getProjectById);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Créer un projet
 *     description: Crée un nouveau projet (Admin requis)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title_en, title_fr, description_en, description_fr]
 *             properties:
 *               title_en: { type: string }
 *               title_fr: { type: string }
 *               description_en: { type: string }
 *               description_fr: { type: string }
 *               image_url: { type: string, format: uri }
 *               budget: { type: number }
 *               status: { type: string, enum: [active, completed, pending] }
 *     responses:
 *       201:
 *         description: Projet créé
 *       400:
 *         description: Données invalides
 */
router.post('/projects', verifyToken, adminOnly, createProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *               description_en: { type: string }
 *               description_fr: { type: string }
 *               status: { type: string, enum: [active, completed, pending] }
 *     responses:
 *       200:
 *         description: Projet mis à jour
 *       404:
 *         description: Projet non trouvé
 */
router.put('/projects/:projectId', verifyToken, adminOnly, updateProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Projet supprimé
 *       404:
 *         description: Projet non trouvé
 */
router.delete('/projects/:projectId', verifyToken, adminOnly, deleteProject);

module.exports = router;
