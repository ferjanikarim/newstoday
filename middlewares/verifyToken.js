const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRETKEY = process.env.SECRETKEY;

module.exports = async (req, res, next) => {
  try {
    const token = req.header("jwt");

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Beware, you are unauthorized" });
    }
    let verfiedToken = await jwt.verify(token, SECRETKEY);
    req.auth = verfiedToken;
    next();
  } catch (error) {
    if (error.message) {
      console.log("error", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error });
  }
};
