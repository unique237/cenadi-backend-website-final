// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, signupSchema, signinSchema, updateUserSchema } = require('../middleware/validation');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Inscription utilisateur
 *     description: Crée un nouvel utilisateur (rôle author par défaut, status pending)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, name, password]
 *             properties:
 *               username: { type: string, example: john_doe }
 *               email: { type: string, format: email, example: john@example.com }
 *               name: { type: string, example: John Doe }
 *               password: { type: string, format: password, example: SecurePass123 }
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id: { type: integer }
 *                     username: { type: string }
 *                     email: { type: string }
 *                     role: { type: string }
 *                     status: { type: string }
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email ou nom d'utilisateur déjà existant
 */
router.post('/auth/signup', authLimiter, validate(signupSchema), signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: admin@cenadi.cm }
 *               password: { type: string, format: password, example: SecureAdmin123 }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 token: { type: string, example: eyJhbGci... }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Email ou mot de passe invalide
 *       403:
 *         description: Compte suspendu ou en attente d'approbation
 */
router.post('/auth/signin', authLimiter, validate(signinSchema), signin);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lister tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs (Admin requis)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé (Admin requis)
 */
router.get('/users', verifyToken, getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Obtenir les détails d'un utilisateur
 *     description: Retourne les informations d'un utilisateur spécifique
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 user: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/:userId', verifyToken, getUserById);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Mettre à jour le rôle ou status d'un utilisateur (Admin requis)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [admin, author] }
 *               status: { type: string, enum: [pending, active, suspended] }
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       403:
 *         description: Accès refusé ou auto-modification interdite
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/users/:userId', verifyToken, adminOnly, validate(updateUserSchema), updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur (Admin requis, ne peut pas se supprimer soi-même)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès refusé ou auto-suppression interdite
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:userId', verifyToken, adminOnly, deleteUser);

module.exports = router;