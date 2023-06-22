const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnAuthError('Необходима авторизация!');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new UnAuthError('Необходима авторизация!');
  }
  req.user = payload;
  next();
};
