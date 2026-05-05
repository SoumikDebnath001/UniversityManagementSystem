
const User  = require("../../Models/User");
const Class = require("../../Models/class");
const Room  = require("../../Models/Room");


const toggleUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;


    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.json({
      status: true,
      message: `User ${isActive ? "activated" : "blocked"} successfully`,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


const appointHod = async (req, res) => {
  try {
    const { makeHod } = req.body;

    if (typeof makeHod !== "boolean") {
      return res.status(400).json({ status: false, message: "makeHod must be true or false" });
    }

    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Only faculty type roles can become HOD
    const eligibleRoles = ["faculty", "hod"];
    if (!eligibleRoles.includes(targetUser.role) && makeHod) {
      return res.status(400).json({
        status: false,
        message: "Only a faculty member can be appointed as HOD",
      });
    }

    targetUser.role = makeHod ? "hod" : "faculty";
    await targetUser.save();

    return res.json({
      status: true,
      message: `User ${makeHod ? "appointed as HOD" : "reverted to faculty"}`,
      data: { _id: targetUser._id, name: targetUser.name, role: targetUser.role },
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


const createClass = async (req, res) => {
  try {
    const { className, classCode, department, course, year, semester } = req.body;

    if (!className || !classCode) {
      return res.status(400).json({ status: false, message: "className and classCode are required" });
    }

    const existing = await Class.findOne({ classCode: classCode.toUpperCase() });
    if (existing) {
      return res.status(409).json({ status: false, message: "A class with this code already exists" });
    }

    const newClass = await Class.create({
      className,
      classCode,
      department,
      course,
      year,
      semester,
      createdBy: req.user._id,  // admin ==>_id
    });

    return res.status(201).json({
      status: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      // .populate("classMonitor", "name email rollNo")
      // .populate("students", "name email rollNo")
      // .sort({ createdAt: -1 });

    return res.json({ status: true, data: classes });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const filter = { isDeleted: false };
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter)
    // .select("-token -password").sort({ createdAt: -1 });
    return res.json({ status: true, data: users });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


const createRoom = async (req, res) => {
  try {
    const { roomNo, facility } = req.body;

    if (!roomNo) {
      return res.status(400).json({ status: false, message: "roomNo is required" });
    }

    const validFacilities = ["ac", "non-ac"];
    if (!facility || !validFacilities.includes(facility.toLowerCase())) {
      return res.status(400).json({
        status: false,
        message: "facility must be 'ac' or 'non-ac'",
      });
    }

    const existing = await Room.findOne({ roomNo: roomNo.trim() });
    if (existing) {
      return res.status(409).json({ status: false, message: "Room with this number already exists" });
    }

    const newRoom = await Room.create({
      roomNo: roomNo.trim(),
      facilities: [facility.toLowerCase()],
    });

    return res.status(201).json({
      status: true,
      message: "Room created successfully",
      data: newRoom,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


module.exports = {
  toggleUserStatus,
  appointHod,
  createClass,
  getAllClasses,
  getAllUsers,
  createRoom,
};