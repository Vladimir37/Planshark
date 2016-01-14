var db = require('../database');
var serializing = require('../serializing');

//get user groups
function user_group(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //right to view all users
    var view_right = false;
    author_group == 0 ? view_right = true : view_right = false;
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
        return serializing(0, groups);
    }).catch(function(err) {
        console.log(err);
        res.end(serializing(1));
    });
};

//get all users in room
function users(req, res, next) {
    //
};

exports.user_group = user_group;
exports.users = users;