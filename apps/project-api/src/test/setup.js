const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

/* eslint-disable */
jest.mock('../publisher');

/** @type {MongoMemoryServer} */
let mongo;

/* eslint-disable */
beforeAll(async () => {
  mongo = await MongoMemoryServer.create({});
  const mongoUrl = mongo.getUri();
  await mongoose.connect(mongoUrl);
});

/* eslint-disable */
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    collection.deleteMany({});
  }
});

/* eslint-disable */
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
