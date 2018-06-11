const Board = require('./board')
const Player = require('./player')

class Game {
  constructor(player1UserId, player1Symbol, player2Symbol) {
    this.gameBoard = new Board();
    this.player1 = new Player(player1Symbol, player1UserId);
    this.player2 = new Player(player2Symbol);
    this.currentPlayer = this.player1;
    this.gameAccepted = false;
    this.gameOver = false;
    this.turn = 1;
  }
  didThisPlayerWin(player) {
    if ( this.winValues.some( winValue => winValue & player.squaresTotal ) ) {
      return true
    }
    return false
  }
  didEitherPlayerWin() {
    // check players' total occupied square values against win values list
    return [this.player1, this.player2].some( player => this.this.didThisPlayerWin(player) )
  }
}

// since we enumerated our squares by powers of two
// each is basically a binary place
// so our decimal total and these three-in-a-row sums show up in binary
// with an &, we can see if one of these is represented there
Game.prototype.winValues = [7, 56, 448, 73, 146, 292, 273, 84]

module.exports = Game;