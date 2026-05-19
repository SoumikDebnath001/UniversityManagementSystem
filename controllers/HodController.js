const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const User = require('../Models/userModel');

function createToken(data) {
    return jwt.sign(data, "DonateSmile");
}

///////////////////////////////////////////////////////////////////////////////create hod  (admin only)
exports.createHod = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ status: false, message: "name and email are required" });
        }

        const existing = await User.findOne({ email, isDeleted: false });
        if (existing) {
            return res.status(400).json({ status: false, message: "User with this email already exists" });
        }

        const hod = new User({
            name,
            email,
            role: "hod",
            password: passwordHash.generate(email),
            token: createToken({ email, role: "hod" }),
            createdBy: req.user._id,
            createdByRole: "admin",
        });

        await hod.save();

        return res.status(201).json({
            status: true,
            message: "HOD created successfully. Default password is the email.",
            data: {
                _id: hod._id,
                name: hod.name,
                email: hod.email,
                department: hod.department,
                role: hod.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////hod login
exports.hodLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: "email and password are required" });
        }

        const hod = await User.findOne({ email, role: "hod", isDeleted: false }).select("+password");
        if (!hod) {
            return res.status(404).json({ status: false, message: "HOD not found" });
        }

        if (!hod.isActive) {
            return res.status(403).json({ status: false, message: "Account is inactive" });
        }

        const isMatch = passwordHash.verify(password, hod.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid password" });
        }

        const token = createToken({ email, role: "hod" });
        await User.updateOne({ _id: hod._id }, { $set: { token } });

        return res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            data: {
                _id: hod._id,
                name: hod.name,
                email: hod.email,
                department: hod.department,
                role: hod.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

///////////////////////////////////////////////////////////////////////////////change password (hod only)
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ status: false, message: "oldPassword and newPassword are required" });
        }

        const hod = await User.findById(req.user._id).select("+password");
        if (!hod) {
            return res.status(404).json({ status: false, message: "HOD not found" });
        }

        const isMatch = passwordHash.verify(oldPassword, hod.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Old password is incorrect" });
        }

        hod.password = passwordHash.generate(newPassword);
        await hod.save();

        return res.status(200).json({ status: true, message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};
