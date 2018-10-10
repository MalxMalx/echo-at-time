module.exports = {
  port: 3000,
  acceptance: {
    baseUrl: 'http://localhost'
  },
  apiPrefix: '/api/v1',
  routes: {
    echo: '/echo'
  },
  maxEchoIntervalMs: 31536000000 // 365 days
};
