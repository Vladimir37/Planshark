var express = require('express');

var status = require('../../basis/status');
var manage_data = require('../../basis/api/manage_data');

var router = express.Router();

//get all user groups in room with users count
router.get('/users_group', manage_data.users_group);

//get all task groups in room with users count
router.get('/tasks_group', manage_data.tasks_groups);

//get all active users in the room
router.get('/active_users', manage_data.active_users);

//get all inactive users in the room
router.get('/inactive_users', manage_data.inactive_users);

module.exports = router;