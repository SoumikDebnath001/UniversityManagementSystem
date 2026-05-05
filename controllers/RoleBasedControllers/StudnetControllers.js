
const User = require("../../Models/User");
const RoomAllocation = require("../../Models/RoomAllocation");

const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    delete req.body.role;
    delete req.body.password;
    delete req.body.token;
    delete req.body.classId;        // managed via join/leave class endpoints
    delete req.body.isClassMonitor; // managed by HOD only

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, role: "student" },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "Student not found" });
    }

    return res.json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Simple: find active room allocation for the logged-in student
const getMyRoom = async (req, res) => {
  try {
    const allocation = await RoomAllocation.findOne({
      studentId: req.user._id,
      isActive: true,
    }).populate("roomId", "roomNo facilities isOccupied");

    if (!allocation) {
      return res.status(404).json({ status: false, message: "No room allocated" });
    }

    return res.json({ status: true, data: allocation });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

// Aggregation: same data with full room details joined via $lookup
const getMyRoomAggregation = async (req, res) => {
  try {
    const result = await RoomAllocation.aggregate([
      {
        $match: {
          studentId: req.user._id,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $project: {
          _id: 0,
          allocationId: "$_id",
          allocatedAt: "$createdAt",
          isActive: 1,
          "room.roomNo": 1,
          "room.facilities": 1,
          "room.isOccupied": 1,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({ status: false, message: "No room allocated" });
    }

    return res.json({ status: true, data: result[0] });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

const getDetails=async(req,res)=>{
  //student details
//room details
//class details
//room partner details
      const studentID=req.user._id;
      const result=await User.aggregate([
        { 
          $match: { _id: studentID } //stage 1
        },
        {  
          $lookup: {
            from: "roomallocations",
            localField: "_id",          //stage 2
            foreignField: "studentId",
            as: "allocation"
          }
        },
        { $unwind: "$allocation" },   //stage 3
        {
          $lookup: {
            from: "rooms",
            localField: "allocation.roomId",
            foreignField: "_id",
            as: "roomDetails"
          }
        },
        { $unwind: "$roomDetails" },
        {
          $project: {
            roomDetails: "$roomDetails",
            allocations: "$allocation",
            
          }
        }
      ]);
      if(!result.length){
        return res.status(404).json({status:false,message:"No details found"});
      }
      return res.json({status:true,data:result[0]});    


}




module.exports = { updateStudentProfile, getMyRoom, getMyRoomAggregation };