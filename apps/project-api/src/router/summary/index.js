const express = require('express');
const asyncHandler = require('express-async-handler');

const Summary = require('../../models/Summary');
const NotFoundError = require('../../common/errors/not-found-error');
const publisher = require('../../publisher');

const router = express.Router();

router.get(
  '/:projectId',
  asyncHandler(async (req, res) => {
    const cacheSummary = await publisher.redisClient?.get(req.params.projectId);
    if (cacheSummary) {
      res.json(JSON.parse(cacheSummary));
      return;
    }
    const summary = await Summary.findById(req.params.projectId);
    if (!summary) {
      throw new NotFoundError('Project not found');
    }
    await publisher.redisClient?.set(
      req.params.projectId,
      JSON.stringify(summary),
      { EX: 2 },
    );

    res.json(summary);
  }),
);

module.exports = router;
