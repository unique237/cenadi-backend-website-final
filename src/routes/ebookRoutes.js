const express = require('express');
const router = express.Router();
const {
  getAllEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook,
  searchEbooks,
} = require('../controllers/ebookController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/ebooks', getAllEbooks);
router.get('/ebooks/search', searchEbooks);
router.get('/ebooks/:ebookId', getEbookById);
router.post('/ebooks', verifyToken, adminOnly, createEbook);
router.put('/ebooks/:ebookId', verifyToken, adminOnly, updateEbook);
router.delete('/ebooks/:ebookId', verifyToken, adminOnly, deleteEbook);

module.exports = router;
