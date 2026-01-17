const express = require("express");
const router = express.Router();

const { upload } = require("../middlewares/upload");
const { validatePaymentProof } = require("../controllers/paymentValidation_controller");

// razor pay method
// router.post("/create_order", createOrder);
// router.post("/verify", verifyPayment);

// Manual Payment Verification

router.post('/validate-payment', upload.single("screenshot"), validatePaymentProof)

module.exports = router;