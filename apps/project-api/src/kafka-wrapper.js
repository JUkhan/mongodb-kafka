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
  }
}

module.exports = new KafkaWrapper();
