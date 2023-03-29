const schedule = require("node-schedule");
const getSportsNews = require("./jobs/sports");
const getBusinessNews = require("./jobs/business");
const getentertainmentNews = require("./jobs/entertainment");
const gethealthNews = require("./jobs/health");
const getscienceNews = require("./jobs/science");
const gettechnologyNews = require("./jobs/technology");

const scheduleJobs = () => {
  schedule.scheduleJob("*/30 * * * * *", async function () {
    console.log("=====================================================");
    console.log("============= Schedule Jobs Startd ==================");
    console.log("=====================================================");

    await Promise.all([
      getSportsNews(),
      getBusinessNews(),
      getentertainmentNews(),
      gethealthNews(),
      getscienceNews(),
      gettechnologyNews(),
    ]);

    console.log("===================== / END =======================\n\n");
  });
};

module.exports = scheduleJobs;
