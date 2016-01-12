var express = require('express');

var status = require('../../basis/status');
var user_manage = require('../../basis/api/user_manage');

var router = express.Router();

//user group
//creating group
router.post('/create', status.medium, user_manage.create);
//editing group
router.post('/edit', status.medium, user_manage.edit);
//deleting group
router.post('/deleting', status.medium, user_manage.deleting);
//adding user to group
router.post('/add', status.medium, user_manage.add);

module.exports = router;