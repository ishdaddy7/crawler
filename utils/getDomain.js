const pd = require('parse-domain');

const getDomain = (url, returnHost) => {
	let domainInfo = pd.parseDomain(
        pd.fromUrl(url)
  	);

  	let tld = 'unknown';
  	let domain = 'unknown';
    let subDomains = 'unknown';

  	if (domainInfo.domain || domainInfo.topLevelDomains) {
        subDomains = domainInfo.subDomains.join(',');
        tld = domainInfo.topLevelDomains.join('.');
        domain = domainInfo.domain;
	} else {
		return;
	}

	if (returnHost) return [subDomains, domain, tld].join('.');
  else return [domain, tld].join('.');
}

module.exports = getDomain;