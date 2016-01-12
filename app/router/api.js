var express = require('express');

var account = require('./api/account');
var tasks = require('./api/tasks');
var user_manage = require('./api/user_manage');
var task_manage = require('./api/task_manage');

var router = express.Router();

//POST
//login and creating account
router.post('/account', account);

//operation with tasks
router.post('/tasks', tasks);

//operation with users and user groups
router.post('/user_manage', user_manage);

//operation with tasks and task groups
router.post('/task_manage', task_manage);

module.exports = router;