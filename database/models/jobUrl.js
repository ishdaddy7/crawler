'use strict';

const db = require('../_db');
const DataTypes = db.Sequelize;


module.exports = db.define('jobUrl', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: true
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false		
	},
	acceptedCookies: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	status: {
		type: DataTypes.ENUM('Pending', 'Complete', 'Error'),
		allowNull: false
	},
	note: {
		type: DataTypes.STRING,
		allowNull: true
	}
});

