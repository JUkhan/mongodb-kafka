const express = require('express');
const asyncHandler = require('express-async-handler');
const { body } = require('express-validator');

const Project = require('../../models/Project');
const validateRequest = require('../../common/middlewares/validate-request');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.get(
  '/:projectId',
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    res.json(project);
  }),
);

router.post(
  '/',
  [body('name').not().isEmpty().withMessage('Name must be provided')],
  validateRequest,
  asyncHandler(async (req, res) => {
    const project = new Project({
      name: req.body.name,
    });
    await project.save();
    res.status(201).send(project);
  }),
);

module.exports = router;
