import joi from "joi";

export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(3).max(35).required().messages({
        "string.empty": "please enter your name",
        "string.min": "userName  minimum length 3 and maxumu length 35",
      }),
      email: joi.string().email().required().messages({
        "string.email": "please enter a valid email",
        "any.required": "please enter your email",
        "string.empty": "Email not allowed to be empty",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "password must contain number ,charchers and symbols",
          "string.empty": "plz enter your password",
        }),
      confirmPassword: joi
        .string()
        .valid(joi.ref("password"))
        .required()
        .messages({
          "any.only": "confirmpassword not matched password",
        }),
    }),
};

export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          )
        )
        .required(),
    }),
};

export const checktoken = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};

export const forgetpassword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "string.email": "please enter a valid email",
        "any.required": "please enter your email",
        "string.empty": "enter your mail plz",
      }),
    }),
};

export const resetpassword = {
  body: joi
    .object()
    .required()
    .keys({
      newcode: joi.string().required(),
      newpassword: joi
        .string()
        .pattern(
          new RegExp(
            /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
          )
        )
        .required(),
      confirmnewpassword: joi.string().valid(joi.ref("newpassword")).required(),
    }),
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
