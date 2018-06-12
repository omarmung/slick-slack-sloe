const channelGamesController = require('../controllers/channelGamesController')
const parseExpandedUsername = require('../services/username_parser')
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
    console.log('middleware isActiveChannel: retrieved channel to request')
   
    // we're done here
    next()
    return
  }
  // it's not there, no activeChannel, :. no game
  console.log('middleware isActiveChannel: false')
  next()
}

// identify and parse play commands
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

// identify and parse move command
function move(req, res, next) {
  if(req.command.commandArr[0] === 'move') {
    console.log('middleware move')
    res.send('middleware move')
    // next()
    return
  }
  next()
}

function devTESTING(req, res, next) {
  // send a message
  channelGamesController.devCommandHandlerAsync(req,res)
  return
}

// identify help command
function help(req, res, next) {
  if(req.command.commandArr[0] === 'help') {
    console.log('middleware help')
    res.send(req.app.locals.constants.helpCommandText)
    return
  }
  next()
}

// identify status command
function status(req, res, next) {
  console.log('middleware status')
 
  if(req.command.commandArr[0] === 'status') {
    
    // render status response
    channelGamesController.statusCommandHandler(req, res)
    return
  }
  next()
}

// identify leave command
function leave(req, res, next) {
  if(req.command.commandArr[0] === 'leave') {
    console.log('middleware leave')

    // engage leave-wanting protocol
    // channelGamesController(req, res, next)
    return
  }
  next()
}

module.exports = {
  devTESTING: devTESTING,
  processBodyText: processBodyText,
  isActiveChannel: isActiveChannel,
  status: status,
  play: play,
  leave: leave,
  move: move,
  help: help
}