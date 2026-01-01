function errorHandler(err, req, res, next) {
  console.error("🔥 ERROR:", err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // unexpected bug
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

module.exports = errorHandler;
