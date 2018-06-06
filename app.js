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
  }

  class Player {
    constructor(symbol, handle) {
      this.handle = handle
      this.symbol = symbol
    }
    checkIfExistsInChannel(channel) {
      // check if user exists in this channel
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
    occupySquare(index){
      if(this.squares[index]) {}
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
    set val(value){
      this.value = value 
    }

  }