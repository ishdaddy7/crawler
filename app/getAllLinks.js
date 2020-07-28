const puppeteer = require("puppeteer");
const getDomain = require('../utils/getDomain')
const db = require('../database');
const classes = require('../utils/classes')
const JobUrl = db.model('jobUrl');

// we're using async/await - so we need an async function, that we can run
module.exports = async (jobUrlToCrawl, jobId) => {
  console.log('getting links for', jobUrlToCrawl);
  // open the browser and prepare a page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // open the page to scrape
  await page.goto(jobUrlToCrawl);

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
      let jobUrlRecord = await JobUrl.create(jobUrl);

      //add db id to for updating acceptedCookies later
      link.push(jobUrlRecord.id);

      cleanLinks.push(link);
      cache[linkUrl] = true;
    }
  }

  console.log('done getting links!');
  return cleanLinks;
};
