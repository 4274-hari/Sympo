const express = require("express")
const router = express.Router();

//Routings import

const formroute = require('./form_route')
const foodroute = require('./food_route')
const paymentroute = require('./payment_route')


// router.get("", (req, res) => {
//   res.send("🚀 Server is running");
// });

router.use("",formroute)
router.use('',foodroute)
router.use('',paymentroute)



module.exports = router;