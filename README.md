# crawler
Hybrid personal/work project in to help with a job-related task. Detects what technology vendors are utilized by a given website. In short, it:

* Finds links on a given site
* Loads a number of the pages/links
* Attempts to click the "accept"/privacy notice to fully load the page content. 
* Sniffs HTTP requests made by the browser (via Puppeteer)
* Attempts to identify vendors based on the hostname in the request URL, checking against a database I created. 
* Writes results to a mysql database, which was visualized in a Redash.io dashboard. 

Not the most accurate, as it's unclear which vendors are still active vs. left on the page/unused. But for the task at hand it produced directional insights that fulfilled the objective. 
