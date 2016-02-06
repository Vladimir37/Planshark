var express = require('express');

var status = require('../../basis/status');
var styles = require('../../basis/api/styles');

var router = express.Router();

router.use(status.hard);

//user group color
router.get('/users', styles.users);

//tasks group color
router.get('/tasks', styles.tasks);

module.exports = router;