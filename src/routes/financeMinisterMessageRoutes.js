const express = require('express');
const router = express.Router();
const {
  getAllMinisterMessages,
  getActiveMinisterMessage,
  getMinisterMessageById,
  createMinisterMessage,
  updateMinisterMessage,
  deleteMinisterMessage,
} = require('../controllers/ministerWordController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/finance-minister-messages', getAllMinisterMessages);
router.get('/finance-minister-messages/active', getActiveMinisterMessage);
router.get('/finance-minister-messages/:messageId', getMinisterMessageById);
router.post('/finance-minister-messages', verifyToken, adminOnly, createMinisterMessage);
router.put('/finance-minister-messages/:messageId', verifyToken, adminOnly, updateMinisterMessage);
router.delete('/finance-minister-messages/:messageId', verifyToken, adminOnly, deleteMinisterMessage);

module.exports = router;
