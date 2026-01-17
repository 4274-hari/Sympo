const { getClient } = require("../config/db");

async function registerParticipantToEventService(role, participant_id, team_name) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       1️⃣ GET EVENT ID FROM ROLE (EVENT NAME)
    ===================================================== */
    const eventResult = await client.query(
      `
      SELECT id
      FROM events
      WHERE event_name = $1
      `,
      [role]
    );

    if (eventResult.rowCount === 0) {
      throw new Error("Event not found for coordinator role");
    }

    const eventId = eventResult.rows[0].id;

    /* =====================================================
       2️⃣ CHECK IF PARTICIPANT ALREADY REGISTERED
    ===================================================== */
    const participantExists = await client.query(
      `
      SELECT 1
      FROM registration_events
      WHERE registration_id = $1
        AND event_id = $2
      `,
      [participant_id, eventId]
    );

    if (participantExists.rowCount > 0) {
      return {
        status: 409,
        response: {
          success: false,
          message: "Participant is already registered for this event"
        }
      };
    }

    /* =====================================================
       3️⃣ CHECK IF TEAM NAME ALREADY EXISTS
    ===================================================== */
    const teamExists = await client.query(
      `
      SELECT 1
      FROM registration_events
      WHERE event_id = $1
        AND team_name = $2
      `,
      [eventId, team_name]
    );

    if (teamExists.rowCount > 0) {
      return {
        status: 409,
        response: {
          success: false,
          message: "Team name already exists"
        }
      };
    }

    /* =====================================================
       4️⃣ INSERT INTO REGISTRATION_EVENTS
    ===================================================== */
    await client.query(
      `
      INSERT INTO registration_events (
        registration_id,
        event_id,
        team_name,
        role,
        registration_mode
      )
      VALUES ($1, $2, $3, 'lead', 'onspot')
      `,
      [participant_id, eventId, team_name]
    );

    await client.query("COMMIT");

    return {
      status: 201,
      response: {
        success: true,
        message: "Participant successfully added to event",
        data: {
          participant_id,
          event: role,
          team_name
        }
      }
    };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  registerParticipantToEventService
};
