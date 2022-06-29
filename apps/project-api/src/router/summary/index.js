const express = require('express');
const asyncHandler = require('express-async-handler');

const Summary = require('../../models/Summary');
const NotFoundError = require('../../common/errors/not-found-error');
const redisClient = require('../../redis-client');

const router = express.Router();

router.get(
  '/:projectId',
  asyncHandler(async (req, res) => {
    const cacheSummary = await redisClient.get(req.params.projectId);
    if (cacheSummary) {
      res.json(cacheSummary);
      return;
    }
    const summary = await Summary.findById(req.params.projectId);
    if (!summary) {
      throw new NotFoundError('Project not found');
    }
    await redisClient.set(req.params.projectId, summary);

    res.json(summary);
  }),
);

module.exports = router;
