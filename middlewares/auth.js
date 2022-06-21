const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if(!token) {
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret');
  } catch(err) {
    next(err);
  }
  req.user = payload;
  next();
};
