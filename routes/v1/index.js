

var express = require("express");
var router  = express.Router();

var adminsRouter = require("./admin");
var usersRouter  = require("./user");

var adminAuthController  = require("../../controllers/auth/admin");
var userAuthController   = require("../../controllers/auth/users");
var studentController    = require("../../controllers/RoleBasedControllers/StudnetControllers");

// ── Public ──────────────────────────────────────────────────
router.post("/admin/register", adminAuthController.register);
router.post("/admin/login",    adminAuthController.login);
router.post("/user/register",  userAuthController.register);
router.post("/user/login",     userAuthController.login);

// ── Protected (JWT required from here) ──────────────────────
const { middleware } = require("../../service/middleware");
router.use(middleware);

// student self-update (any logged-in student)
router.post("/student-details", studentController.updateStudentProfile);

// sub-routers
router.use("/admin", adminsRouter);
router.use("/user",  usersRouter);

module.exports = router;