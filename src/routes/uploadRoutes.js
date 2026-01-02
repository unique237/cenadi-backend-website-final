const express = require('express');
const router = express.Router();
const { upload, handleUploadErrors } = require('../middleware/upload');
const { verifyToken, adminOnly } = require('../middleware/auth');

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

      res.json({
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
 * Route pour supprimer une image (optionnel)
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

      res.json({
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
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du fichier',
      });
    }
  }
);

module.exports = router;
