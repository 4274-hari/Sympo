const {
  fetchCoordinatorParticipants
} = require("../services/event_fetch_service");

/**
 * GET /api/coordinator/participants
 * Role is taken from session (event name)
 */
async function getCoordinatorParticipants(req, res, next) {
  try {
    const role = req.session?.user.role; // event name

    if (!role) {
      return res.status(403).json({
        success: false,
        message: "Coordinator role not found in session"
      });
    }

    const result = await fetchCoordinatorParticipants(role);

    return res.status(200).json({
      success: true,
      event: role,
      totalCount: result.totalCount,
      participants: result.participants,
      morningSessionParticipants: result.morningSessionParticipants,
      afternoonSessionParticipants: result.afternoonSessionParticipants
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCoordinatorParticipants
};
