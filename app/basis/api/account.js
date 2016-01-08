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
function free_name(req, res, next) {
    var name = req.body.login;
    if(!name) {
        res.end('3');
    }
    else {
        db.users.findOne({
            where: {
                name: name
            }
        }).then(function(user) {
            if(user) {
                res.end('1');
            }
            else {
                res.end('0');
            }
        }, function(err) {
            console.log(err);
            res.end('2');
        });
    }
};