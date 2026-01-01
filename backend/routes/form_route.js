const express = require('express');
const router = express.Router();
const {register} = require("../controllers/form_controller")
const { getAllEventsLiveSlots, releaseReservation, reserveSlots } = require('../controllers/slots_controller');
const {
  validateReserveSlots,
  validateReleaseReservation
} = require("../validators/slot_validator");



// router.all("/register", (req, res) => {
//   res.json({ method: req.method });
// });


router.post('/register',register)
router.get('/events/live_slots',getAllEventsLiveSlots)
router.post("/reserve-slots", validateReserveSlots, reserveSlots);
router.post("/release-reservation", validateReleaseReservation, releaseReservation);

module.exports = router;