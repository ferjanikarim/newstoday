let router = require("express").Router();
const newsController = require("../../controllers/news.controller.js");
const auth = require("../../middlewares/verifyToken");

module.exports = (app) => {
  // Retrieve all news of a category
  router.get("/:category", newsController.getAllCategoryNews);

  // Receive one post
  router.get("/:category/:id", newsController.getPost);

  //  like a post
  router.post("/:category/:id/like", auth, newsController.likeAPost);

  //  unlike a post
  router.post("/:category/:id/unlike", auth, newsController.unlikeAPost);

  // add comment
  router.post("/:category/:id/addcomment", auth, newsController.addComment);
  
  // delete comment 
  router.delete("/:category/:id/deletecomment/:commentId", auth, newsController.deleteComment);

  app.use("/api/news", router);
};
