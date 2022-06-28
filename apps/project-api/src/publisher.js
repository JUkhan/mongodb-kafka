const { Kafka } = require('kafkajs');
const redis = require('redis');

class Publisher {
  /**
   *
   * @param {string} clientId
   * @param {string[]} brokers
   */
  connectKafka(clientId, brokers) {
    const kaka = new Kafka({ clientId, brokers });
    this.producer = kaka.producer();
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
   * @param {string} url
   */
  async connectRedis(url) {
    this.redisClient = redis.createClient({
      url,
    });
    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    return this.redisClient.connect();
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

module.exports = new Publisher();
