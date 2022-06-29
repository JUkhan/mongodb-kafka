const mongoose = require('mongoose');
const kafkaWrapper = require('./kafka-wrapper');
const SummaryListener = require('./summery-listener');

/* eslint-disable */
async function run() {
  await mongoose.connect('mongodb://localhost:27017/develop');
  kafkaWrapper.init('summary-app', ['localhost:9092'], 'summery-group');
  new SummaryListener();
}

run();
