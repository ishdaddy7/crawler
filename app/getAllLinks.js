const puppeteer = require("puppeteer");
const preparePageForTests = require('../utils/preparePageForTests');
const getDomain = require('../utils/getDomain')
const db = require('../database');
const classes = require('../utils/classes')
const JobUrl = db.model('jobUrl');

// we're using async/await - so we need an async function, that we can run
module.exports = async (jobUrlToCrawl, jobId) => {
  console.log('getting links for', jobUrlToCrawl);
  // open the browser and prepare a page
  const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
  });
  const page = await browser.newPage();
  await preparePageForTests(page);
  // open the page to scrape
  await page.goto(jobUrlToCrawl, {
      waitUntil: 'networkidle0',
  });

  // execute the JS in the context of the page to get all the links
  const allLinks = await page.evaluate(() => 
    // get all links and create an array from the resulting NodeList
     Array.from(document.querySelectorAll("a")).map(anchor => [anchor.textContent, anchor.href])
  );

  // close the browser 
  await browser.close();

  // remove duplicates and links to other domains
  let cache = {};
  let cleanLinks = [];

  let originalDomain = getDomain(jobUrlToCrawl);

  for (let i = 0; i < allLinks.length; i++) {
    let link = allLinks[i];
    let linkUrl = link[1];
    let linkDomain = getDomain(linkUrl);
    
    if (originalDomain === linkDomain && !cache[linkUrl]) {
      //add link to jobUrls
      let jobUrl = new classes.JobUrl(...link, false, jobId);

      try {
        let jobUrlRecord = await JobUrl.create(jobUrl);

        //add db id to for updating acceptedCookies later
        link.push(jobUrlRecord.id);

        cleanLinks.push(link);
        cache[linkUrl] = true;
      } catch(e) {
        console.log(e)
      }
      
    }
  }

  console.log('done getting links!');
  return cleanLinks;
};
