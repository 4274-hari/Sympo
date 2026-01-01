const express = require('express');
const router = express.Router();
const {register} = require("../controllers/form_controllers")
const {getAllEventsLiveSlots}= require("../controllers/slots_controllers");
const { releaseReservation, reserveSlots } = require('../controllers/slot_reservation_controller');


// router.all("/register", (req, res) => {
//   res.json({ method: req.method });
// });


router.post('/register',register)
router.get('/events/live_slots',getAllEventsLiveSlots)
router.post('/release-reservation', releaseReservation)
router.post('/reserve-slots', reserveSlots)

module.exports = router;