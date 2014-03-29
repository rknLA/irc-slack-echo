var https = require('https');
var config = require('../config');


var slackbotEchoOptions = {
  hostname: config.slack.host,
  port: 443,
  path: '/services/hooks/incoming-webhook?token=' + config.slack.incomingWebhookToken,
  method: 'POST'
};

module.exports = {
  sendEcho: function(echoText) {
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
  }
};
