const Channel = require('../libs/channel')

// storage for channels with a game in progress
let activeChannels = {}

export function isChannelPlayingGame(slackChannelId) {
  return activeChannels.hasOwnProperty(slackChannelId)
}

// create a new channel instance
export function startChannelGame(slackChannelId, slackChannelName, player1, player2) {
  if (!isChannelPlayingGame) {
    // create a channel with a game, a board, squares, and two players
    let channelGame = new Channel(
      slackChannelId, 
      slackChannelName, 
      player1Symbol, 
      player2Symbol
    )
    
    // store the instance with our active instances 
    activeChannels[slackChannelId] = channelGame
    
    // TODO take actions to start gameplay 
  }
}

// prune a channel instance from our activeChannels
export function removeChannelGame(slackChannelId) {
  return delete activeChannels[slackChannelId]
}

