const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    next(new UnAuthError('Необходима авторизация!'));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new UnAuthError('Необходима авторизация!'));
    return;
  }
  req.user = payload;
  next();
};
