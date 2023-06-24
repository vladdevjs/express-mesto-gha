const { isCelebrateError } = require('celebrate');
const httpConstants = require('http2').constants;

module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const { message } = err.details.get('body');
    res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message });
  } else {
    const { statusCode = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;
    res.status(statusCode).send({
      message:
      statusCode === httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? `На сервере произошла ошибка ${message}` : message,
    });
    next();
  }
};
