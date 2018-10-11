const lt = require('long-timeout');
const config = require('config');
const redisClient = require('../redis-client');

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

function runOnDate(timeInMs, job) {
  const now = Date.now();

  // long-timeout is used here to overcome setTimeout's max timeout limitation
  return lt.setTimeout(() => {
    if (timeInMs > Date.now()) {
      runOnDate(timeInMs, job);
    } else job();
  }, timeInMs < now ? 0 : timeInMs - now);
}

function print({ message, time }) {
  if (config.printVerbose) {
    console.log(
      `time from req: ${time}; time now: ${Date.now()}; message: ${message}`
    );
  } else {
    console.log(message);
  }
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
