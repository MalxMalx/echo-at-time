const axios = require('axios');
const { assert } = require('chai');
const { port, routes, acceptance, errorMessages } = require('config');
const axiosInstance = axios.create({
  baseURL: `${acceptance.baseUrl}:${port}${routes.echo}`,
  validateStatus: () => true
});

describe('Echo API', () => {
  describe('POST: Schedule a timed message', () => {
    context('invalid request body', () => {
      it('responds with status 400 and an array of error messages', async () => {
        const { data, status } = await axiosInstance.post('/', {});

        assert.strictEqual(status, 400);
        assert.deepStrictEqual(data, Object.values(errorMessages));
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
