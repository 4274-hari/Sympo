const { query } = require("../config/db");
const crypto = require("crypto");

async function register(req, res) {
  try {
    const { name, email, phone, college, student_year, food, events } =
      req.body;

    if (!name || !email || !phone || !college || !student_year || !food) {
      return res.status(400).json({ message: "Missing registration details" });
    }

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ message: "Select at least one event" });
    }

    const emailExists = await query(
      `SELECT 1 FROM registrations WHERE email = $1`,
      [email]
    );

    if (emailExists.rowCount > 0) {
      return res.status(400).json({
        message: "This email has already been registered",
      });
    }

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
       STEP 3: PROCESS EACH EVENT
    =============================== */
    for (const ev of events) {
      const { event_name, role, team_name, team_code } = ev;

      const eventRes = await query(
        `SELECT id, event_type, teammembers
         FROM events WHERE event_name = $1`,
        [event_name]
      );

      if (eventRes.rowCount === 0) {
        return res.status(400).json({
          message: `Invalid event: ${event_name}`,
        });
      }

      const event = eventRes.rows[0];
      let finalRole = null;
      let finalTeamName = null;
      let finalTeamCode = null;

      /* ========== TEAM EVENT ========== */
      if (event.event_type === "team") {
        if (!role || !team_name) {
          return res.status(400).json({
            message: `Role and team name required for ${event_name}`,
          });
        }

        finalRole = role;
        finalTeamName = team_name;

        // 👑 TEAM LEAD
        if (role === "lead") {
          finalTeamCode = crypto.randomBytes(3).toString("hex").toUpperCase();
        }

        // 👤 TEAM MEMBER
        if (role === "member") {
          if (!team_code) {
            return res.status(400).json({
              message: `Team code required for ${event_name}`,
            });
          }

          // validate team lead exists
          const leadCheck = await query(
            `SELECT 1 FROM registration_events
             WHERE event_id = $1
               AND team_code = $2
               AND role = 'lead'`,
            [event.id, team_code]
          );

          if (leadCheck.rowCount === 0) {
            return res.status(400).json({
              message: `Invalid team code for ${event_name}`,
            });
          }

          // enforce team size
          const countRes = await query(
            `SELECT COUNT(*) FROM registration_events
             WHERE event_id = $1
               AND team_code = $2`,
            [event.id, team_code]
          );

          if (parseInt(countRes.rows[0].count) >= event.teammembers) {
            return res.status(400).json({
              message: `Team full for ${event_name}`,
            });
          }

          finalTeamCode = team_code;
        }
      }

      /* ========== INSERT EVENT ========= */
      await query(
        `INSERT INTO registration_events
         (registration_id,event_id,role,team_name,team_code)
         VALUES ($1,$2,$3,$4,$5)`,
        [registrationId, event.id, finalRole, finalTeamName, finalTeamCode]
      );


      responseEvents.push({
        event_name,
        role: finalRole,
        team_code: role === "lead" ? finalTeamCode : undefined,
      });
    }

    /* ===============================
       FINAL RESPONSE
    =============================== */
    return res.status(201).json({
      message: "Registration successful",
      registration_id: registrationId,
      events: responseEvents,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register };
