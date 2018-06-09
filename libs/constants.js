// text for the help command
let helpCommandText = `\`\`\`
Slack Tic-tac-toe Game
/ttt                             Game slash command                              
      \<help\>                    This help dialog
      \<status\>                  Check your channel\'s game sitch
      \<play\> \<@username\>        Start a game!
      \<move\> \<number\> \<letter\>  Mark a square
\`\`\``

module.exports = {
  helpCommandText: helpCommandText
}