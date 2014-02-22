var irc = require('irc');
var https = require('https');
var _ = require('underscore');
var config = require('./config');

var client = new irc.Client(config.irc.server, config.irc.username, {
  channels: [config.irc.channel]
});

var slackbotEchoOptions = {
  hostname: config.slack.host,
  port: 443,
  path: '/services/hooks/incoming-webhook?token=' + config.slack.incomingWebhookToken,
  method: 'POST'
};

client.addListener('message', function(from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);

  // sub irc usernames for slack usernames
  _.each(config.userMap, function(val, key, list) {
    var re = new RegExp("@?" + key, "g");
    message = message.replace(re, "<@" + val + ">");
  });

  var postContent = {
    channel: config.slack.echoChannel,
    username: config.slack.botName,
    text: "[" + to + "] " + from + ": " + message
  };

  var postBody = JSON.stringify(postContent);
  var options = slackbotEchoOptions;
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postBody)
  };
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(d) {
      console.log('body: ' + d);
    });
  });

  req.write(postBody);
  req.end();
});
