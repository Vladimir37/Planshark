var db = require('../database');

//creating new task
function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    //task data
    var performer = req.body.performer;
    var t_group = req.body.t_group || null;
    var u_group = req.body.u_group || null;
    var priority = req.body.priority;
    var task_name = req.body.name;
    var task_description = req.body.description;
    var expiration = req.body.expiration || null;
    //personal
    if(!room) {
        db.tasks.create({
            author,
            performer: author,
            t_group,
            priority,
            name: task_name,
            description: task_description,
            expiration
        });
    }
};