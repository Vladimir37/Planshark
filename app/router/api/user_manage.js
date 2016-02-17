var express = require('express');

var status = require('../../basis/status');
var user_manage = require('../../basis/api/user_manage');

var router = express.Router();

router.use(status.medium);

//user group
//creating group
router.post('/create', user_manage.create);
//editing group
router.post('/edit', user_manage.edit);
//deleting group
router.post('/deleting', user_manage.deleting);

//operation with users
//adding user to group
router.post('/add', user_manage.add);
//creating new user
router.post('/new', user_manage.new_user);
//blocking and deleting user
router.post('/block', user_manage.block);
//unblocking user
router.post('/unblock', user_manage.unblock);
//edit user data
router.post('/change', user_manage.change);

module.exports = router;