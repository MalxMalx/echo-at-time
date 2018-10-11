const config = require('config');
const { validateParameters } = require('./validation');
const redisClient = require('../../redis-client');
const BadRequestError = require('../../errors/bad-request-error');
const print = require('../../utils/print');

module.exports = function handlePost(req, res, next) {
  const errors = validateParameters(req.body);

  if (errors) {
    return next(new BadRequestError(errors));
  }

  const { time, message } = req.body;

  if (time === Date.now()) {
    // just print out immediately
    res.sendStatus(202);
    print({ time, message });
    return next();
  }

  // store in Redis Waiting Set
  redisClient.sadd(
    config.redis.waitingSet,
    JSON.stringify({ time, message }),
    err => {
      if (err) return next(err);
      res.sendStatus(202);
      next();
    }
  );
};
