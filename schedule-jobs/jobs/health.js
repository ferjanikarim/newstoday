const { healthModel } = require("../../models/news");
const { getCategoryNews } = require("../../utils/jobs");

const gethealthNews = async () => {
  await getCategoryNews({
    categoryModel: healthModel,
    category: "health",
  });
};

module.exports = gethealthNews;
