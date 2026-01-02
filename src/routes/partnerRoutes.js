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

router.get('/partners', getAllPartners);
router.get('/partners/:partnerId', getPartnerById);
router.post('/partners', verifyToken, adminOnly, createPartner);
router.put('/partners/:partnerId', verifyToken, adminOnly, updatePartner);
router.delete('/partners/:partnerId', verifyToken, adminOnly, deletePartner);

module.exports = router;