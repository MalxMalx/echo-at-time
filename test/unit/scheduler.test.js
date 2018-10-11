const { assert } = require('chai');
const sinon = require('sinon');
const utils = require('../../utils/index');
const redisClient = require('../../redis-client');
const { scheduleItem } = require('../../workers/scheduler');

describe('scheduleItem', () => {
  let sandbox;
  let redisClientSpopMock;
  let redisClientSaddMock;
  let runOnDateMock;
  let printMock;

  before(() => {
    sandbox = sinon.createSandbox();
    redisClientSpopMock = sandbox.stub();
    redisClientSaddMock = sandbox.stub();
    runOnDateMock = sandbox.stub();
    printMock = sandbox.stub();

    sandbox.replace(redisClient, 'spop', redisClientSpopMock);
    sandbox.replace(redisClient, 'sadd', redisClientSaddMock);
    sandbox.replace(utils, 'runOnDate', runOnDateMock);
    sandbox.replace(utils, 'print', printMock);
  });

  context('spop returned an error', () => {
    beforeEach(() => {
      redisClientSpopMock.callsArgWith(1, new Error());
    });

    it('calls next with the error', done => {
      scheduleItem(null, error => {
        assert.ok(error);
        done();
      });
    });
  });

  context('item is null', () => {
    beforeEach(() => {
      redisClientSpopMock.callsArgWith(1, null, null);
    });

    it('calls next', done => {
      scheduleItem(null, done);
    });
  });

  context('item is invalid', () => {
    beforeEach(() => {
      redisClientSpopMock.callsArgWith(1, null, 123);
    });

    it('creates an error and passes it to next', done => {
      scheduleItem(null, error => {
        assert.ok(error);
        done();
      });
    });

    it('does not schedule', done => {
      scheduleItem(null, () => {
        sinon.assert.notCalled(runOnDateMock);
        done();
      });
    });

    it('does not push to Redis', done => {
      scheduleItem(null, () => {
        sinon.assert.notCalled(redisClientSaddMock);
        done();
      });
    });
  });

  context('item is valid', () => {
    context('time of the item is now or in the past', () => {
      const validItem = {
        time: Date.now(),
        message: 'test'
      };
      const validItemStringified = JSON.stringify(validItem);

      beforeEach(() => {
        redisClientSpopMock.callsArgWith(1, null, validItemStringified);
      });

      it('prints the message immediately', done => {
        scheduleItem(null, () => {
          sinon.assert.calledWith(printMock, validItem);
          done();
        });
      });

      it('does not schedule', done => {
        scheduleItem(null, () => {
          sinon.assert.notCalled(runOnDateMock);
          done();
        });
      });

      it('does not push to Redis', done => {
        scheduleItem(null, () => {
          sinon.assert.notCalled(redisClientSaddMock);
          done();
        });
      });
    });

    context('time of the item is in the future', () => {
      const validItem = {
        time: Date.now() + 1000,
        message: 'test'
      };
      const validItemStringified = JSON.stringify(validItem);

      beforeEach(() => {
        redisClientSpopMock.callsArgWith(1, null, validItemStringified);
        redisClientSaddMock.callsArgWith(2, null);
      });

      it('schedules the printing and removing from Redis', done => {
        scheduleItem(null, () => {
          sinon.assert.calledOnce(runOnDateMock);
          done();
        });
      });

      it('pushes into inProgressSet in Redis', done => {
        scheduleItem(null, () => {
          sinon.assert.calledOnce(redisClientSaddMock);
          done();
        });
      });
    });
  });

  afterEach(() => sandbox.reset());
  after(() => sandbox.restore());
});
