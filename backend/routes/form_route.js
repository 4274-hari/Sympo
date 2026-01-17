const express = require('express');
const router = express.Router();
const {register} = require("../controllers/form_controller")
const { getAllEventsLiveSlots, releaseReservation, reserveSlots } = require('../controllers/slots_controller');
const {
  validateReserveSlots,
  validateReleaseReservation
} = require("../validators/slot_validator");
const { getTeamSlots } = require('../controllers/check_team_code_controller');



// router.all("/register", (req, res) => {
//   res.json({ method: req.method });
// });


router.post('/register',register)
router.get('/events/live_slots',getAllEventsLiveSlots)
router.post('/check-team-code', getTeamSlots)
router.post("/reserve-slots", validateReserveSlots, reserveSlots);
router.post("/release-reservation", validateReleaseReservation, releaseReservation);

module.exports = router;