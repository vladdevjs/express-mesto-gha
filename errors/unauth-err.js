const httpConstants = require('http2').constants;

class UnAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnAuthError;
