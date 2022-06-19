class CustomError extends Error {
  statusCode = 200;

  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = CustomError;
