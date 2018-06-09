const slackSlashCommandOutgoingVerificationToken = process.env.SLACK_SLASH_COMMAND_OUTGOING_VERIFICATION_TOKEN
// const slackAppOutgoingVerificationToken = process.env.SLACK_APP_OUTGOING_VERIFICATION_TOKEN

module.exports = (req, res, next) => {
  if(req.body.token && req.body.token === slackSlashCommandOutgoingVerificationToken) {
    next()
    return
  }
  res.sendStatus(404)
  return
}