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

router.get('/facts', getAllFacts);
router.get('/facts/:factId', getFactById);
router.post('/facts', verifyToken, adminOnly, createFact);
router.put('/facts/:factId', verifyToken, adminOnly, updateFact);
router.delete('/facts/:factId', verifyToken, adminOnly, deleteFact);

module.exports = router;
