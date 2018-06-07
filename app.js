'use strict'; // jshint ignore:line

// set up express
const app = require('express')
const v1 = require('./api/v1/routes')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv').config()

// get config and env variables
const port = process.env.PORT || process.env.APP_PORT_NUMBER
const slack_integration_token = process.env.SLACK_INTEGRATION_TOKEN

// build express app
app()
  .use(bodyParser.json()) // attach app-wide middleware
  .use('/docs', app.static('./doc')) // attach static route for documentation
  .use('/api/v1', v1) // attach router
  .listen(port, () => { console.log('Server listening on port ' + port + '...') } ) // start server