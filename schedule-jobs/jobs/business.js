const { businessModel } = require("../../models/news");
const { getCategoryNews } = require("../../utils/jobs");

const getBusinessNews = async () => {
  await getCategoryNews({ categoryModel: businessModel, category: "business" });
};

module.exports = getBusinessNews;
