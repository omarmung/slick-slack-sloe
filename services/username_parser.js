const miscHelpers = require('../utils/misc_helpers')

// parse username string to username obj
module.exports = function(usernameString) {
  // identify <@U1234|user> format
  
  // search
  const regex = /\<@(.*?)\|(.*?)\>/
  const matched = regex.exec(usernameString)
  // handle cases
  if (matched === null) {
    // it's not an expanded entity
    return false
  }
  // looks like the <@U1234|user> format
  // send back a parsed obj
  return {
    parsedUserId: matched[1],
    parsedUserName: miscHelpers.capitalizeFirstLetter(matched[2])
  }
}