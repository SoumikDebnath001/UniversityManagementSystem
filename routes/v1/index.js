var express = require('express');
var router = express.Router();

var adminsRouter=require('./admin')
var usersRouter=require('./user')
var adminAuthController = require('../../controllers/auth/admin');
var userAuthController = require('../../controllers/auth/users');
var studentController = require('../../controllers/RoleBasedControllers/StudnetControllers');

router.post('/admin/register', adminAuthController.register);
router.post('/user/register', userAuthController.register);









const middleware = require('../../service/middleware').middleware;
router.use(middleware); 

router.post('/student-details',studentController.updateStudentProfile);

router.use('/admin',adminsRouter)
router.use('/user',usersRouter)
module.exports = router;