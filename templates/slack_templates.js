module.exports = {
  stringTemplates: {
    userResponse: {
      challenge: {
        retired: `{{player2}} has retired from /ttt and declines your challenge`,
        promptPlayer2: `{{player1}} has challenged you to a game of tic-tac-toe. Want to play?`,
        declined: `{{player2}} has declined your challenge.`,
      },
      status: {
        channelHasGame: `Here's the board:`,
        channelHasNoGame: `Use '/ttt challenge @name' to start a game with Name`,
        whoseTurn: `It is {{playerX}}'s turn to '/ttt move <row><column>`
      },
      move: {
        noGameInPlay: `Challenge someone to play with '/ttt challenge <@name>'`,
        notYourTurn: `It's {{playerX}}'s turn to move.'`,
        invalidMove: `That move doesn't work. Try again.`,
        youWon: `You won! Yaaay!`,
        youDrew: `It's a draw!`,
        gameResults: `Game over!`
      },
      leave: {
        notPlayingAGameTho: `Hmm... you're not playing a game right now.`,
        leftGame: `That's all, folks...`,
        otherPlayerLeft: `{{playerX}} has left the game.`,
      },
      retire: {
        alreadyRetired: `You're already retired!`,
        retired: `Future challenges will be declined. Congrats on your retirement.`
      },
      unretire: {
        unretired: `Welcome back. Future challenges will no longer be automatically declined.`
      }
    }
  },
  boardTemplate: "```| {{1.mark}} | {{2.mark}} | {{3.mark}} |\n|---+---+---|\n| {{4.mark}} | {{5.mark}} | {{6.mark}} |\n|---+---+---|\n| {{7.mark}} | {{8.mark}} | {{9.mark}} |```",
  slackMessageJsonTemplates: {
    "channel": "{{slackChannelId}}",
    "text": "{{player1Name}} vs. {{player2Name}}, round {{calcRoundNumber}}",
    "attachments": [
      {
        "fallback": "Tic-tac-toe App",
        "color": "#36a64f",
        "author_name": "Bobby Tables",
        "author_link": "http://flickr.com/bobby/",
        "author_icon": "https://upload.wikimedia.org/wikipedia/commons/4/45/Right-facing-Arrow-icon.jpg",
        "title": "Current Stats",
        "text": "{{boardTemplate}}",
        "fields": [
          {
            "title": "Priority",
            "value": "High",
            "short": false
          }
        ],
        "footer": "Tic-tac-toe App",
        "footer_icon": "https://upload.wikimedia.org/wikipedia/commons/4/45/Right-facing-Arrow-icon.jpg" 
      }
    ]
  }

}
