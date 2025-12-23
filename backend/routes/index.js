const express = require("express")
const router = express.Router();

//Routings import

const formroute = require('./form_routes')
const eventroute = require('./event_routes')



// router.get("", (req, res) => {
//   res.send("🚀 Server is running");
// });

router.use("",formroute)

router.use("",eventroute)


module.exports = router;