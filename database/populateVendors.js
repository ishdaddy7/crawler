'use strict';

const vendorList = require('./vendorList');
const classes = require('../utils/classes');
const db = require('../database');
const Vendor = db.model('vendor');

let run = async () => {
	try {
		await db.sync({force: true});
	} catch(e) {
		console.log('could not sync', e)
	}
	Object.keys(vendorList).forEach(async (vendorDomain) => {
		let t1Vendor = vendorList[vendorDomain];

		let newRecord = new classes.Vendor(
			t1Vendor.name,
			vendorDomain,
			t1Vendor.id,
			'third_party',
			t1Vendor.vendor_type,
			undefined,
			undefined,
			undefined,
			false,
			false
		);

		try {
			await Vendor.create(newRecord);
		} catch(e) {
			console.log(e)
		}	
	});
}

run();