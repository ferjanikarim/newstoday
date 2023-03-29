const { scienceModel } = require("../../models/news");
const { getCategoryNews } = require("../../utils/jobs");

const getscienceNews = async () => {
  await getCategoryNews({
    categoryModel: scienceModel,
    category: "science",
  });
};

module.exports = getscienceNews;
