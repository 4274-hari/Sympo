const {
  registerParticipantToEventService
} = require("../services/event_insert_service");

/**
 * POST /api/coordinator/register-participant
 * Body:
 * {
 *   "participant_id": number,
 *   "team_name": string
 * }
 */
async function registerParticipantToEvent(req, res, next) {
  try {
    const role = req.session?.user.role; // event name
    let { participant_id, team_name } = req.body;

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

    if (!participant_id) {
      return res.status(400).json({
        success: false,
        message: "Participant ID required"
      });
    }

    const result = await registerParticipantToEventService(
      role,
      participant_id,
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
