var _ = require('underscore');
var Hapi = require('hapi');
var https = require('https');
var config = require('../config');

var ircClient;

var slackPostOptions = {
  hostname: config.slack.host,
  port: 443,
  path: '/services/hooks/incoming-webhook?token=' + config.slack.incomingWebhookToken,
  method: 'POST'
};

var sendToSlack = function(content) {
  var postContent = {
    channel: config.slack.echoChannel,
    username: config.slack.botName,
    text: content 
  };
  var postBody = JSON.stringify(postContent);

  var options = slackPostOptions;
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

module.exports = {

  sendEcho: function(echoText) {
    sendToSlack(echoText);
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
    if (request.payload.token == config.slack.outgoingWebhookToken) {
      handleSlackInput(request.payload);
      reply('ok');
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


/* slack response methods */
var slackBotMethods = {
  'ping': function() {
    // don't care about args here
    return "pong";
  },

  'say': function(context) {
    var messageText = context.commandless_words.join(' ');
    var composed = context.user_name + " from Slack said: " + messageText;
    ircClient.say(config.irc.channel, composed);
    return "[" + room + "] " + config.irc.nick + ": " + composed;
  }
}

var handleSlackInput = function(payload) {
  if (ircClient) {
    // remove trigger word
    var deTriggered = payload.text.slice(payload.trigger_word.length);
    var words = deTriggered.split(' ');
    if (words[0] == ':') {
      words = words.slice(1);
    }

    var command = words[0];
    payload.commandless_words = words.slice(1);
    if (_.has(slackBotMethods, command)) {
      var response = slackBotMethods[command](payload);
      if (response) {
        sendToSlack(response);
      }
    }
  }
};

