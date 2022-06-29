const redis = require('redis');

class RedisClient {
  /**
   *
   * @param {string} url
   * @param {number} cacheTimeout
   */
  async connect(url, cacheTimeout) {
    this.cacheTimeout = cacheTimeout;
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
   * @param {string} key
   */
  async get(key) {
    const val = await this.redisClient?.get(key);
    if (val) return JSON.parse(val);
    return val;
  }

  /**
   *
   * @param {string} key
   * @param {object} value
   */
  async set(key, value) {
    return this.redisClient?.set(key, JSON.stringify(value), {
      EX: this.cacheTimeout,
    });
  }
}

module.exports = new RedisClient();
