const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new UnAuthError('Необходима авторизация!');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(err);
  }
  req.user = payload;
};
