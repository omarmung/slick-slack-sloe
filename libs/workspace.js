const Channel = require('./channel')

class Workspace {
  constructor() {
    this.activeChannels = {}
  }
  activeChannelExists(slackChannelId) {
    return this.activeChannels.hasOwnProperty(slackChannelId)
  }
  activeChannelRemove(slackChannelId) {
    delete this.activeChannels[slackChannelId]
    return
  }
  getActiveChannelGameById(slackChannelId) {
    if(this.activeChannelExists(slackChannelId)) {
      return this.activeChannels[slackChannelId]
    }
    throw new Error('channel not found')
  }
  createNewChannel(slackChannelId, channelName, player1UserId, player1Symbol, player2Symbol, player2UserId, player2UserName, player1UserName) {
    // instantiate new channel
    let channel = new Channel(slackChannelId, channelName, player1UserId, player1Symbol, player2Symbol, player2UserId, player2UserName, player1UserName)
    // add to activeChannels storage
    this.activeChannels[slackChannelId] = channel
    // return reference to new channel
    return channel
  }

}

module.exports = Workspace