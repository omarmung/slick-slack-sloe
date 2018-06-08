// parse incoming commands from slack /command POST request body text
module.exports = function parseCommand(bodyText) {
  // parse words out of text field
  return bodyText.split(' ')
}