const express = require("express")
const router = express.Router();

//Routings import

const formroute = require('./form_route')
const paymentroute = require('./payment_route')
const authroute = require('./auth_routes')


// router.get("", (req, res) => {
//   res.send("🚀 Server is running");
// });

router.use("",formroute)
router.use('',paymentroute)
router.use('',authroute)



module.exports = router;