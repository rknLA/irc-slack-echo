var _ = require('underscore');
var config = require('../config');


var commands = {
  'empty': function() {
    return "Yes...?";
  },
};

var getCommand = function(message) {
  if (typeof(message) == "string") { // paranoidTypeChecking = true;
    var splitMessage = message.split(' ');
    if (splitMessage.length > 0) {
      if (splitMessage[0] == config.irc.nick ||
          splitMessage[0] == config.irc.nick + ':') {
        if (splitMessage.length == 1) {
          return {
            cmd: 'empty',
            args: []
          }
        }
        return {
          cmd: splitMessage[1],
          args: splitMessage.slice(2)
        }
      }
    }
  }
  return null;
};

module.exports = {
  handleCommand: function(from, to, message) {
    var parsed = getCommand(message);
    if (parsed) {
      if (_.has(commands, parsed.cmd)) {
        return commands[parsed.cmd]();
      } else {
        return "I'm sorry, I don't know what you mean.";
      }
    }
  },
};
