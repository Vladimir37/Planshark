var Sequelize = require('sequelize');

var db_config = require('../../config/db');

var sequelize = new Sequelize(db_config.database, db_config.login, db_config.pass, {
    dialect: db_config.dialect,
    port: db_config.port,
    logging: false
});


//testing connect
sequelize.authenticate().then(function() {
    console.log('Connect to DB created!');
}, function(err) {
    console.log('Connection error: ' + err);
});

var tables = {};

tables.users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.TEXT,
    pass: Sequelize.TEXT,
    mail: Sequelize.TEXT,
    room: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    u_group: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    active: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
});

tables.users_groups = sequelize.define('users_groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room: Sequelize.INTEGER,
    name: Sequelize.TEXT,
    color: Sequelize.TEXT,
    creating: Sequelize.INTEGER,
    editing: Sequelize.INTEGER,
    reassignment: Sequelize.INTEGER,
    deleting: Sequelize.INTEGER,
    t_group_manage: Sequelize.INTEGER,
    u_group_manage: Sequelize.INTEGER,
    all_view: Sequelize.INTEGER
});

tables.tasks_groups = sequelize.define('tasks_groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    user: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    name: Sequelize.TEXT,
    color: Sequelize.TEXT
});

tables.rooms = sequelize.define('rooms', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    master: Sequelize.INTEGER
});

tables.tasks = sequelize.define('tasks', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    author: Sequelize.INTEGER,
    editor: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    performer: {
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
        allowNull: true
    },
    t_group: {
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
        defaultValue: 0
    },
    u_group: {
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
        allowNull: true
    },
    priority: Sequelize.INTEGER,
    name: Sequelize.TEXT,
    description: Sequelize.TEXT,
    answer: Sequelize.TEXT,
    active: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    expiration: {
        type: Sequelize.DATE,
        allowNull: true
    },
    closedAt: Sequelize.DATE
});

//connection tables
tables.tasks.belongsTo(tables.tasks_groups, {foreignKey: 't_group'});
tables.tasks.belongsTo(tables.users_groups, {foreignKey: 'u_group'});
tables.users.belongsTo(tables.users_groups, {foreignKey: 'u_group'});
var performer_data = tables.tasks.belongsTo(tables.users, {foreignKey: 'performer', as: 'performer_data'});
var author_data = tables.tasks.belongsTo(tables.users, {foreignKey: 'author', as:'author_data'});
var editor_data = tables.tasks.belongsTo(tables.users, {foreignKey: 'editor', as:'editor_data'});

//synchronization tables
for(var table in tables) {
    tables[table].sync().then(function() {
        //success
    }, function(err) {
        console.log('Database error: ' + err);
    });
};

//aliases
tables.aliases = {
    performer_data,
    author_data,
    editor_data
};

module.exports = tables;