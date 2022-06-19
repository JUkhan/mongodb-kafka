const mongoose = require('mongoose');

const { model, Schema } = mongoose;

/**
 * @typedef {object} IProject
 * @property {string} name
 */

/** @type {import('mongoose').Schema<IProject>} */
const schema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    toJSON: {
      /* eslint-disable */
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Project = model('Project', schema);

module.exports = Project;
