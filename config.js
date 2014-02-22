module.exports = {
  slack: {
    host: 'my.slack.com',
    incomingWebhookToken: 'your incoming webhook token',
    echoChannel: '#irc-echo',
    botName: 'IRCBot'
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
