const { sportsModel } = require("../../models/news");
const { getCategoryNews } = require("../../utils/jobs");

const getSportsNews = async () => {
  await getCategoryNews({ categoryModel: sportsModel, category: "sports" });
};

module.exports = getSportsNews;
