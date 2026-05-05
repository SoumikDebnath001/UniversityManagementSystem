/**
 * routes/v1/admin.js
 * All routes here are already protected by the JWT middleware
 * (applied in index.js before mounting).
 * requireRole('admin') is applied per-route for admin-only access.
 */

var express = require("express");
var router  = express.Router();

const adminController = require("../../controllers/RoleBasedControllers/AdminController");
const hodController   = require("../../controllers/RoleBasedControllers/HodController");
const { requireRole } = require("../../service/Rolemiddleware");

const ClassController = require("../../controllers/RoleBasedControllers/ClassController");
//  User management 
router.get("/users", requireRole("admin"), adminController.getAllUsers);
router.patch("/toggle-user-status/:userId", requireRole("admin"), adminController.toggleUserStatus);
router.patch("/appoint-hod/:userId", requireRole("admin"), adminController.appointHod);


// Room management
router.post("/create_room", requireRole("admin"), adminController.createRoom);

router.post("/create_class",ClassController.createCourse);
router.post("/appoint_monitor",ClassController.ClassMonitor);
router.get("/monitors",ClassController.getAllMonitors);
// Class management 
// router.post("/create-class", requireRole("admin"), adminController.createClass);
// router.get("/classes", requireRole("admin"), adminController.getAllClasses);
// router.patch("/appoint-monitor", requireRole("hod"), hodController.appointClassMonitor);
// router.get("/class/:classId/students", requireRole("hod", "admin"), hodController.getClassStudents);

module.exports = router;