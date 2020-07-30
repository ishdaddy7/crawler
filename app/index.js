const getAllLinks = require('./getAllLinks');
const checkUrl = require('./checkUrl');
const db = require('../database');
const classes = require('../utils/classes')
const Job = db.model('job');
const JobUrl = db.model('jobUrl');
const fs = require('fs').promises;
const config = require('../config');

module.exports = async () => {
	//don't force true before saving the vendor table!!
	console.log('starting job');
	//let jobUrl = 'https://www.mediamath.com/'
	//let jobUrl = 'https://www.omen.com/us/en.html';
	//let jobUrl = 'https://www.bmw.com/en/index.html';
	let jobUrl = 'https://www8.hp.com/us/en/home.html';
	//let jobUrl = 'https://www.chewy.com/'
	//let jobUrl = 'https://www.aldi.us/';
	//create new job in db
	let job = new classes.Job(
		'Chewy.com',
		jobUrl,
		config.numLinksToSniff,
		'Target List',
		null,
		null
	);

	let jobRecord = await Job.create(job);
	let jobRecordId = jobRecord.id;

	//create fresh cookie jar
	try {
		await fs.writeFile('./cookies.json', '');
	} catch(e) {
		console.log(e);
	}

	try {
		let links = await getAllLinks(jobUrl, jobRecordId);

		await Job.update(
			{linkCount: links.length},
			{where: {id: jobRecordId}}
		);

		//set to true once one url/page returns true for checkUrl
		let siteAcceptedCookies = false;

		if (links) {
			for (let i = 0; i < config.numLinksToSniff; i++) {
				let jobUrl = links[i][1];
				let jobUrlId = links[i][2];
				let urlAcceptedCookies = await checkUrl(jobUrl, jobUrlId);

				if (urlAcceptedCookies) siteAcceptedCookies = true;
				try {
					await JobUrl.update(
						{acceptedCookies: siteAcceptedCookies, status: 'Complete'},
						{where: {id: jobUrlId}}
					);
				} catch (e) {
					console.log(e);
				}
			}
		} else {
			await Job.update(
				{status: 'Error', note: `couldn\'t find any links on ${jobUrl}`},
				{where: {id: jobRecordId}}
			);
		}

		await Job.update(
			{status: 'Complete', acceptedCookies: siteAcceptedCookies},
			{where: {id: jobRecordId}}
		);
		
	} catch(e) {
		console.log(e)
		await Job.update(
			{status: 'Error', note: e.toString()},
			{where: {id: jobRecordId}}
		);
	}
	console.log('finishing job');
};

