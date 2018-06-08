const slackClient = require('../services/slack_client')
const parseCommand = require('../services/command_parser.js')

// handle requests for channel/games resources from models
function gameCommandHandler(req, res) {
  console.log('gameCommandHandler received req.body: ', req.body)

  let command = parseCommand(req.body.text)
  req.command = command
  
  // let's print out our command
  req.command.forEach((word, index) => {
    console.log(`word index: ${index}, word: ${word}`)
  })
  
  // forward to individual command handlers
  switch(req.command[0]) {
    case "play":
      console.log('gameCommandHandler: "play"')
      playCommandHandler(req, res)
      break;
    case "leave":
      console.log('gameCommandHandler: "leave"')
      leaveCommandHandler(req, res)
      break;
    case "status":
      console.log('gameCommandHandler: "status"')
      statusCommandHandler(req, res)
      break;
    default:
      console.log('gameCommandHandler: default')
  }
}

function playCommandHandler(req, res) {
  let slackChannelId = req.body.channel_id
  let slackChannelName = req.body.channel_name
  let player1Symbol = "X"
  let player2Symbol = "O"
  
  // does the command have a second word after 'play'?
  if (req.command.length > 1 && req.command[1]) {
    // yes it does

    // is there already a game in progress in that channel?
    if(!workspaceModel.isChannelPlayingGame(slackChannelId)) {
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
  
  // fetch channel info 
  fetchSlackChannelAsync(slackChannelId)
    .then()
    .catch()
}

function fetchSlackChannelAsync(slackChannelId) {
  // call Slack Web API and get channels for the workspace
  let channelPromise = slackClient.getSlackWorkspaceChannelAsync(slackChannelId)
    .then((channelResponse) => {
      // if (!channelResponse.ok)

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


module.exports = {
  gameCommandHandler: gameCommandHandler,
  statusCommandHandler: statusCommandHandler,
  fetchSlackChannelAsync: fetchSlackChannelAsync,
  isUserInChannelAsync: isUserInChannelAsync,
  isGameAlreadyBeingPlayedInChannel: isGameAlreadyBeingPlayedInChannel,
}

