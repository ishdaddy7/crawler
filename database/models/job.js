'use strict';

const db = require('../_db');
const DataTypes = db.Sequelize;


module.exports = db.define('job', {
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
	numLinksToSniff: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	jobType: {
		type: DataTypes.ENUM('Prospect', 'Customer', 'Target List', 'Other'),
		allowNull: false		
	},
	internalId: {
		type: DataTypes.STRING,
		allowNull: true
	},
	internalIdType: {
		type: DataTypes.ENUM('SFDC', 'T1 Org', 'Other'),
		allowNull: true
	},
	status: {
		type: DataTypes.ENUM('Pending', 'Complete', 'Error'),
		allowNull: false
	},
	note: {
		type: DataTypes.STRING,
		allowNull: true
	},
	acceptedCookies: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	linkCount: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
});
