const { getClient } = require("../config/db");

async function registerParticipantsToEventService(role, participant_ids, team_name) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       1️⃣ GET EVENT ID FROM ROLE
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
       2️⃣ CHECK DUPLICATE PARTICIPANTS
    ===================================================== */
    const duplicateParticipants = await client.query(
      `
      SELECT registration_id
      FROM registration_events
      WHERE event_id = $1
        AND registration_id = ANY($2::int[])
      `,
      [eventId, participant_ids]
    );

    if (duplicateParticipants.rowCount > 0) {
      return {
        status: 409,
        response: {
          success: false,
          message: "Some participants are already registered",
          duplicate_participants: duplicateParticipants.rows.map(
            r => r.registration_id
          )
        }
      };
    }

    /* =====================================================
       3️⃣ CHECK TEAM NAME (ONLY ONCE)
    ===================================================== */
    if (team_name) {
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
    }

    /* =====================================================
      4️⃣ BULK INSERT
    ===================================================== */
    const insertQuery = `
      INSERT INTO registration_events (
        registration_id,
        event_id,
        team_name,
        role,
        registration_mode
      )
      SELECT
        pid,
        $2,
        $3,
        CASE
          WHEN ord = 1 THEN 'lead'
          ELSE 'member'
        END,
        'onspot'
      FROM unnest($1::int[]) WITH ORDINALITY AS u(pid, ord)
    `;

    await client.query(insertQuery, [
      participant_ids,
      eventId,
      team_name
    ]);

    await client.query("COMMIT");

    return {
      status: 201,
      response: {
        success: true,
        message: "Participants successfully added to event",
        data: {
          event: role,
          team_name,
          participant_ids
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
  registerParticipantsToEventService
};