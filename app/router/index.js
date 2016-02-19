var express = require('express');

var render = require('../basis/render');
var status = require('../basis/status');

var router = express.Router();

//index page
router.get('/', render('main/index'));

//operation with password and appeal to support
router.get('/personal', render('main/personal'));

//tasks manage
router.get('/tasks', status.hard, render('main/tasks'));

//tasks groups manage
router.get('/tasks_groups', status.hard, render('main/tasks_groups'));

//users groups manage
router.get('/users_groups', status.medium, render('main/users_groups'));

//users manage
router.get('/users', status.hard, render('main/users'));

module.exports = router;