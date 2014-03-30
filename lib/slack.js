var Hapi = require('hapi');
var https = require('https');
var config = require('../config');

var ircClient;

var echoOptions = {
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
    var options = echoOptions;
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
  },

  /* set the IRC client for the outgoing webhook listener */
  setClient: function(client) {
    ircClient = client;
    server.start(function() {
      console.log("Outgoing webhook listener started.");
    });
  }
};

/* Slack Outgoing Web Hook listening server */

var server = new Hapi.Server('localhost', 6666, {
  location: 'slack.rkn.la',
});

server.route({
  path: '/irc-echo',
  method: 'POST',
  handler: function(request, reply) {
    console.log("hapi request!");
    console.log(request.payload);
    if (request.payload.token == config.slack.outgoingWebToken) {
      handleSlackInput(request.payload);
      reply('');
    } else {
      reply(Hapi.error.unauthorized('Bad Token'));
    }
  }
});

server.route({
  path: '/',
  method: 'GET',
  handler: function(request, reply) {
    reply("Oh, hi. What are _you_ doing here?");
  }
});


var handleSlackInput = function(slackMessage) {
  if (ircClient) {
  }
};

