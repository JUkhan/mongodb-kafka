const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef {'ACTIVE' | 'INACTIVE'} State
 */

/**
 * @typedef {object} IParticipation
 * @property {Number} total
 * @property {State} state
 */

/** @type {import('mongoose').Schema<IParticipation>} */

const Participation = new Schema({
  state: { type: String, enum: ['ACTIVE', 'INACTIVE'], required: true },
  total: { type: Number, default: 0 },
});

/**
 * @typedef {object} ISummary
 * @property {import('mongoose').Types.ObjectId} projectId
 * @property {Participation[]} participations
 */

/** @type {import('mongoose').Schema<ISummary>} */
const schema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    participations: [Participation],
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

const Summary = model('Summary', schema);

module.exports = Summary;
