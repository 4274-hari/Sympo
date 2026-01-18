const {
  registerParticipantsToEventService
} = require("../services/event_insert_service");

/**
 * POST /api/coordinator/register-participant
 * Body:
 * {
 *   "participant_ids": number[],
 *   "team_name": string | null
 * }
 */
async function registerParticipantToEvent(req, res, next) {
  try {
    const role = req.session?.user.role;
    let { participant_ids, team_name } = req.body;

    // Normalize empty string to NULL
    team_name =
      typeof team_name === "string" && team_name.trim() === ""
        ? null
        : team_name;

    if (!role) {
      return res.status(403).json({
        success: false,
        message: "Coordinator role not found in session"
      });
    }

    if (!Array.isArray(participant_ids) || participant_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "participant_ids must be a non-empty array"
      });
    }

    const result = await registerParticipantsToEventService(
      role,
      participant_ids,
      team_name
    );

    return res.status(result.status).json(result.response);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerParticipantToEvent
};