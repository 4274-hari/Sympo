const express = require("express");

const router = express.Router();


const {eventdetails} = require('../controllers/event_details_controllers');


router.get('/event',eventdetails);

module.exports = router;