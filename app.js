const express = require('express');
const bodyParser = require('body-parser');
const { port, apiPrefix, routes } = require('config');
const echoPostHandler = require('./routes/echo/handler');
const app = express();

app.use(bodyParser.json());

app.post(`${apiPrefix}${routes.echo}`, echoPostHandler);

app.listen(port, () => console.log(`Server listening on port ${port}`));
