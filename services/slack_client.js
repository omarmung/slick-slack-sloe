const { WebClient } = require('@slack/client')
const token = process.env.SLACK_WORKSPACE_OAUTH_ACCESS_TOKEN || '';
if (!token) { console.log('You must specify a token'); process.exitCode = 1; return; }

const web = new WebClient(token);

// get the channels in the workspace
function getSlackWorkspaceChannelAsync(slackChannelId) {
  // call Slack Web API
  return web.channels.info({'channel': slackChannelId})
    .then(response => {
      return response.channel
    })
    .catch((error) => {
      // Error
      console.log('slackClient.getSlackWorkspaceChannelAsync error: ', error)
      throw new Error(error)
    });
}

// post a message to the channel, either publicly, or ephemerally (just to one user)
function postTextToChannelPublicAsync(slackChannelId, messagePayloadJson) {
  messagePayloadJson = messagePayloadJson
  messagePayloadJson.channel = slackChannelId

  // make promise to make a call to Slack Web API
  return web.chat.postMessage(messagePayloadJson)
}

// post an ephemeral message (to a single user) in the channel
function postTextToChannelEphemeralAsync(slackChannelId, messagePayloadJson, slackUserId) {
  let messagePayloadJson1 = messagePayloadJson
  messagePayloadJson1.channel = slackChannelId
  messagePayloadJson1.user = slackUserId

  // make promise to make a call to Slack Web API
  return web.chat.postEphemeral(messagePayloadJson)
}

module.exports = {
  getSlackWorkspaceChannelAsync: getSlackWorkspaceChannelAsync,
  postTextToChannelPublicAsync: postTextToChannelPublicAsync,
  postTextToChannelEphemeralAsync: postTextToChannelEphemeralAsync
}

