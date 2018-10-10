const { assert } = require('chai');
const { maxEchoIntervalMs } = require('config');
const {
  isValidTimeInMs,
  isValidInterval,
  isValidTime,
  isValidMessage,
  validateParameters
} = require('../../routes/echo/validation');

describe('Echo API validation', () => {
  const dateOutOfRange = maxEchoIntervalMs + 100;
  const dateInRange = Date.now() + maxEchoIntervalMs;

  describe('isValidTimeInMs', () => {
    it('returns true for a number representing valid time in ms', () => {
      assert.isTrue(isValidTimeInMs(Date.now()));
    });
    it('returns false for a number that is too big', () => {
      assert.isFalse(isValidTimeInMs(Date.now() * 10000));
    });
  });

  describe('isValidInterval', () => {
    it('returns true for a date in ms within the configured range', () => {
      assert.isTrue(isValidInterval(dateInRange, maxEchoIntervalMs));
    });
    it('returns false for a date in the past', () => {
      assert.isFalse(isValidInterval(Date.now() - 100, maxEchoIntervalMs));
    });
    it('returns false for a date out of the configured range in future', () => {
      assert.isFalse(isValidInterval(dateOutOfRange, maxEchoIntervalMs));
    });
  });

  describe('isValidTime', () => {
    it('returns true for a valid date in ms within the configured range', () => {
      assert.isTrue(isValidTime(dateInRange));
    });
    it('returns false for non-numbers', () => {
      assert.isFalse(isValidTime('test'));
    });
    it('returns false for non-integers', () => {
      assert.isFalse(isValidTime(1.33333));
    });
    it('returns false for a date out of the configured range', () => {
      assert.isFalse(isValidTime(dateOutOfRange));
    });
  });

  describe('isValidMessage', () => {
    it('returns true for a non-empty string', () => {
      assert.isTrue(isValidMessage('test'));
    });
    it('returns false for an empty string', () => {
      assert.isFalse(isValidMessage(''));
    });
    it('returns false for a non-string value', () => {
      assert.isFalse(isValidMessage({}));
      assert.isFalse(isValidMessage([]));
      assert.isFalse(isValidMessage(1));
      assert.isFalse(isValidMessage());
      assert.isFalse(isValidMessage(true));
    });
  });

  describe('validateParameters', () => {
    it('returns null for an object with valid structure and values', () => {
      assert.isNull(validateParameters({ time: dateInRange, message: 'test' }));
    });
    it('returns an array of errors for an empty object', () => {
      const errors = validateParameters({});
      assert.isArray(errors);
      assert.lengthOf(errors, 2);
    });
    it('returns an array of errors for an object with invalid properties', () => {
      const errors = validateParameters({ time: 'test', message: 123 });
      assert.isArray(errors);
      assert.lengthOf(errors, 2);
    });
  });
});
