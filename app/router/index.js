var express = require('express');

var render = require('../basis/render');

var router = express.Router();

//index page
router.get('/', render('main/index'));

//tasks manage
router.get('/tasks', render('main/index'));

//tasks groups manage
router.get('/tasks_groups', render('main/index'));

//users groups manage
router.get('/users_groups', render('main/index'));

//users manage
router.get('/users', render('main/index'));

module.exports = router;