const express = require("express")
const router = express.Router();

//Routings import

const formroute = require('./form_routes')
const eventroute = require('./event_routes')
const foodroute = require('./food_routes')
const paymentroute = require('./payment_routes')
const secondary = require('./secondary_mail_routes')


// router.get("", (req, res) => {
//   res.send("🚀 Server is running");
// });

router.use("",formroute)
router.use("",eventroute)
router.use('',foodroute)
router.use('',paymentroute)
router.use('',secondary)



module.exports = router;