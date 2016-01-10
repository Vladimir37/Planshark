var express = require('express');

var status = require('../../basis/status');
var tasks = require('../../basis/api/tasks');

var router = express.Router();

//checking status and error if user not entered
router.use(status.hard);

//creating new task
router.post('/create', tasks.create);

//editing task
router.post('/edit', tasks.edit);

//reassign task
router.post('/reassign', status.medium, tasks.reassign);

module.exports = router;