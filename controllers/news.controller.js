const {
  sportsModel,
  businessModel,
  entertainmentModel,
  healthModel,
  scienceModel,
  technologyModel,
} = require("../models/news");
const User = require("../models/user");
const { getModel } = require("../utils/news");

const getAllModelNews = async (model, page = 1, limit = 10) => {
  try {
    const count = await model.countDocuments({ urlToImage: { $ne: null } });
    const totalPages = Math.ceil(count / limit);

    if (page < 1 || page > totalPages) {
      return { error: "Invalid page number" };
    }

    const skip = (page - 1) * limit;
    const categoryNews = await model
      .find({ urlToImage: { $ne: null } })
      .skip(skip)
      .limit(limit)
      .exec();

    return { data: categoryNews.reverse(), count, totalPages };
  } catch (err) {
    console.error(err);
  }
};

// get all category news
exports.getAllCategoryNews = async (req, res) => {
  const category = req.params.category;
  const { page, limit } = req.query;

  switch (category) {
    //......sports
    case "sports":
      return res.json({
        sports: await getAllModelNews(sportsModel, page, limit),
      });
    //......business
    case "business":
      return res.json({
        business: await getAllModelNews(businessModel, page, limit),
      });
    //....entertainment
    case "entertainment":
      return res.json({
        entertainment: await getAllModelNews(entertainmentModel, page, limit),
      });
    //..... health
    case "health":
      return res.json({
        health: await getAllModelNews(healthModel, page, limit),
      });
    //.....science
    case "science":
      return res.json({
        science: await getAllModelNews(scienceModel, page, limit),
      });
    //.......technology
    case "technology":
      return res.json({
        technology: await getAllModelNews(technologyModel, page, limit),
      });

    // ........... all
    case "latest":
      let allNews = await Promise.all([
        getAllModelNews(sportsModel, 1, 3),
        getAllModelNews(businessModel, 1, 3),
        getAllModelNews(entertainmentModel, 1, 3),
        getAllModelNews(healthModel, 1, 3),
        getAllModelNews(scienceModel, 1, 3),
        getAllModelNews(technologyModel, 1, 3),
      ]);

      return res.json({
        sports: allNews[0],
        business: allNews[1],
        entertainment: allNews[2],
        health: allNews[3],
        science: allNews[4],
        technology: allNews[5],
      });
  }

  return res.json({});
};
const models = {
  sports: sportsModel,
  business: businessModel,
  entertainment: entertainmentModel,
  health: healthModel,
  science: scienceModel,
  technology: technologyModel,
};

exports.getPost = async (req, res) => {
  const { category, id } = req.params;

  try {
    const model = models[category];
    if (!model) return res.json({ error: "category not found" });
    const post = await model.findById(id);
    // if post not found
    if (!post) return res.json({ error: "post not found" });
    return res.json({ post });
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
};

exports.likeAPost = async (req, res) => {
  try {
    const categoryModel = getModel(req.params.category);
    const post = await categoryModel.findById(req.params.id);
    // Check if the post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.auth.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.auth.id });
    await post.save();
    console.log(req);
    return res.json({ post });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

exports.unlikeAPost = async (req, res) => {
  try {
    const categoryModel = getModel(req.params.category);
    const post = await categoryModel.findById(req.params.id);

    // Check if the post has not yet been liked
    if (!post.likes.some((like) => like.user.toString() === req.auth.id)) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.auth.id
    );

    await post.save();

    return res.json({ post });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!req.body.text) return res.json({ error: "text is required!" });
    const categoryModel = getModel(req.params.category);
    const user = await User.findById(req.auth.id).select("-password");
    const post = await categoryModel.findById(req.params.id);

    console.log({ user });

    const newComment = {
      text: req.body.text,
      name: user.username,
      user: req.auth.id,
    };
    post.comments.unshift(newComment);
    await post.save();
    return res.json({ post });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const categoryModel = getModel(req.params.category);
    const post = await categoryModel.findById(req.params.id);
    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.user.toString() !== req.auth.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.commentId
    );

    await post.save();

    return res.json({ post });
  } catch (error) {
    console.error(error);
    return res.json({ error });
  }
};
