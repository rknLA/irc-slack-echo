var _ = require('underscore');
var Hapi = require('hapi');
var https = require('https');

var config = require('../config');
var mapping = require('./mapping');

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

  sendEcho: sendToSlack,

  /* set the IRC client for the outgoing webhook listener */
  setClient: function(client) {
    ircClient = client;
    server.start(function() {
      console.log("Outgoing webhook listener started.");
    });
  }
};

/* Slack Outgoing Web Hook listening server */

var server = new Hapi.Server(config.slack.outgoingWebhookServer.interface, config.slack.outgoingWebhookServer.port, {
  location: config.slack.outgoingWebhookServer.domain,
});

server.route({
  path: config.slack.outgoingWebhookServer.hookPath,
  method: 'POST',
  handler: function(request, reply) {
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
    var composed = "[Slack] " + context.user_name + ": " + messageText;
    ircClient.say(config.irc.channel, composed);
    return "[" + config.irc.channel + "] " + config.irc.nick + ": " + composed;
  },

  'link': function(context) {
    var response;
    switch(context.commandless_words.length) {
      case 1:
        response = mapping.link(context.user_name,
                                context.commandless_words[0]);
        break;
      case 2:
        response = mapping.link(context.commandless_words[0],
                                context.commandless_words[1]);
        break;
      default:
        response = "I guess I should tell you how to use link..";
        break;
    }

    if (response) {
      sendToSlack(response);
    }
  },

  'unlink': function(context) {
    var response;
    switch(context.commandless_words.length) {
      case 0:
        // no args, unlink all
        response = mapping.unlink(context.user_name);
        break;
      case 1:
        // 1 arg, unlink my slack name from the passed irc name
        response = mapping.unlink(context.user_name,
                                  context.commandless_words[0]);
        break;
      case 2:
        // 2 args, slack name first, irc name second
        response = mapping.unlink(context.commandless_words[0],
                                  context.commandless_words[1]);
        break;
      default:
        response = "I guess I should tell you how to unlink..";
        break;
    }
    if (response) {
      sendToSlack(response);
    }
  },

  'show': function(context) {
    var response;
    switch(context.commandless_words.length) {
      case 0:
        response = mapping.list();
        break;
    }
    if (response) {
      sendToSlack(response);
    }
  },
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
    } else {
      sendToSlack("I don't understand '" + words.join(' ') + "'.");
    }
  }
};

