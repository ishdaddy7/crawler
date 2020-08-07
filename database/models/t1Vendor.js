'use strict';

const db = require('../_db');
const DataTypes = db.Sequelize;


module.exports = db.define('t1Vendor', {
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
	domain: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	t1Id: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	type1: {
		type: DataTypes.STRING,
		allowNull: false
	}
});
