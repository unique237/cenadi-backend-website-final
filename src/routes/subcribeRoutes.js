const express = require('express');
const router = express.Router();
const { sendSubscribeMail } = require('../controllers/subscribeController');

router.post('/subscribe', sendSubscribeMail);

module.exports = router;