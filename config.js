module.exports = {
  slack: {
    // URL sans 'https://hooks.slack.com/services/' prefix:
    incomingWebhookToken: 'your incoming webhook token',
    outgoingWebhookToken: 'your outgoing webhook token',
    outgoingWebhookServer: {
      port: 666,
      domain: 'your.webhook.server.com',
      hookPath: '/irc-echo'
    },
  },
  irc: {
    server: 'your.irc.net',
    nick: 'slackbot',
    channel: '#mychan'
  },
};
