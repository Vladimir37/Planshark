var express = require('express');

var status = require('../../basis/status');
var get_tasks = require('../../basis/api/get_tasks');

var router = express.Router();

router.use(status.hard);

//get tasks list for user
router.get('/get', get_tasks.get_tasks);

module.exports = router;