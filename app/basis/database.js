var Sequelize = require('sequelize');

var db_config = require('../../configs/db');

var sequelize = new Sequelize(db_config.database, db_config.login, db_config.pass, {
    dialect: db_config.dialect,
    port: db_config.port
    //logging: false
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
    room: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    u_group: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
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
    performer: Sequelize.INTEGER,
    t_group: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    u_group: {
        type: Sequelize.INTEGER,
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
    expiration: Sequelize.TEXT,
    closedAt: Sequelize.DATETIME
});