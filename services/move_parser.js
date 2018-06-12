const miscHelpers = require('../utils/misc_helpers')
// parse move string
module.exports = function(moveString) {
  // identify A1 format
  
  // search
  const regex = /([abcABC]) *([123])/
  let matched = regex.exec(moveString)
  
  // handle cases
  if (matched === null) {
    // it's not a valid move
    return null
  }
  // looks like a valid move
  let move = matched[1].toUpperCase() + matched[2]

  // map to an index on the game board (laaaaaame, i should think of a better way)
  const lookupIndex = {
    A1: 0,
    A2: 1,
    A3: 2,
    B1: 3,
    B2: 4,
    B3: 5,
    C1: 6,
    C2: 7,
    C3: 8
  }

  let index = lookupIndex[move]
  
  return index
    
}