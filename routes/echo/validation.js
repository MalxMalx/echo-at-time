const { maxEchoIntervalMs } = require('config');

function isValidTimeInMs(numeric) {
  return isNaN(Date.parse(new Date(numeric))) ? false : true;
}

function isValidInterval(timeInMs, maxTimeInMs) {
  const now = Date.now();
  const maxDate = now + maxTimeInMs;

  return timeInMs > now && timeInMs <= maxDate;
}

function isValidTime(value) {
  return (
    Number.isInteger(value) &&
    isValidTimeInMs(value) &&
    isValidInterval(value, maxEchoIntervalMs)
  );
}

function isValidMessage(value) {
  return typeof value === 'string' && value.length > 0;
}

function validateParameters({ time, message }) {
  const errors = [];

  if (!isValidTime(time)) {
    errors.push('Invalid time');
  }

  if (!isValidMessage(message)) {
    errors.push('Invalid message');
  }

  return errors.length ? errors : null;
}

module.exports = {
  isValidTimeInMs,
  isValidInterval,
  isValidTime,
  isValidMessage,
  validateParameters
};
