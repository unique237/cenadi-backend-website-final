const express = require('express');
const router = express.Router();
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  searchAssets,
} = require('../controllers/assetController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/assets', getAllAssets);
router.get('/assets/search', searchAssets);
router.get('/assets/:assetId', getAssetById);
router.post('/assets', verifyToken, adminOnly, createAsset);
router.put('/assets/:assetId', verifyToken, adminOnly, updateAsset);
router.delete('/assets/:assetId', verifyToken, adminOnly, deleteAsset);

module.exports = router;
