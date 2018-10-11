const config = require('config');
const redis = require('redis');

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  prefix: config.redis.prefix
});

redisClient.on('error', err => {
  console.log('Redis Error: ' + err);
});

module.exports = redisClient;
