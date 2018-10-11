const config = require('config');

module.exports = function print({ message, time }) {
  if (config.printVerbose) {
    console.log(
      `time from req: ${time}; time now: ${Date.now()}; message: ${message}`
    );
  } else {
    console.log(message);
  }
};
