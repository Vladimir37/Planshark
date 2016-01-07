var errors = require('../router/errors');
var crypt = require('./crypt');

//checking user status
function status_hard(req, res, next) {
    var cookie = req.cookies.status;
    if(!cookie) {
        errors.e403(req, res, next);
    }
    else {
        var result = crypt.decrypt(cookie);
        if(result) {
            var status_data = JSON.parse(result);
            res.user_status = {
                room: status_data[0],
                group: status_data[1],
                id: status_data[2]
            };
            next();
        }
        else {
            errors.e403(req, res, next);
        }
    }
};