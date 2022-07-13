const jwt = require('jsonwebtoken');


const AuthorizationError = require('../errors/authorization-error');


module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new AuthorizationError('Необходима авторизация'));
    } else {
      next(err);
    }
  }
  req.user = payload;
  next();
};


/*
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new AuthorizationError('Необходима авторизация'));
    } else {
      next(err);
    }
  }
  req.user = payload;
  next();
}; */
