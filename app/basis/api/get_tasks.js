var db = require('../database');
var serializing = require('../serializing');

//get tasks for user
function active_tasks(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //personal
    if(!room) {
        db.tasks.findAll({
            where: {
                user: author,
                active: 1
            }
        }).then(function(result) {
            res.end(serializing(0, result));
        }, function(err) {
            console.log(err);
            res.end(serializing(1));
        })
    }
    //company
    else {
        //
    }
};

exports.get_tasks = get_tasks;