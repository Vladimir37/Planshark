var db = require('../database');

//creating new task
function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //task data
    var performer = req.body.performer || author;
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
            console.log(!author_group);
            console.log(author_group != 0);
            if((!author_group && (author_group != 0)) || (author_group && !a_group.creating)) {
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
            console.log(err);
            res.end('1');
        })
    }
};

//editing task
function editing(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //task data
    var task_id = req.body.task_id;
    var t_group = req.body.t_group || null;
    var u_group = req.body.u_group || null;
    var priority = req.body.priority;
    var task_name = req.body.name;
    var task_description = req.body.description;
    var expiration = req.body.expiration || null;
    //right to edit
    var edit_right = false;
    //personal
    if(!room) {
        db.tasks.update({
            t_group,
            priority,
            name: task_name,
            description: task_description,
            editor: author,
            expiration
        }, {
            where: {
                id: task_id,
                author
            }
        }).then(function() {
            res.end('0');
        }, function(err) {
            res.end('1');
        });
    }
    //company
    else {
        db.users_groups.findById(author_group).then(function(result) {
            if((!author_group && (author_group != 0)) || (author_group && !a_group.editing)) {
                throw '1';
            }
            else {
                author_group == 0 ? edit_right = true : edit_right = false;
                result.editing == 1 ? edit_right = true : edit_right = false;
                return db.tasks.findById(task_id);
            }
        }).then(function(result) {
            if(!result) {
                throw '1';
            }
            else {
                result.t_group == 0 ? edit_right = true : edit_right = false;
                return db.tasks_groups.findById(result.u_group);
            }
        }).then(function(result) {
            if (!result) {
                throw '1';
            }
            else {
                var allowed_user_groups = JSON.parse(result.u_groups);
                allowed_user_groups.indexOf(author_group) != -1 ? edit_right = true : edit_right = false;
                return Promise.resolve();
            }
        }).catch(function(err) {
            if(edit_right) {
                return Promise.resolve();
            }
            else {
                res.end('1');
            }
        }).then(function() {
            return db.tasks.update({
                t_group,
                priority,
                name: task_name,
                description: task_description,
                editor: author,
                expiration
            }, {
                where: {
                    id: task_id,
                    room
                }
            });
        }).then(function() {
            res.end('0');
        }, function(err) {
            console.log(err);
            res.end('1');
        });
    }
};

//reassignment task to other performer
function reassignment(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //task data
    var task_id = req.body.task_id;
    var performer = req.body.performer;
    //right to reassign
    var assign_right = false;
    author_group == 0 ? assign_right = true : assign_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        if(!group) {
            throw '1';
        }
        group.reassignment == 1 ? assign_right = true : assign_right = false;
        return Promise.resolve();
    }).catch(function(err) {
        if(assign_right) {
            return Promise.resolve();
        }
        else {
            res.end('1');
        }
    }).then(function() {
        return db.tasks.update({
            performer,
            editor: author
        }, {
            where: {
                id: task_id,
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

//deleting task
function deleting(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = +res.user_status.group;
    //task data
    var task_id = req.body.task_id;
    //right to delete
    var delete_right = false;
    //personal
    if(!room) {
        db.tasks.destroy({
            where: {
                id: task_id,
                author
            }
        }).then(function() {
            res.end('0');
        }, function(err) {
            console.log(err);
            res.end('1');
        });
    }
    //company
    else {
        author_group == 0 ? delete_right = true : delete_right = false;
        db.users_groups.findById(author_group).then(function(group) {
            if(!group) {
                throw '1';
            }
            group.deleting == 1 ? delete_right = true : delete_right = false;
            return Promise.resolve();
        }).catch(function(err) {
            if(delete_right) {
                return Promise.resolve();
            }
            else {
                res.end('1');
            }
        }).then(function() {
            return db.tasks.destroy({
                where: {
                    id: task_id,
                    room
                }
            });
        }).then(function() {
            res.end('0');
        }, function(err) {
            console.log(err);
            res.end('1');
        });
    }
};

//closing task
function closing(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    //task data
    var task_id = req.body.task_id;
    var answer = req.body.answer;
    //personal
    if(!room) {
        db.tasks.update({
            active: 0,
            answer,
            closedAt: new Date()
        }, {
            where: {
                id: task_id,
                author
            }
        }).then(function() {
            res.end('0');
        }, function(err) {
            console.log(err);
            res.end('1');
        });
    }
    //company
    else {
        db.tasks.update({
            active: 0,
            answer,
            closedAt: new Date()
        }, {
            where: {
                id: task_id,
                room
            }
        }).then(function() {
            res.end('0');
        }, function(err) {
            console.log(err);
            res.end('1');
        });
    }
};

exports.create = creating;
exports.edit = editing;
exports.reassign = reassignment;
exports.deleting = deleting;
exports.close = closing;