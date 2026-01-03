const { getClient } = require("../config/db");
const {
  ValidationError,
  ConflictError
} = require("../errors/error");

const {
  resolveTeamReservation
} = require("../services/team_service");

/* ===============================
   RESERVE SLOTS (TEMPORARY)
=============================== */
async function reserveSlotsService({ email, events, registration_mode }) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* 🔹 Clear expired + old reservations */
    await client.query(
      `DELETE FROM slot_reservations WHERE expires_at < NOW()`
    );

    await client.query(
      `DELETE FROM slot_reservations WHERE email = $1`,
      [email]
    );

    for (const ev of events) {
      const { event_name, role, team_name, team_code, session } = ev;

      /* 1️⃣ Get event */
      const eventRes = await client.query(
        `SELECT id, event_type, max_teams, max_online_teams, teammembers
         FROM events WHERE event_name = $1`,
        [event_name]
      );

      if (eventRes.rowCount === 0) {
        throw ValidationError(`Invalid event: ${event_name}`);
      }

      const event = eventRes.rows[0];
      const isIndividual = event.event_type === "individual";
      const isTeamLead = event.event_type === "team" && role === "lead";

      /* =================================================
         🔐 LOCK EXISTING ROWS (CRITICAL FIX)
      ================================================= */
      if (isIndividual || isTeamLead) {
        // Lock registrations
        await client.query(
          `SELECT 1 FROM registration_events WHERE event_id = $1 FOR UPDATE`,
          [event.id]
        );

        // Lock reservations
        await client.query(
          `SELECT 1 FROM slot_reservations WHERE event_id = $1 FOR UPDATE`,
          [event.id]
        );

        /* 2️⃣ TOTAL SLOT CHECK */
        const totalRes = await client.query(
          `
          SELECT
            (SELECT COUNT(*) FROM registration_events WHERE event_id = $1)
          + (SELECT COUNT(*) FROM slot_reservations WHERE event_id = $1)
          AS total
          `,
          [event.id]
        );

        if (+totalRes.rows[0].total >= event.max_teams) {
          throw ConflictError(`"${event_name}" is already full`);
        }

        /* 3️⃣ ONLINE SLOT CHECK */
        if (registration_mode === "online") {
          const onlineRes = await client.query(
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

          if (+onlineRes.rows[0].total >= event.max_online_teams) {
            throw ConflictError(`"${event_name}" online slots are full`);
          }
        }
      }

      /* =================================================
         4️⃣ TEAM LOGIC (SAFE NOW)
      ================================================= */
      const {
        finalRole,
        finalTeamName,
        finalTeamCode
      } = await resolveTeamReservation({
        client,
        event,
        role,
        team_name,
        team_code
      });

      /* =================================================
         5️⃣ INSERT RESERVATION
      ================================================= */
      await client.query(
        `
        INSERT INTO slot_reservations
        (email, event_id, role, team_name, team_code, registration_mode, session, expires_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7, NOW() + INTERVAL '30 minutes')
        `,
        [
          email,
          event.id,
          finalRole,
          finalTeamName,
          finalTeamCode,
          registration_mode,
          session || null
        ]
      );
    }

    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


/* ===============================
   RELEASE RESERVATION
=============================== */
async function releaseReservationService(email) {
  const client = await getClient();
  try {
    const result = await client.query(
      `DELETE FROM slot_reservations WHERE email = $1`,
      [email]
    );
    return result.rowCount;
  } finally {
    client.release();
  }
}

/* ===============================
   CHECK SLOT AVAILABILITY (FINAL REG)
=============================== */
async function checkSlotAvailability({
  client,
  event,
  registration_mode,
  event_name
}) {
  const countCondition =
    event.event_type === "team"
      ? "AND role = 'lead'"
      : "";

  const totalRes = await client.query(
    `SELECT COUNT(*) FROM registration_events
     WHERE event_id = $1 ${countCondition}`,
    [event.id]
  );

  if (+totalRes.rows[0].count >= event.max_teams) {
    throw ConflictError(`"${event_name}" is already full`);
  }

  if (registration_mode === "online") {
    const onlineRes = await client.query(
      `SELECT COUNT(*) FROM registration_events
       WHERE event_id = $1
         ${countCondition}
         AND registration_mode = 'online'`,
      [event.id]
    );

    if (+onlineRes.rows[0].count >= event.max_online_teams) {
      throw ConflictError(
        `"${event_name}" online slots are full. Please register on-spot.`
      );
    }
  }
}

module.exports = {
  reserveSlotsService,
  releaseReservationService,
  checkSlotAvailability
};
