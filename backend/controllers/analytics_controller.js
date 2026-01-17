const { getAdminAnalytics } = require("../services/analytics_service");

async function getAnalytics(req, res, next) {
  try {
    const { date } = req.query;

    const data = await getAdminAnalytics(date);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics };
