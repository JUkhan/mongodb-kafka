const mongoose = require('mongoose');

const publisher = require('./publisher');

const app = require('./app');

const start = async () => {
  if (!process.env.MONGO_DB) {
    process.env.MONGO_DB = 'mongodb://localhost:27017/develop';
  }
  if (!process.env.KAFKA_BROKERS) {
    process.env.KAFKA_BROKERS = 'localhost:9092';
  }
  if (!process.env.REDIS_CACHE) {
    process.env.REDIS_CACHE = 'redis://localhost:6379';
  }
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log('connected to the mongo db');
    await publisher.connectKafka('app1', process.env.KAFKA_BROKERS.split(','));
    console.log('connected to the kafka brokers');
    await publisher.connectRedis(process.env.REDIS_CACHE);
    console.log('connected to the redis server');
  } catch (err) {
    console.error(err);
  }
  app.listen(8080, () => console.log('Listening on port 8080'));
};

start();
