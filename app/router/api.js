var express = require('express');

var account = require('./api/account');
var tasks = require('./api/tasks');
var user_manage = require('./api/user_manage');
var task_manage = require('./api/task_manage');
var get_tasks = require('./api/get_tasks');
var manage_data = require('./api/manage_data');

var router = express.Router();

//POST
//login and creating account
router.use('/account', account);

//operation with tasks
router.use('/tasks', tasks);

//operation with users and user groups
router.use('/user_manage', user_manage);

//operation with tasks and task groups
router.use('/task_manage', task_manage);

//GET
//tasks for user
router.use('/get_tasks', get_tasks);

//get manage data for administrators
router.use('/manage_data', manage_data);

module.exports = router;