var express = require('express');

var status = require('../../basis/status');
var tasks = require('../basis/api/tasks');

var router = express.Router();

//checking status and error if user not entered
router.use(status.hard);

//creating new task
router.post('/create');

module.exports = router;