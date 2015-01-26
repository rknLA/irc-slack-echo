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

slack.setClient(client);

/*
 * Forward and log messages to Slack
 */

function toSlack(to, text) {
  if (to == client.nick) text = "[private] " + text;
  console.log(text);
  slack.sendEcho(text);
}

// Intersperse Slack nick with WORD JOINER to avoid self-notification.
function silently(nick) {
  return mapping.ircToSlack(nick).split('').join('\u2060');
}

/*
 * Set up the IRC listeners
 */

client.addListener('message', function(from, to, message) {
  // propagate the message to slack, even if it was a command
  toSlack(to, "<" + silently(from) + "> " + mapping.ircToSlack(message));

  // handle any commands; pass along the unadulterated message
  var botResponse = ircCommands.handleCommand(from, to, message);
  if (botResponse) {
    client.say(config.irc.channel, botResponse);
    toSlack(config.irc.channel, client.nick + ": " + botResponse);
  }
});

client.addListener('action', function(from, to, text) {
  toSlack(to, "∙ _" + silently(from) + "_ " + mapping.ircToSlack(text));
});

client.addListener('topic', function(channel, topic, nick, message) {
  if (message.command == "TOPIC") // don't forward topic on JOIN
    toSlack(channel, "∙ _" + silently(nick) + "_ set the topic to: " + topic);
});

client.addListener('error', function(message) {
  console.log("ERROR: " + message);
});

console.log("Connecting to IRC");
client.connect(function(){
  console.log("connect called back", arguments);
});
