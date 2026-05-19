

var express = require("express");
var router = express.Router();

const userAuthController = require("../../controllers/auth/users");

// ── Auth / profile ──────────────────────────────────────────
router.get("/me", userAuthController.getProfile);

module.exports = router;