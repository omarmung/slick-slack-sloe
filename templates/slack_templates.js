module.exports = {
  stringTemplates: {
    challenge: {
      opponent: "Who would you like to play?",
      retired: "{{player2}} has retired from /ttt and declines your challenge",
      promptPlayer2: "{{player1}} has challenged you to a game of tic-tac-toe. Want to play?",
      declined: "{{player2}} has declined your challenge.",
      inProgress: "There's already a game going."
    },
    status: {
      channelHasGame: "Here's the board:",
      channelHasNoGame: "Use '/ttt challenge @name' to start a game with Name",
      whoseTurn: "It is {{playerX}}'s turn to '/ttt move <row><column>"
    },
    move: {
      noGameInPlay: "Challenge someone to play with '/ttt challenge <@name>'",
      notYourTurn: "It's {{playerX}}'s turn to move.'",
      invalidMove: "That move doesn't work. Try again.",
      youWon: "You won! Yaaay!",
      youDrew: "It's a draw!",
      gameResults: "Game over!"
    },
    leave: {
      notPlayingAGameTho: "Hmm... you're not playing a game right now.",
      leftGame: "That's all, folks...",
      otherPlayerLeft: "{{playerX}} has left the game.",
    },
    retire: {
      alreadyRetired: "You're already retired!",
      retired: "Future challenges will be declined. Congrats on your retirement."
    },
    unretire: {
      unretired: "Welcome back. Future challenges will no longer be automatically declined."
    }
  }
}
