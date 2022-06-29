const kafkaWrapper = require('./kafka-wrapper');

class Publisher {
  init() {
    this.producer = kafkaWrapper.kafka?.producer();
    this.producer?.on('producer.connect', () =>
      console.log('producer connected'),
    );
  }

  connect() {
    if (this.connecting) return this.connecting;
    this.connecting = this.producer?.connect();
    return this.connecting;
  }

  /**
   *
   * @param {string} topic
   * @param {string|Buffer|Object} message
   */
  async publish(topic, message, key = undefined) {
    await this.connect();
    await this.producer?.send({
      topic,
      messages: [
        {
          key,
          value:
            typeof message === 'object' ? JSON.stringify(message) : message,
        },
      ],
    });
  }
}

module.exports = new Publisher();
