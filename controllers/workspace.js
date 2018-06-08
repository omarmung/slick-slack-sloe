const slackClient = require('../services/slack_client')
const Channel = require('../libs/channel')

// grabs all  
export function getChannels() {
  // 
  return slackClient.getChannelsAsync()
    .then((response) => {
      if (!response.ok) throw new Error(response)
      console.log('Request response: ', response.channels.find( (channel) => channel.name === "general" ))
      res.send(response)
      return
    })
    .catch((error) => {
      console.log('Request error response: ', error) 
      res.sendStatus(404)
      throw new Error(error)
      return
    })
}
  

  