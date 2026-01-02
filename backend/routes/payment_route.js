const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment
} = require("../controllers/payment_controller");
const { upload } = require("../middlewares/upload");
const { validatePaymentProof } = require("../controllers/paymaneValidation_controller");

router.post("/create_order", createOrder);
router.post("/verify", verifyPayment);

// Manual Payment Verification

router.post('/validate-payment', upload.single("screenshot"), validatePaymentProof)

module.exports = router;