const pd = require('parse-domain');
const vendors = require('../database/vendorList');
const classes = require('../utils/classes');
const db = require('../database/');
const JobUrl = db.model('jobUrl');
const JobUrlVendor = db.model('jobUrlVendor');
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
            let vendorDomain = getDomain(url);
            let advDomain = getDomain(advUrl);

            if (vendorDomain) {
                try {
                    //look for existing vendor
                    let vendorRecord = await Vendor.findOne({
                        where: {
                            domain: vendorDomain
                        }
                    });

                    //add vendor if missing
                    if (!vendorRecord) {
                        let party = 'third_party';
                        if (advDomain === vendorDomain) party = 'first_party';
                        let newVendor = new classes.Vendor(
                            'TBD', //name
                            vendorDomain,
                            null, //t1Id
                            party, 
                            'TBD', // type1
                            'TBD', // type2
                            'TBD', // type3
                            null, // note
                            true, // current
                            false // corrected
                        )
                        try {
                            console.log('adding new vendor', vendorDomain)
                            vendorRecord = await Vendor.create(newVendor);
                        } catch (e) {
                            console.log('vendor already exists', vendorDomain)
                        }
                    } else {
                        //mark as current (to filter out noise from t1 list)
                        console.log('updating existing record')  
                        if(!vendorRecord.current) {
                            try {
                                vendorRecord.current = true;
                                await vendorRecord.save();
                                console.log('vendor current saved!', vendorDomain)
                            }
                            catch (e) {
                                console.log('could not save record', vendorDomain, e)
                            }
                        }
                    }

                    let jobUrlVendor;
                    let vendorId = vendorRecord.id;

                    jobUrlVendor = new classes.JobUrlVendor(
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
