// set up express
const express = require('express')
const v1 = require('./api/v1/routes')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv').config()

// get config and env variables
const port = process.env.PORT || process.env.APP_PORT_NUMBER
const slack_integration_token = process.env.SLACK_INTEGRATION_TOKEN

// build express app
const app = express()

app
  .use(bodyParser.json())
  .use('/api/v1', v1)
  .listen(port, () => { console.log('Server listening on port ' + port + '...') } )