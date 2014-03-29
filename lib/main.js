var irc = require('irc');

var ircCommands = require('./ircCommands');
var mapping = require('./mapping');
var slack = require('./slack');

var config = require('../config');


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
 * Set up the IRC listeners
 */

client.addListener('message', function(from, to, message) {
  var room = to;
  console.log(from + ' => ' + room + ': ' + message);

  // propagate the message to slack, even if it was a command
  message = mapping.ircToSlack(message);

  var echoMessage = "[" + room + "] " + from + ": " + message;
  slack.sendEcho(echoMessage);

  // handle any commands
  var botResponse = ircCommands.handleCommand(from, to, message);
  if (botResponse) {
    client.say(config.irc.channel, botResponse);
    slack.sendEcho("[" + room + "] " + config.irc.nick + ": " + botResponse);
  }
});

client.addListener('error', function(message) {
  console.log("ERROR: " + message);
});

console.log("Connecting to IRC");
client.connect(function(){
  console.log("connect called back", arguments);
});
