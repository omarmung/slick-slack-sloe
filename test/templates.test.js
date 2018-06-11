// set up async tests
var chai = require("chai")
const expect = chai.expect
const assert = chai.assert
const mustache = require('mustache')
const boardTemplate = require('../templates/slack_board_template')

describe('Templates', function() {

  describe('Board Template', function() {

    xit('Should represent the board', function() {
      assert.equal( mustache.render(boardTemplate, {}), "not equal" )
    })

    



  })
})