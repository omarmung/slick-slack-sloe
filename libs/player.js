class Player {
  constructor(symbol, userId, handle) {
    this.handle = handle
    this.symbol = symbol
    this.userId = userId || null
    this.occupiedSquaresByValue = []
  }
  checkIfUserExistsInChannel(channel) {
    // check if user exists in this channel
  }
  get squaresTotal() {
    // get sum of all values of all squares a player currently occupies
    if (this.occupiedSquaresByValue.length) {
      return this.occupiedSquaresByValue.reduce((acc, val) => acc + val ) 
    }
    return 0
  }
}

module.exports = Player