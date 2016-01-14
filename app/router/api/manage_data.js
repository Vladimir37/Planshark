var express = require('express');

var status = require('../../basis/status');
var manage_data = require('../../basis/api/manage_data');

var router = express.Router();

//get all user groups in room
router.get('/user_group', status.medium, manage_data.user_group);

//get all users in room
router.get('/users', status.medium, manage_data.users);

module.exports = router;