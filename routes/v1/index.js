var express = require("express");
var router = express.Router();

var adminsRouter = require("./admin");
var usersRouter = require("./user");
var hodRouter = require("./hod");

var adminAuthController = require("../../controllers/auth/admin");
var userAuthController = require("../../controllers/auth/users");
var hodController = require("../../controllers/HodController");

// ── Public ──────────────────────────────────────────────────
router.post("/admin/register", adminAuthController.register);
router.post("/admin/login", adminAuthController.login);
router.post("/user/register", userAuthController.register);
router.post("/user/login", userAuthController.login);
router.post("/hod/login", hodController.hodLogin);

// ── Protected (JWT required from here) ──────────────────────
const { middleware } = require("../../service/middleware");
router.use(middleware);


// sub-routers
router.use("/admin", adminsRouter);
router.use("/user", usersRouter);
router.use("/hod", hodRouter);

module.exports = router;