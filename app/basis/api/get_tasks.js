var db = require('../database');
var serializing = require('../serializing');

//get active tasks for user
function active_tasks(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //personal
    if(!room) {
        db.tasks.findAll({
            where: {
                author,
                active: 1
            },
            include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
        }).then(function(result) {
            res.end(serializing(0, result));
        }, function(err) {
            console.log(err);
            res.end(serializing(1));
        });
    }
    //company
    else {
        db.tasks.findAll({
            where: {
                room,
                active: 1,
                $or: {
                    u_group: author_group,
                    performer: author
                },
                include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
            }
        }).then(function(result) {
            res.end(serializing(0, result));
        }, function(err) {
            console.log(err);
            res.end(serializing(1));
        });
    }
};

//get inactive tasks for user
function inactive_tasks(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //personal
    if(!room) {
        db.tasks.findAll({
            where: {
                author,
                active: 0
            },
            include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
        }).then(function(result) {
            res.end(serializing(0, result));
        }, function(err) {
            console.log(err);
            res.end(serializing(1));
        });
    }
    //company
    else {
        db.tasks.findAll({
            where: {
                room,
                active: 0,
                $or: {
                    u_group: author_group,
                    performer: author
                }
            },
            include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
        }).then(function(result) {
            res.end(serializing(0, result));
        }, function(err) {
            console.log(err);
            res.end(serializing(1));
        });
    }
};

exports.active_tasks = active_tasks;
exports.inactive_tasks = inactive_tasks;