const mongoose = require('mongoose');

const kafkaWrapper = require('./kafka-wrapper');
const redisClient = require('./redis-client');
const publisher = require('./publisher');
const app = require('./app');

async function run() {
  if (!process.env.MONGO_DB) {
    process.env.MONGO_DB = 'mongodb://localhost:27017/develop';
  }

  if (!process.env.REDIS_CACHE) {
    process.env.REDIS_CACHE = 'redis://localhost:6379';
  }

  if (!process.env.KAFKA_BROKERS) {
    process.env.KAFKA_BROKERS = 'localhost:9092';
  }
  try {
    await mongoose.connect(process.env.MONGO_DB);
    await redisClient.connect(process.env.REDIS_CACHE, 2);
    kafkaWrapper.init('app1', process.env.KAFKA_BROKERS.split(','), '');
    publisher.init();
  } catch (ex) {
    console.error(ex);
  }
  app.listen(8080, () => console.log('listening on port:8080'));
}

run();
