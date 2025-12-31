const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validate, contactSchema } = require('../middleware/validation');

router.post('/contact', contactLimiter, validate(contactSchema), sendContactEmail);

module.exports = router;