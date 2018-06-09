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
  if(req.body && req.body.text) {
    console.log('middleware processBodyText')
    req.command.arr = req.body.text.split(' ') || "nada?"
    console.log('REQ.COMMAND:', req.command)
    next()
    return
  }
  // missing body / body.text
  res.send('Quoi?')
  // next()
  // if just '/ttt' w/o param doesn't send a body
  // might want to include a handler for just /ttt
  // to remap to help, or status
}

function help(req, res, next) {
  if(req.command.commandArr[0] === 'help') {
    console.log('middleware help')
    res.send('middleware help')
    // next()
    return
  }
  next()
}

function status(req, res, next) {
  if(req.command.commandArr[0] === 'status') {
    console.log('middleware status')
    res.send('middleware status')
    // next()
    return
  }
  next()
}

function play(req, res, next) {
  if(req.command.commandArr[0] === 'play') {
    console.log('middleware play')
    res.send('middleware play')
    // next()
    return
  }
  next()
}

function leave(req, res, next) {
  if(req.command.commandArr[0] === 'leave') {
    console.log('middleware leave')
    res.send('middleware leave')
    // next()
    return
  }
  next()
}

function move(req, res, next) {
  if(req.command.commandArr[0] === 'move') {
    console.log('middleware move')
    res.send('middleware move')
    // next()
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