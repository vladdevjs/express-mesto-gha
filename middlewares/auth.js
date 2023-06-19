const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { jwt: cookieToken } = req.cookies;
  const { authorization } = req.headers;

  if (cookieToken) {
    req.headers.authorization = `Bearer ${cookieToken}`;
  }

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthError('Необходима авторизация!');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new UnAuthError('Необходима авторизация!');
  }

  req.user = payload;
  next();
};
