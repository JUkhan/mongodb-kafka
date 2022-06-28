const mongoose = require('mongoose');

const { Schema, model } = mongoose;

/**
 * @typedef {object} IParticipation
 * @property {string} state
 * @property {number} total
 */

/**
 * @typedef {object} ISummary
 * @property {import('mongoose').Types.ObjectId} projectId
 * @property {IParticipation[]} participations
 */

/** @type {import('mongoose').Schema<ISummary>} */
const schema = new Schema({
  participations: [
    {
      state: String,
      total: Number,
    },
  ],
});

const Summary = model('Summary', schema);

module.exports = Summary;
