const router = require("express").Router();
const {login,logout} = require("../controllers/auth_controller");
const { scanFoodQR } = require("../controllers/qr_controller");
const allowRoles = require ("../middlewares/role_access")
const auth = require('../middlewares/auth_middleware')


router.post("/login", login);
router.post("/logout", logout);


// Add all role access routes here
//router.post("/food/scan",auth,allowRoles("food"),scanFood);

router.post('/food/scan',auth ,allowRoles("food"), scanFoodQR)

module.exports = router;
