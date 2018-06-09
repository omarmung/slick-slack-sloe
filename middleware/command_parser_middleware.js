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
  // create results obj
  req.command = {}

  // process command text
  if(req.body && req.body.text) {
    console.log('middleware processBodyText')
    req.command.commandArr = req.body.text.split(' ') || ['help']
    console.log('REQ.COMMAND:', req.command)
    next()
    return
  }
  // missing body.text, remap request to 'help'
  req.command.commandArr[0] = 'help'
  next()
}

// identify status command
function status(req, res, next) {
  if(req.command.commandArr[0] === 'status') {
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
  help: help,
  status: status,
  play: play,
  leave: leave,
  move: move,
}