class GenericView {
  constructor(req) {
    this.req = req;
  }
  isGameBeingPlayed() {
    return this.req.app.locals.workspace.activeChannelExists(this.req.command.channelId)
  }
  theBoard() {
    return this.req.app.locals.workspace.activeChannels[this.req.command.channelId].game.gameBoard.render()
  }
}

module.exports = GenericView