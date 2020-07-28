
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
	constructor(url, responseDateTime, jobUrlId, vendorId) {
		this.url = url;
		this.responseDateTime = responseDateTime;
		this.jobUrlId = jobUrlId;
		this.vendorId = vendorId
	}
}

class Vendor {
	constructor(name, domain, t1Id, party, type1, type2, type3, note, current=false, corrected=false) {
		this.name = name;
		this.domain = domain;
		this.t1Id = t1Id;
		this.party = party;
		this.type1 = type1;
		this.type2 = type2;
		this.type3 = type3;
		this.note = note;
		this.current = current;
		this.corrected = corrected;
	}
}

module.exports = {
	Job,
	JobUrl,
	JobUrlVendor,
	Vendor
}