var express = require('express');

var status = require('../../basis/status');
var task_manage = require('../../basis/api/task_manage');

var router = express.Router();

router.use(status.hard);

//operation with tasks groups
//creating new group
router.post('/create', task_manage.create);
//editing task group
router.post('/edit', task_manage.edit);
//deleting task group
router.post('/deleting', task_manage.deleting);
//adding task to group
router.post('/add', task_manage.add);

module.exports = router;