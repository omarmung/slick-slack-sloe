const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv').config();
const port = process.env.PORT || process.env.APP_PORT_NUMBER;

// attach middleware
app.use(bodyParser.json());

// routes
app.get('/', function (req, res) {
  res.send('heartbeat');
});

// start server
app.listen(port, function () {
  console.log('Server listening on port ' + port + '...');
});