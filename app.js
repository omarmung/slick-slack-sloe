'use strict'; // jshint ignore:line

// set up express
const app = require('express')
const v1 = require('./api/v1/routes')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv').config()

// get config and env variables
const port = process.env.PORT || process.env.APP_PORT_NUMBER
const slack_integration_token = process.env.SLACK_INTEGRATION_TOKEN

// build express app
app()
  .use(bodyParser.json()) // attach app-wide middleware
  .use('/docs', app.static('./doc')) // attach static route for documentation
  .use('/api/v1', v1) // attach router
  .listen(port, () => { console.log('Server listening on port ' + port + '...') } ) // start server

  class Game {
    constructor(player1Symbol, player2Symbol) {
      this.gameBoard = new Board();
      this.player1 = new Player(player1Symbol);
      this.player2 = new Player(player2Symbol);
      this.currentPlayer = this.player1;
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
  // 
  // since we enumerated our squares by powers of two
  // each is basically a binary place
  // so our decimal total and these three-in-a-row sums show up in binary
  // with an &, we can see if one of these is represented there
  Game.prototype.winValues = [7, 56, 448, 73, 146, 292, 273, 84]

  class Player {
    constructor(symbol, handle) {
      this.handle = handle
      this.symbol = symbol
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

  class Board {
    constructor() {
      this.squares = []
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

  class Square {
    constructor(value) {
      this.value = value
      this.marked = false
    }
    get mark(){
      return this.marked
    }
    set mark(state){
      if (!this.marked) {
        this.marked = state
        return true
      }
      return false
    }
    get val(){
      return this.value
    }
  }