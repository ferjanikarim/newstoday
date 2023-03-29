const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { RegisterValidation } = require("../utils/auth/RegisterValidation");
const jwt = require("jsonwebtoken");
const { getToken } = require("../utils/auth");
require("dotenv").config();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PWD = process.env.ADMIN_PWD;
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        error: "invalid email or pasword,please try again",
      });
    }
    let verifyPwd = await bcrypt.compare(password, user.password);
    if (!verifyPwd) {
      return res.status(401).json({
        status: false,
        error: "Invalid email or password , please try again.",
      });
    }
    let token = getToken(user);
    res.status(200).json({
      status: true,
      data: {
        isBanned: user.isBanned,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        isUser: user.isUser,
        id: user._id,
        token,
      },
    });
  } catch (error) {
    if (error) throw error;
    res.status(400).json({ error });
  }
};

///////------- register---------
exports.register = async (req, res) => {
  try {
    let { email, password, username, confirm_Password } = req.body;

    let { error } = await RegisterValidation({
      email,
      password,
      username,
      confirm_Password,
    });
    if (error) {
      return res
        .status(401)
        .json({ status: false, error: error.details[0].message });
    }
    let existedEmail = await User.find({ $or: [{ email }, { username }] });
    if (existedEmail.length !== 0) {
      return res.status(401).json({
        status: false,
        message: "User is already exist,please try another email or username",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_PWD,
      },
    });

    const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

</head>

<body>
  <style></style>
  <h1 style="color: blueviolet; font-size: 1.2rem; font-weight: bold;"> welcome ${username}</h1>
  <h2 style="color: darkorchid;"> your acount has been creat successfully </h2>
  <h4>one more step , please cilck the link below to verify your email</h4>
 <a href="http://localhost:5000/api/user/verifyEmail?email=${email}" taget="_blank"> verify  your account</a>

</body>

</html>`;

    const mailOptions = {
      from: "gtariaziz4@gmail.com",
      to: email,
      subject: "please verify your email",
      html: output,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent : " + info.response);
      }
    });

    res.status(200).json({
      status: true,
      message: " your account has been created successfully",
      data: User,
    });
    let newUser = new User({
      email,
      password: hashedPassword,
      username,
    });
    const user = await newUser.save();
  } catch (error) {
    if (error) throw error;
    res.status(400).json({ error });
  }
};

// ======== verifyEmail ===========
exports.verifyEmail = async (req, res) => {
  try {
    let { email } = req.query;
    let verifyEmail = await User.findOneAndUpdate(
      { email },
      {
        $set: { isVerified: true },
      },

      { new: true }
    );
    if (!verifyEmail) {
      return res.status(401).json({ status: false, message: "Wrong data" });
    }
    res.status(200).json({ status: true, message: "Your account is verified" });
  } catch (error) {
    if (error) throw error;
    res.status(401).json({ status: false, error });
  }
};
// ======== change_to_admin =======
exports.change_to_admin = async (req, res) => {
  const { email } = req.auth;
  const { secret_code } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ err: "user not found " });
  if (secret_code !== ADMIN_SECRET_CODE)
    return res.status(400).json({ err: "secret code not valid" });

  if (user.isAdmin) return res.json({ message: "user already is an admin" });

  user.isAdmin = true;
  await user.save();

  // ==== send user the new jwt ========
  let token = getToken(user);
  res.status(200).json({
    status: true,
    data: {
      isBanned: user.isBanned,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      isUser: user.isUser,
      id: user._id,
      token,
    },
  });

  return res.json(user);
};
