const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const routeValidator = require('express-route-validator')
const slashCommandValidationOptions = require('../../libs/route_validation_options')
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
    routeValidator.validate(slashCommandValidationOptions.gameRoute),
    commandParserMiddleware.processBodyText,
    commandParserMiddleware.isActiveChannel,
    commandParserMiddleware.play,
    commandParserMiddleware.move, 
    commandParserMiddleware.devTESTING, // TODO remove testing route
    commandParserMiddleware.help,
    commandParserMiddleware.status, 
    commandParserMiddleware.leave
  ],
  function(req, res) {
    // handle req
    console.log('/game req.body:', req.body)
    // channelGamesController.genericCommandHandler(req, res)
    res.send('no takers')
    return
  }
)
module.exports = router