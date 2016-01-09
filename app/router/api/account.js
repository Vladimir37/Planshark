var express = require('express');

var account = require('../basis/api/account');

var router = express.Router();

//sign in created account
router.post('/login', account.login);

//creating new account
router.post('/registration', account.registration);

module.exports = router;