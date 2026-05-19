/**
 * routes/v1/admin.js
 * All routes here are already protected by the JWT middleware
 * (applied in index.js before mounting).
 * requireRole('admin') is applied per-route for admin-only access.
 */

var express = require("express");
var router = express.Router();

const { requireRole } = require("../../service/Rolemiddleware");
const { createHod } = require("../../controllers/HodController");

const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addDepartment,
    removeDepartment,
} = require("../../controllers/courseController");

router.post("/hod", requireRole("admin"), createHod);

router.post("/courses", requireRole("admin"), createCourse);
router.get("/courses", requireRole("admin"), getAllCourses);
router.get("/courses/:id", requireRole("admin"), getCourseById);
router.put("/courses/:id", requireRole("admin"), updateCourse);
router.delete("/courses/:id", requireRole("admin"), deleteCourse);
router.post("/courses/:id/departments", requireRole("admin"), addDepartment);
router.delete("/courses/:id/departments/:deptId", requireRole("admin"), removeDepartment);

module.exports = router;