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
    console.log(error)
    return new Error(error)
  });
}
// 'text': textToPost

// get the channels in the workspace
function postTextToChannelAsync(slackChannelId, textToPost) {
  // call Slack Web API
  return web.chat.postMessage({
    "channel": slackChannelId,
    "text": "Dustin vs. Robin",
    "attachments": [
      {
        "fallback": "Tic-tac-toe App",
        "color": "#36a64f",
        "author_name": "Bobby Tables",
        "author_link": "http://flickr.com/bobby/",
        "author_icon": "https://upload.wikimedia.org/wikipedia/commons/4/45/Right-facing-Arrow-icon.jpg",
        "title": "Slack API Documentation",
        "title_link": "https://api.slack.com/",
        "text": textToPost,
        "fields": [
          {
            "title": "Priority",
            "value": "High",
            "short": false
          }
        ],
        "image_url": "http://my-website.com/path/to/image.jpg",
        "thumb_url": "http://example.com/path/to/thumb.png",
        "footer": "Tic-tac-toe App",
        "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png"
      }
    ]
  })
  // .then((response) => {
  //   if (response.ok) {
  //     return response
  //   }
  //   throw new Error('API call failed')
  // })
  // .catch((error) => {
  //   // Error
  //   console.log(error)
  //   return new Error(error)
  // });
}

module.exports = {
  getSlackWorkspaceChannelAsync: getSlackWorkspaceChannelAsync,
  postTextToChannelAsync: postTextToChannelAsync
}

