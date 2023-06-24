const httpConstants = require('http2').constants;

class UnAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstants.HTTP_STATUS_DENIED;
  }
}

module.exports = UnAuthError;
