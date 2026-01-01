const { ValidationError } = require("../errors/error");

function validateReserveSlots(req, res, next) {
  const { email, events } = req.body;

  if (!email || !Array.isArray(events) || events.length === 0) {
    return next(
      ValidationError("Invalid reservation request")
    );
  }

  next();
}

function validateReleaseReservation(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return next(
      ValidationError("Email is required to release reservation")
    );
  }

  next();
}

module.exports = {
  validateReserveSlots,
  validateReleaseReservation
};
