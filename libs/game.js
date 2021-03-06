const Board = require('./board')
const Player = require('./player')
const constants = require('./constants')
class Game {
  constructor(player1UserId, player1Symbol, player2Symbol, player2UserId, player1UserName, player2UserName) {
    this.gameBoard = new Board()
    this.player1 = new Player(player1Symbol, player1UserId, player1UserName)
    this.player2 = new Player(player2Symbol, player2UserId, player2UserName) 
    this.currentPlayer = this.player1
    this.waitingPlayer = this.player2
    this.gameAccepted = false
    this.winner = null
    this.gameOver = null
    this.draw = null
    this.turn = 0
  }
  didThisPlayerWin(player) {
    // is a win value represented, bit-wise, in this total?
    // (if this were decimal, this might look like: 1,10,100 -> win val of 111)
    // more about this in constants.js at winValues
    const isWinInTotal = (winValue) => {
      return winValue === (winValue & player.squaresTotal) 
    }
    // compare against each possible winValue of: 3 rows, 3 columns, 2 diagonals
    let won = constants.winValues.some( (winValue) => isWinInTotal(winValue) )
    return won ? true : false
  }
  didEitherPlayerWin() {
    // check players' total occupied square values against win values list
    return [this.player1, this.player2].some( player => this.didThisPlayerWin(player) )
  }
  toggleCurrentPlayer() {
    // set currentPlayer to the next player
    this.currentPlayer.userId === this.player1.userId ? this.currentPlayer = this.player2 : this.currentPlayer = this.player1
    this.waitingPlayer.userId === this.player2.userId ? this.waitingPlayer = this.player1 : this.waitingPlayer = this.player2
    // increment round
    this.turn++
    return this.turn
  }
}

module.exports = Game;