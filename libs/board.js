const Square = require('./square')
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
    if(!square.mark) {
      square.mark = true
      player.occupiedSquaresByValue.push(square.val)
      return true;
    }
    return false;
  }
  render() {
    // construct board text
    return Mustache.render(slackTemplates.boardTemplate, this.squares);
  }
}

module.exports = Board