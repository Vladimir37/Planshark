var express = require('express');

var account = require('../basis/api/account');

var router = express.Router();

//POST
router.post('/login');

module.exports = router;