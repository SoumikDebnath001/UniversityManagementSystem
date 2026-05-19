const Admin = require('../../Models/adminModel');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
function createToken(data) {
  return jwt.sign(data, "DonateSmile");
}
const getTokenData = async (token) => {
  let adminData = await Admin.findOne({ token: token }).exec();
  return adminData;
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const AdminInsert = new Admin({
      name,
      email,
      password: passwordHash.generate(password),
      token: createToken(req.body),
      createdOn: new Date(),//mongodb will automatically create _id and createdAt fields
    })
    await AdminInsert.save();
    return res.status(201).json({
      status: true,
      message: "Admin created successfully",
      data: AdminInsert,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).exec();

    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    const isMatch = passwordHash.verify(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }


    const token = createToken(req.body);
    await Admin.updateOne(
      { _id: admin._id },
      { $set: { token: token } }
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
      data: admin,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  register,
  login,
  getTokenData
}












// const register = async (req, res) => {
// //   const v = new Validator(req.body, {
// //     email: "required|email",
// //     password: "required",
// //   });

// //   let matched = await v.check();
// //   if (!matched) {
// //     return res.status(400).json({
// //       status: false,
// //       error: v.errors,
// //       message: "Validation failed",
// //     });
// //   }

//   let adminData = {
//     ...req.body,
//     password: passwordHash.generate(req.body.password),
//     token: createToken(req.body),
//     createdOn: new Date(),
//   };

//   const {name,email,password} = req.body;

//   try {
//     Admin.create({
//         name,
//         email,
//         password: passwordHash.generate(password),
//         token: createToken(req.body),
//         createdOn: new Date(),
//     })
//     return res.status(201).json({
//       status: true,
//       message: "Admin created successfully",
//       data: adminInsert,
//     });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };