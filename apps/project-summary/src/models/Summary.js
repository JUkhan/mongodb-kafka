const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef {object} IParticipation
 * @property {String} state
 * @property {Number} total
 */

/** @type {import('mongoose').Schema<IParticipation>} */

const Participation = new Schema({
  state: { type: String, required: true },
  total: { type: Number, default: 0 },
});

/**
 * @typedef {object} ISummary
 * @property {import('mongoose').Types.ObjectId} projectId
 * @property {Participation[]} participations
 */

/** @type {import('mongoose').Schema<ISummary>} */
const schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  participations: [Participation],
});

const Summary = model('Summary', schema);

module.exports = Summary;
