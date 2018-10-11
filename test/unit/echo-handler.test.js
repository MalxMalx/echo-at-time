const sinon = require('sinon');
const config = require('config');
const httpMocks = require('node-mocks-http');
const { assert } = require('chai');
const { routes, errorMessages } = require('config');
const handlePost = require('../../routes/echo/handler');
const redisClient = require('../../redis-client');
const BadRequestError = require('../../errors/bad-request-error');

describe('Echo API handler', () => {
  describe('POST', () => {
    let sandbox;
    let redisClientSaddMock;

    before(() => {
      sandbox = sinon.createSandbox();
      redisClientSaddMock = sandbox.stub();

      sandbox.replace(redisClient, 'sadd', redisClientSaddMock);
    });

    beforeEach(() => {
      redisClientSaddMock.callsArg(2);
    });

    context('invalid request body', () => {
      it('returns statusCode 400 and errors', done => {
        const request = httpMocks.createRequest({
          method: 'POST',
          url: routes.echo,
          body: { time: {} }
        });

        const response = httpMocks.createResponse();

        handlePost(request, response, err => {
          assert.instanceOf(err, BadRequestError);
          assert.deepStrictEqual(err.data, Object.values(errorMessages));

          done();
        });
      });
    });

    context('valid request body', () => {
      const time = Date.now() + 5000;
      const message = 'test';
      const request = httpMocks.createRequest({
        method: 'POST',
        url: routes.echo,
        body: {
          time,
          message
        }
      });
      const response = httpMocks.createResponse();

      it('returns statusCode 202', done => {
        handlePost(request, response, () => {
          assert.strictEqual(response.statusCode, 202);

          done();
        });
      });

      it('stores the parameters from request body in Redis', done => {
        handlePost(request, response, () => {
          sinon.assert.calledWith(
            redisClientSaddMock,
            config.redis.waitingSet,
            JSON.stringify({ time, message })
          );

          done();
        });
      });
    });

    afterEach(() => sandbox.reset());
    after(() => sandbox.restore());
  });
});
