const config = require('config');
const redisClient = require('../redis-client');
const print = require('../utils/print');
const runOnDate = require('../utils/run-on-date');

function scheduleItem(error, next) {
  if (error) console.log(error);

  redisClient.spop(config.redis.waitingSet, (err, stringifiedItem) => {
    if (stringifiedItem === null) return next(null, scheduleItem);

    const item = JSON.parse(stringifiedItem);

    // minimal validation
    if (typeof item !== 'object' || !item.time || !item.message) {
      return next(
        new Error(`Got an invalid item from waitingSet: ${stringifiedItem}`),
        scheduleItem
      );
    }

    if (item.time <= Date.now()) {
      // just print out immediately
      print(item);
      return next(null, scheduleItem);
    }

    // schedule printing:
    runOnDate(item.time, () => {
      print(item);

      // remove from inProgressSet
      redisClient.srem(config.redis.inProgressSet, stringifiedItem);
    });

    // put into inProgressSet in Redis
    redisClient.sadd(config.redis.inProgressSet, stringifiedItem, err => {
      next(err, scheduleItem);
    });
  });
}

module.exports = function startWorker() {
  // merge the inProgressSet into waitingSet
  redisClient.sunionstore(
    config.redis.waitingSet,
    config.redis.waitingSet,
    config.redis.inProgressSet,
    errorOnUnion => {
      if (errorOnUnion) throw errorOnUnion;
      // start the scheduler
      redisClient.del(config.redis.inProgressSet, errorOnDel =>
        scheduleItem(errorOnDel, scheduleItem)
      );
    }
  );
};
