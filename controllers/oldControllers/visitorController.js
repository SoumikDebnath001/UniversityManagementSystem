
const Visitor = require("../../Models/visitor");
const User    = require("../../Models/User");


const visitor = async (req, res) => {
  try {
    const { profileOwenerId } = req.body;
    const VisitedByuserId = req.user._id;

    if (!profileOwenerId) {
      return res.status(400).json({ status: false, message: "profileOwenerId is required" });
    }

    if (VisitedByuserId.toString() === profileOwenerId) {
      return res.status(400).json({ status: false, message: "Cannot visit yourself" });
    }

    const profileOwner = await User.findById(profileOwenerId);
    if (!profileOwner) {
      return res.status(404).json({ status: false, message: "Profile owner not found" });
    }

    const newVisit = await Visitor.create({ VisitedByuserId, profileOwenerId });

    return res.status(201).json({
      status: true,
      message: "Profile visit recorded",
      data: newVisit,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};


const getMyVisitors = async (req, res) => {
  try {
    const profileOwenerId = req.user._id;
    const { date } = req.query;

    
    let dateFilter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: start, $lte: end } };

    }


    const visitors = await Visitor.find({ profileOwenerId, ...dateFilter })
      // .populate("VisitedByuserId", "name email department course year semester rollNo")
      // .sort({ createdAt: -1 });

    const visitorMap = {};
    visitors.forEach((v) => {
      if (!v.VisitedByuserId) return; 

      const id = v.VisitedByuserId._id.toString();
      if (!visitorMap[id]) {
        visitorMap[id] = {
          visitor:    v.VisitedByuserId,
          visitCount: 0,
          lastVisit:  v.createdAt,
        };
      }
      visitorMap[id].visitCount += 1;
      if (v.createdAt > visitorMap[id].lastVisit) {
        visitorMap[id].lastVisit = v.createdAt;
      }
    });

    return res.json({
      status: true,
      message: "Visitors retrieved successfully",
      totalVisitRecords: visitors.length,
      uniqueVisitors:    Object.keys(visitorMap).length,
      data: Object.values(visitorMap),
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};


const getVisitorPublicProfile = async (req, res) => {
  try {
    const profileOwenerId = req.user._id;
    const { visitorUserId } = req.params;

   
    const visit = await Visitor.findOne({ profileOwenerId, VisitedByuserId: visitorUserId });
    if (!visit) {
      return res.status(404).json({
        status: false,
        message: "This user has not visited your profile",
      });
    }

    const visitorUser = await User.findById(visitorUserId)
      // .populate({
      //   path: "classId",
      //   select: "className classCode department course year semester",
      // });

    if (!visitorUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const publicData = {
      _id:            visitorUser._id,
      name:           visitorUser.name,
      role:           visitorUser.role,
      department:     visitorUser.department,
      course:         visitorUser.course,
      year:           visitorUser.year,
      semester:       visitorUser.semester,
      rollNo:         visitorUser.rollNo,
      cgpa:           visitorUser.cgpa,
      isClassMonitor: visitorUser.isClassMonitor,
      class:          visitorUser.classId || null,
    };

    return res.json({ status: true, data: publicData });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

module.exports = { visitor, getMyVisitors, getVisitorPublicProfile };