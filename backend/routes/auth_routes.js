const router = require("express").Router();
const {login,logout} = require("../controllers/auth_controller");
const { scanFoodQR } = require("../controllers/qr_controller");
const allowRoles = require ("../middlewares/role_access")
const auth = require('../middlewares/auth_middleware');
const { getAnalytics } = require("../controllers/analytics_controller");
const { getCoordinatorParticipants } = require("../controllers/event_fetch_controller");
const { registerParticipantToEvent } = require("../controllers/event_insert_controller");


router.post("/login", login);
router.post("/logout", logout);


// Add all role access routes here
//router.post("/food/scan",auth,allowRoles("food"),scanFood);

//food
router.post('/food/scan',auth ,allowRoles("food"), scanFoodQR)

//general admin 
router.get('/admin/dashboard',auth , allowRoles("general"), getAnalytics)

//event admin
router.get("/event/data",auth , allowRoles("Auction Arena",
    "Flashback",
    "Cinefrenzy",
    "Battle of Thrones",
    "Beyond the Gate",
    "Rhythmia",
    "Agent Fusion",
    "Paper Podium",
    "Prompt Craft",
    "HackQuest",
    "Query Clash",
    "Shark Tank",
    "Workshop"),getCoordinatorParticipants)

router.post("/event/insert",auth , allowRoles("Auction Arena",
    "Flashback",
    "Cinefrenzy",
    "Battle of Thrones",
    "Beyond the Gate",
    "Rhythmia",
    "Agent Fusion",
    "Paper Podium",
    "Prompt Craft",
    "HackQuest",
    "Query Clash",
    "Shark Tank",
    ),registerParticipantToEvent)

module.exports = router;
