
var user = {};

var AdminController = require('../controllers/auth/admin');
var UserController = require('../controllers/auth/users')



//Middleware
const parmisoen = [
    
    {
        url: "/admin/login",
    },
    {
        url: "/admin/register",
    },
    {
        url: "/hod/login",
    },
    {
        url: "/hod/register",
    }

]

user.middleware = async (req, res, next) => {
    if (parmisoen.filter(it => it.url == req.url).length > 0) {
        next();
    } else {
        if (!req.headers.authorization) {
            return res.status(200).json({ error: "No credentials sent!", status: false, credentials: false });
        } 
        else {
            let authorization = req.headers.authorization
            //console.log(authorization);
            let userData = null;
            let userType = typeof(req.headers.usertype) != "undefined" ? req.headers.usertype : "User";
            // console.log('userType', userType, req.headers); 
            if (userType == "Admin") {
                userData = await AdminController.getTokenData(authorization);
             }
            if (userType == "Hod") {
                userData = await UserController.getTokenData(authorization);
             }
            else if(userType == "User") {
                userData = await UserController.getTokenData(authorization);
            }
//console.log(userData);
            if (userData && userData != null) {
                    userData.password = null;
                    userData.token = null;
                    req.user = userData;
                    req.userType= userType;
                    req.token = req.headers.authorization,
                    next();
            } else {
                res.status(200).json({ error: "credentials not match", status: false, credentials: false });
            }

        }
    }

}



module.exports = user;