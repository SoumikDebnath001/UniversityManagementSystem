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



module.exports = {
    register,
    getTokenData,
    getProfile
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