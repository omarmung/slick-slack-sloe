const slackClient = require('../services/slack_client')
let workspace; // declare this, and grab from req.app.locals.workspace at request time
const slackTemplates = require('../templates/slack_templates')
const slackTemplatesBoard = require('../templates/slack_board_template')
const mustache = require('mustache')

function playCommandHandler(req, res) {
  // gather necessary info
  const slackChannelId = req.command.channelId
  const slackChannelName = req.command.channel_name || 'unknown'
  const player1UserId = req.command.userId
  const opponentUserName = req.command.opponentUserName
  const opponentUserId = req.command.opponentUserId
  console.log('req.command at playCommandHandler: ', req.command)
  workspace = req.app.locals.workspace
  const player1Symbol = 'X'
  const player2Symbol = 'O'
  
  // is there already a game in progress in that channel?
  if(!isGameAlreadyBeingPlayedInChannel(slackChannelId, workspace)) {
    // no, so we need to check if they're in the channel and start a game
    // checking if they're in the channel will be async

    // first, is the potential opponent in this channel?
    return slackClient.getSlackWorkspaceChannelAsync(slackChannelId)
      .then( response => {

        // try to match the input userId to the channel membership
        let isMember = response.members.includes(opponentUserId)
        if (isMember) {
          // ok, they're a channel member

          // second step, let's create a channel (and it will create a game) 
          let newChannelReference = workspace.createNewChannel(slackChannelId, slackChannelName, player1UserId, player1Symbol, player2Symbol)
          res.json(`Okay, let's start a game and see if ${opponentUserName} wants to play!`)
          slackClient.postTextToChannelEphemerallyAsync(slackChannelId, {"text": `Hey ${opponentUserName}, wanna play some tic-tac-toe?`}, opponentUserId)
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
  // get lookup info from req
  const slackChannelId = req.body.channel_id
  let message;
  // check activeChannels to see if we're tracking a game in this channel already
  if(workspace.activeChannelExists(slackChannelId)) {
    message = "there's a game being played already"
  } else {
    message = "no game is being played right now"
  }
  res.send(message)
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
  fetchSlackChannelAsync: fetchSlackChannelAsync,
  isUserInChannelAsync: isUserInChannelAsync,
  isGameAlreadyBeingPlayedInChannel: isGameAlreadyBeingPlayedInChannel,
  doesUserHaveChannelMembershipAsync: doesUserHaveChannelMembershipAsync
}

