const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment
} = require("../controllers/payment_controller");

router.post("/create_order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
