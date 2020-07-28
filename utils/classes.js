
class Job {
	constructor(name, url, numLinksToSniff, jobType, internalId, internalIdType, status='Pending', note, acceptedCookies=false, linkCount=0) {
		this.name = name;
		this.url = url;
		this.numLinksToSniff = numLinksToSniff;
		this.jobType = jobType;
		this.internalId = internalId;
		this.internalIdType = internalIdType;
		this.status = status;
		this.note = note;
		this.acceptedCookies = acceptedCookies;
		this.linkCount = linkCount;
	}
}


class JobUrl {
	constructor(name, url, acceptedCookies=false, jobId, status='Pending', note) {
		this.name = name;
		this.url = url;
		this.acceptedCookies = acceptedCookies;
		this.jobId = jobId;
		this.status = status;
		this.note = note;
	}
}

class JobUrlVendor {
	constructor(vendorUrl, vendorDomain, vendorName, vendorId, vendorType, vendorParty, responseDateTime, jobUrlId) {
		this.vendorUrl = vendorUrl;
		this.vendorDomain = vendorDomain;
		this.vendorName = vendorName;
		this.t1VendorId = vendorId;
		this.vendorType = vendorType;
		this.vendorParty = vendorParty;
		this.responseDateTime = responseDateTime;
		this.jobUrlId = jobUrlId;
	}
}



module.exports = {
	Job,
	JobUrl,
	JobUrlVendor
}