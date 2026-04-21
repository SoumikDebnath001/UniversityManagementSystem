const User = require("../../Models/User");

const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // ❌ prevent sensitive overwrite
    delete req.body.role;
    delete req.body.password;
    delete req.body.token;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, role: "student" },
      { $set: req.body }, // ✅ important
      { new: true, runValidators: true }
    );

    console.log("UPDATED USER =>", updatedUser); // 🔍 debug

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "Student not found"
      });
    }

    return res.json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { updateStudentProfile };