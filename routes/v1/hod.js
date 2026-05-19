var express = require("express");
var router = express.Router();

const { requireRole } = require("../../service/Rolemiddleware");
const { changePassword } = require("../../controllers/HodController");

router.put("/change_password", requireRole("hod"), changePassword);

module.exports = router;
