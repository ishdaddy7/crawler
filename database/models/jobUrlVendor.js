'use strict';

const db = require('../_db');
var DataTypes = db.Sequelize;

module.exports = db.define('jobUrlVendor', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	url: {
		type: DataTypes.STRING(2048),
		allowNull: true		
	},
	responseDateTime: {
		type: DataTypes.STRING,
		allowNull: true
	}
});

