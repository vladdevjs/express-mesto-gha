const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const { authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDhlYzExNmIwNzZjYWY0MWJjMTdlMjQiLCJpYXQiOjE2ODcwNzc3MjMsImV4cCI6MTY4NzY4MjUyM30.YF5o5WR-rqzdSFybth72N63uYEuZhz3fEwO8__GE8VU' } = req.headers;

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
