const { query } = require("../config/db");

async function getAllEventsLiveSlots(req, res) {
  try {
    // 1️⃣ Fetch all events
    const eventsRes = await query(
      `SELECT id, event_name, event_type,event_mode, max_teams, max_online_teams
       FROM events
       ORDER BY event_name`
    );

    const events = eventsRes.rows;

    // 2️⃣ Build live slot data for each event
    const result = [];

    for (const event of events) {

      const countCondition =
        event.event_type === "team"
          ? "AND role = 'lead'"
          : "";

      // 🔒 Total registrations
      const totalRes = await query(
        `SELECT COUNT(*) FROM registration_events
         WHERE event_id = $1 ${countCondition}`,
        [event.id]
      );

      const totalRegistered = parseInt(totalRes.rows[0].count);
      const remainingSlots = event.max_teams - totalRegistered;

      // 🌐 Online registrations
      const onlineRes = await query(
        `SELECT COUNT(*) FROM registration_events
         WHERE event_id = $1
           ${countCondition}
           AND registration_mode = 'online'`,
        [event.id]
      );

      const onlineRegistered = parseInt(onlineRes.rows[0].count);
      const onlineRemaining = event.max_online_teams - onlineRegistered;

      // ⚠️ Status logic
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

    res.json({
      success: true,
      count: result.length,
      events: result
    });

  } catch (err) {
    console.error("Live Slots Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event slot status"
    });
  }
}

module.exports = {
  getAllEventsLiveSlots
};
