const CustomError = require('./custom-error');

class RequestValidationError extends CustomError {
  statusCode = 400;

  /**
   *
   * @param {import('express-validator').ValidationError[]} errors
   */
  constructor(errors) {
    super('');
    this.errors = errors;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => ({ message: err.msg, field: err.param }));
  }
}

module.exports = RequestValidationError;
