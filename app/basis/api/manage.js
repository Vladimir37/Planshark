var db = require('../database');

//creating user group
function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //group data
    var group_name = req.body.name;
    var color = req.body.color;
    var creating_r = req.body.creating || 0;
    var editing_r = req.body.editing || 0;
    var reassignment_r = req.body.reassignment || 0;
    var deleting_r = req.body.deleting || 0;
    var user_manage_r = req.body.user_manage || 0;
    var task_manage_r = req.body.task_manage || 0;
    //right to create
    var create_right = false;
    author_group == 0 ? create_right = true : create_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.u_group_manage == 1 ? create_right = true : create_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        console.log(err);
        if(create_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users_groups.create({
            name: group_name,
            room,
            color,
            creating: creating_r,
            editing: editing_r,
            deleting: deleting_r,
            reassignment: reassignment_r,
            t_group_manage: task_manage_r,
            u_group_manage: user_manage_r
        })
    }).then(function() {
        res.end('0');
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

//editing user group
function editing(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //group data
    var group_id = req.body.id;
    var group_name = req.body.name;
    var color = req.body.color;
    var creating_r = req.body.creating || 0;
    var editing_r = req.body.editing || 0;
    var reassignment_r = req.body.reassignment || 0;
    var deleting_r = req.body.deleting || 0;
    var user_manage_r = req.body.user_manage || 0;
    var task_manage_r = req.body.task_manage || 0;
    //right to create
    var edit_right = false;
    author_group == 0 ? edit_right = true : edit_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.u_group_manage == 1 ? edit_right = true : edit_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        console.log(err);
        if(edit_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users_groups.update({
            name: group_name,
            color,
            creating: creating_r,
            editing: editing_r,
            deleting: deleting_r,
            reassignment: reassignment_r,
            t_group_manage: task_manage_r,
            u_group_manage: user_manage_r
        }, {
            where: {
                id: group_id,
                room
            }
        })
    }).then(function() {
        res.end('0');
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

exports.create = creating;