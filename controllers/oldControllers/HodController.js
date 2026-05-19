

const User      = require("../../Models/User");
const Class     = require("../../Models/class");
const Timetable = require("../../Models/Timetable");

const appointClassMonitor = async (req, res) => {
  try {
    const { studentId, classId, makeMonitor } = req.body;

    if (typeof makeMonitor !== "boolean") {
      return res.status(400).json({ status: false, message: "makeMonitor must be true or false" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: false, message: "Student not found" });
    }

    if (student.role !== "student") {
      return res.status(400).json({ status: false, message: "Only a student can be appointed as class monitor" });
    }

    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ status: false, message: "Class not found" });
    }

  
    const isEnrolled = cls.students.some((s) => s.toString() === studentId);
    if (!isEnrolled) {
      return res.status(400).json({
        status: false,
        message: "Student is not enrolled in this class",
      });
    }

    if (makeMonitor) {
      //Revoke previous monitor 
      if (cls.classMonitor && cls.classMonitor.toString() !== studentId) {
        await User.findByIdAndUpdate(cls.classMonitor, { isClassMonitor: false });
      }

      cls.classMonitor = studentId;
      student.isClassMonitor = true;
    } else {
      // Revoke this student's monitor status
      if (cls.classMonitor && cls.classMonitor.toString() === studentId) {
        cls.classMonitor = null;
      }
      student.isClassMonitor = false;
    }

    await cls.save();
    await student.save();

    return res.json({
      status: true,
      message: `Student ${makeMonitor ? "appointed as" : "removed from"} class monitor`,
      data: {
        student: { _id: student._id, name: student.name, isClassMonitor: student.isClassMonitor },
        class:   { _id: cls._id, className: cls.className, classMonitor: cls.classMonitor },
      },
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};


const getClassStudents = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId)
      .populate("students", "name email rollNo department course year semester isClassMonitor isActive")
      .populate("classMonitor", "name email rollNo");

    if (!cls) {
      return res.status(404).json({ status: false, message: "Class not found" });
    }

    return res.json({ status: true, data: cls });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

const createTimetable = async (req, res) => {
  try {
    const { course, department, semester, day, slots } = req.body;

    if (!course || !department || !semester || !day || !slots || !slots.length) {
      return res.status(400).json({ status: false, message: "course, department, semester, day and slots are required" });
    }

    const existing = await Timetable.findOne({ course, department, semester: Number(semester), day, isActive: true });
    if (existing) {
      return res.status(409).json({ status: false, message: "Timetable for this course/department/semester/day already exists. Use update instead." });
    }

    const timetable = await Timetable.create({
      course,
      department,
      semester: Number(semester),
      day,
      slots,
      createdBy: req.user._id,
    });

    return res.status(201).json({ status: true, message: "Timetable created successfully", data: timetable });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { slots, day } = req.body;

    const timetable = await Timetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ status: false, message: "Timetable not found" });
    }

    if (slots)  timetable.slots = slots;
    if (day)    timetable.day   = day;
    await timetable.save();

    return res.json({ status: true, message: "Timetable updated successfully", data: timetable });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

const getTimetable = async (req, res) => {
  try {
    const { course, department, semester, day } = req.query;

    const filter = { isActive: true };

    if (course) {
      filter.course = course;
    }

    if (department) {
      filter.department = department;
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    if (day) {
      filter.day = day;
    }

    const timetables = await Timetable.aggregate([
      {
        $match: filter
      },
      {
        $lookup: {
          from: "subjects",
          localField: "slots.subjectId",
          foreignField: "_id",
          as: "subjectDetails"
        }
      },
      {
        $addFields: {
          slots: {
            $map: {
              input: "$slots",
              as: "slot",
              in: {
                $mergeObjects: [
                  "$$slot",
                  {
                    subject: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$subjectDetails",
                            as: "sub",
                            cond: {
                              $eq: ["$$sub._id", "$$slot.subjectId"]
                            }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          subjectDetails: 0
        }
      },
      {
        $sort: {
          day: 1
        }
      }
    ]);

    return res.json({
      status: true,
      data: timetables
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

module.exports = { appointClassMonitor, getClassStudents, createTimetable, updateTimetable, getTimetable };