const express = require('express');
const router = express.Router();
const {
  getAllDirectorMessages,
  getActiveDirectorMessage,
  getDirectorMessageById,
  createDirectorMessage,
  updateDirectorMessage,
  deleteDirectorMessage,
} = require('../controllers/directorWordController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/director-messages', getAllDirectorMessages);
router.get('/director-messages/active', getActiveDirectorMessage);
router.get('/director-messages/:messageId', getDirectorMessageById);
router.post('/director-messages', verifyToken, adminOnly, createDirectorMessage);
router.put('/director-messages/:messageId', verifyToken, adminOnly, updateDirectorMessage);
router.delete('/director-messages/:messageId', verifyToken, adminOnly, deleteDirectorMessage);

module.exports = router;
