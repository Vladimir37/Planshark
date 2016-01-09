var db = require('../database');
var crypt = require('../crypt');

//login interface
function login(req, res, next) {
    var login = req.body.login;
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
                remember ? expiration = 604800000 : expiration = false;
                res.cookie('planshrak_status', cookie, {maxAge: expiration});
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
function free_name(type, func) {
    //type: name/mail
    return function(req, res, next) {
        var name = req.body[type];
        if (!name) {
            if(func) {
                return 3;
            }
            res.end('3');
        }
        else {
            db[type + 's'].findOne({
                where: {
                    [type]: name
                }
            }).then(function (user) {
                if (user) {
                    if(func) {
                        return 1;
                    }
                    res.end('1');
                }
                else {
                    if(func) {
                        return 0;
                    }
                    res.end('0');
                }
            }, function (err) {
                console.log(err);
                if(func) {
                    return 2;
                }
                res.end('2');
            });
        }
    }
};

//creating new user
function registration(req, res, next) {
    var type = req.body.type;
    var mail = req.body.mail;
    var name = req.body.name;
    var raw_pass = req.body.pass;
    var pass = crypt.encrypt(pass);
    if((type != 'personal' || type != 'company') || !mail || !name || !raw_pass || !pass) {
        res.end('3');
    }
    else {
        new Promise(function(resolve, reject) {
            var name_status = free_name('name', true)(req, res, next);
            if(name_status == 0) {
                resolve(0);
            }
            else {
                reject('1');
            }
        }).then(function() {
            var mail_status = free_name('mail', true)(req, res, next);
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
        }).then(function() {
            res.end('0');
        }).catch(function(err) {
            console.log(err);
            res.end(err);
        });
    }
};

exports.login = login;
exports.registration = registration;