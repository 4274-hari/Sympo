const { query } = require("../config/db");
const crypto = require("crypto");

async function reserveSlots(req, res) {
  const { email, events, registration_mode } = req.body;

  if (!email || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ message: "Invalid reservation request" });
  }

  try {
    await query("BEGIN");

    // 🔹 clear expired locks
    await query(`DELETE FROM slot_reservations WHERE expires_at < NOW()`);
    await query(`DELETE FROM slot_reservations WHERE email = $1`, [email]);

    for (const ev of events) {
      const { event_name, role, team_name, team_code } = ev;

      // 1️⃣ Get event
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

      // 2️⃣ SLOT COUNT (registrations + active reservations)
      if (isIndividual || isTeamLead) {
        const totalRes = await query(
          `
          SELECT
            (SELECT COUNT(*) FROM registration_events WHERE event_id = $1)
          + (SELECT COUNT(*) FROM slot_reservations WHERE event_id = $1)
          AS total
          `,
          [event.id]
        );

        if (parseInt(totalRes.rows[0].total) >= event.max_teams) {
          throw new Error(`"${event_name}" is already full`);
        }

        if (registration_mode === "online") {
          const onlineRes = await query(
            `
            SELECT
              (SELECT COUNT(*) FROM registration_events
               WHERE event_id = $1 AND registration_mode = 'online')
            + (SELECT COUNT(*) FROM slot_reservations
               WHERE event_id = $1 AND registration_mode = 'online')
            AS total
            `,
            [event.id]
          );

          if (parseInt(onlineRes.rows[0].total) >= event.max_online_teams) {
            throw new Error(`"${event_name}" online slots are full`);
          }
        }
      }

      // 3️⃣ TEAM VALIDATION
      let finalTeamName = null;
      let finalTeamCode = null;

      if (event.event_type === "team") {
        if (!role) throw new Error(`Role required for ${event_name}`);

        if (role === "lead") {
          if (!team_name || team_name.trim().length < 3) {
            throw new Error(`Invalid team name for ${event_name}`);
          }

          // check team name across registrations + reservations
          const teamExists = await query(
            `
            SELECT 1 FROM (
              SELECT team_name FROM registration_events WHERE event_id = $1
              UNION
              SELECT team_name FROM slot_reservations WHERE event_id = $1
            ) t
            WHERE LOWER(team_name) = LOWER($2)
            `,
            [event.id, team_name.trim()]
          );

          if (teamExists.rowCount > 0) {
            throw new Error(`Team name "${team_name}" already exists`);
          }

          finalTeamName = team_name.trim();
          finalTeamCode = crypto.randomBytes(3).toString("hex").toUpperCase();
        }

        if (role === "member") {
          if (!team_code) {
            throw new Error(`Team code required for ${event_name}`);
          }

          const leadRes = await query(
            `
            SELECT team_name FROM registration_events
            WHERE event_id = $1 AND team_code = $2 AND role = 'lead'
            UNION
            SELECT team_name FROM slot_reservations
            WHERE event_id = $1 AND team_code = $2 AND role = 'lead'
            `,
            [event.id, team_code]
          );

          if (leadRes.rowCount === 0) {
            throw new Error(`Invalid team code for ${event_name}`);
          }

          finalTeamCode = team_code;
          finalTeamName = leadRes.rows[0].team_name;
        }
      }

      // 4️⃣ INSERT RESERVATION
      await query(
        `
        INSERT INTO slot_reservations
        (email,event_id,role,team_name,team_code,registration_mode,expires_at)
        VALUES ($1,$2,$3,$4,$5,$6, NOW() + INTERVAL '10 minutes')
        `,
        [email, event.id, role || null, finalTeamName, finalTeamCode, registration_mode]
      );
    }

    await query("COMMIT");
    res.json({ success: true });

  } catch (err) {
    await query("ROLLBACK");
    return res.status(400).json({ message: err.message });
  }
}

async function releaseReservation(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required to release reservation",
    });
  }

  try {
    const result = await query(
      `DELETE FROM slot_reservations WHERE email = $1`,
      [email]
    );

    return res.status(200).json({
      success: true,
      released: result.rowCount,
      message: "Reservation released successfully",
    });

  } catch (err) {
    console.error("Release Reservation Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to release reservation",
    });
  }
}

module.exports = { reserveSlots, releaseReservation };