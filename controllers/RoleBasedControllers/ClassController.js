
const User  = require("../../Models/User");
// const Class = require("../../Models/class");

const mongoose = require("mongoose");
const ClassMonitor = require("../../Models/classMonitor");


const Course = require('../../Models/class');
const classMonitor = require("../../Models/classMonitor");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, eligibility, description, departments } = req.body;

    if (!courseName || !eligibility) {
      return res.status(400).json({
        status: false,
        message: "courseName and eligibility required",
      });
    }

    const course = await Course.create({
      courseName,
      eligibility,
      description,
      departments,
    });

    return res.status(201).json({
      status: true,
      message: "Course created",
      data: course,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


exports.ClassMonitor= async (req, res) => {
  try {
    const { classid,
        Monitor,
        Sectionid,
        isActive} = req.body;
        //getting the course from the table 
        const className = await Course.findById(classid);
        //from the course i am getting the section name using the section id
        const SectionName = await className.departments.id(Sectionid);
        //putting the values in the class monitor table
        const monitor=await ClassMonitor.create({
            className:className.courseName,
            SectionName:SectionName.name,
            classid,
            Monitor,
            Sectionid,
            isActive
        })

  

    return res.status(201).json({
      status: true,
      message: "Course created",
      data: monitor,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
exports.getAllMonitors= async (req, res) => {
  try {
  const monitors=await classMonitor.aggregate([
    {
      $match:{isActive:true}
    },
    {
      $lookup:{
        from:"users",
        localField:"Monitor",
        foreignField:"_id",
        as:"MonitorDetails"
      }
    },
    {
       $lookup:{
        from:"coursedepartments",
        localField:"classid",
        foreignField:"_id",
        as:"ClassDetials"
      }
    },
    {
        $unwind: "$ClassDetials"
    },
    {
        $addFields:{
          Sectiondetails:{


                $arrayElemAt:[//we cannot use . operator here so we willuse filter 


                      {
                            $filter:{
                              input:"$ClassDetials.departments",
                              as:"d",//do not use capital character
                              cond: { $eq: ["$$d._id", "$Sectionid"] }//$ document field access  $$ document variable access                             
                            }
                            
                      },
                      0


                ]



          }
        }
    }


  ])
    
  
    return res.json({ status: true, data: monitors });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message }); 
  }

}

// exports.getAllCourses = async (req, res) => {
//   try {
//     const data = await Course.find({ isDeleted: false }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       status: true,
//       total: data.length,
//       data,
//     });

//   } catch (error) {
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };


// exports.updateCourse = async (req, res) => {
//   try {
//     const { id, courseName, eligibility, description, departments } = req.body;

//     if (!id) {
//       return res.status(400).json({
//         status: false,
//         message: "id is required",
//       });
//     }

//     let updateData = {};

//     if (courseName) updateData.courseName = courseName;
//     if (eligibility) updateData.eligibility = eligibility;
//     if (description) updateData.description = description;

//     // 🔥 main logic (replace full departments array)
//     if (departments) {
//       updateData.departments = departments;
//     }

//     const updated = await Course.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         status: false,
//         message: "Course not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Course updated successfully",
//       data: updated,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Server error",
//     });
//   }
// };

// exports.deleteCourse = async (req, res) => {
//   try {
//     const { id } = req.body;

//     const deleted = await Course.findByIdAndUpdate(
//       id,
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!deleted) {
//       return res.status(404).json({
//         status: false,
//         message: "Course not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Course deleted",
//     });

//   } catch (error) {
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };

// exports.getCourseById = async (req, res) => {
//   try {
//     const { id } = req.body;

//     const data = await Course.findById(id);

//     if (!data) {
//       return res.status(404).json({
//         status: false,
//         message: "Course not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       data,
//     });

//   } catch (error) {
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };

// exports.getDepartmentsByCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body;

//     if (!courseId) {
//       return res.status(400).json({
//         status: false,
//         message: "courseId is required",
//       });
//     }

//     const course = await Course.findOne({
//       _id: courseId,
//       isDeleted: false,
//     }).select("courseName departments");

//     if (!course) {
//       return res.status(404).json({
//         status: false,
//         message: "Course not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       courseName: course.courseName,
//       totalDepartments: course.departments.length,
//       departments: course.departments,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Server error",
//     });
//   }
// };

// const joinClass = async (req, res) => {
//   try {
//     const studentId = req.user._id;
//     const { classCode } = req.body;

//     if (!classCode) {
//       return res.status(400).json({ status: false, message: "classCode is required" });
//     }

//     const student = await User.findById(studentId);

//     if (student.classId) {
//       return res.status(400).json({
//         status: false,
//         message: "You are already enrolled in a class. Leave your current class first.",
//       });
//     }

//     const cls = await Class.findOne({ classCode: classCode.toUpperCase(), isActive: true });
//     if (!cls) {
//       return res.status(404).json({ status: false, message: "Class not found or inactive" });
//     }

//     // Add student to class
//     if (!cls.students.includes(studentId)) {
//       cls.students.push(studentId);
//       await cls.save();
//     }

//     // Update student record
//     student.classId = cls._id;
//     await student.save();

//     return res.status(200).json({
//       status: true,
//       message: `Successfully joined class "${cls.className}"`,
//       data: {
//         classId:   cls._id,
//         className: cls.className,
//         classCode: cls.classCode,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ status: false, error: err.message });
//   }
// };


// const leaveClass = async (req, res) => {
//   try {
//     const studentId = req.user._id;

//     const student = await User.findById(studentId);

//     if (!student.classId) {
//       return res.status(400).json({ status: false, message: "You are not enrolled in any class" });
//     }

//     const cls = await Class.findById(student.classId);
//     if (cls) {
//       cls.students = cls.students.filter((s) => s.toString() !== studentId.toString());

//       // If this student was class monitor, revoke it
//       if (cls.classMonitor && cls.classMonitor.toString() === studentId.toString()) {
//         cls.classMonitor = null;
//         student.isClassMonitor = false;
//       }

//       await cls.save();
//     }

//     student.classId = null;
//     await student.save();

//     return res.json({ status: true, message: "You have left the class" });
//   } catch (err) {
//     return res.status(500).json({ status: false, error: err.message });
//   }
// };


// const listClasses = async (req, res) => {
//   try {
//     const classes = await Class.find({ isActive: true })
//       .select("className classCode department course year semester classMonitor")
//       .populate("classMonitor", "name rollNo")
//       .sort({ createdAt: -1 });

//     return res.json({ status: true, data: classes });
//   } catch (err) {
//     return res.status(500).json({ status: false, error: err.message });
//   }
// };


// const viewStudentProfile = async (req, res) => {
//   try {
//     const viewerId  = req.user._id;
//     const targetId  = req.params.userId;

//     const target = await User.findOne({ _id: targetId, isDeleted: false, isActive: true })
//       .populate({
//         path: "classId",
//         select: "className classCode department course year semester classMonitor",
//         populate: { path: "classMonitor", select: "name rollNo" },
//       });

//     if (!target) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

   
//     const publicProfile = {
//       _id:            target._id,
//       name:           target.name,
//       role:           target.role,
//       department:     target.department,
//       course:         target.course,
//       year:           target.year,
//       semester:       target.semester,
//       rollNo:         target.rollNo,
//       cgpa:           target.cgpa,
//       isClassMonitor: target.isClassMonitor,
//       class:          target.classId || null,
//     };

//     if (viewerId.toString() !== targetId.toString()) {
//       const Visitor = require("../../Models/visitor");
//       await Visitor.create({ VisitedByuserId: viewerId, profileOwenerId: targetId });
//     }

//     return res.json({ status: true, data: publicProfile });
//   } catch (err) {
//     return res.status(500).json({ status: false, error: err.message });
//   }
// };

// module.exports = { joinClass, leaveClass, listClasses, viewStudentProfile };
