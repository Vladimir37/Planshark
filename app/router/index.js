var express = require('express');

var render = require('../basis/render');
var status = require('../basis/status');

var router = express.Router();

//index page
router.get('/', render('main/index'));

//tasks manage
router.get('/tasks', status.hard, render('main/index'));

//tasks groups manage
router.get('/tasks_groups', status.hard, render('main/index'));

//users groups manage
router.get('/users_groups', status.medium, render('main/index'));

//users manage
router.get('/users', status.hard, render('main/index'));

module.exports = router;