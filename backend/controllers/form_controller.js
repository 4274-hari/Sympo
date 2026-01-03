const { getClient } = require("../config/db");

const { sendWelcomeMail } = require("../services/mail_service");
const { appendToGoogleSheet } = require("../services/excel_service");
const { resolveTeamRegistration } = require("../services/team_service");
const { generateReceiptPDF } = require("../services/pdf_service");

const {
  generateFoodToken,
  generateFoodQRBuffer
} = require("../helpers/qr_helper");

const { buildReceiptData } = require("../helpers/receipt_helper");

const {
  ValidationError,
  ConflictError
} = require("../errors/error");


/* ===============================
   REGISTER CONTROLLER
=============================== */
async function register(req, res, next) {
  const client = await getClient(); // 🔐 single DB connection
  let email;

  try {
    /* ===============================
       BEGIN TRANSACTION
    =============================== */
    await client.query("BEGIN");

    const {
      name,
      email: reqEmail,
      phone,
      college,
      student_year,
      food,
      events,
      registration_mode,
    } = req.body;

    email = reqEmail;

    /* ===============================
       BASIC VALIDATION
    =============================== */
    if (!name || !email || !phone || !college || !student_year || !food) {
      throw ValidationError("Missing registration details");
    }

    if (!Array.isArray(events) || events.length === 0) {
      throw ValidationError("Select at least one event");
    }

    if (!["online", "onspot"].includes(registration_mode)) {
      throw ValidationError("Invalid registration mode");
    }

    /* ===============================
   UTR VALIDATION
=============================== */
// if (!utr) {
//   throw ValidationError("UTR is required");
// }

// if (!/^[0-9A-Za-z]{6,50}$/.test(utr)) {
//   throw ValidationError("Invalid UTR format");
// }

    /* ===============================
       SLOT RESERVATION CHECK (NEW)
    =============================== */
    const reservationRes = await client.query(
      `SELECT * FROM slot_reservations WHERE email = $1`,
      [email]
    );

    if (reservationRes.rowCount === 0) {
      throw ConflictError("Reservation expired. Please retry.");
    }

    if (reservationRes.rowCount !== events.length) {
      throw ConflictError("Reservation mismatch. Please retry.");
    }

    /* ===============================
       EMAIL DUPLICATE CHECK
    =============================== */
    const emailExists = await client.query(
      `SELECT 1 FROM registrations WHERE email = $1`,
      [email]
    );

    if (emailExists.rowCount > 0) {
      throw ConflictError("Email already registered");
    }

    const proofRes = await client.query(
      `SELECT uid, screenshot_hash FROM payment_proofs WHERE email = $1`,
      [email]
    );

    if (proofRes.rowCount === 0) {
      throw ConflictError("Payment proof not found");
    }

    const { uid: utr, screenshot_hash } = proofRes.rows[0];

    const utrExists = await client.query(
      `SELECT 1 FROM registrations WHERE utr = $1`,
      [utr]
    );

    const screenshotExists = await client.query(
      `SELECT 1 FROM registrations WHERE screenshot_hash = $1`,
      [screenshot_hash]
    );

    if (utrExists.rowCount > 0 || screenshotExists.rowCount > 0) {
      throw ConflictError("UTR already used");
    }

   const regRes = await client.query(
  `INSERT INTO registrations
   (name, email, phone, college, student_year, food, utr, screenshot_hash)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
   RETURNING id`,
  [name, email, phone, college, student_year, food, utr, screenShot]
);


    const registrationId = regRes.rows[0].id;
    const responseEvents = [];

    /* ===============================
       PROCESS EVENTS
    =============================== */
    for (const ev of events) {
      const { event_name } = ev;

      const eventRes = await client.query(
        `SELECT id, event_type
         FROM events WHERE event_name = $1`,
        [event_name]
      );

      if (eventRes.rowCount === 0) {
        throw ValidationError(`Invalid event: ${event_name}`);
      }

      const event = eventRes.rows[0];

      /* -------------------------------
         MATCH RESERVATION
      ------------------------------- */
      const reservation = reservationRes.rows.find(
        r => r.event_id === event.id
      );

      if (!reservation) {
        throw ConflictError(`Reservation mismatch for ${event_name}`);
      }

      /* -------------------------------
         TEAM LOGIC (UNCHANGED)
      ------------------------------- */
      const {
        finalRole,
        finalTeamName,
        finalTeamCode
      } = await resolveTeamRegistration({
        client,
        event,
        role: reservation.role,
        team_name: reservation.team_name,
        team_code: reservation.team_code
      });

      await client.query(
        `INSERT INTO registration_events
        (registration_id, event_id, role, team_name, team_code, session, registration_mode)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          registrationId,
          event.id,
          finalRole,
          finalTeamName,
          finalTeamCode,
          reservation.session || null,
          registration_mode
        ]
      );


      responseEvents.push({
        event_name,
        role: finalRole || "participant",
        team_name: finalTeamName,
        team_code: finalTeamCode
      });
    }

    /* ===============================
       FOOD TOKEN
    =============================== */
    const foodToken = generateFoodToken();

    await client.query(
      `INSERT INTO food_tokens (registration_id, token, food_type)
       VALUES ($1,$2,$3)`,
      [registrationId, foodToken, food]
    );

    /* ===============================
       COMMIT TRANSACTION
    =============================== */
    await client.query("COMMIT");

    /* ===============================
       SIDE EFFECTS (POST COMMIT)
    =============================== */
    const qrBuffer = await generateFoodQRBuffer(foodToken);

    const receipt = buildReceiptData({
      registrationId,
      name,
      email,
      phone,
      college,
      student_year,
      food,
      events: responseEvents,
      foodToken,
      qrBuffer
    });

    sendWelcomeMail(receipt).catch(console.error);

    appendToGoogleSheet({
      email,
      name,
      college,
      year: student_year,
      events: responseEvents.map(e => e.event_name).join(", "),
      food
    }).catch(console.error);

    /* ===============================
       CLEAR RESERVATION
    =============================== */
    await client.query(
      `DELETE FROM slot_reservations WHERE email = $1`,
      [email]
    );


    const pdfBuffer = await generateReceiptPDF(receipt);

    // return res.status(201).json({
    //   success: true,
    //   receipt,
    //   pdf_base64: pdfBuffer.toString("base64")
    //  pdf_base64: pdfBuffer.toString("base64")
    // });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=COGNEBULA_${receipt.receipt_id}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    return res.status(200).send(pdfBuffer);

  } catch (err) {
    await client.query("ROLLBACK");

    if (email) {
      await client.query(
        `DELETE FROM slot_reservations WHERE email = $1`,
        [email]
      );
    }

    next(err);
  } finally {
    client.release();
  }
}

module.exports = { register };
