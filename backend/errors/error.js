class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

/* -------- FACTORY FUNCTIONS -------- */

const ValidationError = (message) =>
  new AppError(message, 400);

const ConflictError = (message) =>
  new AppError(message, 409);

const AuthError = (message) =>
  new AppError(message, 401);

const ForbiddenError = (message) =>
  new AppError(message, 403);

module.exports = {
  AppError,
  ValidationError,
  ConflictError,
  AuthError,
  ForbiddenError
};
