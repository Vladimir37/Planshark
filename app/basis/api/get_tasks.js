var db = require('../database');

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
                user
            }
        })
    }
};

exports.get_tasks = get_tasks;