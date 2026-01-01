const express = require('express');
const router = express.Router();
const {scanFoodQR} = require("../controllers/qr_controller")

router.post('/scanqr',scanFoodQR);

module.exports = router;