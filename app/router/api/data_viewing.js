var express = require('express');

var status = require('../../basis/status');
var data_viewing = require('../../basis/api/data_viewing');

var router = express.Router();

router.use(status.hard);

//get potential performers
router.get('/users', data_viewing.users);

//get tasks groups
router.get('/t_groups', data_viewing.t_groups);

//get users groups
router.get('/u_groups', data_viewing.u_groups);

//get all data above
router.get('/all' , data_viewing.all);

//get master users
router.get('/masters', data_viewing.masters);

module.exports = router;