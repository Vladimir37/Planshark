var db = require('../database');
var serializing = require('../serializing');

function users(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    db.users.findAll({
        where: {
            room
        }
    }).then(function(users) {
        var result = [];
        users.forEach(function(item) {
            result.push([item.id, item.name]);
        });
        res.end(serializing(0, result));
    }, function(err) {
        console.log(err);
        res.end(serializing(1));
    });
};

function t_groups(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    //personal
    db.tasks_groups.findAll({
        where: {
            user: author
        }
    }).then(function(groups) {
        var result = [];
        groups.forEach(function(item) {
            result.push([item.id, item.name]);
        });
        res.end(serializing(0, result));
    }, function(err) {
        console.log(err);
        res.end(serializing(1));
    });
    //company
    db.tasks_groups.findAll({
        where: {
            room
        }
    }).then(function(groups) {
        var result = [];
        groups.forEach(function(item) {
            result.push([item.id, item.name]);
        });
        res.end(serializing(0, result));
    }, function(err) {
        console.log(err);
        res.end(serializing(1));
    });
};

function u_groups(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    //personal
    db.users_groups.findAll({
        where: {
            user: author
        }
    }).then(function(groups) {
        var result = [];
        groups.forEach(function(item) {
            result.push([item.id, item.name]);
        });
        res.end(serializing(0, result));
    }, function(err) {
        console.log(err);
        res.end(serializing(1));
    });
    //company
    db.users_groups.findAll({
        where: {
            room
        }
    }).then(function(groups) {
        var result = [];
        groups.forEach(function(item) {
            result.push([item.id, item.name]);
        });
        res.end(serializing(0, result));
    }, function(err) {
        console.log(err);
        res.end(serializing(1));
    });
};

exports.users = users;
exports.t_groups = t_groups;
exports.u_groups = u_groups;