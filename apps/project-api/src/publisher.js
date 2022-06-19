const { Kafka } = require('kafkajs');
const redis = require('redis');

class Publisher {
  /**
   *
   * @param {string} clientId
   * @param {string[]} brokers
   */
  async connectKafka(clientId, brokers) {
    const kaka = new Kafka({ clientId, brokers });
    this.producer = kaka.producer();
    await this.producer.connect();
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
    await this.redisClient.connect();
  }

  /**
   *
   * @param {string} topic
   * @param {string|Buffer|Object} message
   */
  async publish(topic, message) {
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
