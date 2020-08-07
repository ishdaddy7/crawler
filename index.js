const runJobs = require('./app');
const jobs = require('./jobs/pipeline')

const run = async () => {
	jobs.forEach(async (job) => {
		try {
			await runJobs(job);
		} catch (e){
			console.log(e)
		}
	});
}

run();