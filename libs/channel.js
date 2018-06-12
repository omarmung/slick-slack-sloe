const Game = require('../libs/game')

class Channel {
  constructor(slackChannelId, channelName, player1UserId, player1Symbol, player2Symbol, player2UserId) {
    this.name = channelName
    this.slackChannelId = slackChannelId
    this.gameInProgress = true
    this.game = new Game(player1UserId, player1Symbol, player2Symbol, player2UserId)
  }
}

module.exports = Channel