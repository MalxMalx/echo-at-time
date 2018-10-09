const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.post('/api/v1/echo', (req, res) => {
  res.sendStatus(202);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
