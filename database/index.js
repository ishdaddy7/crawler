'use strict';
var db = require('./_db');

const T1Vendor = require('./models/t1Vendor');
const Vendor = require('./models/vendor')
const Job = require('./models/job');
const JobUrl = require('./models/jobUrl');
const JobUrlVendor = require('./models/jobUrlVendor');


//Job.hasMany(JobUrl, { foreignKey: 'jobId' });
JobUrl.belongsTo(Job, { foreignKey: 'jobId' });

//JobUrl.hasMany(JobUrlVendor, { foreignKey: 'jobUrlId' });
JobUrlVendor.belongsTo(JobUrl, { foreignKey: 'jobUrlId' });

//Vendor.hasMany(JobUrlVendor, { foreignKey: 'vendorId'});
JobUrlVendor.belongsTo(Vendor, { foreignKey: 'vendorId'});

//don't force true before saving the vendor table!!
//db.sync({});
module.exports = db;