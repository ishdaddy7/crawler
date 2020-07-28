'use strict';

var config = require('./dbconfig.js');
var Sequelize = require('sequelize');

let db = new Sequelize(config.database, config.username, config.password, config);

module.exports = db;
