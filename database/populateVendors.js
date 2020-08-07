'use strict';

const vendorList = require('./vendorList');
const classes = require('../utils/classes');
const db = require('../database');
const T1Vendor = db.model('t1Vendor');

let run = async () => {
	try {
		await db.sync({force: true});
	} catch(e) {
		console.log('could not sync', e)
	}
	Object.keys(vendorList).forEach(async (vendorDomain) => {
		let t1Vendor = vendorList[vendorDomain];

		let newRecord = new classes.T1Vendor(
			t1Vendor.name,
			vendorDomain,
			t1Vendor.id,
			t1Vendor.vendor_type
		);

		try {
			await T1Vendor.create(newRecord);
		} catch(e) {
			console.log(e)
		}	
	});
}

run();