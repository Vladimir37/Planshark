var db = require('../database');

function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //group data
    var group_name = req.body.name;
    var group_color = req.body.color;
    //access u_groups
    var group_access = req.body.groups;
    //right to work with tasks group
    var tasks_right = false;
    author_group == 0 ? tasks_right = true : tasks_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.t_group_manage == 1 ? tasks_right = true : tasks_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        console.log(err);
        if(tasks_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.tasks_groups.create({
            room,
            u_groups: group_access,
            name: group_name,
            color: group_color
        });
    }).then(function() {
        res.end('0');
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

//editing task group
function editing(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //group data
    var group_id = req.body.id;
    var group_name = req.body.name;
    var group_color = req.body.color;
    //access u_groups
    var group_access = req.body.groups;
    //right to work with tasks group
    var tasks_right = false;
    author_group == 0 ? tasks_right = true : tasks_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.t_group_manage == 1 ? tasks_right = true : tasks_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        console.log(err);
        if(tasks_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.tasks_groups.update({
            u_groups: group_access,
            name: group_name,
            color: group_color
        }, {
            where: {
                id: group_id,
                room
            }
        });
    }).then(function() {
        res.end('0');
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

//deleting task group
function deleting(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //group data
    var group_id = req.body.id;
};

exports.create = creating;
exports.edit = editing;
exports.deleting = deleting;