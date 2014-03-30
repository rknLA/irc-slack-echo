module.exports = {
  slack: {
    host: 'my.slack.com',
    incomingWebhookToken: 'your incoming webhook token',
    outgoingWebhookToken: 'your outgoing webhook token',
    echoChannel: '#irc-echo',
    botName: 'IRCBot'
  },
  irc: {
    server: 'your.irc.net',
    nick: 'slackbot',
    channel: '#mychan'
  },
};
