const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef {'ACTIVE' | 'INACTIVE'} State
 */

/**
 * @typedef {object} IParticipation
 * @property {import('mongoose').Types.ObjectId} projectId
 * @property {State} state
 */

/** @type {import('mongoose').Schema<IParticipation>} */
const schema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    state: { type: String, enum: ['ACTIVE', 'INACTIVE'], required: true },
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

const Participation = model('Participation', schema);

module.exports = Participation;
