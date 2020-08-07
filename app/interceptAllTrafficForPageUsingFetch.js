const pd = require('parse-domain');
const vendors = require('../database/vendorList');
const classes = require('../utils/classes');
const db = require('../database/');
const JobUrl = db.model('jobUrl');
const JobUrlVendor = db.model('jobUrlVendor');
const T1Vendor = db.model('t1Vendor')
const Vendor = db.model('vendor');
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
            
            let vendorDomain = getDomain(url, false);
            let vendorHostName = getDomain(url, true);
            let advDomain = getDomain(advUrl, false);
            
            if (vendorDomain) {
                try {
                    //look for existing T1 vendor
                    //check for vendor
                    //if no vendor, check t1 for vendor
                    //make new vendor record
                    //or use existing record
                    let vendorRecord = await (Vendor.findOne({
                        where: {
                            hostName: vendorHostName
                        }
                    }));
                    
                    let vendorId;

                    if (vendorRecord) {
                        console.log('found vendor!', vendorHostName)
                        vendorId = vendorRecord.id;
                    } else {
                        let vendorName = 'TBD'
                        let t1VendorId = null;
                        let party = advDomain === vendorDomain ? 'first_party' : 'third_party';
                        let vendorType = 'TBD'

                        let t1VendorRecord = await T1Vendor.findOne({
                            where: {
                                domain: vendorDomain
                            }
                        });

                        if (t1VendorRecord) {
                            vendorName = t1VendorRecord.name
                            t1VendorId = t1VendorRecord.t1Id
                            vendorType = t1VendorRecord.type1
                        }

                        let newVendor = new classes.Vendor(
                            vendorName, //name
                            vendorHostName,
                            t1VendorId, //t1Id
                            party, 
                            vendorType, // type1
                            'TBD', // type2
                            'TBD', // type3
                            null, // note
                        )
                        try {
                            console.log('adding new vendor', vendorHostName)
                            vendorRecord = await Vendor.create(newVendor);
                            vendorId = vendorRecord.id
                        } catch (e) {
                            console.log('vendor already exists or error', vendorHostName);
                        }
                    }

                    let jobUrlVendor = new classes.JobUrlVendor(
                        //headers.Referer,
                        url,
                        responseDateTime,
                        jobUrlId,
                        vendorId
                    );
                    //write to db
                    await JobUrlVendor.create(jobUrlVendor);
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
