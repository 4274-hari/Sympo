const { ConflictError } = require("../errors/error");

/* ===============================
   CHECK SLOT AVAILABILITY
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

  /* 🔒 TOTAL LIMIT */
  const totalRes = await client.query(
    `SELECT COUNT(*) FROM registration_events
     WHERE event_id = $1 ${countCondition}`,
    [event.id]
  );

  const totalCount = Number(totalRes.rows[0].count);

  if (totalCount >= event.max_teams) {
    throw ConflictError(`"${event_name}" is already full`);
  }

  /* 🌐 ONLINE LIMIT */
  if (registration_mode === "online") {
    const onlineRes = await client.query(
      `SELECT COUNT(*) FROM registration_events
       WHERE event_id = $1
         ${countCondition}
         AND registration_mode = 'online'`,
      [event.id]
    );

    const onlineCount = Number(onlineRes.rows[0].count);

    if (onlineCount >= event.max_online_teams) {
      throw ConflictError(
        `"${event_name}" online slots are full. Please register on-spot.`
      );
    }
  }
}

module.exports = { checkSlotAvailability };
