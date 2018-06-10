const slackClient = require('../services/slack_client')
const Channel = require('../libs/channel')
let workspace; // declare this, and grab from req.app.locals.workspace at request time

function playCommandHandler(req, res) {
  // knock back incomplete commands
  // does the command have a second word after 'play'?
  if (!(req.command.commandArr.length > 1 && req.command.commandArr[1])) {
    // no argument supplied to 'play' command
    res.send('who do you want to play, friend?')
    return
  }

  // gather necessary info
  const slackChannelId = req.command.channelId
  const slackChannelName = req.command.channel_name || 'unknown'
  const player1UserId = req.command.userId
  const player1Symbol = 'X'
  const player2Symbol = 'O'
  let workspace = req.app.locals.workspace
  
  // is there already a game in progress in that channel?
  if(!isGameAlreadyBeingPlayedInChannel(slackChannelId, workspace)) {
    // no game currently being played
    // start game
    let newChannelReference = workspace.createNewChannel(slackChannelId, slackChannelName, player1UserId, player1Symbol, player2Symbol)
    
    let isItThere = workspace.getActiveChannelGameById(slackChannelId)
    console.log('game:', isItThere)
    res.json(isItThere)
    return
  }

  // there's already a game in progress in that channel
  res.send('There\'s already a game in progress!')
  return
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

module.exports = {
  playCommandHandler: playCommandHandler, 
  statusCommandHandler: statusCommandHandler,
  fetchSlackChannelAsync: fetchSlackChannelAsync,
  isUserInChannelAsync: isUserInChannelAsync,
  isGameAlreadyBeingPlayedInChannel: isGameAlreadyBeingPlayedInChannel,
  doesUserHaveChannelMembershipAsync: doesUserHaveChannelMembershipAsync
}

