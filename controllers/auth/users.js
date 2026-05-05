const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const User = require('../../Models/User');
function createToken(data) {
  return jwt.sign(data, "DonateSmile");
}

//////////////////////////////////////////


/////////////////////////////////////////

const getTokenData = async (token) => {
    let userData = await User.findOne({ token: token }).exec();
    return userData;
  };
/////////////////////////////////register function
const register = async (req, res) => {
    try {
        const { role, password , ...rest} = req.body;
        const UserInsert=new User({
            ...rest,
            password: passwordHash.generate(password),
            role,
            token: createToken(req.body),
            createdOn: new Date(),//mongodb will automatically create _id and createdAt fields
        })
        
        await UserInsert.save();
        return res.status(201).json({
          status: true,
          message: "User created successfully",
          data: UserInsert,
        });
    }catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
          status: false,
          message: "Server error",
          error: error.message,
        });
    }
}
const getProfile=async (req,res)=>{
  try{
      const user=await User.findById(req.user._id);
      res.send(user);
      

  }catch(err){
    console.log(err);
    

  }

}
/////////////////////////////////////login function

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password").exec();

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const isMatch = passwordHash.verify(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }

    const token = createToken(req.body);

    await User.updateOne(
      { _id: user._id },
      { $set: { token: token } }
    );

    
    let roleData = {};

    if (user.role === "student") {
      roleData = user.student;
    } else if (user.role === "faculty") {
      roleData = user.faculty;
    } else if (user.role === "hod") {
      roleData = user.hod;
    } else if (user.role === "finance") {
      roleData = user.finance;
    } else if (user.role === "exam_controller") {
      roleData = user.examController;
    } else if (user.role === "hr") {
      roleData = user.hr;
    } else if (user.role === "librarian") {
      roleData = user.librarian;
    } else if (user.role === "warden") {
      roleData = user.warden;
    } else if (user.role === "transport_manager") {
      roleData = user.transportManager;
    } else if (user.role === "placement_officer") {
      roleData = user.placementOfficer;
    } else if (user.role === "parent") {
      roleData = user.parent;
    } else if (user.role === "admission_agent") {
      roleData = user.admissionAgent;
    }

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        details: roleData,
      },
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
    getTokenData,
    getProfile,
    login
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