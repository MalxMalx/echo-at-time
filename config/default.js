module.exports = {
  port: 3000,
  acceptance: {
    baseUrl: 'http://localhost'
  },
  routes: {
    echo: '/api/v1/echo'
  },
  maxEchoIntervalMs: 31536000000, // 365 days
  errorMessages: {
    invalidTime: 'invalid time',
    invalidMessage: 'invalid message'
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    prefix: 'echo:',
    waitingSet: 'waiting',
    inProgressSet: 'inprogress'
  }
};
