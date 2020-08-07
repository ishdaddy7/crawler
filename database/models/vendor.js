'use strict';

const db = require('../_db');
const DataTypes = db.Sequelize;


module.exports = db.define('vendor', {
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
		allowNull: false
	},
	party: {
		type: DataTypes.ENUM('first_party', 'third_party'),
		allowNull: false		
	},
	type1: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type2: {
		type: DataTypes.STRING,
		allowNull: true
	},
	type3: {
		type: DataTypes.STRING,
		allowNull: true
	},
	note: {
		type: DataTypes.STRING,
		allowNull: true
	},
	current: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	tech_stack: {
		type: DataTypes.BOOLEAN,
		allowNull: true
	}
});
