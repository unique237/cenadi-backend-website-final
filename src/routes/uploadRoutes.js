const express = require('express');
const router = express.Router();
const { upload, handleUploadErrors } = require('../middleware/upload');
const { verifyToken, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /upload/{endpoint}:
 *   post:
 *     summary: Télécharger un fichier
 *     description: Upload un fichier image pour une entité. Endpoints disponibles - /partners, /newsletters, /news, /projects, /staff, /ebooks, /assets (Admin requis)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image à télécharger
 *     responses:
 *       200:
 *         description: Fichier téléchargé avec succès
 *       400:
 *         description: Aucun fichier fourni
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */

/**
 * Configuration des endpoints d'upload par type d'entité
 */
const uploadEndpoints = [
  { path: '/partners', subDir: 'partners' },
  { path: '/newsletters', subDir: 'newsletters' },
  { path: '/news', subDir: 'news' },
  { path: '/projects', subDir: 'projects' },
  { path: '/staff', subDir: 'staff' },
  { path: '/ebooks', subDir: 'ebooks' },
  { path: '/assets', subDir: 'assets' },
];

/**
 * Génère les routes d'upload pour chaque type d'entité
 */
uploadEndpoints.forEach(({ path: routePath, subDir }) => {
  router.post(
    routePath,
    verifyToken,
    adminOnly,
    (req, res, next) => {
      req.uploadSubDir = subDir;
      next();
    },
    upload.single('image'),
    handleUploadErrors,
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni',
        });
      }

      // Construire l'URL relative (sans le domaine)
      const fileUrl = `/uploads/${subDir}/${req.file.filename}`;

      return res.json({
        success: true,
        message: 'Fichier uploadé avec succès',
        data: {
          filename: req.file.filename,
          url: fileUrl,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    }
  );
});

/**
 * @swagger
 * /upload/{subDir}/{filename}:
 *   delete:
 *     summary: Supprimer un fichier
 *     description: Supprime un fichier uploadé (Admin requis)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subDir
 *         required: true
 *         schema: { type: string }
 *         description: Répertoire d'upload (partners, news, projects, etc.)
 *       - in: path
 *         name: filename
 *         required: true
 *         schema: { type: string }
 *         description: Nom du fichier à supprimer
 *     responses:
 *       200:
 *         description: Fichier supprimé avec succès
 *       404:
 *         description: Fichier non trouvé
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete(
  '/:subDir/:filename',
  verifyToken,
  adminOnly,
  async (req, res) => {
    const { subDir, filename } = req.params;
    const fs = require('fs').promises;
    const path = require('path');
    const { UPLOAD_BASE_DIR } = require('../config/storage');

    try {
      const filePath = path.join(UPLOAD_BASE_DIR, subDir, filename);
      await fs.unlink(filePath);

      return res.json({
        success: true,
        message: 'Fichier supprimé avec succès',
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          message: 'Fichier non trouvé',
        });
      }

      console.error('Erreur lors de la suppression:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du fichier',
      });
    }
  }
);

module.exports = router;
