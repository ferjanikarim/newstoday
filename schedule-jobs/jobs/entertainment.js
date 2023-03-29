const { entertainmentModel } = require("../../models/news");
const { getCategoryNews } = require("../../utils/jobs");

const getentertainmentNews = async () => {
  await getCategoryNews({
    categoryModel: entertainmentModel,
    category: "entertainment",
  });
};

module.exports = getentertainmentNews;
