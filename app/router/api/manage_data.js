var express = require('express');

var status = require('../../basis/status');
var manage_data = require('../../basis/api/manage_data');

var router = express.Router();

//get all user groups in room
router.get('/users_group', status.medium, manage_data.users_group);

//get all users in room
router.get('/users', status.medium, manage_data.users);

//get all tasks group
router.get('/tasks_groups', status.hard, manage_data.tasks_groups);

module.exports = router;