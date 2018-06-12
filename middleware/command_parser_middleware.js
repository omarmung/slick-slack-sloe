const channelGamesController = require('../controllers/channelGamesController')
const parseExpandedUsername = require('../services/username_parser')
const parseMoveInput = require('../services/move_parser')
/** 
*   We'll do necessary checks here,
*   and load up a 'req.command' obj
*   in which to pass our results
*
*   req {
*     body.text?: "<arg1> <arg2> ...",
*     command { <-- we create this here
*       commandArr: [body.text.split(' ')],
*       channelId: <slack channel_id>,
*       userId: <slack user_id>,
*       responseUrl: <slack response URL>,
*       token: <slack slash command outgoing verification token>,
*       channelReference: false <-- attach activeChannel
*     },
*   } 
*/
function processBodyText(req, res, next) {
  console.log('middleware processBodyText')
  
  // create results obj
  req.command = {
    channelId: req.body.channel_id,
    userNameMaybe: req.body.user_name || null, 
    userId: req.body.user_id,
    responseUrl: req.body.response_url,
    token: req.body.token,
    channelReference: false,
    opponentUserId: false,
    opponentUserName: false
  }

  // process command text
  if(req.body.hasOwnProperty('text')) {
    req.command.commandArr = req.body.text.split(' ')

    console.log('tfw req.command does indeed have text:', req.command)
    
    next()
    return
  }
  // missing body.text, remap request to 'help'
  req.command.commandArr = ['help']
  next()
}

// attach channel if in activeChannels
function isActiveChannel(req, res, next) {
  let channelId = req.command.channelId

  // check if channelId is in workspace's activeChannels
  if(req.app.locals.workspace.activeChannelExists(channelId)) {
    // it's there, game on!
    console.log('middleware isActiveChannel: true')
    
    // get the channel ref from storage and add to this request
    let activeChannelReference = req.app.locals.workspace.getActiveChannelGameById(channelId)
    req.command.channelReference = activeChannelReference
    req.command.game = activeChannelReference.game
    console.log('middleware isActiveChannel: retrieved channel to request')
   
    // we're done here
    next()
    return
  }
  // it's not there, no activeChannel, :. no game
  console.log('middleware isActiveChannel: false')
  next()
}

// PLAY - identify and parse play commands
function play(req, res, next) {
  let commandArr = req.command.commandArr
  if(commandArr[0] === 'play') {
    console.log('middleware play') // TODO: remove

    // did user indicate a potential opponent?
    if(commandArr.length > 1) {
      // yes they did
      
      // but was it an @username?
      // like in the <@U1234|user> format?
      let attemptedParse = parseExpandedUsername(commandArr[1])
      if (!!attemptedParse) {
        // looks like the right format, add parsed info to req
        req.command.opponentUserId = attemptedParse.parsedUserId
        req.command.opponentUserName = attemptedParse.parsedUserName
        console.log('middleware play someone') // TODO: remove
        channelGamesController.playCommandHandler(req, res)
        return
      }
      // they did indicate someone, but not as an @name, so fallthrough
    }
    // no, handle it
    console.log('middleware play who tho')  // TODO: remove
    channelGamesController.playWhoCommandHandler(req, res)
    return
  }
  next()
}

// MOVE - identify and parse move command
function move(req, res, next) {
  if(req.command.commandArr[0] === 'move') {
    console.log('middleware move')
    
    if(req.command.commandArr.length > 1) {
      // ok to parse
      // grab everything after the first space
      let moveString = req.command.commandArr.slice(1).join('')
      console.log('moveString:', moveString)
      // and try to parse it
      const parsedMoveIndex = parseMoveInput(moveString)
      console.log('parseMoveIndex:', parsedMoveIndex)
      // if it succeeded, we have a valid move
      if (parsedMoveIndex !== null && parsedMoveIndex !== undefined) {
        // valid, send to handler
        channelGamesController.moveCommandHandler(req, res, parsedMoveIndex)
        return
      }
      // invalid move, fallthrough
    }
  }
  next()
}

// STATUS - identify status command
function status(req, res, next) {
   // matches?
  if(req.command.commandArr[0] === 'status') {
    
    // render status response
    channelGamesController.statusCommandHandler(req, res)
    return
  }
  next()
}

// QUIT - identify quit command
function quit(req, res, next) {
  let word = req.command.commandArr[0]
  if(word === 'quit' || word === 'leave') {
    console.log('middleware leave')

    // engage leave-wanting protocol
    channelGamesController.quitCommandHandler(req, res, next)
    return
  }
  next()
}

// HELP - help command
function help(req, res, next) {
  // render status response
  channelGamesController.helpCommandHandler(req, res)
}

module.exports = {
  processBodyText: processBodyText,
  isActiveChannel: isActiveChannel,
  status: status,
  play: play,
  quit: quit,
  move: move,
  help: help
}