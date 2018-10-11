const lt = require('long-timeout');
const config = require('config');

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

module.exports = {
  runOnDate,
  print
};
