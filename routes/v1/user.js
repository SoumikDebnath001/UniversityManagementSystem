var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });


var  userAuthController=require("../../controllers/auth/users")

router.get("/me",userAuthController.getProfile);


module.exports = router;


