var db = require('../database');
var crypt = require('../crypt');

//login interface
function login(req, res, next) {
    var login = req.body.login;
    var pass = req.body.pass;
    var remember = req.body.remember;
    if(!login || !pass) {
        return {
            status: 1
        };
    }
};