var db = require('../database');

function users(req, res, next) {
    //user data
    var author = res.user_status.id;
    var room = res.user_status.room;
    //request to db
    db.users_groups.findAll({
        where: {
            room
        }
    }).then(function(groups) {
        res.write('.user_group_color {box-shadow: 0 -2px 0 0 #001448 inset;border-bottom:2px solid #001448;}');
        groups.forEach(function(group) {
            res.write('.user_group_color_' + group.id + '{box-shadow: 0 -2px 0 0 ' + group.color + ' inset;' +
                'border-bottom: 2px solid ' + group.color + '}')
        });
        res.end();
    }, function(err) {
        console.log(err);
        res.end('');
    });
};

function tasks(req, res, next) {
    //user data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var condition = {};
    //personal
    if(!room) {
        condition.author = author;
    }
    //company
    else {
        condition.room = room;
    }
    //request to db
    db.tasks_groups.findAll({
        where: condition
    }).then(function(groups) {
        res.write('.task_group_color {box-shadow: 0 -2px 0 0 #001448 inset;border-bottom:2px solid #001448;}');
        groups.forEach(function(group) {
            res.write('.task_group_color_' + group.id + '{box-shadow: 0 -2px 0 0 ' + group.color + ' inset;' +
                'border-bottom: 2px solid ' + group.color + '}');
        });
        res.end();
    }, function(err) {
        console.log(err);
        res.end('');
    });
};

exports.users = users;
exports.tasks = tasks;