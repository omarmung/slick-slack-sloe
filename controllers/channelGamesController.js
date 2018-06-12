const slackClient = require('../services/slack_client')
let workspace; // declare this, and grab from req.app.locals.workspace at request time
const slackTemplates = require('../templates/slack_templates')
const slackTemplatesBoard = require('../templates/slack_board_template')
const mustache = require('mustache')
const statusTemplate = require('../templates/status_template')
const GenericView = require('../views/generic_view')

function playCommandHandler(req, res) {
  // gather necessary info
  const slackChannelId = req.command.channelId
  const slackChannelName = req.command.channel_name || 'unknown'
  const player1UserId = req.command.userId
  const opponentUserName = req.command.opponentUserName
  const opponentUserId = req.command.opponentUserId
  workspace = req.app.locals.workspace
  const player1Symbol = 'X'
  const player2Symbol = 'O'
  
  // is there already a game in progress in that channel?
  if(!isGameAlreadyBeingPlayedInChannel(slackChannelId, workspace)) {
    // no, so we need to check if they're in the channel and start a game
    
    // first, is the potential opponent in this channel? (async)
    return slackClient.getSlackWorkspaceChannelAsync(slackChannelId)
      .then( response => {

        // try to match the input userId to the channel membership
        let isMember = response.members.includes(opponentUserId)
        if (isMember) {
          // ok, they're a channel member

          // second step, let's create a channel (and it will create a game) 
          let newChannelReference = workspace.createNewChannel(slackChannelId, slackChannelName, player1UserId, player1Symbol, player2Symbol, opponentUserId)
          res.send()
          slackClient.postTextToChannelPublicAsync(slackChannelId, {"text": `Hey ${opponentUserName}, wanna play some tic-tac-toe?`}, opponentUserId)
          return 
        }
        // oh no! that person isn't in this channel, sorry
        res.json('Pick someone here in the channel!')
        return
      })
      .catch( error => {
        console.log('Error:', error)
        // return res.json('testings')
      })
  }

  // look like there's already a game in progress in that channel
  res.json(slackTemplates.stringTemplates.challenge.inProgress)
  return
}

function playWhoCommandHandler(req, res) {
  // res.json({text: slackTemplatesBoard})
  res.json(slackTemplates.stringTemplates.challenge.opponent)
}

function statusCommandHandler(req, res) {
  const slackChannelId = req.command.channelId
  workspace = req.app.locals.workspace
  let statusView = new GenericView(req)

  // respond to slash command req
  res.send()

  // render JSON for post, then post status to channel
  let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(statusTemplate), statusView))
  slackClient.postTextToChannelPublicAsync(slackChannelId, jsonPostBody)
  return
}

function moveCommandHandler(req,res, moveIndex) {
  const slackChannelId = req.command.channelId
  workspace = req.app.locals.workspace
  let statusView = new GenericView(req)

  // is there a game on?
  if (!workspace.activeChannelExists(slackChannelId)) {
    // sorry, no game
    res.send('Challlenge someone to play first!')
    return
  }
  // if so, is it your turn?
  let game = workspace.activeChannels[slackChannelId].game
  if (!(game.currentPlayer.userId === req.command.userId)) {
    // sorry, not your turn
    res.send('It\'s not your turn yet.')
    return
  }
  // if both so, can we place move on board?
  if (!game.gameBoard.occupySquare(moveIndex, game.currentPlayer)) {
    // nope... invalid move
    res.send('Invalid move, try again!')
    return
  }
  // check win status
  if(game.didThisPlayerWin(game.currentPlayer)) {
    // we have a winner!
    this.gameOver = true
    this.winner = game.currentPlayer
    res.send('you won!:' + game.currentPlayer.squaresTotal)
  } else {
    // respond to slash command req
    res.send()
  }

  // if game is over, these won't matter
  if (!this.gameOver) {
    // if no winner yet...

    // ok, nice move, increment turns counter
    let turn = game.toggleCurrentPlayer()

    // check if this is a draw
    if (turn > 9) { // is this off by 1?
      // board is full, it's a draw!
      game.gameOver = true
    }
  }
  

  // render JSON for post, then post status to channel
  let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(statusTemplate), statusView))
  slackClient.postTextToChannelPublicAsync(slackChannelId, jsonPostBody)
}

function fetchSlackChannelAsync(slackChannelId) {
  // call Slack Web API and get channel by Id
  let channelPromise = slackClient.getSlackWorkspaceChannelAsync(slackChannelId)
    .then((channelResponse) => {
      if (!channelResponse.ok) throw new Error(channelResponse)
      return channelResponse 
    })
    .catch((error) => {
      res.send(error)
      return new Error('API call failed.')
    })
}

function isUserInChannelAsync(slackChannelId, slackUserId) {
  let channelInfoPromise = fetchSlackChannelAsync(slackChannelId)
    .then(channelInfoResponse => {
      let matchingId = channelInfoResponse.channel.members.find( member => { 
        return member === slackUserId
      })
      return matchingId ? true : false
    })
    .catch(error => {

    })
}

function isGameAlreadyBeingPlayedInChannel(slackChannelId, workspace) {
  // check if channel exists in activeChannels
  return workspace.activeChannelExists(slackChannelId)
}

function doesUserHaveChannelMembershipAsync(slackUserId, slackChannelId) {
  // fetch channel info
  return fetchSlackChannelAsync(slackChannelId)
    .then(channelResponse => {
      // check if the userId is listed as a member of the channel 
      let matchingId = channelResponse.channel.members.some( member => { 
        return member === slackUserId
      })
      // return a boolean
      return matchingId ? true : false
    })
}

function devCommandHandlerAsync(req, res) {
  const slackChannelId = req.body.channel_id

  // text of post
  let textToPost = req.command.channelReference.game.board.render()
  //


  // async call to post text to channel
  return slackClient.postTextToChannelAsync(slackChannelId, textToPost)
    .then((response) => {

      res.json(response)
      return
    })
    .catch((error) => {
      throw new Error(error)
    })
}

module.exports = {
  playCommandHandler: playCommandHandler,
  playWhoCommandHandler: playWhoCommandHandler,
  devCommandHandlerAsync: devCommandHandlerAsync, // TODO: remove dev func
  statusCommandHandler: statusCommandHandler,
  moveCommandHandler:moveCommandHandler,
  fetchSlackChannelAsync: fetchSlackChannelAsync,
  isUserInChannelAsync: isUserInChannelAsync,
  isGameAlreadyBeingPlayedInChannel: isGameAlreadyBeingPlayedInChannel,
  doesUserHaveChannelMembershipAsync: doesUserHaveChannelMembershipAsync
}

