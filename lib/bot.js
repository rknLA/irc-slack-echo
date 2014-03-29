var irc = require('irc');
var https = require('https');
var config = require('../config');
var mapping = require('./mapping');


/*
 * Set up the IRC client
 */

var client = new irc.Client(config.irc.server, config.irc.nick, {
  channels: [config.irc.channel],
  port: 6697,
  debug: true,
  showErrors: true,
  secure: true,
  autoConnect: false,
  autoRejoin: true,
  retryCount: 3
});


/*
 * Set up the slackbot echoer
 */

var slackbotEchoOptions = {
  hostname: config.slack.host,
  port: 443,
  path: '/services/hooks/incoming-webhook?token=' + config.slack.incomingWebhookToken,
  method: 'POST'
};

var sendEcho = function(echoText) {
  var postContent = {
    channel: config.slack.echoChannel,
    username: config.slack.botName,
    text: echoText
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
};



/*
 * Set up the IRC listeners
 */

client.addListener('message', function(from, to, message) {
  var room = to;
  console.log(from + ' => ' + room + ': ' + message);

  message = mapping.ircToSlack(message);

  var echoMessage = "[" + room + "] " + from + ": " + message;
  sendEcho(echoMessage);
});

client.addListener('error', function(message) {
  console.log("ERROR: " + message);
});

console.log("Connecting to IRC");
client.connect(function(){
  console.log("connect called back", arguments);
});
