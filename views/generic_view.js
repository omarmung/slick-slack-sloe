class GenericView {
  constructor(req) {
    this.req = req
  }
  isGameBeingPlayed() {
    return this.req.app.locals.workspace.activeChannelExists(this.req.command.channelId)
  }
  theBoard(){
    // console.log(this.req.app.locals.workspace.getActiveChannelGameById(this.req.command.channelId).gameBoard)
    return this.req.app.locals.workspace.activeChannels[this.req.command.channelId].game.gameBoard.render()
  }
}

module.exports = GenericView