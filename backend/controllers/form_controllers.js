const { query } = require("../config/db");
const crypto = require("crypto");
const { sendWelcomeMail } = require("./mail_controllers");
const { generateFoodToken, generateFoodQRBuffer } = require("./qr_generator_controllers");
const {appendToGoogleSheet} = require('./excel_controllers')

/* ===============================
   HELPERS
=============================== */
function isValidTeamName(name) {
  return (
    typeof name === "string" &&
    name.trim().length >= 3 &&
    name.trim().length <= 50
  );
}

async function register(req, res) {
  let email;
  try {
    /* ===============================
       BEGIN TRANSACTION
    =============================== */
    await query("BEGIN");

    const { name, email: reqEmail, phone, college, student_year, food, events, registration_mode } = req.body;

    email = reqEmail;

    /* ===============================
       BASIC VALIDATION
    =============================== */
    if (!name || !email || !phone || !college || !student_year || !food) {
      throw new Error("Missing registration details");
    }

    if (!Array.isArray(events) || events.length === 0) {
      throw new Error("Select at least one event");
    }

    if (!registration_mode || !["online", "onspot"].includes(registration_mode)) {
      throw new Error("Invalid registration mode");
    }

    // ensure reservation exists
    const resCheck = await query(
      `SELECT 1 FROM slot_reservations WHERE email = $1`,
      [email]
    );

    if (resCheck.rowCount === 0) {
      throw new Error("Reservation expired. Please try again.");
    }

    // 🔥 ADD THIS IMMEDIATELY AFTER
    const reservationMap = await query(
      `SELECT * FROM slot_reservations WHERE email = $1`,
      [email]
    );

    if (reservationMap.rows.length !== events.length) {
      throw new Error("Reservation mismatch. Please retry registration.");
    }

    /* ===============================
       EMAIL DUPLICATE CHECK
    =============================== */
    const emailExists = await query(
      `SELECT 1 FROM registrations WHERE email = $1`,
      [email]
    );

    if (emailExists.rowCount > 0) {
      throw new Error("EMAIL_EXISTS");
    }

    /* ===============================
       INSERT REGISTRATION
    =============================== */
    const regRes = await query(
      `INSERT INTO registrations
       (name,email,phone,college,student_year,food)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [name, email, phone, college, student_year, food]
    );

    const registrationId = regRes.rows[0].id;
    const responseEvents = [];

    /* ===============================
       PROCESS EVENTS (UNCHANGED)
    =============================== */
    for (const ev of events) {
      const { event_name, role, team_name, team_code } = ev;

      const eventRes = await query(
        `SELECT id, event_type, teammembers, max_teams, max_online_teams
         FROM events WHERE event_name = $1`,
        [event_name]
      );

      if (eventRes.rowCount === 0) {
        throw new Error(`Invalid event: ${event_name}`);
      }

      const event = eventRes.rows[0];

      const reservation = reservationMap.rows.find(
        r => r.event_id === event.id
      );

      if (!reservation) {
        throw new Error(`Reservation mismatch for ${event_name}. Please retry.`);
      }

      const finalRole = reservation.role || null;
      const finalTeamName = reservation.team_name || null;
      const finalTeamCode = reservation.team_code || null;

      await query(
        `INSERT INTO registration_events
        (registration_id,event_id,role,team_name,team_code,registration_mode)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [registrationId, event.id, finalRole, finalTeamName, finalTeamCode, registration_mode]
      );

      responseEvents.push({
        event_name,
        role: finalRole || "participant",
        team_name: finalTeamName,
        team_code: finalTeamCode,
      });
    }

    /* ===============================
       🍽️ FOOD TOKEN + QR (NEW)
    =============================== */
    const foodToken = generateFoodToken();

    await query(
      `INSERT INTO food_tokens (registration_id, token, food_type)
       VALUES ($1,$2,$3)`,
      [registrationId, foodToken, food]
    );

    /* ===============================
       COMMIT TRANSACTION
    =============================== */
    await query("COMMIT");

    const eventsList = responseEvents
      .map(e => e.event_name)
      .join(", ");

    appendToGoogleSheet({
      email,
      name,
      college,
      year: student_year,
      events: eventsList,
      food
    });


    /* ===============================
       SEND MAIL WITH QR (AFTER COMMIT)
    =============================== */
    const qrBuffer = await generateFoodQRBuffer(foodToken);

    sendWelcomeMail(
      name,
      email,
      responseEvents,
      qrBuffer,
      food
    ).catch(err => console.error("Mail Error:", err));

    await query(`DELETE FROM slot_reservations WHERE email = $1`, [email]);

    return res.status(201).json({
      message: "Registration successful",
      registration_id: registrationId,
      events: responseEvents,
    });

  } catch (err) {
    try {
      await query("ROLLBACK");
    } catch (_) {}

    await query(`DELETE FROM slot_reservations WHERE email = $1`, [email]);

    if (err.message === "EMAIL_EXISTS") {
      return res.status(400).json({
        message: "This email has already been registered",
      });
    }

    
    console.error("Registration Error:", err.message);
    return res.status(400).json({
      message: err.message || "Registration failed",
    });
  }
}

module.exports = { register };
