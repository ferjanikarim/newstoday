let router = require("express").Router();
const userController = require("../../controllers/user.controller.js");
const auth = require("../../middlewares/verifyToken");

module.exports = (app) => {
  // register new user
  router.post("/register", userController.register);

  // login user
  router.post("/login", userController.login);

  // verify email
  router.put("/verifyEmail", userController.verifyEmail);

  // change user to admin
  router.post("/change_to_admin", auth, userController.change_to_admin);

  app.use("/api/user", router);
};
