const express = require('express');
const asyncHandler = require('express-async-handler');
const { body } = require('express-validator');
const mongoose = require('mongoose');

const Participation = require('../../models/Participation');
const publisher = require('../../publisher');
const validateRequest = require('../../common/middlewares/validate-request');
const NotFoundError = require('../../common/errors/not-found-error');
const BadRequestError = require('../../common/errors/bad-request-error');

const router = express.Router();

router.get(
  '/:participationId',
  asyncHandler(async (req, res) => {
    const participation = await Participation.findById(
      req.params.participationId,
    );
    if (!participation) {
      throw new NotFoundError('Participation not found');
    }
    res.json(participation);
  }),
);

router.post(
  '/',
  [
    body('projectId')
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ProjectId must be provided'),
    body('state')
      .not()
      .isEmpty()
      .custom((input) => ['ACTIVE', 'INACTIVE'].includes(input))
      .withMessage('State must be either ACTIVE|INACTIVE'),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const participation = new Participation({
      projectId: req.body.projectId,
      state: req.body.state,
    });
    await participation.save();
    publisher.publish('add', participation);
    res.status(201).json(participation);
  }),
);

router.patch(
  '/:participationId',
  [
    body('state')
      .not()
      .isEmpty()
      .custom((input) => ['ACTIVE', 'INACTIVE'].includes(input))
      .withMessage('State must be either ACTIVE|INACTIVE'),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const participation = await Participation.findById(
      req.params.participationId,
    );
    if (!participation) {
      throw new NotFoundError('Participation not found');
    }
    if (req.body.state === participation.state) {
      throw new BadRequestError('No state transition');
    }

    participation.state = req.body.state;

    await participation.save();

    publisher.publish('update', participation);
    res.json(participation);
  }),
);

module.exports = router;
