const { Kafka } = require('kafkajs');

class KafkaWrapper {
  /**
   *
   * @param {string} clientId
   * @param {string[]} brokers
   * @param {string} groupId
   */
  init(clientId, brokers, groupId) {
    this.groupId = groupId;
    this.kafka = new Kafka({ clientId, brokers });
    this.producer = this.kafka.producer();
    this.isConnect = false;
    this.producer.on('producer.connect', () => {
      this.isConnect = true;
    });
    this.producer.on('producer.disconnect', () => {
      this.isConnect = false;
    });
  }

  /**
   *
   * @param {string} topic
   * @param {string|Buffer|Object} message
   */
  async publish(topic, message) {
    if (!this.isConnect) await this.producer?.connect();
    await this.producer?.send({
      topic,
      messages: [
        {
          value:
            typeof message === 'object' ? JSON.stringify(message) : message,
        },
      ],
    });
  }
}

module.exports = new KafkaWrapper();
