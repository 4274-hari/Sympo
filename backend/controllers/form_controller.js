const { getClient } = require("../config/db");

const { sendWelcomeMail } = require("../services/mail_service");
const { appendToGoogleSheet } = require("../services/excel_service");
const { checkSlotAvailability } = require("../services/slot_service");
const { resolveTeamRegistration } = require("../services/team_service");

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

  try {
    /* ===============================
       BEGIN TRANSACTION
    =============================== */
    await client.query("BEGIN");

    const {
      name,
      email,
      phone,
      college,
      student_year,
      food,
      events,
      registration_mode
    } = req.body;

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
       EMAIL DUPLICATE CHECK
    =============================== */
    const emailExists = await client.query(
      `SELECT 1 FROM registrations WHERE email = $1`,
      [email]
    );

    if (emailExists.rowCount > 0) {
      throw ConflictError("Email already registered");
    }

    /* ===============================
       INSERT REGISTRATION
    =============================== */
    const regRes = await client.query(
      `INSERT INTO registrations
       (name, email, phone, college, student_year, food)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [name, email, phone, college, student_year, food]
    );

    const registrationId = regRes.rows[0].id;
    const responseEvents = [];

    /* ===============================
       PROCESS EVENTS
    =============================== */
    for (const ev of events) {
      const { event_name, role, team_name, team_code } = ev;

      const eventRes = await client.query(
        `SELECT id, event_type, teammembers, max_teams, max_online_teams
         FROM events WHERE event_name = $1`,
        [event_name]
      );

      if (eventRes.rowCount === 0) {
        throw ValidationError(`Invalid event: ${event_name}`);
      }

      const event = eventRes.rows[0];

      const isIndividual = event.event_type === "individual";
      const isTeamLead = event.event_type === "team" && role === "lead";

      /* ===============================
         SLOT CHECK (SERVICE)
      =============================== */
      if (isIndividual || isTeamLead) {
        await checkSlotAvailability({
          client,
          event,
          registration_mode,
          event_name
        });
      }

      /* ===============================
         TEAM LOGIC (SERVICE)
      =============================== */
      const {
        finalRole,
        finalTeamName,
        finalTeamCode
      } = await resolveTeamRegistration({
        client,
        event,
        role,
        team_name,
        team_code
      });

      /* ===============================
         INSERT REGISTRATION EVENT
      =============================== */
      await client.query(
        `INSERT INTO registration_events
         (registration_id, event_id, role, team_name, team_code, registration_mode)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          registrationId,
          event.id,
          finalRole,
          finalTeamName,
          finalTeamCode,
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
       SIDE EFFECTS (OUTSIDE TX)
    =============================== */
    const eventsList = responseEvents.map(e => e.event_name).join(", ");

    appendToGoogleSheet({
      email,
      name,
      college,
      year: student_year,
      events: eventsList,
      food
    }).catch(console.error);

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

    return res.status(201).json({
      success: true,
      receipt
    });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err); // 🔥 centralized error handling
  } finally {
    client.release(); // 🔓 IMPORTANT
  }
}

module.exports = { register };
