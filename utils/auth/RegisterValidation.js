const Joi = require("joi");

const RegisterValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{4,})"))
      .messages({
        "string.empty": "username should not be an empty field",
        "string.base": "username must be a string",
        "string.min": "username length must be at least 4 chracter long",
        "any.required": "username is a required field",
        "string.pattern.base":
          "username must at least contains a lowercase caracter , an uppercase caracter and a number",
      }),
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
      })
      .messages({
        "string.empty": "Email cannot be an empty field",
        "string.email": "Your email must be a valid email",
        "any.required": "Email is a required field",
      }),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*/])(?=.{8,})"
        )
      )
      .messages({
        "string.min": "Password length must be at least 8 characters",
        "string.required": "email is a required field",
        "string.pattern.base":
          "Password  must contains at least one lower caracter,one upper caracter,one digit caracter and one specific caracter ",
      }),
    confirm_Password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({
        messages: {
          "any.only": "Confirm password does not match",
          "any.required": "Please confirm your password",
        },
      }),
  });
  return schema.validate(data);
};

module.exports.RegisterValidation = RegisterValidation;
