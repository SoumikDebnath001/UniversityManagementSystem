
const User  = require("../../Models/User");
const Class = require("../../Models/class");
const Room  = require("../../Models/Room");
const RoomAllocation = require("../../Models/RoomAllocation");
const Subject = require("../../Models/Subject");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
function createToken(data) { return jwt.sign(data, "DonateSmile"); }


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
    const { roomNo, facility, roomType, RoomCapacity } = req.body;

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
      if (!roomType || !["Shared","Single"].includes(roomType)) { 
        return res.status(400).json({
          status: false,
          message: "roomType must be 'Shared' or 'Single'",
        });
      }
      if (!RoomCapacity || ![1, 2, 3].includes(RoomCapacity)) {
        return res.status(400).json({
          status: false,
          message: "RoomCapacity must be 1, 2, or 3",
        });
      }
     
    const existing = await Room.findOne({ roomNo: roomNo.trim() });
    if (existing) {
      return res.status(409).json({ status: false, message: "Room with this number already exists" });
    }

    const newRoom = await Room.create({
      roomNo: roomNo.trim(),
      facilities: [facility.toLowerCase()],
      roomType,
      RoomCapacity,
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

const AllocateRoom= async (req,res)=>{
  const {roomId,StudentId}=req.body;

  const room=await Room.findById(roomId);
  // console.log(room);
  

  if(!room){
    return res.status(404).json({status:false,message:"Room not found"});
  }
  if(room.isOccupied){
    return res.status(400).json({status:false,message:"Room is already occupied"});
  }
  if(room.RoomCapacity <= room.currentOccupants){
    return res.status(400).json({status:false,message:"Room capacity exceeded"});
  }
  console.log(room.RoomCapacity);
  // Check if student exists
  const student=User.findById(StudentId); 
  if(!student){
    return res.status(404).json({status:false,message:"Student not found"});
  }
  const existingAllocation = await RoomAllocation.findOne({ studentId: StudentId,roomId: roomId, isActive: true });
  if (existingAllocation) {
    return res.status(400).json({ status: false, message: "Student already has an active room allocation for this room" });
  }
  const allocation = await RoomAllocation.create({
    roomId,
    studentId: StudentId,
    
  });
  await allocation.save();

  // Update room status to occupied
  
  if( room.RoomCapacity >= room.currentOccupants){
  room.currentOccupants += 1;
  room.isOccupied = true;
  }
  await room.save();

  return res.json({
    status: true,
    message: "Room allocated successfully",
    data: allocation,
  });
}



const createHod = async (req, res) => {
  try {
    const { name, email, password, department, designation, employeeId} = req.body;

    if (!name || !email|| !password) {
      return res.status(400).json({ status: false, message: "name, email, phone and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: false, message: "Email already in use" });
    }

    const hodUser = new User({
      name,
      email,
      password: passwordHash.generate(password),
      role: "hod",
      department,
      designation,
      employeeId,
      createdBy: req.user._id,
      createdByRole: "admin",
    });
    hodUser.token = createToken({ email, password });
    await hodUser.save();

    return res.status(201).json({
      status: true,
      message: "HOD created successfully",
      data: { _id: hodUser._id, name: hodUser.name, email: hodUser.email, role: hodUser.role, department: hodUser.department },
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { subjectName, course, department, semester } = req.body;

    if (!subjectName || !course || !department || !semester) {
      return res.status(400).json({ status: false, message: "subjectName, subjectCode, course, department and semester are required" });
    }

    const existing = await Subject.findOne({ subjectName });
    if (existing) {
      return res.status(409).json({ status: false, message: "Subject with this code already exists" });
    }

    const subject = await Subject.create({
      subjectName,
      course,
      department,
      semester,
      createdBy: req.user._id,
    });

    return res.status(201).json({ status: true, message: "Subject created successfully", data: subject });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};
const getAllSubjects = async (req, res) => {
  try {
    const filter = { isDeleted: false };
    if (req.query.course)     filter.course     = req.query.course;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.semester)   filter.semester   = Number(req.query.semester);

    const subjects = await Subject.aggregate([
      {
        $match:filter
      }
    ]);
    return res.json({ status: true, data: subjects });
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
  AllocateRoom,
  createHod,
  createSubject,
  getAllSubjects,
};