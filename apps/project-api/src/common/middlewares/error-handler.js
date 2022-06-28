const CustomError = require('../errors/custom-error');

/**
 *
 * @param {Error} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
/* eslint-disable */
function errorHandler(error, req, res, next) {
  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .send({ errors: error.serializeErrors() });
  }
  console.error(error);
  return res
    .status(400)
    .send({ errors: [{ message: 'Something went wrong.' }] });
}

module.exports = errorHandler;
