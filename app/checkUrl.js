const puppeteer = require('puppeteer');
const preparePageForTests = require('../utils/preparePageForTests');
const fs = require('fs').promises;
const interceptAllTrafficForPageUsingFetch = require('./interceptAllTrafficForPageUsingFetch');
/**
 * Launches a puppeteer controlled Chrome and intercepts all traffic.
 */
module.exports = async (advUrl, jobUrlId) => {
    console.log(`checking ${advUrl}`)
     const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
    });
    const page = (await browser.pages())[0];

    //implement various settings to mitigate crawler getting blocked
    await preparePageForTests(page);

    //load cookies
    try {
        const cookiesString = await fs.readFile('./cookies.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
    } catch (e) {
        console.log('no cookies set yet');
    }

    //@TODO - understand why both calls to the function are needed
    await interceptAllTrafficForPageUsingFetch(page, advUrl, jobUrlId);
    browser.on('targetcreated', async (target) => {
        const page = await target.page();
        await interceptAllTrafficForPageUsingFetch(page, advUrl, jobUrlId);
    });

   //Normal code like navigation, closing browser session, etc.
    await page.goto(advUrl, {
    	waitUntil: 'networkidle0',
  	});

    // fragile way to click on accept cookies via button or link text
    const [toClick] = await page.$x("//button[contains(text(), 'ccept')]|//a[contains(text(), 'ccept')]");
    let urlAcceptedCookies = false;
    if (toClick) {
        try {
            await toClick.click();
            urlAcceptedCookies = true;
            console.log('clicked!');
        } catch(e) {
            console.log(advUrl, 'couldn\'nt click accept cookies. either clicked already/hidden, or rendered too slow');
        }
    } else {
        console.log('couldn\'t find an accept button or link')
    }

    //check for mParticle
    let mParticle;
    try {
        mParticle = await page.evaluate(() => mParticle);
        console.log(mParticle)
    } catch (e) {
        console.log('mParticle not found');
    }
    

    //save cookies
    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));

    //some extra time for slow pages
  	await page.waitFor(7000)

  	await browser.close();
    console.log(`done checking ${advUrl}`)
    return urlAcceptedCookies;
}
