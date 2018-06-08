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

// connect to 'db'
const Workspace = require('./libs/workspace')
const workspace = new Workspace() 

// middleware check 
const requireIntegrationToken = (req, res, next) => {
  if(req.body.token && req.body.token === slack_integration_token) {
    next()
    return
  }
  res.sendStatus(404)
  return
}
// build express app
app()
  .use(bodyParser.json()) // attach app-wide middleware
  .use(bodyParser.urlencoded({extended: true}))
  .use('/docs', app.static('./doc')) // attach static route for documentation
  // .all('/api/v1/*', requireIntegrationToken)
  .use('/api/v1', v1) // attach router
  .listen(port, () => { console.log('Server listening on port ' + port + '...') } ) // start server

  