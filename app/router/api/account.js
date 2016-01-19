var express = require('express');

var account = require('../../basis/api/account');

var router = express.Router();

//sign in created account
router.post('/login', account.login);

//creating new account
router.post('/registration', account.registration);

//change password
router.post('/change', account.change);

//password reminder
router.post('/reminder', account.reminder);

//object with user status
router.get('/status', account.status);

//exit from account
router.post('/exit', account.exit);

module.exports = router;