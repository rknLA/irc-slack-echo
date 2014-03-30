var _ = require('underscore');
var fs = require('fs');

var userMap = JSON.parse(fs.readFileSync('userMap.json', 'utf8'));

module.exports = {
  ircToSlack: function(originalMessage) {
    var modifiedMessage = originalMessage;
    _.each(userMap, function(val, key, list) {
      var re = new RegExp("@?" + key, 'gi');
      modifiedMessage = modifiedMessage.replace(re, "<@" + val + ">");
    });
    return modifiedMessage;
  },

  link: function(slackName, ircName) {
    console.log('should link ' + slackName + ' on slack to ' + ircName);
  },

  unlink: function(slackName, ircName) {
    console.log('should unlink ' + slackName + ' on slack to ' + ircName);
  },

  list: function() {
    var output = "(slack)\t-> (irc)\n";
    _.each(userMap, function(val, key, list) {
      output += val + "\t-> " + key + "\n";
    });
    return output;
  }
};
