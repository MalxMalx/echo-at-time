const axios = require('axios');
const { assert } = require('chai');
const { port, apiPrefix, routes, acceptance } = require('config');
const axiosInstance = axios.create({
  baseURL: `${acceptance.baseUrl}:${port}${apiPrefix}${routes.echo}`,
  validateStatus: () => true
});

describe('Echo API', () => {
  describe('POST: Schedule a timed message', () => {
    context('invalid request body', () => {
      it('responds with status 400', async () => {
        const { status } = await axiosInstance.post('/', {});

        assert.strictEqual(status, 400);
      });
    });

    context('valid request body', () => {
      it('responds with status 202', async () => {
        const time = Date.now() + 3600000;
        const message = 'Test';
        const { status } = await axiosInstance.post('/', { time, message });

        assert.strictEqual(status, 202);
      });
    });
  });
});
