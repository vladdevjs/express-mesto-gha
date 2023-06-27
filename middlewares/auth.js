const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    return next(new UnAuthError('Необходима авторизация!'));
  }
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnAuthError('Необходима авторизация!'));
  }
  req.user = payload;
  next();
};
