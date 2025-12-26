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
  try {
    /* ===============================
       BEGIN TRANSACTION
    =============================== */
    await query("BEGIN");

    const { name, email, phone, college, student_year, food, events, registration_mode } = req.body;

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

      const isIndividual = event.event_type === "individual";
const isTeamLead = event.event_type === "team" && role === "lead";

/* ===============================
   LIMIT CHECK (INDIVIDUAL OR TEAM LEAD)
=============================== */
if (isIndividual || isTeamLead) {

  // 🔒 TOTAL LIMIT
  const totalRes = await query(
    `SELECT COUNT(*) FROM registration_events
     WHERE event_id = $1`,
    [event.id]
  );

  const totalCount = parseInt(totalRes.rows[0].count);

  if (totalCount >= event.max_teams) {
    throw new Error(`"${event_name}" is already full`);
  }

  // 🌐 ONLINE LIMIT
  if (registration_mode === "online") {
    const onlineRes = await query(
      `SELECT COUNT(*) FROM registration_events
       WHERE event_id = $1
         AND registration_mode = 'online'`,
      [event.id]
    );

    const onlineCount = parseInt(onlineRes.rows[0].count);

    if (onlineCount >= event.max_online_teams) {
      throw new Error(
        `"${event_name}" online slots are full. Please register on-spot.`
      );
    }
  }
}


      let finalRole = null;
      let finalTeamName = null;
      let finalTeamCode = null;

      if (event.event_type === "team") {
        if (!role) {
          throw new Error(`Role required for ${event_name}`);
        }

        finalRole = role;

        /* 👑 TEAM LEAD */
        if (role === "lead") {
          if (!isValidTeamName(team_name)) {
            throw new Error(`Invalid team name for ${event_name}`);
          }

          const teamNameExists = await query(
            `SELECT 1 FROM registration_events
             WHERE event_id = $1
               AND LOWER(team_name) = LOWER($2)`,
            [event.id, team_name.trim()]
          );

          if (teamNameExists.rowCount > 0) {
            throw new Error(
              `Team name "${team_name}" already exists for ${event_name}`
            );
          }




          finalTeamName = team_name.trim();
          finalTeamCode = crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();
        }

        /* 👤 TEAM MEMBER */
        if (role === "member") {
          if (!team_code) {
            throw new Error(`Team code required for ${event_name}`);
          }

          const leadRes = await query(
            `SELECT team_name FROM registration_events
             WHERE event_id = $1
               AND team_code = $2
               AND role = 'lead'`,
            [event.id, team_code]
          );

          if (leadRes.rowCount === 0) {
            throw new Error(`Invalid team code for ${event_name}`);
          }

          const countRes = await query(
            `SELECT COUNT(*) FROM registration_events
             WHERE event_id = $1 AND team_code = $2`,
            [event.id, team_code]
          );

          if (parseInt(countRes.rows[0].count) >= event.teammembers) {
            throw new Error(`Team full for ${event_name}`);
          }

          finalTeamCode = team_code;
          finalTeamName = leadRes.rows[0].team_name;
        }
      }

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

    return res.status(201).json({
      message: "Registration successful",
      registration_id: registrationId,
      events: responseEvents,
    });

  } catch (err) {
    await query("ROLLBACK");

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
