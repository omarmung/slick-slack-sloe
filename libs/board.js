const Square = require('./square')
const mustache = require('mustache')
const boardTemplate = require('../templates/slack_board_template')

class Board {
  constructor() {
    this.squares = []
    this.populateWithSquares()
  }
  populateWithSquares() {
    for(var i = 0; i < 9; i++) {
      this.squares.push(new Square(Math.pow(2, i)))
    }
  }
  occupySquare(index, player){
    let square = this.squares[index]
    
    // add symbol to square and send square value to player total
    // and indicate success
    if(!square.marked) {
      square.mark = player.symbol
      player.occupiedSquaresByValue.push(square.val)
      return true
    }
    return false
  }
  render() {
    // construct board text
    return mustache.render(boardTemplate, this.squares);
  }
}

module.exports = Board