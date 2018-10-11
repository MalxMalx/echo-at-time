const lt = require('long-timeout');

module.exports = function runOnDate(timeInMs, job) {
  const now = Date.now();

  // long-timeout is used here to overcome setTimeout's max timeout limitation
  return lt.setTimeout(() => {
    if (timeInMs > Date.now()) {
      runOnDate(timeInMs, job);
    } else job();
  }, timeInMs < now ? 0 : timeInMs - now);
};
