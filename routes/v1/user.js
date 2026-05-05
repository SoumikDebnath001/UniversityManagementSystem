

var express = require("express");
var router  = express.Router();

const userAuthController  = require("../../controllers/auth/users");
const userProfileController = require("../../controllers/RoleBasedControllers/UserProfile");
const visitorController   = require("../../controllers/RoleBasedControllers/visitorController");
const classController     = require("../../controllers/RoleBasedControllers/ClassController");
const studentController   = require("../../controllers/RoleBasedControllers/StudnetControllers");
const { requireRole }     = require("../../service/Rolemiddleware");

// ── Auth / profile ──────────────────────────────────────────
router.get("/me",             userAuthController.getProfile);
router.put("/update-profile", userProfileController.updateProfile);
router.post("/visit-profile", visitorController.visitor);
router.get("/get-visitors", visitorController.getMyVisitors);
router.get("/visitor-profile/:visitorUserId", visitorController.getVisitorPublicProfile);





// Room allocation (students only)
router.get("/my_room",            studentController.getMyRoom);
router.get("/my_room/aggregation", studentController.getMyRoomAggregation);

// Class actions (students only)
// router.get("/classes", requireRole("student"), classController.listClasses);
// router.post("/join-class", requireRole("student"), classController.joinClass);
// router.delete("/leave-class", requireRole("student"), classController.leaveClass);
// router.get("/student-profile/:userId", classController.viewStudentProfile);

module.exports = router;