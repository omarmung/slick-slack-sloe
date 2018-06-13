# Slack Slash Command Tic-tac-toe
Tic-tac-toe as a Slack /command
<br /><br />

## Developer Preview/Workspace App
A note that this was created as a workspace app using the 'Create a developer preview app,' found here, https://api.slack.com/workspace-apps-preview, and which use a per-workspace token (prefixed with 'xoxa-') which might be easy to confuse with a traditional app and their more traditional bot (xoxb-) or user (xoxp-) models and token implementations. 
<br /><br />

## API Documentation
If the app is running, check out the [API documentation page](https://slick-slack-sloe-app.herokuapp.com/docs "API Documentation") that the app generates this each time it starts).
<br /><br />


## Getting Up and Running

To get the game running on Slack, we'll need four things, in this order:

1. The URL at which we'll be hosting the service contained in this repo
2. A Slack Developer Preview Workspace App integration created through Slack's api.slack.com webUI at: https://api.slack.com/workspace-apps-previe
3. A /slash_command, created within #2
4. A token each from #2 and #3 in the app's page, https://api.slack.com/apps, that we'll use to run our service so that it can connect to Slack:
    
    i. The 'Verification Token,' found under Basic Information > App Credentials

    ii. The OAuth Access Token, starting with 'xoxa-,' found under OAuth & Permissions > OAuth settings > Your Workspace Settings, with two permissions added:  'chat.write,' and 'channels.read'
<br /><br />

### Making the Workspace App and /slash_command
For #2 and #3, the app and /slash_command, the set-up in the app's page https://api.slack.com/apps, goes like so:

1. Make a Workspace App and a new /slash_command.
2. Name the command '/ttt,' for 'tic-tac-toe.'
3. Then, scroll down to the 'Integration Settings' section.
4. The URL will be wherever you'll be hosting this service, plus '/api/v1/game,' for example http://whitehouse.gov/api/v1/game
5. For Method, ensure 'POST' is selected
6. Customize Name can be 'Tic-Tac-Toe App'
7. For Token, copy this outgoing verification token text. We'll send this to our app so we know when traffic is coming from our /slash_command.
8. IMPORTANT DETAIL - Go to 'Escape channels, users, and links' and ensure it is switched on
9. Click 'Save Integration'
<br /><br />

### To Run This Service
To install locally, clone this from Github, or unzip the repo and...
```shell
$ npm install
```
You can copy or rename .env.template to .env (a .gitignore'd file), and add in the two tokens, or you can add these to your environment as environment variables.


To run in the cloud, on Heroku, for instance, download the Heroku CLI here, https://devcenter.heroku.com/categories/command-line, and then add env variables to your app like so: 
```shell
$ heroku config:set GITHUB_USERNAME=joesmith
```

To start server, it's the usual:
```shell
$ npm start
```
If this is running locally, you can then go to: [localhost:8080/api/v1](http://localhost:8080/api/v1 "localhost") to see the heartbeat, and to http://localhost:8080/docs/ to see the API documentation.

### To Play the Game
Type '/ttt help' in the Slack workspace where you installed the App and /slash_command, and go to town!

