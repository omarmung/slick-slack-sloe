// route validation options 
const gameRoute = {
  body: {
    token: { isRequired: true },
    channel_id: { isRequired: true },
    channel_name: { isRequired: true },
    user_id: { isRequired: true },
    command: { isRequired: true },
    text: { isRequired: false },
    response_url: { isRequired: true }
  },
  headers: {
    'content-type': { isRequired: true, equals: 'application/x-www-form-urlencoded' }
  }
}

module.exports = {
  gameRoute: gameRoute
}