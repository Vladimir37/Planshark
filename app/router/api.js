var express = require('express');

var account = require('./api/account');
var tasks = require('./api/tasks');
var manage = require('./api/manage');

var router = express.Router();

//POST
//login and creating account
router.post('/account', account);

//operation with tasks
router.post('/tasks', tasks);

//operation with tasks group and users
router.post('/manage', manage);

module.exports = router;