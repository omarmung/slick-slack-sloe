const channelGamesController = require('../controllers/channelGamesController')
/** 
*   We'll do necessary checks here,
*   and load up a 'req.command' obj
*   in which to pass our results
*
*   req {
*     body.text?: "<arg1> <arg2> ...",
*     command { <-- we create this here
*       commandArr: body.text.split(' ')
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
    token: req.body.token
  }

  // process command text
  if(req.body.text) {
    req.command.commandArr = req.body.text.split(' ') || ['help']

    console.log('REQ.COMMAND:', req.command)
    
    next()
    return
  }
  // missing body.text, remap request to 'help'
  req.command.commandArr = ['help']
  next()
}

// identify status command
function status(req, res, next) {
  if(req.command.commandArr[0] === 'status') {
    let channelId = req.command.channelId
    
    console.log('middleware status')
    res.send('middleware status')
    // next()
    return
  }
  next()
}

// identify and parse play command
function play(req, res, next) {
  if(req.command.commandArr[0] === 'play') {
    console.log('middleware play')
    res.send('middleware play')
    // next()
    return
  }
  next()
}

// identify leave command
function leave(req, res, next) {
  if(req.command.commandArr[0] === 'leave') {
    console.log('middleware leave')
    res.send('middleware leave')
    // next()
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

// identify help command
function help(req, res, next) {
  if(req.command.commandArr[0] === 'help') {
    console.log('middleware help')
    res.send(req.app.locals.constants.helpCommandText)
    return
  }
  next()
}

module.exports = {
  processBodyText: processBodyText,
  status: status,
  play: play,
  leave: leave,
  move: move,
  help: help
}