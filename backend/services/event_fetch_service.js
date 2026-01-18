const { getClient } = require("../config/db");

async function fetchCoordinatorParticipants(role) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    /* =====================================================
       🔹 ALL CHECKED-IN PARTICIPANTS
    ===================================================== */
    const participantsResult = await client.query(
      `
      SELECT DISTINCT
        r.id AS registration_id,
        r.name,
        r.phone AS mobile,
        r.email,
        r.college,
        r.student_year AS year,
        re.session
      FROM events e
      JOIN registration_events re ON re.event_id = e.id
      JOIN registrations r ON r.id = re.registration_id
      WHERE
        e.event_name = $1
        AND r.checkin = true
      ORDER BY r.name
      `,
      [role]
    );

 

    /* =====================================================
       🌅 MORNING SESSION PARTICIPANTS
    ===================================================== */
    const morningParticipantsResult = await client.query(
      `
      SELECT DISTINCT
        r.id AS registration_id,
        r.name,
        re.team_name
      FROM events e
      JOIN registration_events re ON re.event_id = e.id
      JOIN registrations r ON r.id = re.registration_id
      WHERE
        e.event_name = $1
        AND r.checkin = true
        AND re.session = 'morning'
      ORDER BY r.name
      `,
      [role]
    );

    /* =====================================================
       🌆 AFTERNOON SESSION PARTICIPANTS
    ===================================================== */
    const afternoonParticipantsResult = await client.query(
      `
      SELECT DISTINCT
        r.id AS registration_id,
        r.name,
        re.team_name
      FROM events e
      JOIN registration_events re ON re.event_id = e.id
      JOIN registrations r ON r.id = re.registration_id
      WHERE
        e.event_name = $1
        AND r.checkin = true
        AND re.session = 'afternoon'
      ORDER BY r.name
      `,
      [role]
    );

    await client.query("COMMIT");

    return {
      totalCount: participantsResult.rowCount,
      participants: participantsResult.rows,
      morningSessionParticipants: {
        count: morningParticipantsResult.rowCount,
        data: morningParticipantsResult.rows
      },
      afternoonSessionParticipants: {
        count: afternoonParticipantsResult.rowCount,
        data: afternoonParticipantsResult.rows
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
  fetchCoordinatorParticipants
};
