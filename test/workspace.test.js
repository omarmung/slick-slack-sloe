// set up async tests
var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const assert = chai.assert
const sinon = require('sinon')

// stubbing ahoy
const request = require('request')
// import libs
const Workspace = require('../libs/workspace')

// Workspace test
describe('Workspace', function() {
  describe('General', function() {
    beforeEach('Create workspace instance', function() {
      // beforeEach hook
      aWorkspace = new Workspace()
    })
  
    afterEach('Destroy workspace instance', function() {
      // afterEach hook
      aWorkspace = null;  
    });

    describe('Workspace instance', function() {
      it('should have an activeChannels property', function() {
        assert.property(aWorkspace, 'activeChannels')
      })
    }) 
  })
  describe('Channel', function() {
    let slackChannelId = 'A1234'
    let channelName = 'Dustin\s Poetry Corner'
    let player1UserId = 'U10000000'
    let player1Symbol = 'X'
    let player2Symbol = 'O'

    beforeEach('Create workspace instance', function() {
      // beforeEach hook
      aWorkspace = new Workspace()
      aWorkspace.createNewChannel(slackChannelId, channelName, player1UserId, player1Symbol, player2Symbol)
      myChan1 = aWorkspace.getActiveChannelGameById(slackChannelId)
    })
    
    afterEach('Destroy workspace instance', function() {
      // afterEach hook
      aWorkspace = null;  
    });
    
    
    it('should create a new channel in activeChannels', function() {
      assert.property(aWorkspace.activeChannels, slackChannelId)
    })
    
    it('should have a game in progress', function() {
      assert.isTrue(myChan1.gameInProgress, 'Game on!')
    })
    
  })

  // Game tests
  describe('Game', function() {
   let slackChannelId = 'A1234'
   let channelName = 'Dustin\s Poetry Corner'
   let player1UserId = 'U10000000'
   let player1Symbol = 'X'
   let player2Symbol = 'O'
   
   beforeEach('Create channel/game instance', function() {
     // beforeEach hook
     aWorkspace = new Workspace()
     aWorkspace.createNewChannel(slackChannelId, channelName, player1UserId, player1Symbol, player2Symbol)
     let myGame1 = aWorkspace.getActiveChannelGameById(slackChannelId).game
   })
   
   after('Destroy channel/game instance', function() {
     // afterEach hook
     aWorkspace = null;  
   });
   
   describe('Creating a channel', function() {
     it('should have a game', function() {
       assert.property(aWorkspace.activeChannels, slackChannelId)
     })
   }) 
 }) 
  
})