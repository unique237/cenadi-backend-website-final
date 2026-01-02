const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

const UPLOAD_BASE_DIR = 'uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

const STORAGE_DIRS = [
  'partners',
  'newsletters',
  'news',
  'projects',
  'staff',
  'ebooks',
  'assets',
  'director',
  'minister',
];

/**
 * Initialise les dossiers de stockage au démarrage
 */
const initStorageDirs = async () => {
  try {
    // Créer le dossier de base
    await fs.mkdir(UPLOAD_BASE_DIR, { recursive: true });
    
    // Créer les sous-dossiers
    for (const dir of STORAGE_DIRS) {
      const dirPath = path.join(UPLOAD_BASE_DIR, dir);
      await fs.mkdir(dirPath, { recursive: true });
    }
    logger.info(`✅ Storage directories initialized: ${STORAGE_DIRS.join(', ')}`);
  } catch (error) {
    logger.error('❌ Error initializing storage directories:', error);
    throw error;
  }
};

/**
 * Génère un nom de fichier unique
 */
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50); // Limite la longueur
  return `${name}-${timestamp}-${random}${ext}`;
};

/**
 * Supprime un fichier du système de fichiers
 */
const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl || fileUrl.startsWith('http')) {
      return; // Ne pas supprimer les URLs externes
    }
    const filePath = path.join(__dirname, '../../', fileUrl);
    await fs.unlink(filePath);
    logger.info(`🗑️ File deleted: ${fileUrl}`);
  } catch (error) {
    logger.warn(`⚠️ Could not delete file: ${fileUrl}`, error.message);
  }
};

module.exports = {
  UPLOAD_BASE_DIR,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  STORAGE_DIRS,
  initStorageDirs,
  generateFileName,
  deleteFile,
};
