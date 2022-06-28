const express = require('express');
const router = require('./router');
const errorHandler = require('./common/middlewares/error-handler');
const NotFoundError = require('./common/errors/not-found-error');

const app = express();

app.use(router);

app.get('*', () => {
  throw new NotFoundError('Page not found');
});

app.use(errorHandler);

module.exports = app;
