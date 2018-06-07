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
    console.log(
      `
        ${this.squares[0].mark} | ${this.squares[1].mark} | ${this.squares[2].mark}
        ${this.squares[3].mark} | ${this.squares[4].mark} | ${this.squares[5].mark}
        ${this.squares[6].mark} | ${this.squares[7].mark} | ${this.squares[8].mark}
      `
    )
  }
}

module.exports = Board