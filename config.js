module.exports = {
  slack: {
    host: 'my.slack.com',
    incomingWebhookToken: 'your incoming webhook token'
  },
  irc: {
    server: 'your.irc.net',
    username: 'slackbot',
    channel: '#mychan'
  },

  userMap: {
    irc_username: "slack_username"
  }
};
