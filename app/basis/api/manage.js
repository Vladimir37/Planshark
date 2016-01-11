var db = require('../database');

//creating user group
function creating(req, res, next) {
    //author data
    var author = res.user_status.id;
    var room = res.user_status.room;
    var author_group = res.user_status.group;
    //group data
    var group_name = req.body.name;
    var color = req.body.color;
    var creating = req.body.creating || 0;
    var editing = req.body.editing || 0;
    var reassignment = req.body.reassignment || 0;
    var deleting = req.body.deleting || 0;
    var user_creating = req.body.user_creating || 0;
    //right to create
    var create_right = false;
    author_group == 0 ? create_right = true : create_right = false;
    db.users_groups.findById(author_group).then(function(group) {
        //
    })
};

exports.creating = creating;