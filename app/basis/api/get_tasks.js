var db = require('../database');
var serializing = require('../serializing');

//get active tasks for user
function active_tasks(all_tasks) {
    return function (req, res, next) {
        //author data
        var author = res.user_status.id;
        var room = res.user_status.room;
        var author_group = res.user_status.group || 0;
        //personal
        if (!room) {
            db.tasks.findAll({
                where: {
                    author,
                    active: 1
                },
                include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
            }).then(function (result) {
                res.end(serializing(0, result));
            }, function (err) {
                console.log(err);
                res.end(serializing(1));
            });
        }
        //company
        else {
            //search conditions
            var company_conditions;
            if(!all_tasks) {
                company_conditions = {
                    room,
                    active: 1,
                    $or: {
                        u_group: author_group,
                        performer: author
                    }
                };
            }
            else {
                company_conditions = {
                    room,
                    active: 1
                };
            }
            //search
            db.tasks.findAll({
                where: company_conditions,
                include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
            }).then(function (result) {
                res.end(serializing(0, result));
            }, function (err) {
                console.log(err);
                res.end(serializing(1));
            });
        }
    }
}

//get inactive tasks for user
function inactive_tasks(all_tasks) {
    return function (req, res, next) {
        //author data
        var author = res.user_status.id;
        var room = res.user_status.room;
        var author_group = res.user_status.group;
        //personal
        if (!room) {
            db.tasks.findAll({
                where: {
                    author,
                    active: 0
                },
                include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
            }).then(function (result) {
                res.end(serializing(0, result));
            }, function (err) {
                console.log(err);
                res.end(serializing(1));
            });
        }
        //company
        else {
            //search conditions
            var company_conditions;
            if(!all_tasks) {
                company_conditions = {
                    room,
                    active: 0,
                    $or: {
                        u_group: author_group,
                        performer: author
                    }
                };
            }
            else {
                company_conditions = {
                    room,
                    active: 0
                };
            }
            //search
            db.tasks.findAll({
                where: company_conditions,
                include: [db.tasks_groups, db.users_groups, db.aliases.author_data, db.aliases.performer_data]
            }).then(function (result) {
                res.end(serializing(0, result));
            }, function (err) {
                console.log(err);
                res.end(serializing(1));
            });
        }
    }
};

exports.active_tasks = active_tasks;
exports.inactive_tasks = inactive_tasks;