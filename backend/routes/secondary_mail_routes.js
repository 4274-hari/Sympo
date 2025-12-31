const express = require('express');

const router = express.Router();

const{sendsecondarymail} = require('../controllers/mail_controllers');

router.post('/welcome',sendsecondarymail);

module.exports = router;