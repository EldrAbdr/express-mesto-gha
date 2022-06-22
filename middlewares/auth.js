const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)
  if(!token) {
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret');
  } catch(err) {
    console.log(err.name)
    if(err.name === 'JsonWebTokenError'){
      next(new AuthorizationError('Необходима авторизация'));
    }

  }
  console.log(payload)
  req.user = payload;
  next();
};
