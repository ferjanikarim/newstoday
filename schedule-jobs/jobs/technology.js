const { technologyModel } = require("../../models/news");
const { getCategoryNews } = require("../../utils/jobs");

const gettechnologyNews = async () => {
  await getCategoryNews({
    categoryModel: technologyModel,
    category: "technology",
  });
};

module.exports = gettechnologyNews;
