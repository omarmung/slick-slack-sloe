const slackClient = require('../services/slack_client')
let workspace; // declare this, and grab from req.app.locals.workspace at request time
const slackTemplates = require('../templates/slack_templates')
const slackTemplatesBoard = require('../templates/slack_board_template')
const mustache = require('mustache')
const statusTemplate = require('../templates/status_template')
const helpTemplate = require('../templates/help_template')
const quitTemplate = require('../templates/quit_template')
const moveTemplate = require('../templates/move_template')
const playTemplate = require('../templates/play_template')
const GenericView = require('../views/generic_view')

function playCommandHandler(req, res) {
  // gather necessary info
  const slackChannelId = req.command.channelId
  const slackChannelName = req.command.channel_name || 'unknown'
  const player1UserId = req.command.userId
  const opponentUserName = req.command.opponentUserName
  const opponentUserId = req.command.opponentUserId
  console.log('opponentUserName:', opponentUserName)
  workspace = req.app.locals.workspace
  const player1Symbol = 'X'
  const player2Symbol = 'O'
  const player1UserName = req.command.userNameMaybe
  const player2UserName = opponentUserName
  let statusView = new GenericView(req)
  
  // is there already a game in progress in that channel?
  if(!isGameAlreadyBeingPlayedInChannel(slackChannelId, workspace)) {
    // no, so we need to check if they're in the channel and start a game
    
    // first, is the potential opponent in this channel? (async)
    return slackClient.getSlackWorkspaceChannelAsync(slackChannelId)
      .then( function(response) {

        // what is this user's username?
        if (player2UserName === null){
          // Slack's user_name is being phased out
          // TODO: go grab this from Web API
          player2UserName = 'Player 1'
        }

        // try to match the input userId to the channel membership
        let isMember = response.members.includes(opponentUserId)
        if (isMember) {
          // ok, they're a channel member

          // second step, let's create a channel (and it will create a game)
          let newChannelReference = workspace.createNewChannel(slackChannelId, slackChannelName, player1UserId, player1Symbol, player2Symbol, opponentUserId, player2UserName, player1UserName)
          res.send()

            // render JSON for post, then post status to channel
          slackClient.postTextToChannelPublicAsync(slackChannelId, {"text": `${opponentUserName}, the game is afoot! '/ttt help' for commands!`}, opponentUserId).then((response) => {
            
              // render JSON for post, then post status to channel
            let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(statusTemplate), statusView))
            slackClient.postTextToChannelPublicAsync(slackChannelId, jsonPostBody)
              .catch((error) => {
                console.log(error)
                throw(error)
              })

          })
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
  const userId = req.command.userId
  workspace = req.app.locals.workspace
  let statusView = new GenericView(req)

  // respond to slash command req
  res.send()

  // render JSON for post, then post status to channel
  let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(statusTemplate), statusView))
  slackClient.postTextToChannelEphemeralAsync(slackChannelId, jsonPostBody, userId)
    .catch((error) => {
      console.log(error)
      throw(error)
    })
  return
}

function moveCommandHandler(req,res, moveIndex) {
  const slackChannelId = req.command.channelId
  workspace = req.app.locals.workspace
  let statusView = new GenericView(req)

  // is there a game on?
  if (!workspace.activeChannelExists(slackChannelId)) {
    // sorry, no game
    res.send('Challenge someone to play first!')
    return
  }
  // if so, are you a player?
  let game = workspace.activeChannels[slackChannelId].game
  if (!((game.player1.userId === req.command.userId) || (game.player2.userId === req.command.userId))) {
    // sorry, not your turn
    res.send('Sorry, you\'re not playing this game.')
    return
  }
  
  // if so, is it your turn?
  if (!(game.currentPlayer.userId === req.command.userId)) {
    // sorry, not your turn
    res.send('Sorry, it\'s not your turn.')
    return
  }
  // if both so, can we place move on board?
  if (!game.gameBoard.occupySquare(moveIndex, game.currentPlayer)) {
    // nope... invalid move
    res.send('Invalid move, try again!')
    return
  }

  // for everyone else, respond to slash command req
  res.send()
  
  // ok, great move, let's increment turns counter
  // and update who is current player and who is waiting player
  let turn = game.toggleCurrentPlayer()
  
  // check win status
  if(game.didThisPlayerWin(game.waitingPlayer)) {
    // we have a winner!
    game.gameOver = true
    game.winner = game.waitingPlayer
  }


  // if game is not over
  if (!game.gameOver) {
    // if no winner yet...

    // check if this is a draw
    if (turn > 8) {
      // board is full, it's a draw!
      game.gameOver = true
      game.draw = true
    }
  }
  
  // render JSON for post, then post status to channel
  let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(moveTemplate), statusView))
  slackClient.postTextToChannelPublicAsync(slackChannelId, jsonPostBody).then(function(response) {
    
    // remove old games
    if (game.gameOver) {
      // and delete the channel, that's a wrap
      console.log('removing from activeChannels')
      workspace.activeChannelRemove(slackChannelId)
    }
  })
  .catch((response) => {
    console.log(error)
  })

}

