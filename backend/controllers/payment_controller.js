const razorpay = require("../config/razorpay");
const { getClient } = require("../config/db");
const crypto = require("crypto");

const {
  ValidationError,
  ConflictError
} = require("../errors/error");

/* -------------------------
   CREATE ORDER
--------------------------*/
exports.createOrder = async (req, res, next) => {
  const client = await getClient();

  try {
    const { events, email } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      throw ValidationError("No events selected");
    }

    if (!email) {
      throw ValidationError("Email is required");
    }

    const eventNames = events.map(e => e.event_name);

    /* 🔍 FETCH EVENT MODES FROM DB */
    const result = await client.query(
      `SELECT event_mode
       FROM events
       WHERE event_name = ANY($1)`,
      [eventNames]
    );

    if (result.rowCount !== eventNames.length) {
      throw ValidationError("Invalid event selected");
    }

    const modes = result.rows.map(r => r.event_mode);
    const isWorkshopOnly = modes.every(m => m === "workshop");
    const amount = isWorkshopOnly ? 300 : 200;

    /* 💳 CREATE RAZORPAY ORDER */
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `sympo_${Date.now()}`,
      notes: {
        email,
        events: eventNames.join(",")
      }
    });

    res.status(200).json({
      success: true,
      amount,
      order
    });

  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};


/* -------------------------
   VERIFY PAYMENT
--------------------------*/
exports.verifyPayment = async (req, res, next) => {
  const client = await getClient();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw ValidationError("Missing payment details");
    }

    /* 🔐 Verify signature */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw ConflictError("Invalid payment signature");
    }

    await client.query("BEGIN");

    /* 🔁 Idempotency check */
    const exists = await client.query(
      `SELECT id FROM payments WHERE order_id = $1`,
      [razorpay_order_id]
    );

    if (exists.rowCount > 0) {
      throw ConflictError("Payment already verified");
    }

    /* ✅ Persist payment */
    await client.query(
      `INSERT INTO payments (order_id, payment_id, status)
       VALUES ($1, $2, 'PAID')`,
      [razorpay_order_id, razorpay_payment_id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};
