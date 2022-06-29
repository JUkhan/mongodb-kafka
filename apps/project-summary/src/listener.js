const kafkaWrapper = require('./kafka-wrapper');

class Listener {
  /**
   * @type{string[]}
   */
  topics = [];

  constructor() {
    this.listen();
  }
  /* eslint-disable */
  async listen() {
    if (kafkaWrapper.kafka) {
      const consumer = kafkaWrapper.kafka.consumer({
        groupId: kafkaWrapper.groupId ?? '',
      });
      consumer.on('consumer.connect', () => {
        console.log('consumer connected');
      });
      await consumer.connect();

      await consumer.subscribe({
        topics: this.topics,
      });

      await consumer.run({
        eachMessage: this.eachMessageHandler,
      });
    }
  }

  /**
   *
   * @param {*} obj
   */
  /* eslint-disable */
  eachMessageHandler(obj) {
    return Promise.resolve();
  }
}

module.exports = Listener;
