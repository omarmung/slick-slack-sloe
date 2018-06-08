const { WebClient } = require('@slack/client')
const token = process.env.SLACK_WORKSPACE_OAUTH_ACCESS_TOKEN || '';
if (!token) { console.log('You must specify a token'); process.exitCode = 1; return; }

const web = new WebClient(token);

// get the channels in the workspace
export function getChannelsAsync() {
  // call Slack Web API
  return web.channels.list()
  .then((response) => {
    // Success!
    console.log('Team info response:');
    // console.log(response);
    return response
  })
  .catch((error) => {
    // Error
    console.log('Team info error:');
    console.log(error);
    throw new Error(error)
  });
}

