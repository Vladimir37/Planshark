var db = require('../database');

//creating new task
function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
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
        }).then(function() {
            res.end('0');
        }, function(err) {
            res.end('1');
        });
    }
    //company
    else {
        db.users_groups.findById(author_group).then(function(a_group) {
            if(!a_group || !a_group.creating) {
                throw '1';
            }
            else {
                return db.tasks.create({
                    room,
                    author,
                    performer,
                    t_group,
                    u_group,
                    priority,
                    name: task_name,
                    description: task_description,
                    expiration
                });
            }
        }).then(function() {
            res.end('0');
        }).catch(function(err) {
            res.end('1');
        })
    }
};

//editing task
function editing(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
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
        db.tasks.update({
            t_group,
            priority,
            name: task_name,
            description: task_description,
            editor: author,
            expiration
        }).then(function() {
            res.end('0');
        }, function(err) {
            res.end('1');
        });
    }
};

exports.create = creating;
exports.edit = editing;