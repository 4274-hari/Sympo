const { query } = require("../config/db");
const { ValidationError } = require("../errors/error");

async function getAllEventsLiveSlots(req, res, next) {
  try {
    /* ===============================
       FETCH EVENTS
    =============================== */
    const eventsRes = await query(
      `SELECT id, event_name, event_type, event_mode,
              max_teams, max_online_teams
       FROM events
       ORDER BY event_name`
    );

    const events = eventsRes.rows;

    if (events.length === 0) {
      throw ValidationError("No events found");
    }

    const result = [];

    /* ===============================
       BUILD LIVE SLOT DATA
    =============================== */
    for (const event of events) {

      const countCondition =
        event.event_type === "team"
          ? "AND role = 'lead'"
          : "";

      /* -------- TOTAL REGISTRATIONS -------- */
      const totalRes = await query(
        `SELECT COUNT(*) FROM registration_events
         WHERE event_id = $1 ${countCondition}`,
        [event.id]
      );

      const totalRegistered = Number(totalRes.rows[0].count);
      const remainingSlots = event.max_teams - totalRegistered;

      /* -------- ONLINE REGISTRATIONS -------- */
      const onlineRes = await query(
        `SELECT COUNT(*) FROM registration_events
         WHERE event_id = $1
           ${countCondition}
           AND registration_mode = 'online'`,
        [event.id]
      );

      const onlineRegistered = Number(onlineRes.rows[0].count);
      const onlineRemaining = event.max_online_teams - onlineRegistered;

      /* -------- STATUS LOGIC -------- */
      let status = "AVAILABLE";
      let message = "Slots available";

      if (remainingSlots <= 0) {
        status = "FULL";
        message = "Registrations closed";
      } else if (remainingSlots <= 3) {
        status = "HURRY_UP";
        message = `Hurry up! Only ${remainingSlots} slots left`;
      }

      result.push({
        event_name: event.event_name,
        event_type: event.event_type,
        event_mode: event.event_mode,
        totalSlots: event.max_teams,
        registered: totalRegistered,
        remainingSlots,
        onlineSlots: event.max_online_teams,
        onlineRegistered,
        onlineRemaining,
        status,
        message
      });
    }

    /* ===============================
       RESPONSE
    =============================== */
    return res.status(200).json({
      success: true,
      count: result.length,
      events: result
    });

  } catch (err) {
    next(err); // 🔥 centralized error handling
  }
}

module.exports = {
  getAllEventsLiveSlots
};
