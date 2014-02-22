var irc = require('irc');
var https = require('https');
var config = require('./config');

var client = new irc.Client('irc.freenode.net', 'rdiobot', {
  channels: ['#rdio']
});

var slackbotEchoOptions = {
  hostname: config.slackHost,
  port: 443,
  path: '/services/hooks/incoming-webhook?token=' + config.webhookToken,
  method: 'POST'
};

client.addListener('message', function(from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);
  var postContent = {
    channel: '#irc-echo',
    username: 'IRCbot',
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
