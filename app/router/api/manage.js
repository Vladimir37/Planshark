var express = require('express');

var status = require('../../basis/status');
var manage = require('../../basis/api/manage');

var router = express.Router();

//user group
//creating group
router.post('/create', status.medium, manage.creating);

module.exports = router;