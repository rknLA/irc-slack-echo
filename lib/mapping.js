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
  }
};
