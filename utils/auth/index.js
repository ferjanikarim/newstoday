const jwt = require("jsonwebtoken");
const SECRETKEY = process?.env?.SECRETKEY || "test";

exports.getToken = (user) =>
  jwt.sign(
    {
      email: user.email,
      isBanned: user.isBanned,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      isUser: user.isUser,
      id: user._id,
    },

    SECRETKEY,
    { expiresIn: "7d" }
  );
