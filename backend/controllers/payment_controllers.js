const razorpay = require("../config/razorpay");
const db = require("../config/db");
const crypto = require("crypto"); // ✅ FIX 1

/* -------------------------
   CREATE ORDER
--------------------------*/
exports.createOrder = async (req, res) => {
  try {
    const { events, email } = req.body;

    if (!events || events.length === 0) {
      return res.status(400).json({ error: "No events selected" });
    }

    // 1️⃣ Extract event names
    const eventNames = events.map(e => e.event_name);

    // 2️⃣ Fetch event modes
    const result = await db.query(
      `SELECT event_name, event_mode
       FROM events
       WHERE event_name = ANY($1)`,
      [eventNames]
    );

    if (result.rowCount !== eventNames.length) {
      return res.status(400).json({ error: "Invalid event selected" });
    }

    // 3️⃣ Pricing logic
    const modes = result.rows.map(r => r.event_mode);

    const isWorkshopOnly = modes.every(m => m === "workshop");
    const amount = isWorkshopOnly ? 300 : 200;

    // 4️⃣ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `sympo_${Date.now()}`,
      notes: {
        email,
        events: eventNames.join(",")
      }
    });

    return res.json({
      success: true,
      amount,
      order
    });

  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ error: "Payment init failed" });
  }
};

/* -------------------------
   VERIFY PAYMENT
--------------------------*/
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    // 🔐 Signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    /* ✅ Payment verified — SAVE IT */
    await db.query(
      `INSERT INTO payments
       (order_id, payment_id, status)
       VALUES ($1, $2, 'PAID')`,
      [razorpay_order_id, razorpay_payment_id]
    );

    return res.json({ success: true });

  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};
