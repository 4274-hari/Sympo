const express = require('express');
const router = express.Router();
const {register} = require("../controllers/form_controllers")

// router.all("/register", (req, res) => {
//   res.json({ method: req.method });
// });


router.post('/register',register)

module.exports = router;