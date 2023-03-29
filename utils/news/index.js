const {
  sportsModel,
  businessModel,
  entertainmentModel,
  healthModel,
  scienceModel,
  technologyModel,
} = require("../../models/news");

exports.getModel = (category) => {
  switch (category) {
    case "sports":
      return sportsModel;

    case "business":
      return businessModel;

    case "entertainment":
      return entertainmentModel;

    case "health":
      return healthModel;

    case "science":
      return scienceModel;

    case "technology":
      return technologyModel;

    default:
      return new Error("category not valid ");
  }
};
