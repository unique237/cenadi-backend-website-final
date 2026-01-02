const multer = require('multer');
const path = require('path');
const { UPLOAD_BASE_DIR, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, generateFileName } = require('../config/storage');

/**
 * Configuration du stockage Multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.uploadSubDir || 'assets';
    const destinationPath = path.join(UPLOAD_BASE_DIR, subDir);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

/**
 * Filtre pour valider les types de fichiers
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}. Types acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`), false);
  }
};

/**
 * Configuration Multer
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Un seul fichier à la fois
  },
});

/**
 * Middleware pour gérer les erreurs d'upload
 */
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `Fichier trop volumineux. Taille maximale: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erreur d'upload: ${err.message}`,
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleUploadErrors,
};
