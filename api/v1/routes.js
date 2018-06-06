const express = require('express')
const router = express.Router()

router
  .get('/', (req, res) => { res.send('GET handler for /api/v1 route.') })
  .post('/', function(req, res) { res.send('POST handler for /api/v1 route.') })

module.exports = router;