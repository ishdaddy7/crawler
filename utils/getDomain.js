const pd = require('parse-domain');

const getDomain = (url) => {
	let domainInfo = pd.parseDomain(
        pd.fromUrl(url)
  	);

  	let tld = 'unknown';
  	let domain = 'unknown';
  	if (domainInfo.domain || domainInfo.topLevelDomains) {
        tld = domainInfo.topLevelDomains.join('.');
        domain = domainInfo.domain;
	} else {
		return;
	}

	return [domain, tld].join('.');
}

module.exports = getDomain;