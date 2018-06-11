# Slack Slash Command Tic-tac-toe
Tic-tac-toe as a slack /command!
<br /><br />

## API Documentation
If the app is running, check out the [API documentation page](https://slick-slack-sloe-app.herokuapp.com/docs "API Documentation"). ( The app generates this each time it starts).
<br /><br />


## Getting Up and Running
First, we'll need to set up a few things in Slack before we can use the code in this repo:
1. Create a slash-command by signing in to your Slack account, something like... my.slack.com/services/new/slash-commands ...and follow these steps: 
2. Make the command '/ttt,' for 'tic-tac-toe.'
3. Then, scroll down to the 'Integration Settings' section.
4. The URL will be wherever you'll be hosting the app, plus '/api/v1/game,' for example http://whitehouse.gov/api/v1/game
5. For Method, ensure 'POST' is selected
6. Customize Name should be 'Tic-Tac-Toe App'
7. For Token, let's copy this outgoing verification token text. We'll send this to our app so we know when traffic is coming from our slash command.
8. Next, go to 'Escape channels, users, and links' and switch it on
9. Click 'Save Integration'
10. Next, go to https://api.slack.com/apps and we'll create an app.

To install locally:
```shell
$ npm install
```
Pre-req: Get Slack token, app, and permissions
Copy or rename .env.template to .env, and add in your token(s)
Post-req: to run on Heroku, get heroku CLI and then add env variables to your app like so: 
```shell
$ heroku config:set GITHUB_USERNAME=joesmith
```

To start server locally:
```shell
$ npm start
```
and go to: [localhost:8080](http://localhost:8080 "localhost")



