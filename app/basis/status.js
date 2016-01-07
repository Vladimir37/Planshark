var errors = require('../router/errors');
var crypt = require('./crypt');

//checking user status
function status(type) {
    return function(req, res, next) {
        var cookie = req.cookies.status;
        if (!cookie) {
            if(type == 'hard' || type == 'medium') {
                errors.e403(req, res, next);
            }
            else {
                next();
            }
        }
        else {
            var result = crypt.decrypt(cookie);
            if (result) {
                var status_data = JSON.parse(result);
                var user_status = {
                    room: status_data[0],
                    group: status_data[1],
                    id: status_data[2]
                };
                if(type == 'hard') {
                    res.user_status = user_status;
                    next();
                }
                else if(type == 'medium') {
                    if(user_status.room) {
                        res.user_status = user_status;
                        next();
                    }
                    else {
                        errors.e403(req, res, next);
                    }
                }
                else {
                    res.user_status = user_status;
                    next();
                }
            }
            else {
                if(type == 'hard' || type == 'medium') {
                    errors.e403(req, res, next);
                }
                else {
                    next();
                }
            }
        }
    }
};

exports.hard = status('hard');
exports.medium = status('medium');
exports.soft = status('soft');