const express = require('express');
const router = express.Router();
const {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  searchNewsletters,
} = require('../controllers/newsletterController');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/newsletters', getAllNewsletters);
router.get('/newsletters/search', searchNewsletters);
router.get('/newsletters/:newsletterId', getNewsletterById);
router.post('/newsletters', verifyToken, adminOnly, createNewsletter);
router.put('/newsletters/:newsletterId', verifyToken, adminOnly, updateNewsletter);
router.delete('/newsletters/:newsletterId', verifyToken, adminOnly, deleteNewsletter);

module.exports = router;
