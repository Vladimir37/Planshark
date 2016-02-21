var db = require('../database');
var crypt = require('../crypt');
var mail_send = require('../mail');
var config = require('../../../config/app');

//RegExp for mail
var re_mail = new RegExp('.+@.+\..+');

//login interface
function login(req, res, next) {
    var login = req.body.name;
    var pass = req.body.pass;
    var remember = req.body.remember;
    if(!login || !pass) {
        res.end('1');
        return 1;
    }
    db.users.findOne({
        where: {
            name: login
        }
    }).then(function(user) {
        if(!user) {
            res.end('1');
        }
        else {
            var right_pass = crypt.decrypt(user.pass);
            if(right_pass == pass) {
                var cookie_data = [user.room || false, user.u_group || false, user.id];
                var cookie = crypt.encrypt(JSON.stringify(cookie_data));
                var expiration;
                remember ? expiration = {maxAge: 604800000} : expiration = {};
                res.cookie('planshark_status', cookie, expiration);
                res.end('0');
            }
            else {
                res.end('1');
            }
        }
    }, function(err) {
        console.log(err);
        res.end('2');
    });
};

//check unoccupied name
function free_name(req, type) {
    //type: name/mail
    return new Promise(function(resolve, reject) {
        var name = req.body[type];
        if (!name) {
            reject(3);
        }
        else {
            db.users.findOne({
                where: {
                    [type]: name
                }
            }).then(function (user) {
                if (user) {
                    reject(1);
                }
                else {
                    if(type == 'mail' && !re_mail.test(name)) {
                        console.log(type == 'mail' && !re_mail.test(name));
                        reject(4);
                    }
                    resolve(0);
                }
            }, function (err) {
                reject(2);
            });
        }
    });
};

//creating new user
function registration(req, res, next) {
    var type = req.body.type;
    var mail = req.body.mail;
    var name = req.body.name;
    var raw_pass = req.body.pass;
    var pass = crypt.encrypt(raw_pass);
    if((type != 'personal' && type != 'company') || !mail || !name || !raw_pass || !pass) {
        res.end('3');
    }
    else {
        free_name(req, 'name').then(function(name_status) {
            if(name_status == 0) {
                return free_name(req, 'mail');
            }
            else {
                throw '1';
            }
        }).then(function(mail_status) {
            if(mail_status == 0) {
                return db.users.create({
                    name,
                    pass,
                    mail,
                    room: null
                });
            }
            else {
                throw '2';
            }
        }).then(function(new_user) {
            if(type == 'company') {
                return db.rooms.create({
                    master: new_user.id
                });
            }
            else {
                res.end('0');
                return Promise.resolve();
            }
        }).then(function(new_rooms) {
            if(type == 'company') {
                return db.users.update({
                    room: new_rooms.id
                }, {
                    where: {
                        id: new_rooms.master
                    }
                });
            }
            else {
                return Promise.resolve();
            }
        }).then(function() {
            mail_send('registration', mail, 'Registration in Planshark', {name, pass});
            res.end('0');
        }).catch(function(err) {
            console.log(err);
            var error_type = err.toString();
            res.end(error_type);
        });
    }
};

//change password
function change(req, res, next) {
    var mail = req.body.mail;
    var old_pass = req.body.old_pass;
    var new_pass_one = req.body.new_pass_one;
    var new_pass_two = req.body.new_pass_two;
    if(new_pass_one != new_pass_two || !new_pass_one || !new_pass_two) {
        res.end('4');
    }
    else {
        db.users.findOne({
            where: {
                mail
            }
        }).then(function(user) {
            if(!user) {
                throw '3';
            }
            else {
                var target_pass = crypt.decrypt(user.pass);
                if(target_pass != old_pass) {
                    throw '3';
                }
                var new_pass_encrypt = crypt.encrypt(new_pass_one);
                return db.users.update({
                    pass: new_pass_encrypt
                }, {
                    where: {
                        mail
                    }
                });
            }
        }).then(function() {
            mail_send('change', mail, 'Password in Planshark', {new_pass_one});
            res.end('0');
        }).catch(function(err) {
            console.log(err);
            res.end(err.toString());
        })
    }
};

//pass reminder
function reminder(req, res, next) {
    var mail = req.body.mail;
    db.users.findOne({
        where: {
            mail
        }
    }).then(function(user) {
        if(!user) {
            res.end('3');
        }
        else {
            var pass = crypt.decrypt(user.pass);
            mail_send('reminder', mail, 'Password in Planshark', {pass, name: user.name});
            res.end('0');
        }
    }, function(err) {
        console.log(err);
        res.end('1');
    });
};

//data about user in JSON. False if not logged
function status(req, res, next) {
    var cookie = JSON.parse(crypt.decrypt(req.cookies.planshark_status));
    if(!cookie) {
        res.end('false');
    }
    else {
        var status_data = {};
        status_data.id = cookie[2];
        status_data.room = cookie[0];
        status_data.group = cookie[1];
        db.users.findById(status_data.id).then(function(user) {
            status_data.name = user.name;
            if(!status_data.room) {
                res.end(JSON.stringify(status_data));
                return JSON.stringify(status_data);
            }
            if(status_data.group == 0) {
                status_data.t_manage = true;
                status_data.u_manage = true;
                status_data.creating = true;
                status_data.editing = true;
                status_data.reassignment = true;
                status_data.deleting = true;
                status_data.viewing = true;
                res.end(JSON.stringify(status_data));
                return JSON.stringify(status_data);
            }
            else {
                return db.users_groups.findById(status_data.group);
            }
        }).then(function(user_group) {
            status_data.t_manage = Boolean(+user_group.t_group_manage);
            status_data.u_manage = Boolean(+user_group.u_group_manage);
            status_data.creating = Boolean(+user_group.creating);
            status_data.editing = Boolean(+user_group.editing);
            status_data.reassignment = Boolean(+user_group.reassignment);
            status_data.deleting = Boolean(+user_group.deleting);
            status_data.viewing = Boolean(+user_group.all_view);
            res.end(JSON.stringify(status_data));
        }).catch(function(err) {
            console.log(err);
            res.end('false');
        })
    }
};

//appeal to support
function appeal(req, res, next) {
    var mail = req.body.mail;
    var text = req.body.text;
    mail_send('appeal', config.support_mail, 'Appeal', {mail, text});
    res.end('0');
};

//exit from account
function exit(req, res, next) {
    res.clearCookie('planshark_status');
    res.end('0');
};

exports.login = login;
exports.registration = registration;
exports.change = change;
exports.reminder = reminder;
exports.status = status;
exports.appeal = appeal;
exports.exit = exit;