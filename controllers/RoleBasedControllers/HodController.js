

const User  = require("../../Models/User");
const Class = require("../../Models/class");

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

module.exports = { appointClassMonitor, getClassStudents };