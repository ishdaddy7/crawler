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
	vendorUrl: {
		type: DataTypes.STRING(2048),
		allowNull: true		
	},
	vendorDomain: {
		type: DataTypes.STRING,
		allowNull: true
	},
	vendorName: {
		type: DataTypes.STRING,
		allowNull: true
	},
	t1VendorId: {
		type: DataTypes.STRING,
		allowNull: true
	},
	vendorType: {
		type: DataTypes.STRING,
		allowNull: true
	},
	vendorParty: {
		type: DataTypes.ENUM('first_party', 'third_party'),
		allowNull: true
	},
	responseDateTime: {
		type: DataTypes.STRING,
		allowNull: true
	}
});

