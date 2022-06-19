const CustomError = require('./custom-error');

class BadRequestError extends CustomError {
  statusCode = 400;

  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = BadRequestError;
