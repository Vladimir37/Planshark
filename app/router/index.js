var express = require('express');

var render = require('../basis/render');

var router = express.Router();

//index page
router.get('/', render('main/index'));