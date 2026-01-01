const crypto = require("crypto");
const {
  ValidationError,
  ConflictError
} = require("../errors/error");

/* =====================================================
   FINAL REGISTRATION TEAM RESOLVER (DO NOT CHANGE)
   ✔ Used ONLY in register controller
   ✔ Reads ONLY registration_events
   ✔ Enforces team size
===================================================== */
async function resolveTeamRegistration({
  client,
  event,
  role,
  team_name,
  team_code
}) {
  let finalRole = null;
  let finalTeamName = null;
  let finalTeamCode = null;

  if (event.event_type !== "team") {
    return { finalRole, finalTeamName, finalTeamCode };
  }

  if (!role) {
    throw ValidationError("Role is required for team events");
  }

  finalRole = role;

  /* 👑 TEAM LEAD */
  if (role === "lead") {
    if (!team_name || team_name.trim().length < 3) {
      throw ValidationError("Invalid team name");
    }

    const exists = await client.query(
      `SELECT 1 FROM registration_events
       WHERE event_id = $1
         AND LOWER(team_name) = LOWER($2)
       FOR UPDATE`,
      [event.id, team_name.trim()]
    );

    if (exists.rowCount > 0) {
      throw ConflictError("Team name already exists");
    }

    finalTeamName = team_name.trim();
    finalTeamCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  /* 👤 TEAM MEMBER */
  if (role === "member") {
    if (!team_code) {
      throw ValidationError("Team code is required");
    }

    const lead = await client.query(
      `SELECT team_name FROM registration_events
       WHERE event_id = $1
         AND team_code = $2
         AND role = 'lead'
       FOR UPDATE`,
      [event.id, team_code]
    );

    if (lead.rowCount === 0) {
      throw ValidationError("Invalid team code");
    }

    const count = await client.query(
      `SELECT COUNT(*) FROM registration_events
       WHERE event_id = $1
         AND team_code = $2
       FOR UPDATE`,
      [event.id, team_code]
    );

    if (Number(count.rows[0].count) >= event.teammembers) {
      throw ConflictError("Team is already full");
    }

    finalTeamCode = team_code;
    finalTeamName = lead.rows[0].team_name;
  }

  return { finalRole, finalTeamName, finalTeamCode };
}

/* =====================================================
   SLOT RESERVATION TEAM RESOLVER (NEW)
   ✔ Used ONLY in slot reservation
   ✔ Reads registration_events + slot_reservations
   ✔ DOES NOT enforce team size
===================================================== */
async function resolveTeamReservation({
  client,
  event,
  role,
  team_name,
  team_code
}) {
  let finalRole = null;
  let finalTeamName = null;
  let finalTeamCode = null;

  if (event.event_type !== "team") {
    return { finalRole, finalTeamName, finalTeamCode };
  }

  if (!role) {
    throw ValidationError("Role is required for team event");
  }

  finalRole = role;

  /* =================================================
     🔐 STEP 1: LOCK TABLE ROWS (NO UNION)
  ================================================= */
  await client.query(
    `SELECT 1 FROM registration_events WHERE event_id = $1 FOR UPDATE`,
    [event.id]
  );

  await client.query(
    `SELECT 1 FROM slot_reservations WHERE event_id = $1 FOR UPDATE`,
    [event.id]
  );

  /* =================================================
     👑 TEAM LEAD LOGIC
  ================================================= */
  if (role === "lead") {
    if (!team_name || team_name.trim().length < 3) {
      throw ValidationError("Valid team name required");
    }

    finalTeamName = team_name.trim();
    finalTeamCode = crypto.randomBytes(3).toString("hex");

    /* 🔍 STEP 2: CHECK EXISTING TEAMS (NO LOCK HERE) */
    const exists = await client.query(
      `
      SELECT 1 FROM (
        SELECT team_name
        FROM registration_events
        WHERE event_id = $1 AND team_name IS NOT NULL

        UNION

        SELECT team_name
        FROM slot_reservations
        WHERE event_id = $1 AND team_name IS NOT NULL
      ) t
      WHERE LOWER(team_name) = LOWER($2)
      `,
      [event.id, finalTeamName]
    );

    if (exists.rowCount > 0) {
      throw ConflictError("Team name already exists");
    }
  }

  /* =================================================
     👥 TEAM MEMBER LOGIC
  ================================================= */
  if (role === "member") {
    if (!team_code) {
      throw ValidationError("Team code required to join team");
    }

    const team = await client.query(
      `
      SELECT team_name, team_code FROM (
        SELECT team_name, team_code
        FROM registration_events
        WHERE event_id = $1

        UNION

        SELECT team_name, team_code
        FROM slot_reservations
        WHERE event_id = $1
      ) t
      WHERE team_code = $2
      `,
      [event.id, team_code]
    );

    if (team.rowCount === 0) {
      throw ValidationError("Invalid team code");
    }

    finalTeamName = team.rows[0].team_name;
    finalTeamCode = team_code;
  }

  return {
    finalRole,
    finalTeamName,
    finalTeamCode
  };
}


module.exports = {
  resolveTeamRegistration,   // 🔒 FINAL
  resolveTeamReservation    // 🔓 TEMPORARY
};
