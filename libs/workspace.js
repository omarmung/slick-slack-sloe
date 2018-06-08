const Channel = require('./channel')

class Workspace {
  constructor() {
    this.activeChannels = {}
  }
  activeChannelExists(slackChannelId) {
    return this.activeChannels.hasOwnProperty(slackChannelId)
  }
  activeChannelRemove(slackChannelId) {
    return delete this.activeChannels[slackChannelId]
  }
  getActiveChannelGameById(slackChannelId) {
    if(channelExists(slackChannelId)) {
      return this.activeChannels[slackChannelId]
    }
    throw new Error('channel not found')
  }

}

module.exports = Workspace