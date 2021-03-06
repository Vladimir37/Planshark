var db = require('../database');
var crypt = require('../crypt');
var mail_send = require('../mail');

//creating user group
function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //group data
    var group_name = req.body.name;
    var color = req.body.color;
    var creating_r = +Boolean(req.body.creating) || 0;
    var editing_r = +Boolean(req.body.editing) || 0;
    var reassignment_r = +Boolean(req.body.reassignment) || 0;
    var deleting_r = +Boolean(req.body.deleting) || 0;
    var user_manage_r = +Boolean(req.body.user_manage) || 0;
    var task_manage_r = +Boolean(req.body.task_manage) || 0;
    var all_view_r = +Boolean(req.body.all_view) || 0;
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
            u_group_manage: user_manage_r,
            all_view: all_view_r
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
    var author_group = +res.user_status.group;
    //group data
    var group_id = req.body.id;
    var group_name = req.body.name;
    var color = req.body.color;
    var creating_r = +Boolean(req.body.creating) || 0;
    var editing_r = +Boolean(req.body.editing) || 0;
    var reassignment_r = +Boolean(req.body.reassignment) || 0;
    var deleting_r = +Boolean(req.body.deleting) || 0;
    var user_manage_r = +Boolean(req.body.user_manage) || 0;
    var task_manage_r = +Boolean(req.body.task_manage) || 0;
    var all_view_r = +Boolean(req.body.all_view) || 0;
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
            u_group_manage: user_manage_r,
            all_view: all_view_r
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

//deleting user group
function deleting(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //group data
    var group_id = req.body.id;
    var new_group = req.body.u_group || null;
    //right to delete
    var delete_right = false;
    author_group == 0 ? delete_right = true : delete_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.u_group_manage == 1 ? delete_right = true : delete_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        console.log(err);
        if(delete_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users.update({
            u_group: new_group
        }, {
            where: {
                u_group: group_id,
                room
            }
        });
    }).then(function() {
        return db.users_groups.destroy({
            where: {
                id: group_id,
                room
            }
        });
    }).then(function() {
        res.end('0');
    }).catch(function(err) {
        console.log(err);
        res.end('1');
    });
};

//add user to group
function adding(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //group data
    var user_id = req.body.u_id;
    var group_id = req.body.g_id;
    //right to delete
    var add_right = false;
    author_group == 0 ? add_right = true : add_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.u_group_manage == 1 ? add_right = true : add_right = false;
        return db.users_groups.findOne({
            where: {
                id: group_id,
                room
            }
        });
    }).then(function(group) {
        if(!group) {
            add_right = false;
            throw '1';
        }
        else {
            return Promise.resolve();
        }
    }).catch(function(err) {
        console.log(err);
        if(add_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users.update({
            u_group: group_id
        }, {
            where: {
                id: user_id
            }
        });
    }).then(function() {
        res.end('0');
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

//creating new user
function new_user(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //user data
    var target_group = req.body.u_group || 0;
    var name = req.body.name;
    var pass_raw = req.body.pass;
    var mail = req.body.mail;
    //pass processing
    var pass = crypt.encrypt(pass_raw);
    //right to creating users
    var create_right = false;
    author_group == 0 ? create_right = true : create_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group || !pass) {
            throw '1';
        }
        group.u_group_manage == 1 ? create_right = true : create_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        if(create_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users.findOne({
            where: {
                name
            }
        });
    }).then(function(user) {
        if(user) {
            res.end('2');
        }
        else {
            return db.users.findOne({
                where: {
                    mail
                }
            });
        }
    }).then(function(user) {
        if(user) {
            res.end('3');
        }
        else {
            return db.users.create({
                name,
                pass,
                mail,
                room,
                u_group: target_group
            });
        }
    }).then(function() {
        mail_send('invite', mail, 'You are invited to Planshark', {
            login: name,
            pass: pass_raw
        });
        res.end('0');
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

//blocking and deleting user
function blocking(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //user data
    var target_user = req.body.id;
    //right to blocking
    var block_right = false;
    author_group == 0 ? block_right = true : block_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group || !pass) {
            throw '1';
        }
        group.u_group_manage == 1 ? block_right = true : block_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        if(block_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users.update({
            active: 0
        }, {
            where: {
                id: target_user,
                active: 1,
                room
            }
        });
    }).then(function () {
        res.end('0');
    }).catch(function (err) {
        console.log(err);
        res.end('1');
    });
};

function unblock(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //user data
    var target_user = req.body.id;
    //right to blocking
    var block_right = false;
    author_group == 0 ? block_right = true : block_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group || !pass) {
            throw '1';
        }
        group.u_group_manage == 1 ? block_right = true : block_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        if(block_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users.update({
            active: 1
        }, {
            where: {
                id: target_user,
                active: 0,
                room
            }
        });
    }).then(function () {
        res.end('0');
    }).catch(function (err) {
        console.log(err);
        res.end('1');
    });
};

//edit user
function change(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //user data
    var target_user = req.body.id;
    var target_name = req.body.name;
    var mail = req.body.mail;
    var target_group = req.body.u_group;
    //right to blocking
    var edit_right = false;
    author_group == 0 ? edit_right = true : edit_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.u_group_manage == 1 ? edit_right = true : edit_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        if(edit_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.users.update({
            mail,
            name: target_name,
            u_group: target_group
        }, {
            where: {
                id: target_user,
                active: 1,
                room
            }
        });
    }).then(function () {
        res.end('0');
    }).catch(function (err) {
        console.log(err);
        res.end('1');
    });
};

exports.create = creating;
exports.edit = editing;
exports.deleting = deleting;
exports.add = adding;
exports.new_user = new_user;
exports.block = blocking;
exports.unblock = unblock;
exports.change = change;