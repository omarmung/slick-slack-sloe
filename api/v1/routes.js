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
    commandParserMiddleware.quit,
    commandParserMiddleware.status,
    commandParserMiddleware.play,
    commandParserMiddleware.move, 
    commandParserMiddleware.help
  ],
  function(req, res) {
    // handle requests where we're not sure what to do
    channelGamesController.helpCommandHandler(req, res)
    return
  }
)
module.exports = router