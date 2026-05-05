

const User = require("../../Models/User");



const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const allowedFields = ["name", "phone"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });

    return res.json({ status: true, message: "Profile updated", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
};

module.exports = { updateProfile };