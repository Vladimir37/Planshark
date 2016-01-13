var express = require('express');

var status = require('../../basis/status');
var get_tasks = require('../../basis/api/get_tasks');

var router = express.Router();

router.use(status.hard);

//get active tasks list for user
router.get('/active', get_tasks.active_tasks);

//get inactive tasks list for user
router.get('/inactive', get_tasks.inactive_tasks);

module.exports = router;