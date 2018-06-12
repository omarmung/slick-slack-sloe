// text for the help command
let helpCommandText = `\`\`\`
Slack Tic-tac-toe Game
/ttt                             Game slash command                              
      \<help\>                    This help dialog
      \<status\>                  Check your channel\'s game sitch
      \<play\> \<@username\>        Start a game!
      \<move\> \<number\> \<letter\>  Mark a square
\`\`\``

// since we enumerated our squares by powers of two
// each relates to a binary place
// so our decimal total and these three-in-a-row sums show up in binary
// with an &, we can see if one of these is represented there
const winValues = [7, 56, 448, 73, 146, 292, 273, 84]

module.exports = {
  helpCommandText: helpCommandText,
  winValues: winValues
}
