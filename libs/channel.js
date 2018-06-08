const Game = require('../libs/game')

class Channel {
  constructor(slackChannelId, name, player1Symbol, player2Symbol) {
    this.name = name
    this.slackChannelId = slackChannelId
    this.gameInProgress = true
    this.game = new Game()
  }
}

module.exports = Channel()