const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe } = require('../controllers/subscribeController.v2');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validate, subscribeSchema } = require('../middleware/validation');

router.post('/subscribe', contactLimiter, validate(subscribeSchema), subscribe);
router.post('/unsubscribe', contactLimiter, unsubscribe);

module.exports = router;