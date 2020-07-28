const pd = require('parse-domain');
const vendors = require('../database/vendorList');
const classes = require('../utils/classes');
const db = require('../database/');
const JobUrlVendor = db.model('jobUrlVendor');
const getDomain = require('../utils/getDomain');
/**
 * Captures all traffic including from Web Workers, does something with it, and continues the request
 * @param page The page/tab to capture from.
 */
module.exports = async (page, advUrl, jobUrlId) => {
    if (page) {
        const client = await page.target().createCDPSession();
        //see: https://chromedevtools.github.io/devtools-protocol/tot/Fetch#method-enable
        await client.send('Fetch.enable', {
            //see: https://chromedevtools.github.io/devtools-protocol/tot/Fetch#type-RequestPattern
            patterns: [{
                urlPattern: '*',
                requestStage: 'Response'
            }]
        });

        //see: https://chromedevtools.github.io/devtools-protocol/tot/Fetch#event-requestPaused
        await client.on('Fetch.requestPaused', async ({ requestId, request, responseHeaders }) => {
            const { url, type, headers } = request;
            const responseDateHeader = responseHeaders.find(el => el.name === 'Date');
            //@TODO - why does this trigger invalid date error?
            const responseDateTime = responseDateHeader ? responseDateHeader.value : null;
            let vendorDomain = getDomain(url);
            let advDomain = getDomain(advUrl);

            if (vendorDomain) {
                try {
                    let vendorDetails;

                    //distinguish same domain requests from 3p ones
                    if(advDomain === vendorDomain) {
                        vendorDetails = new classes.JobUrlVendor(
                            //headers.Referer,
                            url,
                            vendorDomain,
                            'first_party_request',
                            '-1',
                            'first_party',
                            'first_party',
                            responseDateTime,
                            jobUrlId
                        );
                    } else {
                        const t1Vendor = vendors[vendorDomain] || {};
                        const {name, id, vendor_type} = t1Vendor;
                        vendorDetails = new classes.JobUrlVendor(
                            //headers.Referer,
                            url,
                            vendorDomain,
                            name,
                            id,
                            vendor_type,
                            'third_party',
                            responseDateTime,
                            jobUrlId
                        );
                    }
                    //write to db
                    await JobUrlVendor.create(vendorDetails);
                } catch(e) {
                    console.log('error', e, vendorDomain);
                }
            } 

            //Do something like saving the response to disk
            //see: https://chromedevtools.github.io/devtools-protocol/tot/Fetch#method-continueRequest
            try {
                await client.send('Fetch.continueRequest', {
                    requestId
                })
            } catch(e) {
                console.log(e)
            }
        })
    }
}