function helpCommandHandler(req, res) {
  const slackChannelId = req.command.channelId
  const userId = req.command.userId
  workspace = req.app.locals.workspace
  let statusView = new GenericView(req)

  // respond to slash command req
  res.send()

  // render JSON for post, then post status to channel
  let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(helpTemplate), statusView))
  slackClient.postTextToChannelEphemeralAsync(slackChannelId, jsonPostBody, userId)
    .catch((error) => {
      console.log(error)
      throw(error)
    })
  return  
}

function quitCommandHandler(req, res) {
  const slackChannelId = req.command.channelId
  const userId = req.command.userId
  workspace = req.app.locals.workspace
  let statusView = new GenericView(req)
  
  // respond to slash command req
  res.send()
  
  // if you successfully quit, that will be public
  // if you're not playing, or there's no game being played,
  // that will be an ephemeral message
  
  // is there a game being played in the channel?
  let inProgress = isGameAlreadyBeingPlayedInChannel(slackChannelId, workspace)
  if (inProgress) {
    let game = workspace.activeChannels[slackChannelId].game
    let isUserPlaying = ( (game.player1.userId === req.command.userId) || (game.player2.userId === req.command.userId) ) ? true: false
    // with those, we can decide...
    if(isUserPlaying) {
      // public
      // render JSON for post, then post status to channel
      let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(quitTemplate), statusView))
      slackClient.postTextToChannelPublicAsync(slackChannelId, jsonPostBody, userId)
        .then(function(response) {
          // and delete the channel, that's a wrap
          workspace.activeChannelRemove(slackChannelId)
          return  
        })
        .catch((response) => {
          throw(error)
          console.log(error)
        })

    }
  }
  // private
  // render JSON for post, then post status to channel
  let jsonPostBody = JSON.parse(mustache.render(JSON.stringify(quitTemplate), statusView))
  slackClient.postTextToChannelEphemeralAsync(slackChannelId, jsonPostBody, userId)
    .catch((response) => {
      console.log(error)
      throw(error)
    })
  return
}

function fetchSlackChannelAsync(slackChannelId) {
  // call Slack Web API and get channel by Id
  let channelPromise = slackClient.getSlackWorkspaceChannelAsync(slackChannelId)
    .then((channelResponse) => {
      if (!channelResponse.ok) throw new Error(channelResponse)
      return channelResponse 
    })
    .catch((error) => {
      res.send()
      console.log(error)
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
      throw(error)
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
    .catch((error) => {
      throw(error)
    })
}

module.exports = {
  playCommandHandler: playCommandHandler,
  playWhoCommandHandler: playWhoCommandHandler,
  statusCommandHandler: statusCommandHandler,
  quitCommandHandler: quitCommandHandler,
  moveCommandHandler: moveCommandHandler,
  helpCommandHandler: helpCommandHandler, 
  fetchSlackChannelAsync: fetchSlackChannelAsync,
  isUserInChannelAsync: isUserInChannelAsync,
  isGameAlreadyBeingPlayedInChannel: isGameAlreadyBeingPlayedInChannel,
  doesUserHaveChannelMembershipAsync: doesUserHaveChannelMembershipAsync
}

