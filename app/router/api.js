var express = require('express');

var account = require('./api/account');
var tasks = require('./api/tasks');
var user_manage = require('./api/user_manage');

var router = express.Router();

//POST
//login and creating account
router.post('/account', account);

//operation with tasks
router.post('/tasks', tasks);

//operation with tasks group and users
router.post('/manage', user_manage);

module.exports = router;