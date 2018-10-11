const { maxEchoIntervalMs, errorMessages } = require('config');

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
    errors.push(errorMessages.invalidTime);
  }

  if (!isValidMessage(message)) {
    errors.push(errorMessages.invalidMessage);
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
