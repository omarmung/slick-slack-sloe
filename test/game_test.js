// set up async tests
var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const expect = chai.expect
const assert = chai.assert

// import libs
var Game = require('../libs/game')

describe('Classes', function() {
  let aGame;
  const player1UserId = "A12345" 
  const symbol1 = "X"
  const symbol2 = "O"

  beforeEach('some description', function() {
    // beforeEach hook
    aGame = new Game(player1UserId, symbol1, symbol2)

  })

  after(function() {
    // afterEach hook
    aGame = null;  
  });

  describe('Game instance', function() {
    it('should have a gameOver property', function() {
      assert.property(aGame, 'gameOver')
    })

    it('should have a gameBoard property', function() {
      assert.property(aGame, 'gameBoard')
    })
  })

  describe('Player instance 1', function() {
    it(`should have a symbol property of '${symbol1}'`, function() {
      assert.property(aGame.player1, 'symbol')
      assert.equal(aGame.player1.symbol, symbol1)
    })
  })

  describe('Player instance 2', function() {
    it(`should have a symbol property of '${symbol2}'`, function() {
      assert.property(aGame.player2, 'symbol')
      assert.equal(aGame.player2.symbol, symbol2)
    })
  })

  describe('Board instance', function() {
    it('should have a squares property', function() {
      assert.property(aGame.gameBoard, 'squares')
    })

    it('should have a squares array loaded with 9 squares', function() {
      assert.property(aGame.gameBoard, 'squares')
      assert.lengthOf(aGame.gameBoard.squares, 9)
    })
  })

  describe('Square instance', function() {
    it('should have value and marked keys', function() {
      aGame.gameBoard.squares.forEach( square => { 
        assert.hasAllKeys(square, ['value', 'marked'])
        assert(square.markedBool === false) 
      })
    })
  })
})