const slackClient = require('../services/slack_client')

function playCommandHandler(req, res) {
  let slackChannelId = req.body.channel_id
  let slackChannelName = req.body.channel_name
  let player1Symbol = "X"
  let player2Symbol = "O"
  
  // does the command have a second word after 'play'?
  if (req.command.length > 1 && req.command[1]) {
    // yes it does

    // is there already a game in progress in that channel?
    if(!isGameAlreadyBeingPlayedInChannel()) {
      // no game currently being played
      // start game
      workspaceModel.startChannelGame(
        slackChannelId, 
        slackChannelName,
        player1Symbol,
        player2Symbol
      )
      console.log('game:', workspaceModel.getChannelById(slackChannelId) )
      res.json(workspaceModel.getChannelById(slackChannelId))
      return
    }

    // there's already a game in progress in that channel
    res.send('there\'s already a game in progress!')
    return
  }

  // there isn't a second word in the command phrase
   res.send("who do you want to play, friend?")
}

function statusCommandHandler(req, res) {
  // get lookup info from req
  const slackChannelId = req.body.channel_id
  let workspace = req.app.locals.workspace
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

function isGameAlreadyBeingPlayedInChannel(slackChannelId) {
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

