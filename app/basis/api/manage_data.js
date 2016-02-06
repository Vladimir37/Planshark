var db = require('../database');
var serializing = require('../serializing');

//get user groups
function users_group(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //right to view all users
    var view_right = false;
    author_group == 0 ? view_right = true : view_right = false;
    var result;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.u_group_manage == 1 ? view_right = true : view_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        console.log(err);
        if(view_right) {
            return Promise.resolve();
        }
        else {
            res.end(serializing(1));
        }
    }).then(function() {
        return db.users_groups.findAll({
            where: {
                room
            }
        });
    }).then(function(groups) {
        result = groups;
        var users_find_arr = [];
        groups.forEach(function(group) {
            users_find_arr.push(db.users.findAll({
                where: {
                    u_group: group.id,
                    active: 1
                }
            }));
        });
        return Promise.all(users_find_arr);
    }).then(function(users_list) {
        var group_count = result.length;
        for(var i = 0; i < group_count; i++) {
            result[i].dataValues.users = users_list[i];
        };
        res.end(JSON.stringify(result));
    }).catch(function(err) {
        console.log(err);
        res.end(serializing(1));
    });
};

//get all task groups in room
function tasks_group(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //right to view all users
    var view_right = false;
    author_group == 0 ? view_right = true : view_right = false;
    if(!room) {
        db.tasks_groups.findAll({
            where: {
                user: author
            }
        }).then(function(groups) {
            res.end(serializing(0, groups));
        }, function(err) {
            console.log(err);
            res.end(serializing(1));
        });
    }
    else {
        db.users_groups.findById(author_group).then(function(group) {
            if(!group) {
                throw '1';
            }
            group.t_group_manage == 1 ? view_right = true : view_right = false;
            return Promise.resolve();
        }).catch(function(err) {
            console.log(err);
            if(view_right) {
                return Promise.resolve();
            }
            else {
                res.end(serializing(1));
            }
        }).then(function() {
            return db.tasks_groups.findAll({
                where: {
                    room
                }
            });
        }).then(function(groups) {
            res.end(serializing(0, groups));
        }).catch(function(err) {
            console.log(err);
            res.end(serializing(1));
        });
    }
};

exports.users_group = users_group;
exports.tasks_groups = tasks_group;