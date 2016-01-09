var express = require('express');

var account = require('./api/account');
var tasks = require('./api/tasks');

var router = express.Router();

//POST
//login and creating account
router.post('/account', account);

//operation with tasks
router.post('/tasks', tasks);

module.exports = router;