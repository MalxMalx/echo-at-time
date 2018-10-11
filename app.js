const express = require('express');
const bodyParser = require('body-parser');
const { port, routes } = require('config');
const echoPostHandler = require('./routes/echo/handler');
const startScheduler = require('./workers/scheduler');
const app = express();

app.use(bodyParser.json());

app.post(routes.echo, echoPostHandler);

app.use((err, req, res, next) => {
  console.log(err);

  res.status(err.httpStatusCode);
  if (err.data !== null && typeof err.data !== 'undefined') {
    res.json(err.data);
  }
});

startScheduler();

app.listen(port, () => console.log(`Server listening on port ${port}`));
