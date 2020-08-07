
class Job {
	constructor(name, url, numLinksToSniff, jobType, jobTypeName, internalId, internalIdType, status='Pending', note, acceptedCookies=false, linkCount=0) {
		this.name = name;
		this.url = url;
		this.numLinksToSniff = numLinksToSniff;
		this.jobType = jobType;
		this.jobTypeName = jobTypeName;
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
		this.name = name.trim().substr(0,50);
		this.url = url.trim().substr(0,255);
		this.acceptedCookies = acceptedCookies;
		this.jobId = jobId;
		this.status = status;
		this.note = note;
	}
}

class JobUrlVendor {
	constructor(url, responseDateTime, jobUrlId, vendorId) {
		this.url = url.trim().substr(0,255);
		this.responseDateTime = responseDateTime;
		this.jobUrlId = jobUrlId;
		this.vendorId = vendorId
	}
}

class Vendor {
	constructor(name, hostName, t1Id, party, type1, type2, type3, note, current=false, corrected=false) {
		this.name = name;
		this.hostName = hostName;
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

class T1Vendor {
	constructor(name, domain, t1Id, type1) {
		this.name = name;
		this.domain = domain.trim().substr(0,255);
		this.t1Id = t1Id;
		this.type1 = type1;
	}
}

module.exports = {
	Job,
	JobUrl,
	JobUrlVendor,
	Vendor,
	T1Vendor
}