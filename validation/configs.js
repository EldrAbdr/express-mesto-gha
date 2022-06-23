const { Joi } = require('celebrate');

const linkRegex = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

const signupConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegex),
  }),
};

const signinConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const updateUserConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const cardDeleteConfig = {
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
};

const cardCreateConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegex),
  }),
};

const idCheckConfig = {
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
};

const linkCheckConfig = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegex),
  }),
};

module.exports = {
  signupConfig,
  signinConfig,
  cardDeleteConfig,
  cardCreateConfig,
  idCheckConfig,
  updateUserConfig,
  linkCheckConfig,
  linkRegex,
};
