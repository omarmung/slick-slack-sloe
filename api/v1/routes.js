const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const channelGamesController = require('../../controllers/channelGamesController')
const commandParserMiddleware = require('../../middleware/command_parser_middleware')
/**
 * @api {get} /api/v1 App Heartbeat
 * @apiName Heartbeat
 * @apiGroup General
 *
 * @apiSuccess {String} status Service status indicator
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok"
 *     }
 **/
router.get('/', (req, res) => { res.json({"status": "ok"}) })

/**
 * @api {post} /api/v1/game Game Command Parser
 * @apiName Gam
 * @apiGroup Game
 *
 **/
router.post(
  '/game',
  [
    commandParserMiddleware.processBodyText,
    commandParserMiddleware.help,
    commandParserMiddleware.status, 
    commandParserMiddleware.play,
    commandParserMiddleware.move, 
    commandParserMiddleware.leave
  ],
  function(req, res) {
    // handle req
    console.log('/game req.body:', req.body)
    channelGamesController.gameCommandHandler(req, res)
    return
  }
)
module.exports = router