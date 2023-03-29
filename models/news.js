const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = mongoose.Schema({
  source: {
    type: Object,
  },
  author: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  },
  urlToImage: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  content: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  archive: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  sportsModel: mongoose.model("sports", newsSchema),
  businessModel: mongoose.model("business", newsSchema),
  entertainmentModel: mongoose.model("entertainment", newsSchema),
  healthModel: mongoose.model("health", newsSchema),
  scienceModel: mongoose.model("science", newsSchema),
  technologyModel: mongoose.model("technology", newsSchema),
};
