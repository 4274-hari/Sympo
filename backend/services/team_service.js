const crypto = require("crypto");
const {
  ValidationError,
  ConflictError
} = require("../errors/error");

/* ===============================
   RESOLVE TEAM REGISTRATION
=============================== */
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

  /* -----------------------------
     NOT A TEAM EVENT
  ----------------------------- */
  if (event.event_type !== "team") {
    return { finalRole, finalTeamName, finalTeamCode };
  }

  if (!role) {
    throw ValidationError("Role is required for team events");
  }

  finalRole = role;

  /* -----------------------------
     👑 TEAM LEAD
  ----------------------------- */
  if (role === "lead") {
    if (!team_name || team_name.trim().length < 3) {
      throw ValidationError("Invalid team name");
    }

    /* 🔒 Lock existing team names */
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
    finalTeamCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();
  }

  /* -----------------------------
     👤 TEAM MEMBER
  ----------------------------- */
  if (role === "member") {
    if (!team_code) {
      throw ValidationError("Team code is required");
    }

    /* 🔒 Lock the team row */
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

module.exports = { resolveTeamRegistration };
