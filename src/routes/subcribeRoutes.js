const express = require('express');
const router = express.Router();
const { sendSubscribeMail } = require('../controllers/subscribeController');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validate, subscribeSchema } = require('../middleware/validation');

router.post('/subscribe', contactLimiter, validate(subscribeSchema), sendSubscribeMail);

module.exports = router;