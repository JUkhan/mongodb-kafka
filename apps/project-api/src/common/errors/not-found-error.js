const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  statusCode = 404;

  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
module.exports = NotFoundError;
