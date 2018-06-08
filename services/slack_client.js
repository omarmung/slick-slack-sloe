const { WebClient } = require('@slack/client')
const token = process.env.SLACK_WORKSPACE_OAUTH_ACCESS_TOKEN || '';
if (!token) { console.log('You must specify a token'); process.exitCode = 1; return; }

const web = new WebClient(token);

// get the channels in the workspace
function getSlackWorkspaceChannelAsync(slackChannelId) {
  // call Slack Web API
  return web.channels.info({'channel': slackChannelId})
  .then((response) => {
    if (response.ok) {
      return response
    }
    throw new Error('channels.info call failed')
  })
  .catch((error) => {
    // Error
    console.log(error);
    return new Error(error)
  });
}

module.exports = {
  getSlackWorkspaceChannelAsync: getSlackWorkspaceChannelAsync
}

