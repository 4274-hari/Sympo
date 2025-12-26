const express = require('express');
const router = express.Router();
const {scanFoodQR} = require("../controllers/qr_validator_controllers")

router.post('/scanqr',scanFoodQR);

module.exports = router;