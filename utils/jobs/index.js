const axios = require("axios");

const getCategoryNewsApi = (category) =>
  `https://newsapi.org/v2/top-headlines?country=gb&category=${category}&apiKey=${process.env.NEWS_KEY}`;

const getCategoryNews = async ({ categoryModel, category }) => {
  try {
    // set old news to archive
    const conditions = { archive: false };
    const update = {
      $set: {
        archive: true,
      },
    };
    const options = { multi: true, upsert: true };
    await categoryModel.updateMany(conditions, update, options);

    const response = await axios.get(getCategoryNewsApi(category));
    // handle success
    const { data } = response;
    const { articles } = data;

    // insert or update articles
    await categoryModel.insertMany(articles);
    console.log(`- ${category}: articles updated successfully`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getCategoryNews };
