'use strict'; // jshint ignore:line

// set up express
const express = require('express')
const v1 = require('./api/v1/routes')
const path = require('path')
const dotenv = require('dotenv').config()

// get config and env variables
const port = process.env.PORT || process.env.APP_PORT_NUMBER
const constants = require('./libs/constants')

// get app-wide middleware and long-running modules
const bodyParser = require('body-parser')
const requireOutgoingVerificationToken = require('./middleware/verification_check_middleware')
const Workspace = require('./libs/workspace')

// instantiate express app
var app = express()
// ...and attach app-wide middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/docs', express.static('./doc')) // attach static route for documentation
app.all('/api/v1/*', requireOutgoingVerificationToken) // check each request for Slack outgoing verification token
app.use('/api/v1', v1) // attach router for v1 routes
app.listen(port, () => { console.log('Server listening on port ' + port + '...') } ) // start server
app.locals.workspace = new Workspace()  // start internals
app.locals.constants = constants
  
  