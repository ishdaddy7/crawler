'use strict';
var db = require('./_db');
module.exports = db;

const Job = require('./models/job');
const JobUrl = require('./models/jobUrl');
const JobUrlVendor = require('./models/jobUrlVendor');

Job.hasMany(JobUrl, { foreignKey: 'jobId' });
JobUrl.belongsTo(Job, { foreignKey: 'jobId' });

JobUrl.hasMany(JobUrlVendor, { foreignKey: 'jobUrlId' });
JobUrlVendor.belongsTo(JobUrl, { foreignKey: 'jobUrlId' });

(async () => await db.sync({}))();